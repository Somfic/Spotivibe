import type { Palette } from "node-vibrant/lib/color";

export class Current {
    user: SpotifyApi.CurrentUsersProfileResponse

	song: SpotifyApi.SingleTrackResponse
	analysis: SpotifyApi.AudioAnalysisResponse
	features: SpotifyApi.AudioFeaturesResponse
    
    colors: Palette
    
    isPlaying: boolean
   
    // Default constructor
    constructor() {
        this.user = undefined;
        this.song = undefined;
        this.analysis = undefined;
        this.features = undefined;
        this.colors = undefined;
        this.isPlaying = false;
    }
};
