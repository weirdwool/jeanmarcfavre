export default async (req, res) => {
  const { code } = req.query;
  
  if (!code) {
    return res.status(400).send('No code provided');
  }

  try {
    // Exchange code for access token
    const tokenResponse = await fetch('https://github.com/login/oauth/access_token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify({
        client_id: process.env.GITHUB_CLIENT_ID,
        client_secret: process.env.GITHUB_CLIENT_SECRET,
        code: code,
        redirect_uri: 'https://jeanmarcfavre.vercel.app/api/callback',
      }),
    });

    const data = await tokenResponse.json();
    
    if (data.error) {
      return res.status(400).send(`GitHub error: ${data.error_description || data.error}`);
    }

    const token = data.access_token;

    // Send response that closes the popup and sends token to parent window
    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Authorization Success</title>
      </head>
      <body>
        <script>
          (function() {
            const data = {
              token: "${token}",
              provider: "github"
            };
            
            if (window.opener) {
              window.opener.postMessage(
                "authorization:github:success:" + JSON.stringify(data),
                "*"
              );
            }
            
            setTimeout(function() {
              window.close();
            }, 1000);
          })();
        </script>
        <p>Authorization successful! Redirecting...</p>
      </body>
      </html>
    `;

    res.setHeader('Content-Type', 'text/html');
    res.status(200).send(html);
  } catch (error) {
    console.error('OAuth error:', error);
    res.status(500).send('Authentication failed');
  }
};
