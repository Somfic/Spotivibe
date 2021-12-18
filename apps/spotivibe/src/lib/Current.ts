import type { Palette } from 'node-vibrant/lib/color';
import type { Analysis } from './Analysis';

export class Current {
  user: SpotifyApi.CurrentUsersProfileResponse;

  playback: SpotifyApi.CurrentPlaybackResponse;
  song: SpotifyApi.SingleTrackResponse;
  analysis: Analysis;
  features: SpotifyApi.AudioFeaturesResponse;

  colors: Palette;

  isPlaying: boolean;
  elapsed: number;

  imageUri: string;
  newCurrent: SpotifyApi.AudioAnalysisResponse;

  // Default constructor
  constructor() {
    this.user = undefined;
    this.song = undefined;
    this.analysis = undefined;
    this.features = undefined;
    this.colors = undefined;
    (this.imageUri = ''), (this.isPlaying = false);
    (this.elapsed = 0);
  }
}
