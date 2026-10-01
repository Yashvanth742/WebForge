import React, { useState, useMemo } from 'react';
import {
  Terminal,
  Cpu,
  CheckCircle2,
  AlertCircle,
  Clock,
  FileCode,
  FilePlus,
  FileEdit,
  Play,
  RotateCw,
  Copy,
  Check,
  ChevronDown,
  ChevronRight,
  ExternalLink,
  Shield,
  Layers,
  Wrench,
  KeyRound,
} from 'lucide-react';

export default function DevAgentLog({
  devLogs = [],
  isGenerating = false,
  isSending = false,
  generationError = null,
  onConfigureKey,
  onRetry,
  files = {},
  currentModel = 'gemini-2.5-flash',
  currentPrompt = '',
}) {
  const [filterTool, setFilterTool] = useState('all');
  const [expandedIndices, setExpandedIndices] = useState(new Set());
  const [copiedIndex, setCopiedIndex] = useState(null);

  // Compute aggregated stats from logs
  const stats = useMemo(() => {
    let startTime = null;
    let endTime = null;
    let model = currentModel;
    let userPrompt = currentPrompt;
    let toolCallsCount = 0;
    const filesCreated = new Set();
    const filesModified = new Set();
    let buildStatus = 'pending';
    let previewStatus = 'pending';
    let lastError = generationError;
    let totalDurationMs = null;

    for (const log of devLogs) {
      if (log.event === 'request_started') {
        startTime = log.timestamp;
        if (log.model) model = log.model;
        if (log.request) userPrompt = log.request;
      }
      if (log.event === 'tool_call') {
        toolCallsCount++;
      }
      if (log.event === 'file_created') {
        if (log.path) filesCreated.add(log.path);
      }
      if (log.event === 'file_updated') {
        if (log.path) filesModified.add(log.path);
      }
      if (log.event === 'build_started') {
        buildStatus = 'building';
      }
      if (log.event === 'build_result') {
        buildStatus = log.status === 'success' ? 'passed' : 'failed';
      }
      if (log.event === 'preview_status') {
        previewStatus = log.status;
      }
      if (log.event === 'request_completed') {
        endTime = log.timestamp;
        totalDurationMs = log.durationMs;
      }
      if (log.event === 'request_error') {
        lastError = log.error;
        totalDurationMs = log.durationMs;
      }
    }

    if (!totalDurationMs && startTime) {
      const end = endTime ? new Date(endTime).getTime() : Date.now();
      totalDurationMs = Math.max(0, end - new Date(startTime).getTime());
    }

    return {
      startTime,
      model,
      userPrompt,
      toolCallsCount,
      filesCreated: Array.from(filesCreated),
      filesModified: Array.from(filesModified),
      buildStatus,
      previewStatus,
      lastError,
      durationMs: totalDurationMs,
    };
  }, [devLogs, currentModel, currentPrompt, generationError]);

  const toggleExpand = (index) => {
    setExpandedIndices((prev) => {
      const next = new Set(prev);
      if (next.has(index)) next.delete(index);
      else next.add(index);
      return next;
    });
  };

  const copyToClipboard = (text, index) => {
    navigator.clipboard?.writeText(typeof text === 'string' ? text : JSON.stringify(text, null, 2));
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 1500);
  };

  // Group tool calls with their corresponding result if available
  const timelineItems = useMemo(() => {
    return devLogs.filter((log) => {
      if (filterTool === 'all') return true;
      if (filterTool === 'tool_call') return log.event === 'tool_call' || log.event === 'tool_result';
      if (filterTool === 'files') return log.event === 'file_created' || log.event === 'file_updated';
      if (filterTool === 'build') return log.event === 'build_started' || log.event === 'build_result';
      return log.event === filterTool;
    });
  }, [devLogs, filterTool]);

  const formatDuration = (ms) => {
    if (!ms && ms !== 0) return '—';
    if (ms < 1000) return `${ms}ms`;
    return `${(ms / 1000).toFixed(1)}s`;
  };

  const isLive = isGenerating || isSending;

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        backgroundColor: '#fafafa',
        overflowY: 'auto',
        fontFamily: "'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, sans-serif",
      }}
    >
      {/* 1. Header & Status Bar */}
      <div
        style={{
          padding: '14px 16px',
          borderBottom: '1px solid #e4e4e7',
          backgroundColor: '#ffffff',
          display: 'flex',
          flexDirection: 'column',
          gap: '10px',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div
              style={{
                width: '26px',
                height: '26px',
                borderRadius: '6px',
                backgroundColor: '#eef2ff',
                color: '#4f46e5',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Terminal size={14} />
            </div>
            <div>
              <h3 style={{ margin: 0, fontSize: '13px', fontWeight: 800, color: '#09090b' }}>
                Development Agent Log
              </h3>
              <span style={{ fontSize: '11px', color: '#71717a' }}>
                Real-time Gemini function calls & project operations
              </span>
            </div>
          </div>

          {onConfigureKey && (
            <button
              onClick={onConfigureKey}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '5px',
                padding: '4px 10px',
                fontSize: '11px',
                fontWeight: 600,
                borderRadius: '6px',
                border: '1px solid #e4e4e7',
                backgroundColor: '#ffffff',
                color: '#3f3f46',
                cursor: 'pointer',
              }}
            >
              <KeyRound size={12} />
              API Key Config
            </button>
          )}
        </div>

        {/* Diagnostic KPI Metrics Grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(2, 1fr)',
            gap: '8px',
          }}
        >
          {/* Card 1: Gemini Model */}
          <div
            style={{
              padding: '8px 10px',
              borderRadius: '8px',
              backgroundColor: '#f4f4f5',
              border: '1px solid #e4e4e7',
            }}
          >
            <span style={{ fontSize: '10px', color: '#71717a', fontWeight: 700, textTransform: 'uppercase' }}>
              Gemini Model
            </span>
            <div style={{ fontSize: '12px', fontWeight: 700, color: '#09090b', marginTop: '2px', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Cpu size={12} color="#4f46e5" />
              <span>{stats.model}</span>
            </div>
          </div>

          {/* Card 2: Duration */}
          <div
            style={{
              padding: '8px 10px',
              borderRadius: '8px',
              backgroundColor: '#f4f4f5',
              border: '1px solid #e4e4e7',
            }}
          >
            <span style={{ fontSize: '10px', color: '#71717a', fontWeight: 700, textTransform: 'uppercase' }}>
              Execution Time
            </span>
            <div style={{ fontSize: '12px', fontWeight: 700, color: '#09090b', marginTop: '2px', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Clock size={12} color="#f59e0b" />
              <span>{formatDuration(stats.durationMs)}</span>
              {isLive && <span style={{ fontSize: '10px', color: '#4f46e5' }}>(running)</span>}
            </div>
          </div>

          {/* Card 3: Tool Calls */}
          <div
            style={{
              padding: '8px 10px',
              borderRadius: '8px',
              backgroundColor: '#f4f4f5',
              border: '1px solid #e4e4e7',
            }}
          >
            <span style={{ fontSize: '10px', color: '#71717a', fontWeight: 700, textTransform: 'uppercase' }}>
              Tool Calls Executed
            </span>
            <div style={{ fontSize: '12px', fontWeight: 700, color: '#09090b', marginTop: '2px', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Wrench size={12} color="#059669" />
              <span>{stats.toolCallsCount} actions</span>
            </div>
          </div>

          {/* Card 4: Build & Preview */}
          <div
            style={{
              padding: '8px 10px',
              borderRadius: '8px',
              backgroundColor: '#f4f4f5',
              border: '1px solid #e4e4e7',
            }}
          >
            <span style={{ fontSize: '10px', color: '#71717a', fontWeight: 700, textTransform: 'uppercase' }}>
              Build / Preview
            </span>
            <div style={{ fontSize: '12px', fontWeight: 700, marginTop: '2px', display: 'flex', alignItems: 'center', gap: '6px' }}>
              {stats.buildStatus === 'passed' ? (
                <span style={{ color: '#16a34a', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <CheckCircle2 size={12} /> Build OK
                </span>
              ) : stats.buildStatus === 'failed' ? (
                <span style={{ color: '#dc2626', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <AlertCircle size={12} /> Failed
                </span>
              ) : (
                <span style={{ color: '#71717a' }}>{stats.buildStatus}</span>
              )}
            </div>
          </div>
        </div>

        {/* User Prompt Banner */}
        {stats.userPrompt && (
          <div
            style={{
              backgroundColor: '#f8fafc',
              border: '1px solid #e2e8f0',
              borderRadius: '6px',
              padding: '8px 10px',
              fontSize: '11.5px',
            }}
          >
            <span style={{ fontWeight: 800, color: '#64748b', fontSize: '10px', textTransform: 'uppercase', display: 'block', marginBottom: '2px' }}>
              Active User Prompt
            </span>
            <div style={{ color: '#0f172a', fontWeight: 500, fontStyle: 'italic' }}>
              "{stats.userPrompt}"
            </div>
          </div>
        )}

        {/* Error Callout with Action */}
        {stats.lastError && (
          <div
            style={{
              backgroundColor: '#fef2f2',
              border: '1px solid #fecaca',
              borderRadius: '8px',
              padding: '10px 12px',
              display: 'flex',
              flexDirection: 'column',
              gap: '6px',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#b91c1c', fontWeight: 700, fontSize: '12px' }}>
              <AlertCircle size={14} />
              <span>Gemini Agent Error</span>
            </div>
            <p style={{ margin: 0, fontSize: '11.5px', color: '#991b1b', fontFamily: 'monospace', whiteSpace: 'pre-wrap' }}>
              {stats.lastError}
            </p>
            {onRetry && (
              <div style={{ display: 'flex', gap: '6px', marginTop: '4px' }}>
                <button
                  onClick={onRetry}
                  style={{
                    backgroundColor: '#dc2626',
                    color: '#ffffff',
                    border: 'none',
                    borderRadius: '5px',
                    padding: '4px 10px',
                    fontSize: '11px',
                    fontWeight: 700,
                    cursor: 'pointer',
                  }}
                >
                  Retry Request
                </button>
                {onConfigureKey && (
                  <button
                    onClick={onConfigureKey}
                    style={{
                      backgroundColor: '#ffffff',
                      color: '#374151',
                      border: '1px solid #d1d5db',
                      borderRadius: '5px',
                      padding: '4px 10px',
                      fontSize: '11px',
                      fontWeight: 600,
                      cursor: 'pointer',
                    }}
                  >
                    Set API Key
                  </button>
                )}
              </div>
            )}
          </div>
        )}
      </div>

      {/* 2. Filter Bar */}
      <div
        style={{
          display: 'flex',
          gap: '6px',
          padding: '8px 16px',
          borderBottom: '1px solid #e4e4e7',
          backgroundColor: '#fafafa',
          flexWrap: 'wrap',
        }}
      >
        {[
          { key: 'all', label: `All Events (${devLogs.length})` },
          { key: 'tool_call', label: `Tool Calls (${stats.toolCallsCount})` },
          { key: 'files', label: `Files (${stats.filesCreated.length + stats.filesModified.length})` },
          { key: 'build', label: 'Build Events' },
        ].map((btn) => (
          <button
            key={btn.key}
            onClick={() => setFilterTool(btn.key)}
            style={{
              padding: '4px 9px',
              fontSize: '11px',
              fontWeight: 600,
              borderRadius: '9999px',
              border: filterTool === btn.key ? '1px solid #4f46e5' : '1px solid #e4e4e7',
              backgroundColor: filterTool === btn.key ? '#eef2ff' : '#ffffff',
              color: filterTool === btn.key ? '#4f46e5' : '#71717a',
              cursor: 'pointer',
            }}
          >
            {btn.label}
          </button>
        ))}
      </div>

      {/* 3. Timeline / Tool Calls Feed */}
      <div style={{ flex: 1, padding: '12px 16px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
        {timelineItems.length === 0 ? (
          <div
            style={{
              padding: '24px 16px',
              textAlign: 'center',
              color: '#a1a1aa',
              fontSize: '12px',
              backgroundColor: '#ffffff',
              borderRadius: '8px',
              border: '1px dashed #e4e4e7',
            }}
          >
            <p style={{ margin: '0 0 4px', fontWeight: 600, color: '#71717a' }}>No developer logs recorded yet.</p>
            <p style={{ margin: 0, fontSize: '11px' }}>
              Detailed Gemini function calls, tool arguments, and results will appear live during generation.
            </p>
          </div>
        ) : (
          timelineItems.map((log, idx) => {
            const isExpanded = expandedIndices.has(idx);
            const isToolCall = log.event === 'tool_call';
            const isToolResult = log.event === 'tool_result';
            const isFileCreated = log.event === 'file_created';
            const isFileUpdated = log.event === 'file_updated';
            const isBuild = log.event === 'build_started' || log.event === 'build_result';
            const isCompleted = log.event === 'request_completed';

            let badgeBg = '#f4f4f5';
            let badgeColor = '#52525b';
            let badgeLabel = log.event;

            if (isToolCall) {
              badgeBg = '#dbeafe';
              badgeColor = '#1d4ed8';
              badgeLabel = `call: ${log.tool}`;
            } else if (isToolResult) {
              badgeBg = '#ecfdf5';
              badgeColor = '#047857';
              badgeLabel = `result: ${log.tool}`;
            } else if (isFileCreated) {
              badgeBg = '#e0e7ff';
              badgeColor = '#4338ca';
              badgeLabel = 'create_file';
            } else if (isFileUpdated) {
              badgeBg = '#fef3c7';
              badgeColor = '#b45309';
              badgeLabel = 'update_file';
            } else if (isBuild) {
              badgeBg = log.status === 'success' ? '#dcfce7' : '#fee2e2';
              badgeColor = log.status === 'success' ? '#15803d' : '#b91c1c';
              badgeLabel = log.event === 'build_started' ? 'build: started' : `build: ${log.status}`;
            } else if (isCompleted) {
              badgeBg = '#dcfce7';
              badgeColor = '#15803d';
              badgeLabel = 'completed';
            }

            const payloadToInspect = log.args || log.result || log.files || log;

            return (
              <div
                key={idx}
                style={{
                  backgroundColor: '#ffffff',
                  border: '1px solid #e4e4e7',
                  borderRadius: '8px',
                  padding: '9px 12px',
                  fontSize: '12px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '6px',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span
                      style={{
                        backgroundColor: badgeBg,
                        color: badgeColor,
                        padding: '2px 7px',
                        borderRadius: '4px',
                        fontSize: '11px',
                        fontFamily: 'monospace',
                        fontWeight: 700,
                      }}
                    >
                      {badgeLabel}
                    </span>
                    <span style={{ color: '#09090b', fontWeight: 600, fontSize: '12px' }}>
                      {log.path || log.tool || (log.summary ? 'Project Generated' : log.event)}
                    </span>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    {log.timestamp && (
                      <span style={{ fontSize: '10.5px', color: '#a1a1aa' }}>
                        {new Date(log.timestamp).toLocaleTimeString()}
                      </span>
                    )}

                    <button
                      onClick={() => toggleExpand(idx)}
                      style={{
                        background: 'none',
                        border: 'none',
                        color: '#71717a',
                        cursor: 'pointer',
                        padding: '2px',
                        display: 'flex',
                        alignItems: 'center',
                      }}
                      title={isExpanded ? 'Collapse' : 'Expand payload'}
                    >
                      {isExpanded ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
                    </button>
                  </div>
                </div>

                {/* Inline preview for tool arguments */}
                {isToolCall && log.args && !isExpanded && (
                  <div
                    style={{
                      fontFamily: 'monospace',
                      fontSize: '11px',
                      color: '#52525b',
                      backgroundColor: '#fafafa',
                      padding: '4px 8px',
                      borderRadius: '4px',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    args: {JSON.stringify(log.args)}
                  </div>
                )}

                {/* Inline preview for tool result */}
                {isToolResult && log.result && !isExpanded && (
                  <div
                    style={{
                      fontFamily: 'monospace',
                      fontSize: '11px',
                      color: '#047857',
                      backgroundColor: '#f0fdf4',
                      padding: '4px 8px',
                      borderRadius: '4px',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    result: {JSON.stringify(log.result)}
                  </div>
                )}

                {/* Expanded full JSON Inspector */}
                {isExpanded && (
                  <div
                    style={{
                      marginTop: '4px',
                      position: 'relative',
                      backgroundColor: '#18181b',
                      borderRadius: '6px',
                      padding: '8px 10px',
                    }}
                  >
                    <button
                      onClick={() => copyToClipboard(payloadToInspect, idx)}
                      style={{
                        position: 'absolute',
                        top: '8px',
                        right: '8px',
                        backgroundColor: '#27272a',
                        border: '1px solid #3f3f46',
                        color: '#e4e4e7',
                        borderRadius: '4px',
                        padding: '2px 6px',
                        fontSize: '10px',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px',
                      }}
                    >
                      {copiedIndex === idx ? <Check size={10} color="#22c55e" /> : <Copy size={10} />}
                      {copiedIndex === idx ? 'Copied' : 'Copy'}
                    </button>
                    <pre
                      style={{
                        margin: 0,
                        fontFamily: 'monospace',
                        fontSize: '11px',
                        color: '#e4e4e7',
                        overflowX: 'auto',
                        whiteSpace: 'pre-wrap',
                        wordBreak: 'break-all',
                        maxHeight: '260px',
                      }}
                    >
                      {JSON.stringify(payloadToInspect, null, 2)}
                    </pre>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
