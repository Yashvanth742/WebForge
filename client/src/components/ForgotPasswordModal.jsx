import React, { useState } from 'react';
import { Eye, EyeOff, KeyRound, Loader2, X } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../api/api';

export default function ForgotPasswordModal({ isOpen, onClose, initialEmail = '', onSuccess }) {
  const [email, setEmail] = useState(initialEmail);
  const [newPassword, setNewPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const { data } = await api.post('/api/auth/reset-password', {
        email: email.trim().toLowerCase(),
        newPassword,
      });

      toast.success(data?.message || 'Password reset successfully!');
      onSuccess?.(email, newPassword);
      onClose();
    } catch (err) {
      console.error('Password reset error:', err);
      setError(
        err.response?.data?.error ||
        'Failed to reset password. Please check your email or try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="w-full max-w-md bg-white rounded-2xl shadow-2xl border border-zinc-200 overflow-hidden transform transition-all"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-6 pb-4 border-b border-zinc-100 relative">
          <button
            type="button"
            onClick={onClose}
            className="absolute top-5 right-5 p-1 text-zinc-400 hover:text-zinc-700 rounded-full hover:bg-zinc-100 transition cursor-pointer"
            title="Close"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="w-10 h-10 rounded-xl bg-zinc-100 flex items-center justify-center text-zinc-900 mb-3">
            <KeyRound className="w-5 h-5" />
          </div>
          <h2 className="text-xl font-bold text-zinc-900">Reset your password</h2>
          <p className="text-xs text-zinc-500 mt-1">
            Enter your account email and specify a new password to restore access.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-lg font-medium">
              {error}
            </div>
          )}

          <div>
            <label className="block text-[11px] font-semibold text-zinc-500 uppercase tracking-wider mb-1.5">
              Account Email
            </label>
            <input
              type="email"
              required
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2.5 border border-zinc-200 rounded-lg text-sm text-zinc-900 bg-white placeholder-zinc-400 outline-none focus:border-zinc-900 transition"
            />
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-zinc-500 uppercase tracking-wider mb-1.5">
              New Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                required
                minLength={4}
                placeholder="At least 4 characters"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full px-3 py-2.5 pr-10 border border-zinc-200 rounded-lg text-sm text-zinc-900 bg-white placeholder-zinc-400 outline-none focus:border-zinc-900 transition"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-700 transition"
                tabIndex={-1}
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          <div className="pt-2 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="py-2.5 px-4 text-xs font-semibold text-zinc-600 hover:text-zinc-900 transition cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="py-2.5 px-4 bg-zinc-900 hover:bg-zinc-800 text-white text-xs font-semibold rounded-lg transition cursor-pointer flex items-center gap-2 disabled:opacity-60"
            >
              {loading && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
              <span>{loading ? 'Updating…' : 'Reset Password'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
