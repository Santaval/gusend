import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';

export async function GET(request: NextRequest) {
  try {
    const authData = await auth();
    console.log('Authenticated user ID:', JSON.stringify(authData));
    if (!authData.isAuthenticated) {
        console.log('User is not authenticated');
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const code = searchParams.get('code');

    if (!code) {
      return NextResponse.json({ error: 'Missing authorization code' }, { status: 400 });
    }

    // Exchange the code for an access token
    const tokenResponse = await fetch('https://github.com/login/oauth/access_token', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        client_id: process.env.GITHUB_CLIENT_ID,
        client_secret: process.env.GITHUB_CLIENT_SECRET,
        code,
      }),
    });

    const tokenData = await tokenResponse.json();

    if (!tokenData.access_token) {
      console.error('GitHub OAuth error:', tokenData);
      return NextResponse.json({ error: 'Failed to get access token' }, { status: 400 });
    }

    // Fetch user info to verify the token works
    const userResponse = await fetch('https://api.github.com/user', {
      headers: {
        'Authorization': `token ${tokenData.access_token}`,
        'Accept': 'application/vnd.github.v3+json',
      },
    });

    const userData = await userResponse.json();

    if (!userData.login) {
      return NextResponse.json({ error: 'Failed to get user info' }, { status: 400 });
    }

    // In a real app, you'd store this token securely in a database
    // For this demo, we'll return it to be stored client-side
    // IMPORTANT: In production, store tokens server-side linked to the Clerk user ID
    
    // Redirect to success page with token in URL params (not secure, just for demo)
    const redirectUrl = new URL('/dashboard', request.url);
    redirectUrl.searchParams.set('github_token', tokenData.access_token);
    redirectUrl.searchParams.set('github_user', userData.login);
    
    return NextResponse.redirect(redirectUrl);

  } catch (error) {
    console.error('GitHub OAuth callback error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}