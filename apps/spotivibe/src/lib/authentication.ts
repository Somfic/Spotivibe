import { spotify } from "./spotify";

import { isLoggedIn } from "./stores";

const API_URL = window.location.hostname == 'localhost' ? "http://localhost:3333/api" : "https://spotivibe.herokuapp.com/api";

export function login() : void {
    window.location.href = `${API_URL}/login`;
}

export function logout() {
    spotify.setAccessToken('');
    spotify.setRefreshToken('');

    isLoggedIn.set(false);
}

export function isLoginCallback() : boolean {
    const urlParams = new URLSearchParams(window.location.search);

	const hasAccessToken = urlParams.has('access_token');
	const hasRefreshToken = urlParams.has('refresh_token');
   
    return hasAccessToken && hasRefreshToken;
}

export function handleCallback() : void {
    // Throw an error if we don't have the access token
    if(!isLoginCallback()) {
        throw new Error('No access token or refresh token defined in the URL parameters');
    }

    const urlParams = new URLSearchParams(window.location.search);

    // Set the access and refresh tokens
    const accessToken = urlParams.get('access_token');
    const refreshToken = urlParams.get('refresh_token');

    spotify.setAccessToken(accessToken);
	spotify.setRefreshToken(refreshToken);

    // Mark as logged in
    isLoggedIn.set(true);

    // Remove the access token and refresh token from the URL
    window.history.replaceState({}, '', '/');
}