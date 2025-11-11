const simpleOauth2 = require('simple-oauth2');

module.exports = async (req, res) => {
  const oauth2 = simpleOauth2.create({
    client: {
      id: process.env.GITHUB_CLIENT_ID,
      secret: process.env.GITHUB_CLIENT_SECRET,
    },
    auth: {
      tokenHost: 'https://github.com',
      tokenPath: '/login/oauth/access_token',
      authorizePath: '/login/oauth/authorize',
    },
  });

  const { code } = req.query;

  try {
    const result = await oauth2.authorizationCode.getToken({
      code,
      redirect_uri: `${process.env.VERCEL_URL || 'https://jeanmarcfavre.vercel.app'}/api/callback`,
    });

    const token = oauth2.accessToken.create(result);

    const responseBody = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Authorization Success</title>
      </head>
      <body>
        <script>
          (function() {
            window.opener.postMessage(
              'authorization:github:success:${JSON.stringify({
                token: token.token.access_token,
                provider: 'github'
              })}',
              window.location.origin
            );
            window.close();
          })();
        </script>
      </body>
      </html>
    `;

    res.send(responseBody);
  } catch (error) {
    res.status(500).send('Authentication failed');
  }
};

