import { useEffect, useMemo, useState, useRef } from 'react';
import { Link, useNavigate, useParams, useLocation } from 'react-router-dom';
import {
  Code2,
  Download,
  Eye,
  FileCode,
  FileText,
  Globe2,
  LogOut,
  Send,
  CheckCircle2,
  Loader2,
  Laptop,
  Tablet,
  Smartphone,
  RotateCw,
  User,
  Bot,
  Sparkles,
  Mic,
  MicOff,
  Paperclip,
  X,
  Image as ImageIcon,
  Folder,
  FolderOpen,
  AlertCircle,
  ExternalLink,
  Terminal,
  Cpu,
  KeyRound,
  Play,
} from 'lucide-react';
import toast from 'react-hot-toast';

import api from '../api/api';
import { exportProjectZip } from '../utils/exportProject';
import { useAppContext } from '../context/AppContext';
import { generatePreviewHtml } from '../utils/previewEngine';
import DevAgentLog from '../components/DevAgentLog';
import ApiKeyModal from '../components/ApiKeyModal';

// Unique sequence generator for live activities
let globalSeq = 0;
const createUniqueId = (prefix = 'act') =>
  `${prefix}_${Date.now()}_${++globalSeq}_${Math.random().toString(36).slice(2, 7)}`;

// Helper to consume Server-Sent Events (SSE) via native fetch and ReadableStream
async function consumeEventStream(url, body, onEvent, signal) {
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'text/event-stream',
    },
    body: JSON.stringify(body),
    credentials: 'include',
    signal,
  });

  if (!response.ok) {
    const errJson = await response.json().catch(() => ({}));
    throw new Error(errJson.error || 'Request failed with status ' + response.status);
  }

  const reader = response.body.getReader();
  const decoder = new TextDecoder();
  let buffer = '';
  let terminalReceived = false;

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    buffer += decoder.decode(value, { stream: true });
    const lines = buffer.split('\n');
    buffer = lines.pop() || '';

    for (const line of lines) {
      const trimmed = line.trim();
      if (trimmed.startsWith('data:')) {
        const jsonStr = trimmed.slice(5).trim();
        if (jsonStr) {
          try {
            const parsed = JSON.parse(jsonStr);
            if (parsed.type === 'done' || parsed.type === 'error') {
              terminalReceived = true;
            }
            onEvent(parsed);
          } catch (e) {
            console.warn('Could not parse SSE event:', e);
          }
        }
      }
    }
  }

  if (!terminalReceived) {
    throw new Error('Connection to AI agent closed unexpectedly. Click Retry or Instant Build.');
  }
}

