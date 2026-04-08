import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const appId = process.env.FACEBOOK_APP_ID;

  if (!appId) {
    return NextResponse.json(
      { error: 'Facebook App ID not configured' },
      { status: 500 }
    );
  }

  const { origin } = new URL(request.url);
  const redirectUri = `${origin}/api/instagram/callback`;

  const scopes = [
    'instagram_basic',
    'instagram_manage_insights',
    'pages_show_list',
    'pages_read_engagement',
  ].join(',');

  const authUrl = `https://www.facebook.com/v19.0/dialog/oauth?client_id=${appId}&redirect_uri=${encodeURIComponent(redirectUri)}&scope=${scopes}&response_type=code`;

  return NextResponse.redirect(authUrl);
}
