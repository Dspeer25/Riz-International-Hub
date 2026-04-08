import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get('code');
  const error = searchParams.get('error');

  if (error || !code) {
    return NextResponse.redirect(`${origin}/media?error=auth_denied`);
  }

  const appId = process.env.FACEBOOK_APP_ID;
  const appSecret = process.env.FACEBOOK_APP_SECRET;
  const redirectUri = `${origin}/api/instagram/callback`;

  if (!appId || !appSecret) {
    return NextResponse.redirect(`${origin}/media?error=missing_config`);
  }

  try {
    // Step 1: Exchange code for short-lived token
    const tokenRes = await fetch(
      `https://graph.facebook.com/v19.0/oauth/access_token?client_id=${appId}&redirect_uri=${encodeURIComponent(redirectUri)}&client_secret=${appSecret}&code=${code}`
    );
    const tokenData = await tokenRes.json();

    if (!tokenData.access_token) {
      return NextResponse.redirect(`${origin}/media?error=token_exchange_failed`);
    }

    // Step 2: Exchange for long-lived token
    const longTokenRes = await fetch(
      `https://graph.facebook.com/v19.0/oauth/access_token?grant_type=fb_exchange_token&client_id=${appId}&client_secret=${appSecret}&fb_exchange_token=${tokenData.access_token}`
    );
    const longTokenData = await longTokenRes.json();
    const longToken = longTokenData.access_token || tokenData.access_token;

    // Step 3: Get Facebook Pages
    const pagesRes = await fetch(
      `https://graph.facebook.com/v19.0/me/accounts?access_token=${longToken}`
    );
    const pagesData = await pagesRes.json();

    if (!pagesData.data || pagesData.data.length === 0) {
      return NextResponse.redirect(`${origin}/media?error=no_pages`);
    }

    // Step 4: Get Instagram Business Account from first page
    const pageId = pagesData.data[0].id;
    const pageToken = pagesData.data[0].access_token;
    const igRes = await fetch(
      `https://graph.facebook.com/v19.0/${pageId}?fields=instagram_business_account&access_token=${pageToken}`
    );
    const igData = await igRes.json();

    if (!igData.instagram_business_account?.id) {
      return NextResponse.redirect(`${origin}/media?error=no_instagram`);
    }

    const igUserId = igData.instagram_business_account.id;

    // Step 5: Redirect to success page with credentials
    // These need to be added to Vercel env vars
    const successUrl = new URL('/media', origin);
    successUrl.searchParams.set('connected', 'true');
    successUrl.searchParams.set('ig_user_id', igUserId);
    successUrl.searchParams.set('token_preview', longToken.slice(0, 20) + '...');
    successUrl.searchParams.set('full_token', longToken);

    return NextResponse.redirect(successUrl.toString());
  } catch (err) {
    return NextResponse.redirect(`${origin}/media?error=unknown`);
  }
}
