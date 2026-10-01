import React, { useEffect, useState, useMemo } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../api/api';
import { generatePreviewHtml } from '../utils/previewEngine';

/**
 * Fullscreen Standalone Live Preview Page.
 * Renders ONLY the created website in full viewport with zero WebForge branding or headers.
 */
export default function PreviewPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [project, setProject] = useState(null);

  useEffect(() => {
    let isMounted = true;
    api
      .get(`/api/projects/${id}`)
      .then((res) => {
        if (isMounted) {
          setProject(res.data);
          if (res.data?.name) {
            document.title = res.data.name;
          }
        }
      })
      .catch((err) => {
        console.error('Failed to load project for preview:', err);
        navigate('/');
      });

    return () => {
      isMounted = false;
    };
  }, [id, navigate]);

  const previewHtml = useMemo(() => {
    if (!project?.files) return '';
    return generatePreviewHtml(project.files);
  }, [project?.files]);

  if (!project) {
    return (
      <div
        style={{
          width: '100vw',
          height: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#ffffff',
          color: '#71717a',
          fontSize: '14px',
          fontFamily: 'system-ui, -apple-system, sans-serif',
        }}
      >
        Loading website…
      </div>
    );
  }

  return (
    <iframe
      srcDoc={previewHtml}
      title={project.name || 'Created Website'}
      sandbox="allow-scripts allow-modals allow-same-origin allow-forms"
      style={{
        width: '100vw',
        height: '100vh',
        border: 'none',
        margin: 0,
        padding: 0,
        display: 'block',
        backgroundColor: '#ffffff',
      }}
    />
  );
}
