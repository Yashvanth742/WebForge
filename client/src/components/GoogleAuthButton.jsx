import React, { useEffect, useRef, useState } from 'react';
import { AlertCircle, Loader2 } from 'lucide-react';
import api from '../api/api';

/**
 * Official Google 'G' Logo SVG
 */
export function GoogleIcon({ size = 18, className = '' }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      aria-hidden="true"
      style={{
        width: `${size}px`,
        height: `${size}px`,
        minWidth: `${size}px`,
        minHeight: `${size}px`,
        maxWidth: `${size}px`,
        maxHeight: `${size}px`,
        flexShrink: 0,
        display: 'block',
      }}
      className={className}
    >
      <path
        fill="#4285F4"
        d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17Z"
      />
      <path
        fill="#34A853"
        d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.34 24 12 24Z"
      />
      <path
        fill="#FBBC05"
        d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.17 0 9.99 0 12s.45 3.83 1.25 5.42l4.03-3.15Z"
      />
      <path
        fill="#EA4335"
        d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.34 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98Z"
      />
    </svg>
  );
}

/**
 * Production-ready Google Authentication Component for WebForge
 */
export default function GoogleAuthButton({
  mode = 'login',
  onSuccess,
  onError,
  disabled = false,
}) {
  const [loading, setLoading] = useState(false);
  const [gisReady, setGisReady] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const googleBtnContainerRef = useRef(null);
  const tokenClientRef = useRef(null);

  const googleClientId =
    import.meta.env.VITE_GOOGLE_CLIENT_ID ||
    '663237560942-h1uvg8for1nenmpn3adtn68doriki6o8.apps.googleusercontent.com';

  const isLogin = mode === 'login';

  // Handle authenticated payload from Google (either JWT credential or verified OAuth profile)
  const handleAuthPayload = async (payload) => {
    setLoading(true);
    setErrorMessage('');
    try {
      const { data } = await api.post('/api/auth/google', payload);
      if (data?.user) {
        onSuccess(data.user);
      } else {
        throw new Error('Authentication failed: no user returned from server.');
      }
    } catch (err) {
      console.error('[Google Auth Error]:', err);
      const msg =
        err.response?.data?.error ||
        err.message ||
        'Failed to authenticate with Google. Please check your credentials and try again.';
      setErrorMessage(msg);
      onError?.(msg);
    } finally {
      setLoading(false);
    }
  };

  // Initialize Google Identity Services
  useEffect(() => {
    let checkInterval = null;
    let cancelled = false;

    const setupGis = () => {
      if (cancelled) return;
      if (!window.google?.accounts) return;

      try {
        // 1. Initialize Google ID Token (GIS Credential API)
        if (window.google.accounts.id && googleClientId) {
          window.google.accounts.id.initialize({
            client_id: googleClientId,
            callback: (response) => {
              if (response?.credential) {
                handleAuthPayload({ credential: response.credential });
              }
            },
            auto_select: false,
            cancel_on_tap_outside: true,
          });

          // Render official Google button into container
          if (googleBtnContainerRef.current) {
            googleBtnContainerRef.current.innerHTML = '';
            window.google.accounts.id.renderButton(googleBtnContainerRef.current, {
              type: 'standard',
              theme: 'outline',
              size: 'large',
              text: isLogin ? 'signin_with' : 'signup_with',
              shape: 'rectangular',
              logo_alignment: 'left',
              width: 380,
            });
          }
        }

        // 2. Initialize Google OAuth2 Token Client (for popup fallback / custom button)
        if (window.google.accounts.oauth2 && googleClientId) {
          tokenClientRef.current = window.google.accounts.oauth2.initTokenClient({
            client_id: googleClientId,
            scope: 'email profile openid',
            callback: async (tokenResponse) => {
              if (tokenResponse?.error) {
                console.error('[Google OAuth2 Error]:', tokenResponse);
                const desc =
                  tokenResponse.error_description ||
                  `Google Sign-In failed (${tokenResponse.error})`;
                setErrorMessage(desc);
                onError?.(desc);
                setLoading(false);
                return;
              }

              if (tokenResponse?.access_token) {
                try {
                  // Fetch profile directly from Google
                  const profileRes = await fetch(
                    'https://www.googleapis.com/oauth2/v3/userinfo',
                    {
                      headers: {
                        Authorization: `Bearer ${tokenResponse.access_token}`,
                      },
                    }
                  );
                  if (profileRes.ok) {
                    const profile = await profileRes.json();
                    await handleAuthPayload({
                      email: profile.email,
                      name: profile.name || profile.given_name,
                      avatar: profile.picture,
                      googleId: profile.sub,
                      accessToken: tokenResponse.access_token,
                    });
                  } else {
                    // Fallback to sending token directly
                    await handleAuthPayload({
                      accessToken: tokenResponse.access_token,
                    });
                  }
                } catch (fetchErr) {
                  console.error('[Google Profile Fetch Error]:', fetchErr);
                  await handleAuthPayload({
                    accessToken: tokenResponse.access_token,
                  });
                }
              }
            },
            error_callback: (err) => {
              console.error('[Google Token Client Error]:', err);
              setLoading(false);
              const errMsg =
                err?.message ||
                'Google Sign-In cancelled or blocked. Ensure http://localhost:5173 is added to Authorized JavaScript Origins in Google Cloud Console.';
              setErrorMessage(errMsg);
              onError?.(errMsg);
            },
          });
        }

        setGisReady(true);
      } catch (err) {
        console.warn('[GIS Setup Warning]:', err);
      }
    };

    if (window.google?.accounts) {
      setupGis();
    } else {
      // Poll briefly until the async GIS script in index.html finishes loading
      checkInterval = setInterval(() => {
        if (window.google?.accounts) {
          clearInterval(checkInterval);
          setupGis();
        }
      }, 150);
    }

    return () => {
      cancelled = true;
      if (checkInterval) clearInterval(checkInterval);
    };
  }, [googleClientId, isLogin]);

  // Click handler if using the custom button or token popup
  const handleCustomButtonClick = () => {
    if (disabled || loading) return;
    setErrorMessage('');

    if (tokenClientRef.current) {
      setLoading(true);
      try {
        tokenClientRef.current.requestAccessToken({ prompt: 'select_account' });
      } catch (err) {
        setLoading(false);
        console.error('Trigger error:', err);
        setErrorMessage(
          'Could not launch Google Sign-In popup. Please verify popup permissions.'
        );
      }
    } else if (window.google?.accounts?.id) {
      try {
        window.google.accounts.id.prompt();
      } catch (e) {
        console.warn('Google One Tap notice:', e);
      }
    } else {
      setErrorMessage(
        'Google Identity Services is still loading. Please check your internet connection or ad-blocker.'
      );
    }
  };

  return (
    <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '8px' }}>
      {/* Official Google Identity Services Rendered Button Container */}
      <div
        ref={googleBtnContainerRef}
        style={{
          width: '100%',
          minHeight: '44px',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          borderRadius: '8px',
          overflow: 'hidden',
        }}
      />

      {/* Fallback button if GIS rendered button is loading or needs explicit custom click */}
      {!gisReady && (
        <button
          type="button"
          onClick={handleCustomButtonClick}
          disabled={disabled || loading}
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '12px',
            width: '100%',
            height: '44px',
            padding: '0 16px',
            backgroundColor: '#ffffff',
            color: '#3c4043',
            border: '1px solid #dadce0',
            borderRadius: '8px',
            fontSize: '14px',
            fontWeight: 600,
            cursor: disabled || loading ? 'not-allowed' : 'pointer',
            boxShadow: '0 1px 2px rgba(60,64,67,0.08), 0 1px 3px 1px rgba(60,64,67,0.06)',
            transition: 'background-color 0.2s, box-shadow 0.2s',
            opacity: disabled ? 0.6 : 1,
            boxSizing: 'border-box',
          }}
          title="Sign in with Google"
        >
          {loading ? (
            <Loader2 style={{ width: 18, height: 18 }} className="animate-spin text-zinc-600" />
          ) : (
            <GoogleIcon size={18} />
          )}
          <span style={{ whiteSpace: 'nowrap' }}>
            {loading
              ? 'Connecting Google…'
              : isLogin
              ? 'Continue with Google'
              : 'Sign up with Google'}
          </span>
        </button>
      )}

      {/* Origin or configuration warning if Google encounters an issue */}
      {errorMessage && (
        <div
          style={{
            padding: '10px 12px',
            borderRadius: '8px',
            backgroundColor: '#fef2f2',
            border: '1px solid #fecaca',
            color: '#991b1b',
            fontSize: '12px',
            display: 'flex',
            alignItems: 'flex-start',
            gap: '8px',
            lineHeight: 1.4,
          }}
        >
          <AlertCircle size={15} style={{ flexShrink: 0, marginTop: '2px' }} />
          <div>{errorMessage}</div>
        </div>
      )}
    </div>
  );
}
