import SpotifyWebApi from 'spotify-web-api-node';

export const spotify = new SpotifyWebApi();

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