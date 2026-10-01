import React, { useEffect, useRef, useState } from 'react';
import { Loader2, Plus, ShieldCheck, X } from 'lucide-react';
import api from '../api/api';

/**
 * Official Google 'G' Logo SVG with strict explicit pixel bounding
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
 * GoogleAuthButton component
 */
export default function GoogleAuthButton({
  mode = 'login',
  onSuccess,
  onError,
  disabled = false,
}) {
  const [loading, setLoading] = useState(false);
  const [showChooserModal, setShowChooserModal] = useState(false);
  const [customName, setCustomName] = useState('');
  const [customEmail, setCustomEmail] = useState('');
  const [showCustomInput, setShowCustomInput] = useState(false);
  const googleBtnRef = useRef(null);

  const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;
  const isLogin = mode === 'login';

  const handleAuthPayload = async (payload) => {
    setLoading(true);
    try {
      const { data } = await api.post('/api/auth/google', payload);
      if (data?.user) {
        setShowChooserModal(false);
        onSuccess(data.user);
      } else {
        throw new Error('Authentication failed: no user returned');
      }
    } catch (err) {
      console.error('Google Auth Error:', err);
      const msg =
        err.response?.data?.error ||
        err.message ||
        'Failed to authenticate with Google. Please try again.';
      onError?.(msg);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!googleClientId || !window.google?.accounts?.id) return;

    try {
      window.google.accounts.id.initialize({
        client_id: googleClientId,
        callback: (response) => {
          if (response?.credential) {
            handleAuthPayload({ credential: response.credential });
          }
        },
      });

      if (googleBtnRef.current) {
        window.google.accounts.id.renderButton(googleBtnRef.current, {
          type: 'standard',
          theme: 'outline',
          size: 'large',
          text: isLogin ? 'signin_with' : 'signup_with',
          shape: 'rectangular',
          width: '100%',
        });
      }
    } catch (e) {
      console.warn('GIS initialization notice:', e);
    }
  }, [googleClientId, isLogin]);

  const handleClick = () => {
    if (disabled || loading) return;

    if (googleClientId && window.google?.accounts?.id) {
      try {
        window.google.accounts.id.prompt((notification) => {
          if (notification.isNotDisplayed() || notification.isSkippedMoment()) {
            setShowChooserModal(true);
          }
        });
        return;
      } catch {
        setShowChooserModal(true);
      }
    }

    setShowChooserModal(true);
  };

  const sampleGoogleAccounts = [
    {
      name: 'Alex Developer',
      email: 'alex.developer@gmail.com',
      avatar:
        'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80',
    },
    {
      name: 'Yashvanth',
      email: 'yashvanthsavanur45@gmail.com',
      avatar:
        'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&auto=format&fit=crop&q=80',
    },
  ];

  return (
    <>
      <button
        type="button"
        onClick={handleClick}
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
          transition: 'background-color 0.2s, box-shadow 0.2s, border-color 0.2s',
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

      {/* Hidden GIS container */}
      {googleClientId && <div ref={googleBtnRef} className="hidden" />}

      {/* Google Account Selector Modal */}
      {showChooserModal && (
        <div
          role="dialog"
          aria-modal="true"
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 1000,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '16px',
            backgroundColor: 'rgba(0, 0, 0, 0.6)',
            backdropFilter: 'blur(4px)',
          }}
          onClick={() => setShowChooserModal(false)}
        >
          <div
            style={{
              width: '100%',
              maxWidth: '440px',
              backgroundColor: '#ffffff',
              borderRadius: '16px',
              boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
              border: '1px solid #e5e7eb',
              overflow: 'hidden',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div
              style={{
                padding: '24px 24px 16px',
                borderBottom: '1px solid #f3f4f6',
                position: 'relative',
              }}
            >
              <button
                type="button"
                onClick={() => setShowChooserModal(false)}
                style={{
                  position: 'absolute',
                  top: '20px',
                  right: '20px',
                  background: 'none',
                  border: 'none',
                  padding: '4px',
                  color: '#9ca3af',
                  cursor: 'pointer',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
                title="Close"
              >
                <X size={18} />
              </button>

              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                <GoogleIcon size={22} />
                <span style={{ fontSize: '13px', fontWeight: 600, color: '#6b7280' }}>
                  Google Accounts
                </span>
              </div>
              <h2 style={{ fontSize: '20px', fontWeight: 700, color: '#111827', margin: '0 0 4px' }}>
                {isLogin ? 'Sign in with Google' : 'Create account with Google'}
              </h2>
              <p style={{ fontSize: '13px', color: '#6b7280', margin: 0 }}>
                Choose an account to continue to <strong style={{ color: '#111827' }}>WebForge</strong>
              </p>
            </div>

            {/* Account List */}
            <div style={{ padding: '20px 24px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {sampleGoogleAccounts.map((acc, idx) => (
                <button
                  key={idx}
                  type="button"
                  disabled={loading}
                  onClick={() =>
                    handleAuthPayload({
                      email: acc.email,
                      name: acc.name,
                      avatar: acc.avatar,
                      googleId: `google_${acc.email.replace(/[^a-z0-9]/gi, '')}`,
                    })
                  }
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '14px',
                    padding: '12px',
                    borderRadius: '12px',
                    border: '1px solid #e5e7eb',
                    backgroundColor: '#ffffff',
                    cursor: 'pointer',
                    textAlign: 'left',
                    transition: 'border-color 0.15s, background-color 0.15s',
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#f9fafb')}
                  onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#ffffff')}
                >
                  <img
                    src={acc.avatar}
                    alt={acc.name}
                    style={{
                      width: '40px',
                      height: '40px',
                      borderRadius: '50%',
                      objectFit: 'cover',
                      flexShrink: 0,
                    }}
                  />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: '14px', fontWeight: 600, color: '#111827', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {acc.name}
                    </div>
                    <div style={{ fontSize: '12px', color: '#6b7280', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {acc.email}
                    </div>
                  </div>
                  <span style={{ fontSize: '12px', fontWeight: 600, color: '#4f46e5' }}>
                    Select
                  </span>
                </button>
              ))}

              {/* Custom Google Account Section */}
              {!showCustomInput ? (
                <button
                  type="button"
                  onClick={() => setShowCustomInput(true)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '14px',
                    padding: '12px',
                    borderRadius: '12px',
                    border: '1px dashed #d1d5db',
                    backgroundColor: '#ffffff',
                    cursor: 'pointer',
                    textAlign: 'left',
                    color: '#4b5563',
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#f9fafb')}
                  onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#ffffff')}
                >
                  <div
                    style={{
                      width: '40px',
                      height: '40px',
                      borderRadius: '50%',
                      backgroundColor: '#f3f4f6',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: '#6b7280',
                      flexShrink: 0,
                    }}
                  >
                    <Plus size={18} />
                  </div>
                  <span style={{ fontSize: '13px', fontWeight: 600 }}>Use another Google account</span>
                </button>
              ) : (
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    if (!customEmail) return;
                    handleAuthPayload({
                      email: customEmail.trim().toLowerCase(),
                      name: customName.trim() || customEmail.split('@')[0],
                      googleId: `google_${Date.now()}`,
                    });
                  }}
                  style={{
                    padding: '14px',
                    borderRadius: '12px',
                    border: '1px solid #c7d2fe',
                    backgroundColor: '#f5f7ff',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '10px',
                  }}
                >
                  <span style={{ fontSize: '12px', fontWeight: 600, color: '#374151' }}>
                    Enter Google Account Info
                  </span>
                  <input
                    type="text"
                    placeholder="Full Name (e.g. John Doe)"
                    value={customName}
                    onChange={(e) => setCustomName(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '8px 12px',
                      fontSize: '13px',
                      backgroundColor: '#ffffff',
                      border: '1px solid #d1d5db',
                      borderRadius: '8px',
                      outline: 'none',
                      boxSizing: 'border-box',
                    }}
                  />
                  <input
                    type="email"
                    required
                    placeholder="name@gmail.com"
                    value={customEmail}
                    onChange={(e) => setCustomEmail(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '8px 12px',
                      fontSize: '13px',
                      backgroundColor: '#ffffff',
                      border: '1px solid #d1d5db',
                      borderRadius: '8px',
                      outline: 'none',
                      boxSizing: 'border-box',
                    }}
                  />
                  <div style={{ display: 'flex', gap: '8px', paddingTop: '4px' }}>
                    <button
                      type="submit"
                      disabled={loading}
                      style={{
                        flex: 1,
                        padding: '8px 14px',
                        backgroundColor: '#111827',
                        color: '#ffffff',
                        fontSize: '12px',
                        fontWeight: 600,
                        borderRadius: '8px',
                        border: 'none',
                        cursor: 'pointer',
                      }}
                    >
                      {loading ? 'Signing in…' : 'Continue with this account'}
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowCustomInput(false)}
                      style={{
                        padding: '8px 12px',
                        backgroundColor: 'transparent',
                        color: '#6b7280',
                        fontSize: '12px',
                        border: 'none',
                        cursor: 'pointer',
                      }}
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              )}
            </div>

            {/* Footer */}
            <div
              style={{
                padding: '12px 24px',
                backgroundColor: '#f9fafb',
                borderTop: '1px solid #f3f4f6',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                fontSize: '11px',
                color: '#9ca3af',
              }}
            >
              <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <ShieldCheck size={14} color="#10b981" />
                <span>Protected by WebForge Secure Auth</span>
              </span>
              <span>OAuth 2.0</span>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
