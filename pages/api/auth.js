// pages/api/auth.js
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

export default function handler(req, res) {
  if (!process.env.GITHUB_CLIENT_ID || !process.env.GITHUB_CLIENT_SECRET) {
    res.status(500).json({ error: 'GitHub OAuth credentials not configured.' });
    return;
  }

  const client = new AuthorizationCode(config);
  // Ensure NEXT_PUBLIC_SITE_URL is your Vercel domain without a trailing slash for this construction
  let siteUrl = process.env.NEXT_PUBLIC_SITE_URL;
  if (siteUrl.endsWith('/')) {
    siteUrl = siteUrl.slice(0, -1);
  }
  const redirectUri = `${siteUrl}/api/callback`;

  const authorizationUri = client.authorizeURL({
    redirect_uri: redirectUri,
    scope: 'repo,user', // or just 'repo' as per your config.yml
    state: Math.random().toString(36).substring(7) // Basic CSRF protection
  });

  res.redirect(authorizationUri);
}