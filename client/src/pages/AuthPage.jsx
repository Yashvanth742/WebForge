import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AlertCircle, Eye, EyeOff, Loader2, Sparkles } from 'lucide-react';
import toast from 'react-hot-toast';
import LoginLeft from '../components/LoginLeft';
import GoogleAuthButton from '../components/GoogleAuthButton';
import ForgotPasswordModal from '../components/ForgotPasswordModal';
import api from '../api/api';
import { useAppContext } from '../context/AppContext';

export default function AuthPage({ mode = 'login' }) {
  const navigate = useNavigate();
  const { setUser } = useAppContext();
  const isLogin = mode === 'login';

  // Form state
  const [error, setError] = useState('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [demoLoading, setDemoLoading] = useState(false);
  const [forgotModalOpen, setForgotModalOpen] = useState(false);

  // Load remembered email
  useEffect(() => {
    const saved = localStorage.getItem('webforge_remember_email');
    if (saved) {
      setEmail(saved);
      setRememberMe(true);
    }
  }, []);

  const handleAuthSuccess = (userData, message) => {
    setUser(userData);
    if (rememberMe && email) {
      localStorage.setItem('webforge_remember_email', email.trim().toLowerCase());
    } else if (!rememberMe) {
      localStorage.removeItem('webforge_remember_email');
    }
    toast.success(message || (isLogin ? 'Signed in successfully!' : 'Account created!'));
    navigate('/');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    const cleanEmail = email.trim().toLowerCase();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanEmail)) {
      setError('Please provide a valid email address.');
      return;
    }

    if (!isLogin && name.trim().length < 2) {
      setError('Name must be at least 2 characters.');
      return;
    }

    if (password.length < 4) {
      setError('Password must be at least 4 characters.');
      return;
    }

    setSubmitting(true);
    try {
      const endpoint = isLogin ? '/api/auth/login' : '/api/auth/register';
      const payload = isLogin
        ? { email: cleanEmail, password }
        : { name: name.trim(), email: cleanEmail, password };

      const { data } = await api.post(endpoint, payload);
      if (data?.user) {
        handleAuthSuccess(data.user);
      } else {
        throw new Error('No user data returned');
      }
    } catch (err) {
      console.error('Auth error:', err);
      setError(
        err.response?.data?.error ||
        'Authentication failed. Please verify your credentials and try again.'
      );
    } finally {
      setSubmitting(false);
    }
  };

  const handleDemoSignIn = async () => {
    setError('');
    setDemoLoading(true);
    try {
      const { data } = await api.post('/api/auth/demo');
      if (data?.user) {
        handleAuthSuccess(data.user, 'Signed in as Demo Developer!');
      }
    } catch {
      try {
        const { data } = await api.post('/api/auth/register', {
          name: 'Demo Developer',
          email: 'demo@webforge.ai',
          password: 'password123',
        });
        if (data?.user) {
          handleAuthSuccess(data.user, 'Signed in as Demo Developer!');
        }
      } catch {
        setError('Demo sign-in unavailable. Please register an account.');
      }
    } finally {
      setDemoLoading(false);
    }
  };

  return (
    <div
      className="auth-page"
      style={{
        display: 'flex',
        flexDirection: 'row',
        width: '100%',
        minHeight: '100vh',
        backgroundColor: '#ffffff',
        color: '#09090b',
        fontFamily: "'Plus Jakarta Sans', system-ui, -apple-system, sans-serif",
      }}
    >
      {/* Left Reference Side with /bg-img.png */}
      <LoginLeft />

      {/* Right Form Side matching the screenshot */}
      <div
        className="auth-page__right"
        style={{
          flex: '1 1 58%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '40px 32px',
          minHeight: '100vh',
          backgroundColor: '#ffffff',
          boxSizing: 'border-box',
        }}
      >
        <div style={{ width: '100%', maxWidth: '380px' }}>
          {/* Header */}
          <div style={{ marginBottom: '32px' }}>
            <h1
              style={{
                fontSize: '28px',
                fontWeight: 700,
                color: '#18181b',
                letterSpacing: '-0.02em',
                margin: '0 0 8px',
              }}
            >
              {isLogin ? 'Sign in' : 'Create an account'}
            </h1>
            <p style={{ margin: 0, color: '#71717a', fontSize: '13.5px' }}>
              {isLogin
                ? 'Enter your credentials to access your account.'
                : 'Get started by entering your registration details.'}
            </p>
          </div>

          {/* Error Banner */}
          {error && (
            <div
              style={{
                marginBottom: '20px',
                padding: '12px 14px',
                borderRadius: '8px',
                backgroundColor: '#fef2f2',
                border: '1px solid #fecaca',
                color: '#b91c1c',
                fontSize: '12.5px',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
              }}
            >
              <AlertCircle size={15} style={{ flexShrink: 0 }} />
              <div>{error}</div>
            </div>
          )}

          {/* Form with clean underline input styling matching reference image */}
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '22px' }}>
            {!isLogin && (
              <div>
                <label
                  style={{
                    display: 'block',
                    fontSize: '11px',
                    fontWeight: 600,
                    textTransform: 'uppercase',
                    letterSpacing: '0.08em',
                    color: '#71717a',
                    marginBottom: '6px',
                  }}
                >
                  Full Name
                </label>
                <input
                  type="text"
                  name="name"
                  placeholder="GreatStack"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  style={{
                    width: '100%',
                    padding: '8px 0',
                    border: 'none',
                    borderBottom: '1px solid #e4e4e7',
                    borderRadius: 0,
                    fontSize: '14px',
                    color: '#18181b',
                    backgroundColor: 'transparent',
                    outline: 'none',
                    transition: 'border-color 0.2s',
                    boxSizing: 'border-box',
                  }}
                  onFocus={(e) => (e.target.style.borderBottomColor = '#ea580c')}
                  onBlur={(e) => (e.target.style.borderBottomColor = '#e4e4e7')}
                />
              </div>
            )}

            <div>
              <label
                style={{
                  display: 'block',
                  fontSize: '11px',
                  fontWeight: 600,
                  textTransform: 'uppercase',
                  letterSpacing: '0.08em',
                  color: '#71717a',
                  marginBottom: '6px',
                }}
              >
                Email Address
              </label>
              <input
                type="email"
                name="email"
                placeholder={isLogin ? 'you@example.com' : 'GreatStack@example.com'}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                style={{
                  width: '100%',
                  padding: '8px 0',
                  border: 'none',
                  borderBottom: '1px solid #e4e4e7',
                  borderRadius: 0,
                  fontSize: '14px',
                  color: '#18181b',
                  backgroundColor: 'transparent',
                  outline: 'none',
                  transition: 'border-color 0.2s',
                  boxSizing: 'border-box',
                }}
                onFocus={(e) => (e.target.style.borderBottomColor = '#ea580c')}
                onBlur={(e) => (e.target.style.borderBottomColor = '#e4e4e7')}
              />
            </div>

            <div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
                <label
                  style={{
                    display: 'block',
                    fontSize: '11px',
                    fontWeight: 600,
                    textTransform: 'uppercase',
                    letterSpacing: '0.08em',
                    color: '#71717a',
                    margin: 0,
                  }}
                >
                  Password
                </label>
                {isLogin && (
                  <button
                    type="button"
                    onClick={() => setForgotModalOpen(true)}
                    style={{
                      background: 'none',
                      border: 'none',
                      fontSize: '11.5px',
                      color: '#ea580c',
                      fontWeight: 600,
                      cursor: 'pointer',
                      padding: 0,
                    }}
                  >
                    Forgot password?
                  </button>
                )}
              </div>
              <div style={{ position: 'relative', width: '100%' }}>
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  minLength={4}
                  required
                  style={{
                    width: '100%',
                    padding: '8px 28px 8px 0',
                    border: 'none',
                    borderBottom: '1px solid #e4e4e7',
                    borderRadius: 0,
                    fontSize: '14px',
                    color: '#18181b',
                    backgroundColor: 'transparent',
                    outline: 'none',
                    transition: 'border-color 0.2s',
                    boxSizing: 'border-box',
                  }}
                  onFocus={(e) => (e.target.style.borderBottomColor = '#ea580c')}
                  onBlur={(e) => (e.target.style.borderBottomColor = '#e4e4e7')}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{
                    position: 'absolute',
                    right: 0,
                    top: '50%',
                    transform: 'translateY(-50%)',
                    background: 'none',
                    border: 'none',
                    color: '#a1a1aa',
                    cursor: 'pointer',
                    padding: '4px',
                    display: 'flex',
                    alignItems: 'center',
                  }}
                  tabIndex={-1}
                  title={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {/* Remember Me on Login */}
            {isLogin && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '-4px' }}>
                <input
                  type="checkbox"
                  id="rememberMe"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  style={{
                    width: '15px',
                    height: '15px',
                    borderRadius: '3px',
                    cursor: 'pointer',
                    accentColor: '#ea580c',
                    margin: 0,
                  }}
                />
                <label
                  htmlFor="rememberMe"
                  style={{
                    fontSize: '12.5px',
                    color: '#52525b',
                    userSelect: 'none',
                    cursor: 'pointer',
                    margin: 0,
                  }}
                >
                  Remember my email
                </label>
              </div>
            )}

            {/* Orange-Red Gradient Action Button (Matching Reference Image) */}
            <button
              type="submit"
              disabled={submitting || demoLoading}
              style={{
                width: '100%',
                height: '44px',
                background: 'linear-gradient(90deg, #ea580c 0%, #dc2626 100%)',
                color: '#ffffff',
                fontSize: '14px',
                fontWeight: 600,
                borderRadius: '8px',
                border: 'none',
                cursor: submitting || demoLoading ? 'not-allowed' : 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                boxShadow: '0 4px 12px rgba(234, 88, 12, 0.25)',
                transition: 'opacity 0.15s ease, transform 0.15s ease',
                opacity: submitting || demoLoading ? 0.7 : 1,
                marginTop: '6px',
              }}
            >
              {submitting && <Loader2 size={16} className="animate-spin" />}
              <span>{submitting ? 'Please wait…' : isLogin ? 'Sign in' : 'Sign up'}</span>
            </button>

            {/* Divider */}
            <div style={{ display: 'flex', alignItems: 'center', margin: '4px 0', textAlign: 'center' }}>
              <div style={{ flex: 1, borderTop: '1px solid #f4f4f5' }} />
              <span
                style={{
                  padding: '0 10px',
                  fontSize: '11px',
                  fontWeight: 600,
                  letterSpacing: '0.05em',
                  textTransform: 'uppercase',
                  color: '#a1a1aa',
                }}
              >
                or
              </span>
              <div style={{ flex: 1, borderTop: '1px solid #f4f4f5' }} />
            </div>

            {/* Google Sign In Option */}
            <GoogleAuthButton
              mode={mode}
              onSuccess={(user) =>
                handleAuthSuccess(
                  user,
                  isLogin
                    ? `Signed in with Google as ${user.name}`
                    : `Account registered with Google as ${user.name}`
                )
              }
              onError={setError}
              disabled={submitting || demoLoading}
            />

            {/* 1-Click Demo Developer option on Login */}
            {isLogin && (
              <button
                type="button"
                onClick={handleDemoSignIn}
                disabled={submitting || demoLoading}
                style={{
                  width: '100%',
                  height: '38px',
                  backgroundColor: '#fef2f2',
                  color: '#ea580c',
                  fontSize: '12.5px',
                  fontWeight: 600,
                  borderRadius: '8px',
                  border: '1px solid #ffedd5',
                  cursor: submitting || demoLoading ? 'not-allowed' : 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '6px',
                  opacity: submitting || demoLoading ? 0.7 : 1,
                }}
              >
                <Sparkles size={14} color="#ea580c" />
                <span>{demoLoading ? 'Signing in…' : 'Quick Demo Sign In (1-Click)'}</span>
              </button>
            )}

            {/* Switch Mode Link matching reference image */}
            <p
              style={{
                textAlign: 'center',
                fontSize: '13px',
                color: '#71717a',
                margin: '10px 0 0',
              }}
            >
              {isLogin ? "Don't have an account? " : 'Already have an account? '}
              <Link
                to={isLogin ? '/register' : '/login'}
                onClick={() => setError('')}
                style={{
                  color: '#18181b',
                  fontWeight: 600,
                  textDecoration: 'none',
                }}
              >
                {isLogin ? 'Sign up here' : 'Sign in here'}
              </Link>
            </p>
          </form>
        </div>
      </div>

      {/* Forgot Password Modal */}
      <ForgotPasswordModal
        isOpen={forgotModalOpen}
        onClose={() => setForgotModalOpen(false)}
        initialEmail={email}
        onSuccess={(resetEmail, newPass) => {
          setEmail(resetEmail);
          setPassword(newPass);
        }}
      />
    </div>
  );
}
