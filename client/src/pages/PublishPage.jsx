import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Check, Copy, Download, Globe } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../api/api';
import { exportProjectZip } from '../utils/exportProject';

/**
 * Publish & Share page for generating public preview links.
 */
export default function PublishPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [project, setProject] = useState(null);
  const [isPublishing, setIsPublishing] = useState(false);

  useEffect(() => {
    let isMounted = true;
    api
      .get(`/api/projects/${id}`)
      .then((res) => {
        if (isMounted) setProject(res.data);
      })
      .catch((err) => {
        console.error('Failed to load project for publishing:', err);
        navigate('/');
      });

    return () => {
      isMounted = false;
    };
  }, [id, navigate]);

  if (!project) {
    return (
      <div className="page-loading">
        <div className="agent-loader">
          <i />
          <span>Loading publishing status…</span>
        </div>
      </div>
    );
  }

  const handlePublish = async () => {
    setIsPublishing(true);
    try {
      await api.post(`/api/projects/${id}/publish`);
      setProject({ ...project, published: true });
      toast.success('Project published successfully!');
    } catch (err) {
      console.error('Publish error:', err);
      toast.error(err.response?.data?.error || 'Could not publish project');
    } finally {
      setIsPublishing(false);
    }
  };

  const previewUrl = `${window.location.origin}/preview/${id}`;

  const copyToClipboard = () => {
    navigator.clipboard
      .writeText(previewUrl)
      .then(() => toast.success('Shareable link copied to clipboard!'))
      .catch(() => toast.error('Could not copy link'));
  };

  return (
    <main className="publish-page">
      <header className="builder__bar">
        <Link to={`/builder/${id}`} className="back">
          <ArrowLeft size={18} />
          <span>Back to Studio</span>
        </Link>
        <strong>Publish Project</strong>
        <span />
      </header>

      <section className="publish-card">
        <div className="publish-icon">
          <Globe size={30} />
        </div>

        <h1>{project.published ? 'Your website is live' : 'Ready to share your website?'}</h1>
        <p>
          {project.published
            ? 'Your latest published version is ready to view and share with anyone.'
            : 'Publish to generate a shareable preview link for your application.'}
        </p>

        {project.published && (
          <div className="share-url">
            <code>{previewUrl}</code>
            <button type="button" onClick={copyToClipboard} title="Copy Link">
              <Copy size={17} />
            </button>
          </div>
        )}

        <div className="publish-actions">
          <button
            className="button-primary"
            onClick={handlePublish}
            disabled={isPublishing}
          >
            {project.published ? (
              <>
                <Check size={17} />
                <span>Published</span>
              </>
            ) : isPublishing ? (
              'Publishing…'
            ) : (
              'Publish project'
            )}
          </button>

          <button
            className="button-secondary"
            onClick={() => exportProjectZip(project)}
            title="Download full source code"
          >
            <Download size={17} />
            <span>Download code</span>
          </button>
        </div>

        <small>
          Publishing here provides a shareable preview route. You can also export the code and host it on Vercel, Netlify, or Cloudflare Pages.
        </small>
      </section>
    </main>
  );
}
