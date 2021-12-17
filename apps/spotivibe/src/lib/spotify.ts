import Vibrant from 'node-vibrant';
import SpotifyWebApi from 'spotify-web-api-node';

import type { Current } from './Current';
import { current, isLoggedIn } from './stores';

import { get } from 'svelte/store';

export const spotify = new SpotifyWebApi();

const REFRESH_RATE = 2500;

let lastRefresh = 0;
export async function process(): Promise<Current> {
  // Don't process if we're not logged in
  if (!get(isLoggedIn)) {
    return;
  }

  // Only refresh every 5 seconds
  if (Date.now() - lastRefresh < REFRESH_RATE) {
    return;
  }
  lastRefresh = Date.now();

  const newCurrent = get(current);

  try {
    // Set the user if we haven't yet
    if (newCurrent.user == undefined) {
      newCurrent.user = (await spotify.getMe()).body;
    }

    // Get the current playback
    const playback = (await spotify.getMyCurrentPlaybackState()).body;
    newCurrent.isPlaying = playback?.is_playing;

    // Only refresh if we're playing
    if (playback?.is_playing) {
      const song = (await spotify.getTrack(playback.item.id)).body;

      const old = get(current);

      // Only update the audio analysis if the song has changed
      if (old.song == undefined || song?.id !== old.song.id) {
        newCurrent.song = song;
        newCurrent.analysis = (
          await spotify.getAudioAnalysisForTrack(playback?.item.id)
        ).body;
        newCurrent.features = (
          await spotify.getAudioFeaturesForTrack(playback?.item.id)
        ).body;
        newCurrent.colors = await Vibrant.from(
          song?.album.images[0].url
        ).getPalette();
        newCurrent.imageUri = song?.album.images[0].url;

        console.log(`New song: ${song?.name} by ${song?.artists[0].name}`);
      }
    } else {
      console.log(newCurrent.user.images[0].url);

      newCurrent.colors = await Vibrant.from(
        newCurrent.user.images[0].url
      ).getPalette();
      newCurrent.imageUri = newCurrent.user.images[0].url;
    }

    current.set(newCurrent);
  } catch (e) {
    if(e.toString().includes('No token provided')) {
		isLoggedIn.set(false);
	}
  }
}

export function login(): boolean {
  const urlParams = new URLSearchParams(window.location.search);

  const hasAccessToken = urlParams.has('access_token');
  const hasRefreshToken = urlParams.has('refresh_token');

  const isLoginCallback = hasAccessToken && hasRefreshToken;
  if (isLoginCallback) {
    localStorage.setItem('access_token', urlParams.get('access_token'));
    localStorage.setItem('refresh_token', urlParams.get('refresh_token'));
  }

  const accessToken = localStorage.getItem('access_token');
  const refreshToken = localStorage.getItem('refresh_token');

  if (accessToken && refreshToken) {
    loginWithTokens(accessToken, refreshToken);
  }

  return accessToken !== null;
}

export function loginWithTokens(accessToken: string, refreshToken: string) {
  localStorage.setItem('access_token', accessToken);
  localStorage.setItem('refresh_token', refreshToken);

  spotify.setAccessToken(accessToken);
  spotify.setRefreshToken(refreshToken);
}

export function logout(): void {
  localStorage.removeItem('access_token');
  localStorage.removeItem('refresh_token');

  spotify.setAccessToken('');
  spotify.setRefreshToken('');
}

export function requestLogin(): void {
  logout();

  window.location.href = `http://localhost:3333/api/login`;
}
