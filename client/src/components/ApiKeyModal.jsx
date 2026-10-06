import React, { useState, useEffect } from 'react';
import {
  Sparkles,
  CheckCircle2,
  AlertCircle,
  X,
  Loader2,
  RefreshCw,
  Eye,
  EyeOff,
  ExternalLink,
  Cpu,
  ShieldCheck,
} from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../api/api';

const POPULAR_MODELS = [
  { id: 'nvidia/nemotron-3.5-lightning:free', name: 'Nvidia Nemotron 3.5 Lightning', badge: 'Free / Fast' },
  { id: 'google/gemma-4-31b-it:free', name: 'Google Gemma 4 31B', badge: 'Free / Powerful' },
  { id: 'qwen/qwen3.8-27b:free', name: 'Qwen 3.8 27B', badge: 'Free / Coding' },
  { id: 'deepseek/deepseek-chat', name: 'DeepSeek Chat (V3)', badge: 'Recommended' },
  { id: 'anthropic/claude-3.5-sonnet', name: 'Claude 3.5 Sonnet', badge: 'SOTA Coding' },
];

export default function ApiKeyModal({ isOpen, onClose, onKeyConfigured }) {
  const [apiKey, setApiKey] = useState('');
  const [showKey, setShowKey] = useState(false);
  const [model, setModel] = useState('nvidia/nemotron-3.5-lightning:free');
  const [isCustomModel, setIsCustomModel] = useState(false);
  const [customModelName, setCustomModelName] = useState('');
  const [isConnected, setIsConnected] = useState(false);
  const [keyInfo, setKeyInfo] = useState(null);
  const [maskedKey, setMaskedKey] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const fetchStatus = async () => {
    setIsLoading(true);
    try {
      const res = await api.get('/api/agent/status');
      setIsConnected(Boolean(res.data.connected));
      if (res.data.model) {
        setModel(res.data.model);
        const isPreset = POPULAR_MODELS.some((m) => m.id === res.data.model);
        if (!isPreset) {
          setIsCustomModel(true);
          setCustomModelName(res.data.model);
        }
      }
      if (res.data.apiKey) {
        setMaskedKey(res.data.apiKey);
      }
      if (res.data.keyInfo) {
        setKeyInfo(res.data.keyInfo);
      }
    } catch (err) {
      console.warn('Could not fetch OpenRouter status:', err);
      setIsConnected(false);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (!isOpen) return;
    fetchStatus();
  }, [isOpen]);

  if (!isOpen) return null;

  const activeModelValue = isCustomModel ? customModelName : model;

  const handleTestConnection = async () => {
    setIsLoading(true);
    try {
      const res = await api.post('/api/agent/config', {
        apiKey: apiKey.trim() || undefined,
        model: activeModelValue,
      });
      setIsConnected(Boolean(res.data.connected));
      if (res.data.keyInfo) setKeyInfo(res.data.keyInfo);
      if (res.data.apiKey) setMaskedKey(res.data.apiKey);

      if (res.data.connected) {
        toast.success('Connected to OpenRouter successfully!');
      } else {
        toast.error(res.data.error || 'Failed to authenticate with OpenRouter.');
      }
    } catch (err) {
      setIsConnected(false);
      toast.error(err.response?.data?.error || 'Failed to reach OpenRouter.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      const payload = { model: activeModelValue };
      if (apiKey.trim()) {
        payload.apiKey = apiKey.trim();
      }

      const res = await api.post('/api/agent/config', payload);
      setIsConnected(Boolean(res.data.connected));
      if (res.data.keyInfo) setKeyInfo(res.data.keyInfo);
      if (res.data.apiKey) setMaskedKey(res.data.apiKey);

      toast.success('OpenRouter settings saved successfully!');
      if (onKeyConfigured) onKeyConfigured(res.data);
      onClose();
    } catch (err) {
      console.error('Failed to save OpenRouter config:', err);
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
        backgroundColor: 'rgba(9, 9, 11, 0.7)',
        backdropFilter: 'blur(8px)',
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
          borderRadius: '16px',
          border: '1px solid #e4e4e7',
          width: '100%',
          maxWidth: '520px',
          padding: '24px',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '18px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div
              style={{
                width: '40px',
                height: '40px',
                borderRadius: '10px',
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
              <h3 style={{ margin: 0, fontSize: '17px', fontWeight: 800, color: '#09090b' }}>
                OpenRouter AI Settings
              </h3>
              <span style={{ fontSize: '12px', color: '#71717a' }}>
                Unified AI routing across open-source and proprietary models
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
            padding: '12px 14px',
            borderRadius: '10px',
            backgroundColor: isConnected ? '#f0fdf4' : '#fffbeb',
            border: isConnected ? '1px solid #bbf7d0' : '1px solid #fef3c7',
            marginBottom: '18px',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '9px' }}>
            {isConnected ? (
              <CheckCircle2 size={18} color="#16a34a" />
            ) : (
              <AlertCircle size={18} color="#d97706" />
            )}
            <div>
              <div
                style={{
                  fontSize: '13px',
                  fontWeight: 700,
                  color: isConnected ? '#15803d' : '#b45309',
                }}
              >
                {isConnected ? 'OpenRouter Active & Connected' : 'OpenRouter Key Required / Offline'}
              </div>
              <div style={{ fontSize: '11px', color: isConnected ? '#166534' : '#92400e', marginTop: '2px' }}>
                {isConnected
                  ? `Active Model: ${activeModelValue}${keyInfo?.free_model_daily_requests ? ` • ${keyInfo.free_model_daily_requests.remaining} free requests remaining today` : ''}`
                  : 'Enter your API key below to enable autonomous web generation.'}
              </div>
            </div>
          </div>
          <button
            type="button"
            onClick={fetchStatus}
            disabled={isLoading}
            title="Refresh status"
            style={{
              background: '#ffffff',
              border: '1px solid #e4e4e7',
              borderRadius: '6px',
              padding: '4px 8px',
              fontSize: '11px',
              fontWeight: 600,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              color: '#3f3f46',
            }}
          >
            <RefreshCw size={12} className={isLoading ? 'animate-spin' : ''} />
            <span>Check</span>
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {/* API Key */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
              <label style={{ fontSize: '12px', fontWeight: 700, color: '#27272a' }}>
                OpenRouter API Key
              </label>
              <a
                href="https://openrouter.ai/keys"
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  fontSize: '11px',
                  color: '#4f46e5',
                  fontWeight: 600,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '3px',
                  textDecoration: 'none',
                }}
              >
                Get API Key <ExternalLink size={11} />
              </a>
            </div>
            <div style={{ display: 'flex', gap: '8px' }}>
              <div style={{ position: 'relative', flex: 1 }}>
                <input
                  type={showKey ? 'text' : 'password'}
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                  placeholder={maskedKey ? `Current: ${maskedKey}` : 'sk-or-v1-...'}
                  style={{
                    width: '100%',
                    padding: '9px 36px 9px 12px',
                    borderRadius: '8px',
                    border: '1px solid #d4d4d8',
                    fontSize: '13px',
                    fontFamily: 'monospace',
                    outline: 'none',
                    boxSizing: 'border-box',
                  }}
                />
                <button
                  type="button"
                  onClick={() => setShowKey(!showKey)}
                  style={{
                    position: 'absolute',
                    right: '8px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    background: 'none',
                    border: 'none',
                    color: '#71717a',
                    cursor: 'pointer',
                    padding: '4px',
                  }}
                >
                  {showKey ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
              <button
                type="button"
                onClick={handleTestConnection}
                disabled={isLoading}
                style={{
                  padding: '8px 14px',
                  borderRadius: '8px',
                  border: '1px solid #e4e4e7',
                  backgroundColor: '#f4f4f5',
                  fontSize: '12px',
                  fontWeight: 600,
                  color: '#18181b',
                  cursor: 'pointer',
                  whiteSpace: 'nowrap',
                }}
              >
                Test
              </button>
            </div>
            <span style={{ fontSize: '11px', color: '#71717a', marginTop: '4px', display: 'block' }}>
              Your key is saved locally in <code>server/.env</code> and never exposed publicly.
            </span>
          </div>

          {/* Model Selector */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
              <label style={{ fontSize: '12px', fontWeight: 700, color: '#27272a' }}>
                OpenRouter Model
              </label>
              <button
                type="button"
                onClick={() => setIsCustomModel(!isCustomModel)}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#4f46e5',
                  fontSize: '11px',
                  fontWeight: 600,
                  cursor: 'pointer',
                  padding: 0,
                }}
              >
                {isCustomModel ? 'Choose from popular presets' : 'Enter custom model ID'}
              </button>
            </div>

            {isCustomModel ? (
              <input
                type="text"
                value={customModelName}
                onChange={(e) => setCustomModelName(e.target.value)}
                placeholder="e.g. meta-llama/llama-3.3-70b-instruct:free or openai/gpt-4o"
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
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                {POPULAR_MODELS.map((m) => (
                  <label
                    key={m.id}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '8px 12px',
                      borderRadius: '8px',
                      border: model === m.id ? '1px solid #4f46e5' : '1px solid #e4e4e7',
                      backgroundColor: model === m.id ? '#f5f3ff' : '#ffffff',
                      cursor: 'pointer',
                      transition: 'all 0.15s ease',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <input
                        type="radio"
                        name="openrouter_model"
                        value={m.id}
                        checked={model === m.id}
                        onChange={() => setModel(m.id)}
                        style={{ accentColor: '#4f46e5' }}
                      />
                      <span style={{ fontSize: '13px', fontWeight: model === m.id ? 700 : 500, color: '#18181b' }}>
                        {m.name}
                      </span>
                    </div>
                    <span
                      style={{
                        fontSize: '11px',
                        padding: '2px 7px',
                        borderRadius: '9999px',
                        backgroundColor: model === m.id ? '#e0e7ff' : '#f4f4f5',
                        color: model === m.id ? '#3730a3' : '#71717a',
                        fontWeight: 600,
                      }}
                    >
                      {m.badge}
                    </span>
                  </label>
                ))}
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px', marginTop: '4px' }}>
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
                backgroundColor: '#09090b',
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
              <span>Save Configuration</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
