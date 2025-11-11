import simpleOauth2 from 'simple-oauth2';

export default async (req, res) => {
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

  const authorizationUri = oauth2.authorizationCode.authorizeURL({
    redirect_uri: `${process.env.VERCEL_URL || 'https://jeanmarcfavre.vercel.app'}/api/callback`,
    scope: 'repo,user',
    state: req.query.state || '',
  });

  res.redirect(authorizationUri);
};

