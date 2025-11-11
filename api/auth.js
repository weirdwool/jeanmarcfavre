export default async (req, res) => {
  const clientId = process.env.GITHUB_CLIENT_ID;
  
  const authUrl = `https://github.com/login/oauth/authorize?client_id=${clientId}&scope=repo,user&redirect_uri=${encodeURIComponent('https://jeanmarcfavre.vercel.app/api/callback')}`;
  
  res.redirect(authUrl);
};
