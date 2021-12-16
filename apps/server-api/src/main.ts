/**
 * This is not a production server yet!
 * This is only a minimal backend to get started.
 */

import express from 'express';
import SpotifyWebApi from "spotify-web-api-node";

const app = express();

app.get('/api/callback', (req, res) => {
  try {
    const spotifyApi = new SpotifyWebApi({
      clientId: process.env.SPOTIFY_CLIENT_ID,
      clientSecret: process.env.SPOTIFY_CLIENT_SECRET,
      redirectUri: `${process.env.SPOTIFY_SERVER_URL}/api/callback/`,
    });

    // Retrieve an access token
    spotifyApi.authorizationCodeGrant(
      req.query.code.toString(),
      async (error, data) => {
        if (error) {
          return res.send(error).status(500);
        }

        spotifyApi.setAccessToken(data.body.access_token);
        spotifyApi.setRefreshToken(data.body.refresh_token);

        const params = new URLSearchParams({
          refresh_token: data.body.refresh_token,
          access_token: data.body.access_token,
          expires_in: data.body.expires_in.toString(),
          scopes: data.body.scope,
          token_type: data.body.token_type,
        });

        const user = await spotifyApi.getMe();
        console.log('Authenticated user: ', JSON.stringify(user.body));

        res.redirect(`${process.env.SPOTIFY_REDIRECT_URL}/login` + "/?" + params);
      }
    );
  } catch (err) {
    res.redirect(`${process.env.SPOTIFY_REDIRECT_URL}/login` + "/?error=" + err);
  }
});

app.get('/api/login', (req, res) => {
  const scopes = [
    "user-read-private",
    "user-read-email",
    "user-read-playback-state",
    "user-modify-playback-state",
  ];

  const spotifyApi = new SpotifyWebApi({
    clientId: process.env.SPOTIFY_CLIENT_ID,
    clientSecret: process.env.SPOTIFY_CLIENT_SECRET,
    redirectUri: `${process.env.SPOTIFY_SERVER_URL}/api/callback/`,
  });

  // Generate a random string for the state
  const authorizeURL = spotifyApi.createAuthorizeURL(scopes, "state");

  // Redirect to Spotify for authentication
  res.redirect(authorizeURL);
});

const port = process.env.port || 3333;
const server = app.listen(port, () => {
  console.log(process.env)
  console.log(`Listening at http://localhost:${port}/api`);
});
server.on('error', console.error);
