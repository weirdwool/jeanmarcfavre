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
        <h2>Authorization successful!</h2>
        <p>Completing login...</p>
        <script>
          (function() {
            function sendMessage() {
              if (!window.opener) {
                console.error('No window.opener found');
                document.body.innerHTML += '<p style="color:red;">Error: No parent window found. Please close this window and try again.</p>';
                return;
              }

              const message = 'authorization:github:success:' + JSON.stringify({
                token: "${token}",
                provider: "github"
              });
              
              console.log('Sending message to parent:', message);
              window.opener.postMessage(message, window.location.origin);
              
              // Try with wildcard origin as backup
              setTimeout(function() {
                window.opener.postMessage(message, "*");
                console.log('Message sent, closing window in 2 seconds...');
                
                setTimeout(function() {
                  window.close();
                }, 2000);
              }, 500);
            }
            
            // Wait for page to fully load
            if (document.readyState === 'complete') {
              sendMessage();
            } else {
              window.addEventListener('load', sendMessage);
            }
          })();
        </script>
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
