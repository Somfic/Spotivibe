import SpotifyWebApi from "spotify-web-api-node";

export default (req, res) => {
  const scopes = [
    "user-read-private",
    "user-read-email",
    "user-read-playback-state",
    "user-modify-playback-state",
  ];

  const spotifyApi = new SpotifyWebApi({
    clientId: process.env.SPOTIFY_CLIENT_ID,
    clientSecret: process.env.SPOTIFY_CLIENT_SECRET,
    redirectUri: `https://${process.env.VERCEL_URL}/`,
  });

  // Generate a random string for the state
  const authorizeURL = spotifyApi.createAuthorizeURL(scopes, "state");

  // Redirect to Spotify for authentication
  res.redirect(authorizeURL);
};
