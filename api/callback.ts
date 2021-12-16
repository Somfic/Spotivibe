import SpotifyWebApi from "spotify-web-api-node";

export default (req, res) => {
  try {
    console.log(req.headers["x-forwarded-proto"])
    console.log(`${process.env.VERCEL_URL}/api/callback/`);
    const spotifyApi = new SpotifyWebApi({
      clientId: process.env.SPOTIFY_CLIENT_ID,
      clientSecret: process.env.SPOTIFY_CLIENT_SECRET,
      redirectUri: `${process.env.SPOTIFY_REDIRECT_URL}/api/callback/`,
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
};
