import React from 'react';

const LoginLeft = () => {
  return (
    <div
      className="login-left"
      style={{
        display: 'flex',
        flex: '0 0 42%',
        minHeight: '100vh',
        flexDirection: 'column',
        justifyContent: 'space-between',
        padding: '44px 40px',
        overflow: 'hidden',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        backgroundSize: 'cover',
        backgroundColor: '#18181b',
        backgroundImage: "url('/bg-img.png')",
        color: '#ffffff',
        boxSizing: 'border-box',
      }}
    >
      {/* Brand Header */}
      <div className="login-left__brand" style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        <img src="/logo.svg" alt="Builder AI logo" style={{ width: '28px', height: '28px' }} />
        <span style={{ color: '#ffffff', fontSize: '22px', fontWeight: 700, letterSpacing: '-0.02em' }}>
          Builder AI
        </span>
      </div>

      {/* Headline & Description */}
      <div>
        <h2
          style={{
            margin: '0 0 14px',
            color: '#ffffff',
            fontSize: '32px',
            fontWeight: 700,
            lineHeight: 1.25,
            letterSpacing: '-0.03em',
          }}
        >
          Build your presence on web
        </h2>
        <p
          style={{
            maxWidth: '480px',
            margin: 0,
            color: '#a1a1aa',
            fontSize: '14.5px',
            lineHeight: 1.6,
          }}
        >
          Describe what you need, preview instantly, and customize your site in real-time. React with
          clean JSX, verified layouts, and instant code exports.
        </p>
      </div>
    </div>
  );
};

export default LoginLeft;