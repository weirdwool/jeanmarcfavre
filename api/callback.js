export default async (req, res) => {
  const { code, state } = req.query;
  
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
    
    // Construct the exact message format Decap CMS expects
    const content = {
      token: token,
      provider: 'github'
    };
    
    const message = `authorization:github:success:${JSON.stringify(content)}`;

    // Send response with inline script
    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Authorization Complete</title>
        <script>
          (function() {
            function receiveMessage(e) {
              console.log("Received message from parent:", e);
              window.removeEventListener("message", receiveMessage);
            }
            
            window.addEventListener("message", receiveMessage);
            
            var message = ${JSON.stringify(message)};
            var origin = "${req.headers.origin || '*'}";
            
            console.log("Posting message:", message);
            console.log("To origin:", origin);
            
            if (window.opener) {
              window.opener.postMessage(message, origin);
              
              // Fallback with wildcard
              setTimeout(function() {
                window.opener.postMessage(message, "*");
              }, 100);
            }
            
            setTimeout(function() {
              window.close();
            }, 1000);
          })();
        </script>
      </head>
      <body>
        <h3>Authorization successful!</h3>
        <p>This window will close automatically...</p>
      </body>
      </html>
    `;

    res.setHeader('Content-Type', 'text/html');
    res.status(200).send(html);
  } catch (error) {
    console.error('OAuth error:', error);
    res.status(500).send(`Authentication failed: ${error.message}`);
  }
};
