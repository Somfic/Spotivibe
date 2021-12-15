import SpotifyWebApi from "spotify-web-api-node";

export default (req, res) => {
  try {
    const spotifyApi = new SpotifyWebApi({
      clientId: process.env.SPOTIFY_CLIENT_ID,
      clientSecret: process.env.SPOTIFY_CLIENT_SECRET,
      redirectUri: process.env.SPOTIFY_CALLBACK_URI,
    });

    // Retrieve an access token
    spotifyApi.authorizationCodeGrant(
      req.query.code.toString(),
      async (error, data) => {
        if (error) {
          return res.send(error).status(500);
        }

        const params = new URLSearchParams({
          refresh_token: data.body.refresh_token,
          access_token: data.body.access_token,
          expires_in: data.body.expires_in.toString(),
          scopes: data.body.scope,
          token_type: data.body.token_type,
        });

        res.redirect(process.env["FRONTEND_CALLBACK_URI"] + "/?" + params);
      }
    );
  } catch (err) {
    res.redirect(process.env["FRONTEND_CALLBACK_URI"] + "/?error=" + err);
  }
};
