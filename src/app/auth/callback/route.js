import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export async function GET(request) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get('code');

  if (code) {
    const cookieStore = cookies();
    const supabase = createRouteHandlerClient({ cookies: () => cookieStore });
    
    try {
      const { error } = await supabase.auth.exchangeCodeForSession(code);
      
      if (error) {
        console.error('Error exchanging code for session:', error);
        return NextResponse.redirect(new URL('/?error=auth', requestUrl.origin));
      }
    } catch (error) {
      console.error('Error in auth callback:', error);
      return NextResponse.redirect(new URL('/?error=auth', requestUrl.origin));
    }
  }

  // Create a loading page response
  const loadingPage = `
    <!DOCTYPE html>
    <html>
      <head>
        <title>Authenticating...</title>
        <style>
          body {
            margin: 0;
            padding: 0;
            display: flex;
            justify-content: center;
            align-items: center;
            min-height: 100vh;
            background-color: #f9fafb;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
          }
          .loading-container {
            display: flex;
            flex-direction: column;
            align-items: center;
            gap: 0.5rem;
          }
          .spinner {
            width: 2rem;
            height: 2rem;
            border: 2px solid #6366f1;
            border-top-color: transparent;
            border-radius: 50%;
            animation: spin 1s linear infinite;
          }
          @keyframes spin {
            to { transform: rotate(360deg); }
          }
          .text {
            color: #6b7280;
            font-size: 0.875rem;
          }
        </style>
      </head>
      <body>
        <div class="loading-container">
          <div class="spinner"></div>
          <p class="text">Completing authentication...</p>
        </div>
        <script>
          // Redirect to home page after a short delay
          setTimeout(() => {
            window.location.href = '/';
          }, 1000);
        </script>
      </body>
    </html>
  `;

  return new NextResponse(loadingPage, {
    headers: {
      'Content-Type': 'text/html',
    },
  });
} 