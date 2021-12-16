import Vibrant from 'node-vibrant';
import SpotifyWebApi from 'spotify-web-api-node';
import { Current } from './Current';

export const spotify = new SpotifyWebApi();

export const current: Current = new Current();


let lastRefresh = 0;
export async function process() : Promise<Current> {

	// Only refresh every 5 seconds
	if (Date.now() - lastRefresh < 5000) {
		return;
	}
	lastRefresh = Date.now();

	// Set the user if we haven't yet
	if(current.user == undefined) {
		current.user = (await spotify.getMe()).body;
	}

	// Get the current playback
	const playback = (await spotify.getMyCurrentPlaybackState()).body;
	current.isPlaying = playback?.is_playing;

	// Only refresh if we're playing
	if (playback?.is_playing) {
		const song = (await spotify.getTrack(playback.item.id)).body;

		// Only update the audio analysis if the song has changed
		if (current.song == undefined || song?.id !== current.song.id) {
			current.song = song;
			current.analysis = (await spotify.getAudioAnalysisForTrack(playback?.item.id)).body;
			current.analysis = (await spotify.getAudioFeaturesForTrack(playback?.item.id)).body;
			current.colors = await Vibrant.from(song?.album.images[0].url).getPalette();

			console.log(`New song: ${song?.name} by ${song?.artists[0].name}`);
		}
	}
	
	return current;
}

export function login() : boolean {
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