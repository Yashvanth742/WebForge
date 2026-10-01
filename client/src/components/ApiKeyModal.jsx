import React, { useState, useEffect } from 'react';
import { KeyRound, CheckCircle2, AlertCircle, X, Loader2, Sparkles, ExternalLink } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../api/api';

export default function ApiKeyModal({ isOpen, onClose, onKeyConfigured }) {
  const [apiKey, setApiKey] = useState('');
  const [model, setModel] = useState('gemini-2.5-flash');
  const [isConfigured, setIsConfigured] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (!isOpen) return;
    setIsLoading(true);
    api
      .get('/api/agent/status')
      .then((res) => {
        setIsConfigured(res.data.configured);
        if (res.data.model) setModel(res.data.model);
      })
      .catch((err) => {
        console.warn('Could not fetch agent status:', err);
      })
      .finally(() => setIsLoading(false));
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSave = async (e) => {
    e.preventDefault();
    if (!apiKey.trim() && !isConfigured) {
      toast.error('Please enter a Google Gemini API Key.');
      return;
    }

    setIsSaving(true);
    try {
      const payload = { model };
      if (apiKey.trim()) {
        payload.apiKey = apiKey.trim();
      }
      const res = await api.post('/api/agent/config', payload);
      setIsConfigured(res.data.configured);
      toast.success('Gemini configuration saved successfully!');
      if (onKeyConfigured) onKeyConfigured(res.data);
      onClose();
    } catch (err) {
      console.error('Failed to save API config:', err);
      toast.error(err.response?.data?.error || 'Failed to update configuration.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(9, 9, 11, 0.6)',
        backdropFilter: 'blur(4px)',
        zIndex: 999,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '16px',
      }}
      onClick={onClose}
    >
      <div
        style={{
          backgroundColor: '#ffffff',
          borderRadius: '14px',
          border: '1px solid #e4e4e7',
          width: '100%',
          maxWidth: '460px',
          padding: '24px',
          boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div
              style={{
                width: '36px',
                height: '36px',
                borderRadius: '8px',
                backgroundColor: '#eef2ff',
                color: '#4f46e5',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Sparkles size={20} />
            </div>
            <div>
              <h3 style={{ margin: 0, fontSize: '16px', fontWeight: 800, color: '#09090b' }}>
                Google Gemini Agent Setup
              </h3>
              <span style={{ fontSize: '12px', color: '#71717a' }}>
                Powers autonomous tool execution and build verification
              </span>
            </div>
          </div>
          <button
            onClick={onClose}
            style={{
              background: 'none',
              border: 'none',
              color: '#71717a',
              cursor: 'pointer',
              padding: '4px',
            }}
          >
            <X size={18} />
          </button>
        </div>

        {/* Current Status Badge */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '10px 14px',
            borderRadius: '8px',
            backgroundColor: isConfigured ? '#f0fdf4' : '#fffbeb',
            border: isConfigured ? '1px solid #bbf7d0' : '1px solid #fef3c7',
            marginBottom: '16px',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            {isConfigured ? (
              <CheckCircle2 size={16} color="#16a34a" />
            ) : (
              <AlertCircle size={16} color="#d97706" />
            )}
            <span
              style={{
                fontSize: '12.5px',
                fontWeight: 600,
                color: isConfigured ? '#15803d' : '#b45309',
              }}
            >
              {isConfigured ? 'Gemini API Key Connected' : 'Gemini API Key Not Set'}
            </span>
          </div>
          <span style={{ fontSize: '11px', color: '#71717a', fontFamily: 'monospace' }}>
            {model}
          </span>
        </div>

        {/* Form */}
        <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <div>
            <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#27272a', marginBottom: '6px' }}>
              Gemini API Key
            </label>
            <input
              type="password"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              placeholder={isConfigured ? '•••••••••••••••••••••••••••••••• (Active)' : 'AIzaSy...'}
              style={{
                width: '100%',
                padding: '9px 12px',
                borderRadius: '8px',
                border: '1px solid #d4d4d8',
                fontSize: '13px',
                fontFamily: 'monospace',
                outline: 'none',
                boxSizing: 'border-box',
              }}
            />
            <span style={{ fontSize: '11px', color: '#71717a', marginTop: '4px', display: 'block' }}>
              Stored securely on the backend in <code>server/.env</code>. Never exposed to the browser.
            </span>
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#27272a', marginBottom: '6px' }}>
              Model
            </label>
            <select
              value={model}
              onChange={(e) => setModel(e.target.value)}
              style={{
                width: '100%',
                padding: '9px 12px',
                borderRadius: '8px',
                border: '1px solid #d4d4d8',
                fontSize: '13px',
                backgroundColor: '#ffffff',
                outline: 'none',
                boxSizing: 'border-box',
              }}
            >
              <option value="gemini-2.5-flash">gemini-2.5-flash (Recommended: fast, high quality)</option>
              <option value="gemini-2.0-flash">gemini-2.0-flash</option>
              <option value="gemini-1.5-pro">gemini-1.5-pro</option>
            </select>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px', marginTop: '8px' }}>
            <button
              type="button"
              onClick={onClose}
              style={{
                padding: '8px 14px',
                borderRadius: '8px',
                border: '1px solid #e4e4e7',
                backgroundColor: '#ffffff',
                color: '#3f3f46',
                fontSize: '13px',
                fontWeight: 600,
                cursor: 'pointer',
              }}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSaving}
              style={{
                padding: '8px 18px',
                borderRadius: '8px',
                border: 'none',
                backgroundColor: '#4f46e5',
                color: '#ffffff',
                fontSize: '13px',
                fontWeight: 700,
                cursor: isSaving ? 'not-allowed' : 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
              }}
            >
              {isSaving ? <Loader2 size={14} className="animate-spin" /> : null}
              <span>Save & Connect</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
