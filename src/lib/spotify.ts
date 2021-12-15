import SpotifyWebApi from 'spotify-web-api-node';

export const spotify = new SpotifyWebApi();

export function login() : boolean {
	const urlParams = new URLSearchParams(window.location.search);

	const hasAccessToken = urlParams.has('access_token');
	const hasRefreshToken = urlParams.has('refresh_token');

	const isLoginCallback = hasAccessToken && hasRefreshToken;

	const cachedAccessToken = localStorage.getItem('access_token');
	const cachedRefreshToken = localStorage.getItem('refresh_token');

	const hasCachedTokens = cachedAccessToken && cachedRefreshToken;

	if (isLoginCallback) {
		const accessToken = urlParams.get('access_token');
		const refreshToken = urlParams.get('refresh_token');

		loginWithTokens(accessToken, refreshToken);
		return true;
	} 
	
	else if (hasCachedTokens) {
		loginWithTokens(cachedAccessToken, cachedRefreshToken);
		return true;
	} 
	
	else {
		return false;
	}
} 

function loginWithTokens(accessToken: string, refreshToken: string) {
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
	window.location.href = 'http://localhost:5000/login';
}