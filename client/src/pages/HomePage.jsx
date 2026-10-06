import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  ArrowRight,
  Sparkles,
  Loader2,
  LogOut,
  Clock,
  ChevronRight,
  Folder,
  Mic,
  MicOff,
  Paperclip,
  X,
  FileText,
  Image as ImageIcon,
  Settings,
} from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../api/api';
import { useAppContext } from '../context/AppContext';
import ApiKeyModal from '../components/ApiKeyModal';

const SUGGESTIONS = [
  'Build a luxury restaurant website with a menu, table reservation, location, chef section and customer reviews',
  'Create a simple landing page for an artisanal coffee shop',
  'Create a React e-commerce store with shopping cart and checkout',
  'Create a SaaS dashboard with authentication and analytics',
  'Create a modern portfolio website for a web developer',
  'Create a fitness and gym club portal with class schedules',
];

export default function HomePage() {
  const [prompt, setPrompt] = useState('');
  const [isCreating, setIsCreating] = useState(false);
  const [projects, setProjects] = useState([]);
  const [loadingProjects, setLoadingProjects] = useState(true);
  const [isListening, setIsListening] = useState(false);
  const [attachedFile, setAttachedFile] = useState(null);
  const [showConfigModal, setShowConfigModal] = useState(false);

  const fileInputRef = useRef(null);
  const { user, logout } = useAppContext();
  const navigate = useNavigate();

  // Load user's recent projects
  useEffect(() => {
    let isMounted = true;
    api
      .get('/api/projects')
      .then((res) => {
        if (isMounted) {
          setProjects(Array.isArray(res.data) ? res.data : []);
        }
      })
      .catch((err) => {
        console.error('Failed to load recent projects:', err);
      })
      .finally(() => {
        if (isMounted) setLoadingProjects(false);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  // Voice speech-to-text recognition
  const toggleVoiceInput = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      toast.error('Voice input is not supported in this browser. Please use Chrome or Edge.');
      return;
    }

    if (isListening) {
      setIsListening(false);
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = 'en-US';

      recognition.onstart = () => {
        setIsListening(true);
        toast('Listening… Speak your prompt now', { icon: '🎙️' });
      };

      recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        setPrompt((prev) => {
          let base = prev.trim();
          if (!base || !base.startsWith('Create')) {
            base = 'Create';
          }
          return `${base} ${transcript}`.trim();
        });
        toast.success('Voice captured!');
      };

      recognition.onerror = (event) => {
        console.warn('Speech recognition notice:', event.error);
        setIsListening(false);
        if (event.error !== 'no-speech') {
          toast.error('Microphone unavailable or permission denied');
        }
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognition.start();
    } catch (err) {
      console.error('Speech recognition error:', err);
      setIsListening(false);
      toast.error('Microphone access denied or unavailable');
    }
  };

  // File attachment handler
  const handleFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 4 * 1024 * 1024) {
      toast.error('File size exceeds 4MB limit');
      return;
    }

    const reader = new FileReader();
    if (file.type.startsWith('image/')) {
      reader.onload = () => {
        setAttachedFile({ name: file.name, type: file.type, preview: reader.result });
        toast.success(`Attached image: ${file.name}`);
      };
      reader.readAsDataURL(file);
    } else {
      reader.onload = () => {
        setAttachedFile({ name: file.name, type: file.type, content: reader.result });
        setPrompt((prev) => {
          const base = prev.trim() || 'Create a web application with the attached specifications';
          return `${base}\n\n[Reference File: ${file.name}]`;
        });
        toast.success(`Attached file: ${file.name}`);
      };
      reader.readAsText(file);
    }
  };

  const handleCreate = (e) => {
    if (e) e.preventDefault();

    let cleanPrompt = prompt.trim();
    if (!cleanPrompt || isCreating) return;

    // Attach file context if provided
    if (attachedFile?.content) {
      cleanPrompt += `\n\nReference Specs:\n${attachedFile.content.slice(0, 1500)}`;
    }

    setIsCreating(true);
    // Navigate immediately to builder page to show generation pipeline
    navigate('/builder', { state: { prompt: cleanPrompt, attachedFile } });
  };

  const handleSignOut = async () => {
    try {
      await logout();
      toast.success('Signed out');
      navigate('/login');
    } catch {
      navigate('/login');
    }
  };

  return (
    <div className="forge-home" style={{ overflowY: 'auto' }}>
      {/* 1. Header Navigation */}
      <header className="forge-nav">
        <Link to="/" className="forge-brand">
          <span className="forge-mark">
            <span />
          </span>
          WebForge
        </Link>

        <nav>
          {user && (
            <span
              style={{
                fontSize: '13px',
                color: 'rgba(255, 255, 255, 0.85)',
                fontWeight: 500,
              }}
            >
              {user.name || user.email}
            </span>
          )}
          <button
            type="button"
            onClick={() => setShowConfigModal(true)}
            title="OpenRouter AI Settings"
            style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}
          >
            <Settings size={13} />
            <span>AI Settings</span>
          </button>
          <button type="button" onClick={handleSignOut} title="Sign Out">
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
              <LogOut size={13} />
              Sign Out
            </span>
          </button>
        </nav>
      </header>

      {/* 2. Hero Section */}
      <main className="forge-hero">
        <div className="promo">
          <b>NEW</b> Builder 2.0 is live
        </div>

        <h1>What do you want to build?</h1>
        <p>
          Describe your application requirements. Our autonomous AI coding agent
          dynamically designs, builds, and launches your bespoke project in real time.
        </p>

        {/* Prompt Input Form */}
        <form onSubmit={handleCreate} className="forge-prompt">
          <textarea
            rows={3}
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleCreate();
              }
            }}
            placeholder="e.g. Build a luxury restaurant website with a menu, table reservation, location, chef section and customer reviews..."
            disabled={isCreating}
            autoFocus
          />

          {/* Attached File Preview Chip */}
          {attachedFile && (
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                backgroundColor: 'rgba(255, 255, 255, 0.12)',
                border: '1px solid rgba(255, 255, 255, 0.25)',
                borderRadius: '6px',
                padding: '4px 8px',
                fontSize: '11.5px',
                color: '#ffffff',
                marginBottom: '8px',
              }}
            >
              {attachedFile.type.startsWith('image/') ? <ImageIcon size={13} /> : <FileText size={13} />}
              <span style={{ maxWidth: '200px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {attachedFile.name}
              </span>
              <button
                type="button"
                onClick={() => setAttachedFile(null)}
                style={{ background: 'none', border: 'none', color: '#ffffff', cursor: 'pointer', padding: 0 }}
              >
                <X size={13} />
              </button>
            </div>
          )}

          <div className="forge-prompt__footer">
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              {/* Voice Input Button */}
              <button
                type="button"
                className="prompt-icon"
                title={isListening ? 'Stop Listening' : 'Voice Input (Click to speak)'}
                onClick={toggleVoiceInput}
                style={{
                  backgroundColor: isListening ? '#ef1d37' : 'transparent',
                  color: isListening ? '#ffffff' : 'rgba(255, 255, 255, 0.85)',
                  borderColor: isListening ? '#ef1d37' : 'rgba(255, 255, 255, 0.2)',
                  animation: isListening ? 'pulse 1.5s infinite' : 'none',
                }}
              >
                {isListening ? <MicOff size={15} /> : <Mic size={15} />}
              </button>

              {/* File Upload Button */}
              <button
                type="button"
                className="prompt-icon"
                title="Attach Document or Image Specs"
                onClick={() => fileInputRef.current?.click()}
                style={{
                  color: attachedFile ? '#ef1d37' : 'rgba(255, 255, 255, 0.85)',
                  backgroundColor: attachedFile ? 'rgba(239, 29, 55, 0.15)' : 'transparent',
                }}
              >
                <Paperclip size={15} />
              </button>

              {/* Hidden file input */}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*,text/*,.json,.jsx,.js,.html,.css,.md"
                style={{ display: 'none' }}
                onChange={handleFileUpload}
              />
            </div>

            <button
              type="submit"
              className="prompt-send"
              disabled={!prompt.trim() || prompt.trim() === 'Create' || isCreating}
              title="Build Website"
            >
              {isCreating ? <Loader2 size={16} className="animate-spin" /> : <ArrowRight size={16} />}
            </button>
          </div>
        </form>

        {/* Idea Marquee */}
        <div className="idea-marquee">
          <div className="idea-marquee__track">
            {SUGGESTIONS.map((idea, idx) => (
              <button key={`idea-1-${idx}`} type="button" onClick={() => setPrompt(idea)}>
                {idea}
              </button>
            ))}
            {SUGGESTIONS.map((idea, idx) => (
              <button key={`idea-2-${idx}`} type="button" onClick={() => setPrompt(idea)}>
                {idea}
              </button>
            ))}
          </div>
        </div>

        {/* 3. Recent Projects (if any exist) */}
        {!loadingProjects && projects.length > 0 && (
          <section
            style={{
              marginTop: '56px',
              textAlign: 'left',
              maxWidth: '720px',
              marginLeft: 'auto',
              marginRight: 'auto',
              paddingBottom: '80px',
              position: 'relative',
              zIndex: 2,
            }}
          >
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: '16px',
              }}
            >
              <h2
                style={{
                  fontSize: '14px',
                  fontWeight: 700,
                  letterSpacing: '0.04em',
                  textTransform: 'uppercase',
                  color: 'rgba(255, 255, 255, 0.7)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  margin: 0,
                }}
              >
                <Folder size={15} />
                Recent Projects ({projects.length})
              </h2>
            </div>

            <div
              style={{
                display: 'grid',
                gap: '10px',
              }}
            >
              {projects.slice(0, 5).map((proj) => (
                <div
                  key={proj._id || proj.id}
                  style={{
                    backgroundColor: 'rgba(255, 255, 255, 0.05)',
                    border: '1px solid rgba(255, 255, 255, 0.12)',
                    borderRadius: '12px',
                    padding: '14px 18px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    backdropFilter: 'blur(10px)',
                    transition: 'all 0.15s ease',
                  }}
                >
                  <div style={{ minWidth: 0, flex: 1, paddingRight: '16px' }}>
                    <div
                      style={{
                        fontWeight: 600,
                        fontSize: '14.5px',
                        color: '#ffffff',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                      }}
                    >
                      {proj.name || 'Untitled Website'}
                    </div>
                    <div
                      style={{
                        fontSize: '12px',
                        color: 'rgba(255, 255, 255, 0.55)',
                        marginTop: '3px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                      }}
                    >
                      <span>v{proj.version || 1}</span>
                      <span>•</span>
                      <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                        <Clock size={11} />
                        {new Date(proj.updatedAt || proj.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>

                  <div style={{ display: 'flex', gap: '8px', flexShrink: 0 }}>
                    <Link
                      to={`/preview/${proj._id || proj.id}`}
                      target="_blank"
                      style={{
                        padding: '6px 12px',
                        borderRadius: '6px',
                        fontSize: '12px',
                        fontWeight: 600,
                        backgroundColor: 'rgba(255, 255, 255, 0.08)',
                        color: 'rgba(255, 255, 255, 0.9)',
                        textDecoration: 'none',
                        border: '1px solid rgba(255, 255, 255, 0.15)',
                      }}
                    >
                      Preview
                    </Link>
                    <Link
                      to={`/builder/${proj._id || proj.id}`}
                      style={{
                        padding: '6px 14px',
                        borderRadius: '6px',
                        fontSize: '12px',
                        fontWeight: 600,
                        backgroundColor: '#ef1d37',
                        color: '#ffffff',
                        textDecoration: 'none',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '4px',
                      }}
                    >
                      Open Studio <ChevronRight size={13} />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}
      </main>

      {/* Bottom Glow */}
      <div className="forge-glow" />

      {/* OpenRouter Settings Modal */}
      <ApiKeyModal
        isOpen={showConfigModal}
        onClose={() => setShowConfigModal(false)}
      />
    </div>
  );
}