export default function BuilderPage() {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const { logout } = useAppContext();

  const initialPrompt = location.state?.prompt;
  const initialFile = location.state?.attachedFile;

  // Project state - starts with NO predetermined files
  const [isGenerating, setIsGenerating] = useState(!id && !!initialPrompt);
  const [project, setProject] = useState(() => {
    if (!id && initialPrompt) {
      return {
        id: 'new',
        name: initialPrompt.replace(/^Create\s+/i, '').slice(0, 35),
        description: initialPrompt,
        version: 1,
        files: {}, // Starts completely empty!
        messages: [{ role: 'user', content: initialPrompt }],
      };
    }
    return null;
  });

  // UI state
  const [activeTab, setActiveTab] = useState('chat'); // 'chat' | 'files' | 'devlog'
  const [showCode, setShowCode] = useState(false);
  const [activeFile, setActiveFile] = useState('');
  const [editedCode, setEditedCode] = useState('');
  const [deviceView, setDeviceView] = useState('desktop');
  const [previewKey, setPreviewKey] = useState(0);

  // OpenRouter Agent Dev Log & Error state
  const [devLogs, setDevLogs] = useState([]);
  const [generationError, setGenerationError] = useState(null);
  const [showApiKeyModal, setShowApiKeyModal] = useState(false);
  const [agentModel, setAgentModel] = useState('llama3:latest');

  // Live Agent Activity Stream state
  const [liveActivities, setLiveActivities] = useState([]);
  const [currentActionNotice, setCurrentActionNotice] = useState('Understanding requirements...');

  // In-studio publishing modal
  const [showPublishModal, setShowPublishModal] = useState(false);
  const [publishStep, setPublishStep] = useState(0);

  // Chat composer
  const [composerMessage, setComposerMessage] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [attachedFile, setAttachedFile] = useState(null);

  const chatBottomRef = useRef(null);
  const composerFileRef = useRef(null);

  // Auto-scroll chat
  useEffect(() => {
    chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [project?.messages, liveActivities]);

  // Sync edited code when active file or files change
  useEffect(() => {
    if (project?.files && activeFile) {
      const content = project.files[activeFile] ?? project.files[`/${activeFile}`] ?? '';
      setEditedCode(typeof content === 'string' ? content : content?.content || '');
    }
  }, [activeFile, project?.files]);

  // Check if active file has unsaved changes
  const isCodeModified = useMemo(() => {
    if (!project?.files || !activeFile) return false;
    const currentOnDisk = project.files[activeFile] ?? project.files[`/${activeFile}`] ?? '';
    return editedCode !== (typeof currentOnDisk === 'string' ? currentOnDisk : currentOnDisk?.content || '');
  }, [project?.files, activeFile, editedCode]);

  // Project loader & Live SSE Generation Effect
  useEffect(() => {
    let isMounted = true;
    const abortCtrl = new AbortController();

    // CASE 1: Fresh project creation initiated from user prompt
    if (!id && initialPrompt) {
      setIsGenerating(true);
      setLiveActivities([]);
      setCurrentActionNotice('Understanding your requirements...');

      consumeEventStream(
        '/api/projects?stream=true',
        { prompt: initialPrompt, file: initialFile },
        (event) => {
          if (!isMounted) return;

          if (event.type === 'activity_started') {
            setCurrentActionNotice(event.message);
            setLiveActivities((prev) => {
              const updated = prev.map((act) =>
                act.status === 'active' ? { ...act, status: 'completed' } : act
              );
              return [
                ...updated,
                {
                  id: createUniqueId('act'),
                  type: 'activity',
                  message: event.message,
                  status: 'active',
                },
              ];
            });
          } else if (event.type === 'activity_completed') {
            setLiveActivities((prev) => {
              const last = prev[prev.length - 1];
              if (last && last.status === 'active') {
                return [
                  ...prev.slice(0, -1),
                  { ...last, message: event.message || last.message, status: 'completed' },
                ];
              }
              return [
                ...prev,
                {
                  id: createUniqueId('act'),
                  type: 'activity',
                  message: event.message,
                  status: 'completed',
                },
              ];
            });
          } else if (event.type === 'file_created' || event.type === 'file_updated') {
            // Live file emission: add file directly to state
            setProject((prev) => {
              if (!prev) return prev;
              const nextFiles = { ...prev.files, [event.path]: event.content };
              return { ...prev, files: nextFiles };
            });

            // Set active file if none selected or if main file created
            setActiveFile((curr) => {
              if (!curr || event.path.includes('App') || event.path.endsWith('index.html')) {
                return event.path;
              }
              return curr;
            });

            // Add activity stream badge
            setLiveActivities((prev) => [
              ...prev,
              {
                id: createUniqueId('file'),
                type: 'file',
                action: event.type === 'file_created' ? 'created' : 'updated',
                path: event.path,
                message: (event.type === 'file_created' ? 'Created ' : 'Updated ') + event.path,
                status: 'completed',
              },
            ]);
          } else if (event.type === 'build_started') {
            setCurrentActionNotice('Running application build...');
          } else if (event.type === 'build_failed') {
            setLiveActivities((prev) => [
              ...prev,
              {
                id: createUniqueId('build_err'),
                type: 'error',
                message: 'Build failed: ' + (event.errors?.[0] || 'Verification error'),
                status: 'failed',
              },
            ]);
          } else if (event.type === 'preview_updated') {
            setPreviewKey((k) => k + 1);
          } else if (event.type === 'dev_log') {
            setDevLogs((prev) => [...prev, event.log]);
          } else if (event.type === 'error') {
            setIsGenerating(false);
            setGenerationError(event.error);
            toast.error(event.error);
            if (event.error?.includes('OpenRouter') || event.error?.includes('API key')) {
              setShowApiKeyModal(true);
            }
          } else if (event.type === 'done' && event.project) {
            setProject(event.project);
            setIsGenerating(false);
            setGenerationError(null);
            setCurrentActionNotice('Ready');

            if (event.project.messages) {
              const assistantLogs = event.project.messages.flatMap((m) => m?.devLogs || []);
              if (assistantLogs.length > 0) {
                setDevLogs((prev) => {
                  const safePrev = Array.isArray(prev) ? prev : [];
                  const existingTimestamps = new Set(safePrev.map((p) => p?.timestamp).filter(Boolean));
                  const newLogs = assistantLogs.filter((l) => l && (!l.timestamp || !existingTimestamps.has(l.timestamp)));
                  return [...safePrev, ...newLogs];
                });
              }
            }

            const fileKeys = Object.keys(event.project.files || {});
            const bestFile =
              fileKeys.find((f) => f.includes('App')) ||
              fileKeys.find((f) => f.endsWith('index.html')) ||
              fileKeys[0] ||
              '';
            setActiveFile(bestFile);
            setEditedCode(event.project.files[bestFile] || '');

            setPreviewKey((k) => k + 1);
            window.history.replaceState(null, '', `/builder/${event.project._id || event.project.id}`);
            toast.success('Website built successfully!');
          }
        },
        abortCtrl.signal
      ).catch((err) => {
        if (!isMounted) return;
        if (err.name === 'AbortError') return;
        console.error('Project generation error:', err);
        setIsGenerating(false);
        const errMsg = err.message || 'Generation failed.';
        setGenerationError(errMsg);
        toast.error(errMsg);
      });

      return () => {
        isMounted = false;
        abortCtrl.abort();
      };
    }

    // CASE 2: Open existing project by ID
    if (id) {
      api
        .get(`/api/projects/${id}`)
        .then((res) => {
          if (!isMounted) return;
          setProject(res.data);
          const fileKeys = Object.keys(res.data.files || {});
          const bestFile =
            fileKeys.find((f) => f.includes('App')) ||
            fileKeys.find((f) => f.endsWith('index.html')) ||
            fileKeys[0] ||
            '';
          setActiveFile(bestFile);
          setEditedCode(res.data.files[bestFile] || '');
          setIsGenerating(false);
          setPreviewKey((k) => k + 1);

          const assistantLogs = res.data.messages?.flatMap((m) => m.devLogs || []) || [];
          if (assistantLogs.length > 0) {
            setDevLogs(assistantLogs);
          }
        })
        .catch((err) => {
          console.error('Failed to load project:', err);
          toast.error('Project not found');
          navigate('/');
        });

      return () => {
        isMounted = false;
      };
    }

    // CASE 3: Neither ID nor initial prompt
    if (!id && !initialPrompt) {
      navigate('/');
    }
  }, [id, initialPrompt, initialFile, navigate]);

  // Voice speech-to-text in chat composer
  const toggleVoiceInput = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      toast.error('Voice input is not supported in this browser.');
      return;
    }

    if (isListening) {
      setIsListening(false);
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.lang = 'en-US';

      recognition.onstart = () => {
        setIsListening(true);
        toast('Listening… Speak your change', { icon: '🎙️' });
      };

      recognition.onresult = (e) => {
        const transcript = e.results[0][0].transcript;
        setComposerMessage((prev) => `${prev} ${transcript}`.trim());
        toast.success('Voice captured!');
      };

      recognition.onerror = () => setIsListening(false);
      recognition.onend = () => setIsListening(false);
      recognition.start();
    } catch {
      setIsListening(false);
      toast.error('Microphone unavailable or access denied');
    }
  };

  // Composer file attachment
  const handleComposerFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.type.startsWith('image/')) {
      setAttachedFile({ name: file.name, type: 'image' });
      toast.success(`Attached image: ${file.name}`);
    } else {
      const reader = new FileReader();
      reader.onload = () => {
        setAttachedFile({ name: file.name, type: 'text', content: reader.result });
        toast.success(`Attached file: ${file.name}`);
      };
      reader.readAsText(file);
    }
  };

  // Send revision prompt in chat with real-time SSE streaming
  const handleSendMessage = async (e) => {
    if (e) e.preventDefault();
    let clean = composerMessage.trim();
    if (!clean && !attachedFile) return;
    if (isSending) return;

    if (attachedFile?.content) {
      clean += `\n[Reference file: ${attachedFile.name}]\n${attachedFile.content.slice(0, 1000)}`;
    }

    const currentProjectId = id || project?.id;
    if (!currentProjectId || currentProjectId === 'new') return;

    setIsSending(true);
    setComposerMessage('');
    setAttachedFile(null);

    // Append user message immediately
    const userMsgTimestamp = new Date().toISOString();
    setProject((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        messages: [
          ...(prev.messages || []),
          { role: 'user', content: clean, timestamp: userMsgTimestamp },
        ],
      };
    });

    // Start live revision activities
    setLiveActivities([]);

    try {
      await consumeEventStream(
        `/api/projects/${currentProjectId}/chat?stream=true`,
        { prompt: clean },
        (event) => {
          if (event.type === 'activity_started') {
            setLiveActivities((prev) => {
              const updated = prev.map((act) =>
                act.status === 'active' ? { ...act, status: 'completed' } : act
              );
              return [
                ...updated,
                {
                  id: createUniqueId('rev_act'),
                  type: 'activity',
                  message: event.message,
                  status: 'active',
                },
              ];
            });
          } else if (event.type === 'activity_completed') {
            setLiveActivities((prev) => {
              const last = prev[prev.length - 1];
              if (last && last.status === 'active') {
                return [
                  ...prev.slice(0, -1),
                  { ...last, message: event.message || last.message, status: 'completed' },
                ];
              }
              return [
                ...prev,
                {
                  id: createUniqueId('rev_act'),
                  type: 'activity',
                  message: event.message,
                  status: 'completed',
                },
              ];
            });
          } else if (event.type === 'file_created' || event.type === 'file_updated') {
            setProject((prev) => ({
              ...prev,
              files: { ...prev.files, [event.path]: event.content },
            }));
            setActiveFile(event.path);
            setLiveActivities((prev) => [
              ...prev,
              {
                id: createUniqueId('rev_file'),
                type: 'file',
                action: event.type === 'file_created' ? 'created' : 'updated',
                path: event.path,
                message: (event.type === 'file_created' ? 'Created ' : 'Updated ') + event.path,
                status: 'completed',
              },
            ]);
          } else if (event.type === 'preview_updated') {
            setPreviewKey((k) => k + 1);
          } else if (event.type === 'done' && event.project) {
            setProject(event.project);
            setLiveActivities([]);
            setPreviewKey((k) => k + 1);
            toast.success('Website updated with your changes!');
          }
        }
      );
    } catch (err) {
      console.error('Update request failed:', err);
      // Fallback to normal post
      try {
        const { data } = await api.post(`/api/projects/${currentProjectId}/chat`, { prompt: clean });
        setProject(data);
        setPreviewKey((k) => k + 1);
        toast.success('Website updated!');
      } catch (postErr) {
        toast.error(postErr.response?.data?.error || 'Could not update website');
      }
    } finally {
      setIsSending(false);
    }
  };

  // Save manual code edits
  const handleSaveCode = async () => {
    if (!project || !activeFile) return;
    const updatedFiles = { ...project.files, [activeFile]: editedCode };

    try {
      const { data } = await api.put(`/api/projects/${id || project.id}/files`, { files: updatedFiles });
      setProject(data);
      setPreviewKey((k) => k + 1);
      toast.success('Code saved and applied to live preview!');
    } catch (err) {
      console.error('Failed to save code:', err);
      toast.error('Could not save changes');
    }
  };

  // Start in-studio publish workflow
  const handleStartPublish = async () => {
    setShowPublishModal(true);
    setPublishStep(1);

    setTimeout(() => {
      setPublishStep(2);
      setTimeout(() => {
        setPublishStep(3);
        api
          .post(`/api/projects/${id || project.id}/publish`)
          .then(() => {
            setProject((p) => (p ? { ...p, published: true } : p));
            setPublishStep(4);
            toast.success('Website published successfully!');
          })
          .catch((err) => {
            console.error('Publish error:', err);
            toast.error(err.response?.data?.error || 'Failed to publish');
            setShowPublishModal(false);
          });
      }, 700);
    }, 600);
  };

  // Instant build with senior architect
  const handleInstantBuild = async () => {
    const promptToUse = initialPrompt || project?.description || composerMessage || 'Create a modern web application';
    setIsGenerating(true);
    setGenerationError(null);
    setCurrentActionNotice('Generating complete application with Senior Architect...');
    try {
      const res = await api.post('/api/projects?stream=false', {
        prompt: promptToUse,
        engine: 'architect',
      });
      setProject(res.data);
      setIsGenerating(false);
      setGenerationError(null);
      setCurrentActionNotice('Ready');
      const fileKeys = Object.keys(res.data.files || {});
      const bestFile = fileKeys.find((f) => f.includes('App')) || fileKeys.find((f) => f.endsWith('index.html')) || fileKeys[0] || '';
      setActiveFile(bestFile);
      setEditedCode(res.data.files[bestFile] || '');
      setPreviewKey((k) => k + 1);
      if (res.data.id) {
        window.history.replaceState(null, '', `/builder/${res.data._id || res.data.id}`);
      }
      toast.success('Website built successfully!');
    } catch (err) {
      setIsGenerating(false);
      const msg = err.response?.data?.error || err.message || 'Build failed';
      setGenerationError(msg);
      toast.error(msg);
    }
  };

  const handleRetryAgent = () => {
    const promptToUse = initialPrompt || project?.description || composerMessage;
    if (!promptToUse) return;
    setIsGenerating(true);
    setGenerationError(null);
    setCurrentActionNotice('Generating application with AI Agent...');
    setLiveActivities([]);

    consumeEventStream(
      '/api/projects?stream=true',
      { prompt: promptToUse },
      (event) => {
        if (event.type === 'activity_started') {
          setCurrentActionNotice(event.message);
        } else if (event.type === 'file_created' || event.type === 'file_updated') {
          setProject((prev) => prev ? { ...prev, files: { ...prev.files, [event.path]: event.content } } : prev);
          setActiveFile(event.path);
        } else if (event.type === 'done' && event.project) {
          setProject(event.project);
          setIsGenerating(false);
          setGenerationError(null);
          setCurrentActionNotice('Ready');
          setPreviewKey((k) => k + 1);
          toast.success('Website built successfully!');
        } else if (event.type === 'error') {
          setIsGenerating(false);
          setGenerationError(event.error);
          toast.error(event.error);
        }
      }
    ).catch((err) => {
      setIsGenerating(false);
      const errMsg = err.message || 'Generation failed.';
      setGenerationError(errMsg);
      toast.error(errMsg);
    });
  };

  // Generate live iframe HTML
  const previewHtml = useMemo(() => {
    return generatePreviewHtml(project?.files || {});
  }, [project?.files, previewKey]);

  // Hierarchical file tree list
  const fileTree = useMemo(() => {
    const rawKeys = Object.keys(project?.files || {});
    return rawKeys.sort((a, b) => {
      // Keep root files (package.json, index.html) at top, then src files
      if (a === '/package.json' || a === 'package.json') return -1;
      if (b === '/package.json' || b === 'package.json') return 1;
      if (a === '/index.html' || a === 'index.html') return -1;
      if (b === '/index.html' || b === 'index.html') return 1;
      return a.localeCompare(b);
    });
  }, [project?.files]);

  const formatTabName = (path) => {
    const parts = path.split('/');
    return parts[parts.length - 1] || path;
  };

  return (
    <main
      style={{
        display: 'flex',
        flexDirection: 'column',
        height: '100vh',
        width: '100vw',
        overflow: 'hidden',
        backgroundColor: '#fafafa',
        fontFamily: "'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, sans-serif",
      }}
    >
      {/* 1. Header Toolbar */}
      <header
        style={{
          height: '52px',
          borderBottom: '1px solid #e4e4e7',
          backgroundColor: '#ffffff',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0 20px',
          zIndex: 20,
          flexShrink: 0,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <Link
            to="/"
            style={{
              textDecoration: 'none',
              fontWeight: 800,
              fontSize: '16px',
              color: '#09090b',
              letterSpacing: '-0.03em',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
            }}
          >
            <span
              style={{
                width: '18px',
                height: '18px',
                borderRadius: '5px',
                backgroundColor: '#09090b',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#ffffff' }} />
            </span>
            WebForge
          </Link>

          <span style={{ color: '#d4d4d8', fontSize: '14px' }}>/</span>

          <span
            style={{
              fontSize: '13px',
              color: '#27272a',
              fontWeight: 600,
              maxWidth: '220px',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
            }}
          >
            {project?.name || 'Untitled Application'}
          </span>

          {isGenerating && (
            <span
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                backgroundColor: '#eef2ff',
                color: '#4f46e5',
                fontSize: '11px',
                fontWeight: 700,
                padding: '3px 8px',
                borderRadius: '9999px',
                border: '1px solid #e0e7ff',
              }}
            >
              <Loader2 size={11} className="animate-spin" />
              Building Live…
            </span>
          )}
        </div>

        {/* Right Action Buttons */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <button
            onClick={() => setShowCode(!showCode)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              border: '1px solid #e4e4e7',
              borderRadius: '7px',
              padding: '6px 12px',
              backgroundColor: showCode ? '#f4f4f5' : '#ffffff',
              color: showCode ? '#09090b' : '#52525b',
              fontSize: '12.5px',
              fontWeight: 600,
              cursor: 'pointer',
              transition: 'all 0.15s ease',
            }}
            title="Toggle Code Editor"
          >
            <Code2 size={14} />
            <span>Code</span>
          </button>

          <button
            onClick={() => exportProjectZip(project)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              border: '1px solid #e4e4e7',
              borderRadius: '7px',
              padding: '6px 12px',
              backgroundColor: '#ffffff',
              color: '#52525b',
              fontSize: '12.5px',
              fontWeight: 600,
              cursor: 'pointer',
            }}
            title="Export ZIP"
          >
            <Download size={14} />
            <span>Export</span>
          </button>


          <button
            onClick={() => {
              if (id) window.open(`/preview/${id}`, '_blank');
              else toast('Please wait for the build to finish');
            }}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              border: '1px solid #e4e4e7',
              borderRadius: '7px',
              padding: '6px 12px',
              backgroundColor: '#ffffff',
              color: '#52525b',
              fontSize: '12.5px',
              fontWeight: 600,
              cursor: 'pointer',
            }}
            title="Open in new window"
          >
            <ExternalLink size={14} />
            <span>Preview</span>
          </button>

          <button
            onClick={handleStartPublish}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              border: 'none',
              borderRadius: '7px',
              padding: '6px 14px',
              backgroundColor: '#09090b',
              color: '#ffffff',
              fontSize: '12.5px',
              fontWeight: 600,
              cursor: 'pointer',
            }}
          >
            <Globe2 size={14} />
            <span>Publish</span>
          </button>

          <button
            onClick={async () => {
              await logout();
              navigate('/login');
            }}
            style={{
              border: 'none',
              background: 'transparent',
              color: '#a1a1aa',
              padding: '6px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
            }}
            title="Sign Out"
          >
            <LogOut size={16} />
          </button>
        </div>
      </header>

      {/* 2. Main Studio Grid (Chat / Files | Code Editor | Live Preview) */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: showCode ? '350px 420px 1fr' : '380px 1fr',
          flex: 1,
          minHeight: 0,
          backgroundColor: '#ffffff',
        }}
      >
        {/* COLUMN 1: SIDEBAR (Chat & Files tabs) */}
        <aside
          style={{
            borderRight: '1px solid #e4e4e7',
            display: 'flex',
            flexDirection: 'column',
            backgroundColor: '#ffffff',
            height: '100%',
            overflow: 'hidden',
          }}
        >
          {/* Tabs Header */}
          <div
            style={{
              height: '40px',
              display: 'flex',
              borderBottom: '1px solid #e4e4e7',
              backgroundColor: '#fafafa',
              flexShrink: 0,
            }}
          >
            <button
              onClick={() => setActiveTab('chat')}
              style={{
                flex: 1,
                padding: '10px',
                fontSize: '12px',
                fontWeight: 600,
                border: 'none',
                borderBottom: activeTab === 'chat' ? '2px solid #09090b' : '2px solid transparent',
                backgroundColor: activeTab === 'chat' ? '#ffffff' : 'transparent',
                color: activeTab === 'chat' ? '#09090b' : '#71717a',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '7px',
                cursor: 'pointer',
              }}
            >
              <span>Agent Activity</span>
            </button>
            <button
              onClick={() => setActiveTab('files')}
              style={{
                flex: 1,
                padding: '10px',
                fontSize: '12px',
                fontWeight: 600,
                border: 'none',
                borderBottom: activeTab === 'files' ? '2px solid #09090b' : '2px solid transparent',
                backgroundColor: activeTab === 'files' ? '#ffffff' : 'transparent',
                color: activeTab === 'files' ? '#09090b' : '#71717a',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '7px',
                cursor: 'pointer',
              }}
            >
              <FileText size={14} />
              <span>Files ({fileTree.length})</span>
            </button>
          </div>

          {/* CHAT TAB CONTENT */}
          {activeTab === 'chat' ? (
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                flex: 1,
                minHeight: 0,
              }}
            >
              <div
                style={{
                  flex: 1,
                  overflowY: 'auto',
                  padding: '16px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '16px',
                }}
              >
                {/* 1. User Initial Prompt Message */}
                <div style={{ display: 'flex', gap: '10px' }}>
                  <div
                    style={{
                      width: '24px',
                      height: '24px',
                      borderRadius: '6px',
                      backgroundColor: '#f4f4f5',
                      border: '1px solid #e4e4e7',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: '#71717a',
                      flexShrink: 0,
                    }}
                  >
                    <User size={12} />
                  </div>
                  <div style={{ flex: 1 }}>
                    <span style={{ fontSize: '10.5px', fontWeight: 800, color: '#a1a1aa', display: 'block', marginBottom: '2px' }}>
                      YOU
                    </span>
                    <p style={{ margin: 0, color: '#09090b', fontSize: '13px', lineHeight: 1.5 }}>
                      {project?.messages?.[0]?.content || project?.description}
                    </p>
                  </div>
                </div>

                {/* 2. Live Agent Activity Stream (Codex / Google AI Studio Style) */}
                <div
                  style={{
                    backgroundColor: '#fafafa',
                    border: '1px solid #e4e4e7',
                    borderRadius: '12px',
                    padding: '14px 16px',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '10px',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '2px' }}>
                    <span style={{ fontSize: '12px', fontWeight: 800, color: '#09090b', display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <Sparkles size={13} color="#4f46e5" />
                      Agent Activity
                    </span>
                    {isGenerating || isSending ? (
                      <span style={{ fontSize: '11px', color: '#4f46e5', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <Loader2 size={11} className="animate-spin" /> In progress
                      </span>
                    ) : (
                      <span style={{ fontSize: '11px', color: '#16a34a', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <CheckCircle2 size={12} /> Ready
                      </span>
                    )}
                  </div>

                  {/* Render activities: if active generation/sending, render liveActivities. Otherwise render stored message events */}
                  {(() => {
                    const activitiesToRender =
                      (isGenerating || isSending || liveActivities.length > 0)
                        ? liveActivities
                        : project?.messages?.find((m) => m.role === 'assistant')?.activityEvents || [];

                    if (activitiesToRender.length === 0 && isGenerating) {
                      return (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12.5px', color: '#4f46e5' }}>
                          <span style={{ width: 8, height: 8, borderRadius: '50%', backgroundColor: '#4f46e5' }} />
                          <span>Understanding your requirements...</span>
                        </div>
                      );
                    }

                    return activitiesToRender.map((act, idx) => {
                      const isActive = act.status === 'active';
                      const isFile = act.type === 'file' || act.path;

                      return (
                        <div
                          key={act.id || idx}
                          style={{
                            display: 'flex',
                            alignItems: 'flex-start',
                            gap: '8px',
                            fontSize: '12.5px',
                            lineHeight: 1.4,
                            color: isActive ? '#4f46e5' : '#27272a',
                            fontWeight: isActive ? 600 : 500,
                          }}
                        >
                          {isActive ? (
                            <span
                              style={{
                                color: '#4f46e5',
                                marginTop: '2px',
                                display: 'inline-flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                              }}
                            >
                              ●
                            </span>
                          ) : act.status === 'failed' ? (
                            <AlertCircle size={14} color="#ef4444" style={{ marginTop: '2px', flexShrink: 0 }} />
                          ) : (
                            <span style={{ color: '#16a34a', fontWeight: 800, marginTop: '1px' }}>✓</span>
                          )}

                          <div style={{ flex: 1 }}>
                            <span>{act.message}</span>
                            {isFile && act.path && (
                              <button
                                onClick={() => {
                                  setActiveFile(act.path);
                                  setShowCode(true);
                                }}
                                style={{
                                  display: 'inline-flex',
                                  alignItems: 'center',
                                  gap: '4px',
                                  marginLeft: '6px',
                                  background: '#f4f4f5',
                                  border: '1px solid #e4e4e7',
                                  borderRadius: '4px',
                                  padding: '1px 6px',
                                  fontSize: '11px',
                                  fontFamily: 'monospace',
                                  color: '#09090b',
                                  cursor: 'pointer',
                                }}
                                title="Open file in code editor"
                              >
                                <FileCode size={11} />
                                View Code
                              </button>
                            )}
                          </div>
                        </div>
                      );
                    });
                  })()}
                </div>

                {/* 3. Assistant Summary & Follow-up Messages */}
                {project?.messages?.slice(1).map((msg, index) => (
                  <div key={index} style={{ display: 'flex', gap: '10px' }}>
                    <div
                      style={{
                        width: '24px',
                        height: '24px',
                        borderRadius: '6px',
                        backgroundColor: msg.role === 'user' ? '#f4f4f5' : '#eef2ff',
                        border: '1px solid #e4e4e7',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: msg.role === 'user' ? '#71717a' : '#4f46e5',
                        flexShrink: 0,
                      }}
                    >
                      {msg.role === 'user' ? <User size={12} /> : <Bot size={12} />}
                    </div>
                    <div style={{ flex: 1 }}>
                      <span style={{ fontSize: '10.5px', fontWeight: 800, color: '#a1a1aa', display: 'block', marginBottom: '2px' }}>
                        {msg.role === 'user' ? 'YOU' : 'AI'}
                      </span>
                      <p style={{ margin: 0, color: '#3f3f46', fontSize: '13px', lineHeight: 1.5, whiteSpace: 'pre-wrap' }}>
                        {msg.content}
                      </p>
                    </div>
                  </div>
                ))}

                <div ref={chatBottomRef} />
              </div>

              {/* Chat Composer */}
              <div
                style={{
                  padding: '12px 14px',
                  borderTop: '1px solid #e4e4e7',
                  backgroundColor: '#ffffff',
                  flexShrink: 0,
                }}
              >
                {attachedFile && (
                  <div
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '6px',
                      backgroundColor: '#f4f4f5',
                      border: '1px solid #e4e4e7',
                      borderRadius: '6px',
                      padding: '4px 8px',
                      fontSize: '11.5px',
                      color: '#09090b',
                      marginBottom: '8px',
                    }}
                  >
                    {attachedFile.type === 'image' ? <ImageIcon size={12} /> : <FileText size={12} />}
                    <span style={{ maxWidth: '180px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {attachedFile.name}
                    </span>
                    <button
                      type="button"
                      onClick={() => setAttachedFile(null)}
                      style={{ background: 'none', border: 'none', color: '#71717a', cursor: 'pointer', padding: 0 }}
                    >
                      <X size={12} />
                    </button>
                  </div>
                )}

                <form
                  onSubmit={handleSendMessage}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                  }}
                >
                  <textarea
                    value={composerMessage}
                    onChange={(e) => setComposerMessage(e.target.value)}
                    placeholder="Ask AI to make a change or add a feature…"
                    maxLength={4000}
                    disabled={isGenerating || isSending}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault();
                        handleSendMessage(e);
                      }
                    }}
                    style={{
                      flex: 1,
                      resize: 'none',
                      height: '38px',
                      border: '1px solid #e4e4e7',
                      borderRadius: '8px',
                      padding: '8px 10px',
                      fontSize: '13px',
                      color: '#09090b',
                      outline: 'none',
                      fontFamily: 'inherit',
                    }}
                  />

                  {/* Voice Button */}
                  <button
                    type="button"
                    onClick={toggleVoiceInput}
                    title={isListening ? 'Stop Listening' : 'Voice Input'}
                    style={{
                      width: '34px',
                      height: '34px',
                      borderRadius: '8px',
                      border: '1px solid #e4e4e7',
                      backgroundColor: isListening ? '#ef4444' : '#ffffff',
                      color: isListening ? '#ffffff' : '#71717a',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      cursor: 'pointer',
                    }}
                  >
                    {isListening ? <MicOff size={14} /> : <Mic size={14} />}
                  </button>

                  {/* File Attachment Button */}
                  <button
                    type="button"
                    onClick={() => composerFileRef.current?.click()}
                    title="Attach File / Specs"
                    style={{
                      width: '34px',
                      height: '34px',
                      borderRadius: '8px',
                      border: '1px solid #e4e4e7',
                      backgroundColor: attachedFile ? '#eef2ff' : '#ffffff',
                      color: attachedFile ? '#4f46e5' : '#71717a',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      cursor: 'pointer',
                    }}
                  >
                    <Paperclip size={14} />
                  </button>
                  <input
                    ref={composerFileRef}
                    type="file"
                    accept="image/*,text/*,.json,.jsx,.js,.html,.css"
                    style={{ display: 'none' }}
                    onChange={handleComposerFileUpload}
                  />

                  {/* Send Button */}
                  <button
                    type="submit"
                    disabled={isGenerating || isSending || (!composerMessage.trim() && !attachedFile)}
                    style={{
                      border: 'none',
                      borderRadius: '8px',
                      backgroundColor: '#18181b',
                      color: '#ffffff',
                      width: '36px',
                      height: '36px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      cursor:
                        isGenerating || isSending || (!composerMessage.trim() && !attachedFile)
                          ? 'not-allowed'
                          : 'pointer',
                      opacity:
                        isGenerating || isSending || (!composerMessage.trim() && !attachedFile)
                          ? 0.4
                          : 1,
                    }}
                    title="Send change request"
                  >
                    {isSending ? <Loader2 size={15} className="animate-spin" /> : <Send size={14} />}
                  </button>
                </form>
              </div>
            </div>
          ) : (
            /* FILES TAB CONTENT (Real project state) */
            <div style={{ padding: '14px', overflowY: 'auto', flex: 1 }}>
              <div
                style={{
                  fontSize: '11px',
                  fontWeight: 700,
                  color: '#a1a1aa',
                  padding: '6px 8px 10px',
                  letterSpacing: '0.06em',
                }}
              >
                PROJECT FILES ({fileTree.length})
              </div>

              {fileTree.length === 0 ? (
                <div
                  style={{
                    padding: '24px 16px',
                    textAlign: 'center',
                    color: '#a1a1aa',
                    fontSize: '12.5px',
                    backgroundColor: '#fafafa',
                    borderRadius: '8px',
                    border: '1px dashed #e4e4e7',
                  }}
                >
                  <p style={{ margin: '0 0 6px', fontWeight: 600, color: '#71717a' }}>No files yet.</p>
                  <p style={{ margin: 0, fontSize: '11.5px' }}>
                    Files will appear in real time as the AI builder creates them.
                  </p>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '3px' }}>
                  {fileTree.map((filePath) => {
                    const isSelected = activeFile === filePath;
                    return (
                      <button
                        key={filePath}
                        onClick={() => {
                          setActiveFile(filePath);
                          setShowCode(true);
                        }}
                        style={{
                          width: '100%',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '8px',
                          border: 'none',
                          borderRadius: '6px',
                          padding: '7px 10px',
                          backgroundColor: isSelected ? '#f4f4f5' : 'transparent',
                          color: isSelected ? '#09090b' : '#52525b',
                          fontWeight: isSelected ? 700 : 500,
                          fontSize: '12.5px',
                          fontFamily: 'monospace',
                          cursor: 'pointer',
                          textAlign: 'left',
                          transition: 'all 0.1s ease',
                        }}
                      >
                        <FileCode size={13} color={isSelected ? '#4f46e5' : '#71717a'} />
                        <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                          {filePath.startsWith('/') ? filePath.slice(1) : filePath}
                        </span>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          )}
        </aside>

        {/* COLUMN 2: CODE EDITOR (Rendered ONLY when showCode === true) */}
        {showCode && (
          <section
            style={{
              display: 'flex',
              flexDirection: 'column',
              backgroundColor: '#ffffff',
              borderRight: '1px solid #e4e4e7',
              height: '100%',
              overflow: 'hidden',
            }}
          >
            {/* Horizontal Tabs */}
            <div
              style={{
                height: '40px',
                display: 'flex',
                alignItems: 'center',
                backgroundColor: '#fafafa',
                borderBottom: '1px solid #e4e4e7',
                overflowX: 'auto',
                padding: '0 8px',
                gap: '2px',
                flexShrink: 0,
              }}
            >
              {fileTree.map((filePath) => {
                const isSelected = activeFile === filePath;
                return (
                  <button
                    key={filePath}
                    onClick={() => setActiveFile(filePath)}
                    style={{
                      padding: '6px 12px',
                      fontSize: '12px',
                      fontWeight: isSelected ? 600 : 500,
                      fontFamily: 'monospace',
                      color: isSelected ? '#09090b' : '#71717a',
                      backgroundColor: isSelected ? '#ffffff' : 'transparent',
                      border: 'none',
                      borderBottom: isSelected ? '2px solid #4f46e5' : '2px solid transparent',
                      cursor: 'pointer',
                      whiteSpace: 'nowrap',
                      display: 'inline-flex',
                      alignItems: 'center',
                    }}
                  >
                    {formatTabName(filePath)}
                    {isSelected && isCodeModified && (
                      <span
                        style={{
                          width: '6px',
                          height: '6px',
                          borderRadius: '50%',
                          backgroundColor: '#4f46e5',
                          display: 'inline-block',
                          marginLeft: '6px',
                        }}
                        title="Unsaved changes"
                      />
                    )}
                  </button>
                );
              })}
            </div>

            {/* Code Editor Header & Save Button */}
            <div
              style={{
                height: '36px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '0 16px',
                backgroundColor: '#ffffff',
                borderBottom: '1px solid #f4f4f5',
                flexShrink: 0,
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ fontSize: '11px', fontFamily: 'monospace', color: '#71717a', fontWeight: 600 }}>
                  {activeFile || 'No file selected'}
                </span>
                {isCodeModified && (
                  <span
                    style={{
                      fontSize: '10px',
                      fontWeight: 700,
                      color: '#4f46e5',
                      backgroundColor: '#eef2ff',
                      padding: '1px 6px',
                      borderRadius: '4px',
                    }}
                  >
                    Unsaved
                  </span>
                )}
              </div>
              <button
                onClick={handleSaveCode}
                disabled={!isCodeModified}
                style={{
                  border: 'none',
                  borderRadius: '4px',
                  backgroundColor: isCodeModified ? '#4f46e5' : '#f4f4f5',
                  color: isCodeModified ? '#ffffff' : '#a1a1aa',
                  fontSize: '11.5px',
                  fontWeight: 600,
                  padding: '4px 12px',
                  cursor: isCodeModified ? 'pointer' : 'default',
                  transition: 'background-color 0.15s ease',
                }}
              >
                {isCodeModified ? 'Save & Apply' : 'Saved'}
              </button>
            </div>

            {/* Code Textarea */}
            <div style={{ flex: 1, position: 'relative', overflow: 'hidden' }}>
              <textarea
                value={editedCode}
                onChange={(e) => setEditedCode(e.target.value)}
                spellCheck={false}
                style={{
                  width: '100%',
                  height: '100%',
                  border: 'none',
                  outline: 'none',
                  padding: '16px',
                  fontFamily: "'JetBrains Mono', Consolas, Monaco, monospace",
                  fontSize: '12.5px',
                  lineHeight: '1.65',
                  color: '#18181b',
                  backgroundColor: '#ffffff',
                  resize: 'none',
                  boxSizing: 'border-box',
                  whiteSpace: 'pre',
                  tabSize: 2,
                }}
              />
            </div>
          </section>
        )}

        {/* COLUMN 3: LIVE PREVIEW */}
        <section
          style={{
            display: 'flex',
            flexDirection: 'column',
            backgroundColor: '#ffffff',
            height: '100%',
            overflow: 'hidden',
          }}
        >
          {/* Preview Toolbar */}
          <div
            style={{
              height: '40px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '0 16px',
              backgroundColor: '#ffffff',
              borderBottom: '1px solid #e4e4e7',
              flexShrink: 0,
            }}
          >
            {/* Device Switcher */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <button
                onClick={() => setDeviceView('desktop')}
                style={{
                  width: '28px',
                  height: '28px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  border: '1px solid',
                  borderColor: deviceView === 'desktop' ? '#e4e4e7' : 'transparent',
                  borderRadius: '5px',
                  backgroundColor: deviceView === 'desktop' ? '#f4f4f5' : 'transparent',
                  color: '#18181b',
                  cursor: 'pointer',
                }}
                title="Desktop View"
              >
                <Laptop size={14} />
              </button>
              <button
                onClick={() => setDeviceView('tablet')}
                style={{
                  width: '28px',
                  height: '28px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  border: '1px solid',
                  borderColor: deviceView === 'tablet' ? '#e4e4e7' : 'transparent',
                  borderRadius: '5px',
                  backgroundColor: deviceView === 'tablet' ? '#f4f4f5' : 'transparent',
                  color: '#18181b',
                  cursor: 'pointer',
                }}
                title="Tablet View"
              >
                <Tablet size={14} />
              </button>
              <button
                onClick={() => setDeviceView('mobile')}
                style={{
                  width: '28px',
                  height: '28px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  border: '1px solid',
                  borderColor: deviceView === 'mobile' ? '#e4e4e7' : 'transparent',
                  borderRadius: '5px',
                  backgroundColor: deviceView === 'mobile' ? '#f4f4f5' : 'transparent',
                  color: '#18181b',
                  cursor: 'pointer',
                }}
                title="Mobile View"
              >
                <Smartphone size={14} />
              </button>
            </div>

            {/* Refresh Live Preview */}
            <button
              onClick={() => {
                setPreviewKey((k) => k + 1);
                toast.success('Live preview reloaded!');
              }}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '5px',
                border: '1px solid #e4e4e7',
                borderRadius: '5px',
                padding: '4px 10px',
                backgroundColor: '#ffffff',
                color: '#52525b',
                fontSize: '11.5px',
                fontWeight: 600,
                cursor: 'pointer',
              }}
              title="Reload preview"
            >
              <RotateCw size={12} />
              <span>Reload</span>
            </button>
          </div>

          {/* Live Preview Iframe Container */}
          <div
            style={{
              flex: 1,
              backgroundColor: '#f4f4f5',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              overflow: 'hidden',
              padding: deviceView === 'desktop' ? '0' : '16px',
            }}
          >
            {(isGenerating || generationError) && (!project?.files || Object.keys(project.files).length === 0) ? (
              <div
                style={{
                  width: deviceView === 'desktop' ? '100%' : deviceView === 'tablet' ? '768px' : '375px',
                  height: '100%',
                  backgroundColor: '#ffffff',
                  borderRadius: deviceView === 'desktop' ? '0' : '12px',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  padding: '32px 24px',
                  boxSizing: 'border-box',
                }}
              >
                {generationError ? (
                  <>
                    <div
                      style={{
                        width: '56px',
                        height: '56px',
                        borderRadius: '16px',
                        backgroundColor: '#fef2f2',
                        border: '1px solid #fee2e2',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: '#dc2626',
                        marginBottom: '18px',
                      }}
                    >
                      <AlertCircle size={28} />
                    </div>

                    <h2 style={{ fontSize: '20px', fontWeight: 800, color: '#09090b', margin: '0 0 6px' }}>
                      Generation Stalled or Encountered Notice
                    </h2>

                    <p style={{ fontSize: '12.5px', color: '#b91c1c', margin: '0 0 20px', maxWidth: '460px', textAlign: 'center', lineHeight: 1.5 }}>
                      {generationError}
                    </p>

                    <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', justifyContent: 'center' }}>
                      <button
                        onClick={handleInstantBuild}
                        style={{
                          padding: '10px 18px',
                          borderRadius: '8px',
                          backgroundColor: '#09090b',
                          color: '#ffffff',
                          border: 'none',
                          fontSize: '13px',
                          fontWeight: 700,
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '6px',
                        }}
                      >
                        <Sparkles size={14} color="#f59e0b" />
                        <span>Instant Build (Senior Architect)</span>
                      </button>

                      <button
                        onClick={handleRetryAgent}
                        style={{
                          padding: '10px 16px',
                          borderRadius: '8px',
                          backgroundColor: '#f4f4f5',
                          color: '#18181b',
                          border: '1px solid #e4e4e7',
                          fontSize: '13px',
                          fontWeight: 600,
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '6px',
                        }}
                      >
                        <RotateCw size={14} />
                        <span>Retry Build</span>
                      </button>

                      <button
                        onClick={() => setShowApiKeyModal(true)}
                        style={{
                          padding: '10px 16px',
                          borderRadius: '8px',
                          backgroundColor: '#ffffff',
                          color: '#3f3f46',
                          border: '1px solid #e4e4e7',
                          fontSize: '13px',
                          fontWeight: 600,
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '6px',
                        }}
                      >
                        <Cpu size={14} color="#16a34a" />
                        <span>AI Settings</span>
                      </button>
                    </div>
                  </>
                ) : (
                  <>
                    <div
                      style={{
                        width: '56px',
                        height: '56px',
                        borderRadius: '16px',
                        backgroundColor: '#eef2ff',
                        border: '1px solid #e0e7ff',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: '#4f46e5',
                        marginBottom: '18px',
                      }}
                    >
                      <Sparkles size={28} className="animate-spin" style={{ animationDuration: '6s' }} />
                    </div>

                    <h2 style={{ fontSize: '20px', fontWeight: 800, color: '#09090b', margin: '0 0 6px' }}>
                      AI is building your application
                    </h2>

                    <p style={{ fontSize: '13px', color: '#71717a', margin: '0', maxWidth: '440px', textAlign: 'center' }}>
                      {currentActionNotice}
                    </p>
                  </>
                )}
              </div>
            ) : (
              <iframe
                key={previewKey}
                srcDoc={previewHtml}
                title="Live Application Preview"
                sandbox="allow-scripts allow-modals allow-same-origin allow-forms"
                style={{
                  backgroundColor: '#ffffff',
                  border: deviceView === 'desktop' ? 'none' : '1px solid #e4e4e7',
                  borderRadius: deviceView === 'desktop' ? '0' : '12px',
                  boxShadow: deviceView === 'desktop' ? 'none' : '0 12px 30px rgba(0,0,0,0.1)',
                  width: deviceView === 'desktop' ? '100%' : deviceView === 'tablet' ? '768px' : '375px',
                  height: '100%',
                  display: 'block',
                  transition: 'width 0.2s ease, border-radius 0.2s ease',
                }}
              />
            )}
          </div>
        </section>
      </div>

      {/* 3. In-Studio Publishing Modal */}
      {showPublishModal && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.55)',
            backdropFilter: 'blur(4px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
          }}
          onClick={() => {
            if (publishStep === 4) setShowPublishModal(false);
          }}
        >
          <div
            style={{
              backgroundColor: '#ffffff',
              borderRadius: '16px',
              padding: '30px 32px',
              maxWidth: '460px',
              width: '90%',
              boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
              position: 'relative',
              boxSizing: 'border-box',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {publishStep < 4 ? (
              <div>
                <h3 style={{ fontSize: '18px', fontWeight: 700, margin: '0 0 20px', color: '#09090b' }}>
                  Publishing website…
                </h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '13.5px' }}>
                    {publishStep >= 1 ? <CheckCircle2 size={18} color="#16a34a" /> : <Loader2 size={18} className="animate-spin text-zinc-400" />}
                    <span style={{ color: publishStep >= 1 ? '#09090b' : '#a1a1aa', fontWeight: 500 }}>
                      Building project
                    </span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '13.5px' }}>
                    {publishStep >= 2 ? <CheckCircle2 size={18} color="#16a34a" /> : <span style={{ width: 18, height: 18 }} />}
                    <span style={{ color: publishStep >= 2 ? '#09090b' : '#a1a1aa', fontWeight: 500 }}>
                      Checking files
                    </span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '13.5px' }}>
                    {publishStep >= 3 ? <CheckCircle2 size={18} color="#16a34a" /> : <span style={{ width: 18, height: 18 }} />}
                    <span style={{ color: publishStep >= 3 ? '#09090b' : '#a1a1aa', fontWeight: 500 }}>
                      Creating deployment
                    </span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '13.5px' }}>
                    {publishStep >= 4 ? <CheckCircle2 size={18} color="#16a34a" /> : <span style={{ width: 18, height: 18 }} />}
                    <span style={{ color: publishStep >= 4 ? '#09090b' : '#a1a1aa', fontWeight: 500 }}>
                      Publishing
                    </span>
                  </div>
                </div>
              </div>
            ) : (
              <div>
                <div
                  style={{
                    width: '46px',
                    height: '46px',
                    borderRadius: '50%',
                    backgroundColor: '#dcfce7',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#16a34a',
                    marginBottom: '16px',
                  }}
                >
                  <CheckCircle2 size={26} />
                </div>
                <h3 style={{ fontSize: '19px', fontWeight: 800, margin: '0 0 8px', color: '#09090b' }}>
                  Your website is live!
                </h3>
                <p style={{ fontSize: '13.5px', color: '#71717a', margin: '0 0 18px', lineHeight: 1.5 }}>
                  Your application is compiled and deployed to the WebForge live preview network.
                </p>

                <div
                  style={{
                    backgroundColor: '#f4f4f5',
                    borderRadius: '8px',
                    padding: '10px 14px',
                    fontSize: '12.5px',
                    fontFamily: 'monospace',
                    color: '#18181b',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                    marginBottom: '18px',
                    border: '1px solid #e4e4e7',
                  }}
                >
                  {`${window.location.origin}/preview/${id || project?.id}`}
                </div>

                <div style={{ display: 'flex', gap: '10px' }}>
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(`${window.location.origin}/preview/${id || project?.id}`);
                      toast.success('Shareable link copied to clipboard!');
                    }}
                    style={{
                      flex: 1,
                      padding: '10px',
                      backgroundColor: '#f4f4f5',
                      border: '1px solid #e4e4e7',
                      borderRadius: '8px',
                      fontSize: '13px',
                      fontWeight: 600,
                      color: '#09090b',
                      cursor: 'pointer',
                    }}
                  >
                    Copy Link
                  </button>
                  <a
                    href={`/preview/${id || project?.id}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      flex: 1,
                      padding: '10px',
                      backgroundColor: '#09090b',
                      color: '#ffffff',
                      borderRadius: '8px',
                      fontSize: '13px',
                      fontWeight: 600,
                      textAlign: 'center',
                      textDecoration: 'none',
                      display: 'inline-flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    Open Site
                  </a>
                </div>

                <button
                  onClick={() => setShowPublishModal(false)}
                  style={{
                    width: '100%',
                    marginTop: '12px',
                    background: 'transparent',
                    border: 0,
                    color: '#71717a',
                    fontSize: '12.5px',
                    cursor: 'pointer',
                    padding: '6px',
                  }}
                >
                  Close
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* OpenRouter Settings Modal */}
      <ApiKeyModal
        isOpen={showApiKeyModal}
        onClose={() => setShowApiKeyModal(false)}
        onKeyConfigured={(cfg) => {
          if (cfg?.model) setAgentModel(cfg.model);
        }}
      />
    </main>
  );
}
