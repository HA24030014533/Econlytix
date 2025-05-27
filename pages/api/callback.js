// pages/api/callback.js
import { AuthorizationCode } from 'simple-oauth2';

const config = {
  client: {
    id: process.env.GITHUB_CLIENT_ID,
    secret: process.env.GITHUB_CLIENT_SECRET
  },
  auth: {
    tokenHost: 'https://github.com',
    tokenPath: '/login/oauth/access_token',
    authorizePath: '/login/oauth/authorize'
  }
};

export default async function handler(req, res) {
  if (!process.env.GITHUB_CLIENT_ID || !process.env.GITHUB_CLIENT_SECRET) {
    res.status(500).json({ error: 'GitHub OAuth credentials not configured.' });
    return;
  }
  
  const client = new AuthorizationCode(config);
  const { code, error, error_description } = req.query;

  if (error) {
    console.error('OAuth Error:', error_description);
    res.status(500).send(`Error: ${error_description}`);
    return;
  }

  const redirectUri = `${process.env.NEXT_PUBLIC_SITE_URL}/api/callback`;

  const tokenParams = {
    code,
    redirect_uri: redirectUri,
    scope: 'repo,user', // or just 'repo'
  };

  try {
    const accessToken = await client.getToken(tokenParams);
    const token = accessToken.token.access_token;

    const script = `
      <script>
        (function() {
          function receiveMessage(e) {
            console.log("receiveMessage %o", e);
            if (e.data === "authorizing:github") {
              e.source.postMessage(
                'authorization:github:success:${JSON.stringify({ token: token, provider: "github" })}',
                e.origin
              );
            }
          }
          window.addEventListener("message", receiveMessage, false);
          window.opener.postMessage("authorizing:github", "*");
        })()
      </script>
    `;
    res.setHeader('Content-Type', 'text/html');
    res.send(script);
  } catch (e) {
    console.error('Access Token Error', e.message);
    res.status(500).send(`Access Token Error: ${e.message}`);
  }
}