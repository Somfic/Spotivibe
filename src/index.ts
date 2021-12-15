require("dotenv").config();

import express from "express";
import SpotifyWebApi from "spotify-web-api-node";
import { URLSearchParams } from "url";

const app = express();
const port = process.env.PORT || 3000;

const scopes = [
  "user-read-private",
  "user-read-email",
  "user-read-playback-state",
  "user-modify-playback-state",
];
const spotifyApi = new SpotifyWebApi({
  clientId: process.env.SPOTIFY_CLIENT_ID,
  clientSecret: process.env.SPOTIFY_CLIENT_SECRET,
  redirectUri: process.env.SPOTIFY_CALLBACK_URI,
});

// Spotify login
app.get("/login", (req, res) => {
  // Generate a random string for the state
  const authorizeURL = spotifyApi.createAuthorizeURL(scopes, "state");

  // Redirect to Spotify for authentication
  res.redirect(authorizeURL);
});

// Spotify callback
app.get("/callback", (req, res) => {
  try {
    // Retrieve an access token
    spotifyApi.authorizationCodeGrant(
      req.query.code.toString(),
      async (error, data) => {
        if (error) {
          return res.send(error).status(500);
        }

        var params = new URLSearchParams({
          refresh_token: data.body.refresh_token,
          access_token: data.body.access_token,
          expires_in: data.body.expires_in.toString(),
          scopes: data.body.scope.split(" "),
          token_type: data.body.token_type,
        });

        res.redirect(process.env["FRONTEND_CALLBACK_URI"] + "/?" + params);
      }
    );
  } catch (err) {
    res.redirect(process.env["FRONTEND_CALLBACK_URI"] + "/?error=" + err);
  }
});

app.listen(port, () => console.log(`Example app listening on port ${port}!`));
