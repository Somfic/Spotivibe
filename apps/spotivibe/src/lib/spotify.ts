import Vibrant from 'node-vibrant';
import SpotifyWebApi from 'spotify-web-api-node';

import type { Current } from './Current';
import { current, isLoggedIn } from './stores';

import { get } from 'svelte/store';
import type { Analysis } from './Analysis';

export const spotify = new SpotifyWebApi();

const REFRESH_RATE = 2500;

let startedAt = Date.now();

let lastRefresh = 0;
export async function process(): Promise<void> {
  // Don't process if we're not logged in
  if (!get(isLoggedIn)) {
    return;
  }

  let newCurrent = get(current);

  newCurrent = await processSong(newCurrent);

  if (newCurrent.playback?.is_playing) {
    newCurrent = processBeat(newCurrent);
  }

  current.set(newCurrent);
}

async function processSong(newCurrent: Current): Promise<Current> {
  // Only refresh every 5 seconds
  if (Date.now() - lastRefresh < REFRESH_RATE) {
    return newCurrent;
  }

  lastRefresh = Date.now();

  try {
    // Set the user if we haven't yet
    if (newCurrent.user == undefined) {
      newCurrent.user = (await spotify.getMe()).body;
    }

    // Get the current playback
    newCurrent.playback = (await spotify.getMyCurrentPlaybackState()).body;
    startedAt = Date.now() - newCurrent.playback.progress_ms;

    // Only refresh if we're playing
    if (newCurrent.playback?.is_playing) {
      const song = (await spotify.getTrack(newCurrent.playback.item.id)).body;

      const old = get(current);

      newCurrent.colors = await Vibrant.from(song?.album.images[0].url).getPalette();
      newCurrent.imageUri = song?.album.images[0].url;

      // Only update the audio analysis if the song has changed
      if (old.song == undefined || song?.id !== old.song.id) {
        newCurrent.song = song;
        newCurrent.analysis = <Analysis>(
          (await spotify.getAudioAnalysisForTrack(newCurrent.playback?.item.id))
            .body
        );
        newCurrent.features = (
          await spotify.getAudioFeaturesForTrack(newCurrent.playback?.item.id)
        ).body;

        console.log(`New song: ${song?.name} by ${song?.artists[0].name}`);
        console.log(newCurrent.analysis);
      }
    } else {
      newCurrent.colors = await Vibrant.from(
        newCurrent.user.images[0].url
      ).getPalette();
      newCurrent.imageUri = newCurrent.user.images[0].url;
    }
  } catch (e) {
    if (e.toString().includes('No token provided')) {
      isLoggedIn.set(false);
    }
  }

  return newCurrent;
}

function processBeat(current: Current): Current {
  current.elapsed = (Date.now() - startedAt) / 1000;

  if (current.analysis != undefined) {
    current.analysis.bar = getPart(current.analysis.bars, current.elapsed);
    current.analysis.beat = getPart(current.analysis.beats, current.elapsed);
    current.analysis.section = getPart(current.analysis.sections, current.elapsed);
    current.analysis.segment = getPart(current.analysis.segments, current.elapsed);
    current.analysis.tatum = getPart(current.analysis.tatums, current.elapsed);
  }

  return current;
}

function getPart(parts, elapsed: number) {
  const filter = parts.filter((x) => x.start <= elapsed);
  const part = parts[filter.length - 1];

  if (part?.start) {
    part.elapsed = (elapsed - part.start) / part.duration;
  }

  return part;
}
