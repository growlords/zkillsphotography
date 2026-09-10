import React, { useState } from 'react';
import { Lock, ShieldCheck, KeyRound, Loader2, AlertCircle, CheckCircle2 } from 'lucide-react';
import { useAdminToast } from '../components/AdminToast';

export const AdminSettings: React.FC = () => {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [changing, setChanging] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const { toast } = useAdminToast();

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (!currentPassword) {
      setError('Please provide your current password.');
      return;
    }

    if (newPassword.length < 6) {
      setError('New password must be at least 6 characters long.');
      return;
    }

    if (newPassword !== confirmPassword) {
      setError('New passwords do not match.');
      return;
    }

    try {
      setChanging(true);
      const res = await fetch('/api/auth/change-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ currentPassword, newPassword }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setSuccess('Password updated successfully! Future logins will require the new password.');
        toast('Admin password updated successfully', 'success');
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
      } else {
        setError(data.error || 'Failed to update password');
      }
    } catch {
      setError('Network error while updating password');
    } finally {
      setChanging(false);
    }
  };

  return (
    <div className="space-y-8 max-w-2xl">
      {/* Header */}
      <div className="pb-6 border-b border-white/10">
        <span className="text-[11px] font-mono uppercase tracking-widest text-champagne block mb-1">
          Security & Access Controls
        </span>
        <h1 className="font-serif text-3xl sm:text-4xl text-white font-normal">
          Admin Settings & Credentials
        </h1>
        <p className="text-xs text-white/50 font-sans mt-1">
          Manage administrator authentication and rotate security keys.
        </p>
      </div>

      {/* Security Info Card */}
      <div className="bg-[#121217] border border-white/10 rounded-2xl p-6 space-y-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-sm font-semibold text-white">Cryptographic Security Active</h2>
            <p className="text-xs text-white/50">
              Passwords are salted and securely hashed using native scrypt with timing-safe comparison.
            </p>
          </div>
        </div>

        <div className="p-4 rounded-xl bg-[#09090C] border border-white/5 space-y-2 text-xs font-mono text-white/70">
          <div className="flex justify-between">
            <span className="text-white/40">Username:</span>
            <span className="text-champagne font-bold">kamaljeet</span>
          </div>
          <div className="flex justify-between">
            <span className="text-white/40">Hashing Algorithm:</span>
            <span className="text-emerald-400 font-bold">crypto.scryptSync (64-byte key)</span>
          </div>
          <div className="flex justify-between">
            <span className="text-white/40">Session Mechanism:</span>
            <span className="text-white">HttpOnly Cookie + SQLite Session Ledger</span>
          </div>
        </div>
      </div>

      {/* Change Password Form */}
      <div className="bg-[#121217] border border-white/10 rounded-2xl p-6 space-y-6">
        <div className="flex items-center gap-2.5 text-champagne">
          <KeyRound className="w-4 h-4" />
          <h2 className="text-sm font-semibold uppercase tracking-wider font-mono">
            Change Administrator Password
          </h2>
        </div>

        {error && (
          <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
            <span>{error}</span>
          </div>
        )}

        {success && (
          <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400" />
            <span>{success}</span>
          </div>
        )}

        <form onSubmit={handlePasswordChange} className="space-y-4">
          <div>
            <label className="block text-xs font-mono uppercase text-white/70 mb-1.5">
              Current Password *
            </label>
            <input
              type="password"
              required
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              placeholder="Enter current password (e.g. kamal@123#)"
              className="w-full px-3.5 py-2.5 rounded-xl bg-[#09090C] border border-white/15 text-white text-sm focus:border-champagne"
            />
          </div>

          <div>
            <label className="block text-xs font-mono uppercase text-white/70 mb-1.5">
              New Password *
            </label>
            <input
              type="password"
              required
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="Enter new strong password"
              className="w-full px-3.5 py-2.5 rounded-xl bg-[#09090C] border border-white/15 text-white text-sm focus:border-champagne"
            />
          </div>

          <div>
            <label className="block text-xs font-mono uppercase text-white/70 mb-1.5">
              Confirm New Password *
            </label>
            <input
              type="password"
              required
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Re-type new password"
              className="w-full px-3.5 py-2.5 rounded-xl bg-[#09090C] border border-white/15 text-white text-sm focus:border-champagne"
            />
          </div>

          <button
            type="submit"
            disabled={changing}
            className="w-full py-3 rounded-xl bg-champagne hover:bg-champagne-dark text-black font-semibold text-xs font-mono tracking-widest uppercase flex items-center justify-center gap-2 shadow-lg shadow-champagne/20 transition-all disabled:opacity-50"
          >
            {changing ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Verifying and Updating...</span>
              </>
            ) : (
              <>
                <Lock className="w-4 h-4" />
                <span>Update Password</span>
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};
