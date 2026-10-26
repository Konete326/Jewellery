import React, { useState, useEffect } from 'react';
import {
  X,
  ArrowLeft,
  User,
  Mail,
  Calendar,
  Clock,
  ShieldCheck,
  Shield,
  Heart,
  MessageSquare,
  Gem,
  Key,
  CheckCircle2,
  AlertCircle,
  Copy,
  Check,
  UserCheck,
  UserX
} from 'lucide-react';
import { GoogleIcon } from '@/components/google-icon';
import { LumaSpin } from '@/components/ui/luma-spin';
import { usersApi } from '@/api/users.api.js';
import { toast } from 'sonner';

export function UserActivityModal({
  isOpen,
  onClose,
  user,
  onToggleStatus,
  onToggleRole,
  isSelf = false
}) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('inquiries');
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (isOpen && user?._id) {
      loadActivities();
    } else {
      setData(null);
    }
  }, [isOpen, user?._id]);

  const loadActivities = async () => {
    try {
      setLoading(true);
      const res = await usersApi.getActivities(user._id);
      setData(res?.data || res);
    } catch (err) {
      toast.error('Failed to load client activity record', {
        description: err.message || 'Please verify server connection.'
      });
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen || !user) return null;

  const clientUser = data?.user || user;
  const stats = data?.stats || {
    inquiriesCount: 0,
    wishlistCount: Array.isArray(clientUser.wishlist) ? clientUser.wishlist.length : 0,
    repliedCount: 0,
    pendingCount: 0
  };
  const inquiries = data?.inquiries || [];
  const isGoogle = clientUser.authProvider === 'google';
  const isAdmin = clientUser.role === 'admin';
  const isActive = clientUser.isActive !== false;

  const formatDate = (dateString) => {
    if (!dateString) return '—';
    try {
      return new Date(dateString).toLocaleDateString('en-GB', {
        day: '2-digit',
        month: 'short',
        year: 'numeric'
      });
    } catch {
      return '—';
    }
  };

  const formatDateTime = (dateString) => {
    if (!dateString) return '—';
    try {
      const d = new Date(dateString);
      return `${d.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })} at ${d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
    } catch {
      return '—';
    }
  };

  const copyUserId = () => {
    if (clientUser._id) {
      navigator.clipboard.writeText(clientUser._id);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
      toast.success('Client ID copied to clipboard');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
      <button
        type="button"
        aria-label="Close dialog overlay"
        onClick={onClose}
        className="fixed inset-0 bg-black/60 backdrop-blur-xs cursor-default w-full h-full border-0 p-0 focus-visible:outline-none"
        tabIndex={-1}
      />

      <div className="relative w-full max-w-2xl max-h-[90vh] flex flex-col rounded-2xl border border-border bg-card shadow-2xl z-10 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-border bg-muted/20 shrink-0">
          <button
            type="button"
            onClick={onClose}
            className="inline-flex items-center gap-1.5 text-xs font-medium text-muted-foreground hover:text-foreground transition-colors cursor-pointer py-1 px-2 rounded-lg hover:bg-muted"
          >
            <ArrowLeft className="size-3.5" />
            <span>Back to Directory</span>
          </button>
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-mono text-muted-foreground">
              Client Dossier
            </span>
            <button
              type="button"
              aria-label="Close modal"
              onClick={onClose}
              className="p-1 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted transition-colors cursor-pointer"
            >
              <X className="size-4" />
            </button>
          </div>
        </div>

        <div className="p-5 overflow-y-auto space-y-5 flex-1">
          <div className="p-4 rounded-xl border border-border/80 bg-background/60 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3.5 min-w-0">
              {clientUser.avatar ? (
                <img
                  src={clientUser.avatar}
                  alt={clientUser.name}
                  referrerPolicy="no-referrer"
                  className="size-14 rounded-full object-cover border-2 border-border shrink-0 shadow-xs"
                />
              ) : (
                <div className="size-14 rounded-full bg-neutral-100 dark:bg-neutral-800 text-neutral-800 dark:text-neutral-200 font-serif font-bold text-lg border-2 border-neutral-200 dark:border-neutral-700 flex items-center justify-center shrink-0">
                  {(clientUser.name || clientUser.email || 'U').charAt(0).toUpperCase()}
                </div>
              )}
              <div className="min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <h3 className="font-serif text-lg font-bold text-foreground truncate">
                    {clientUser.name}
                  </h3>
                  {isSelf && (
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-muted text-muted-foreground font-medium">
                      You
                    </span>
                  )}
                </div>
                <p className="text-xs text-muted-foreground font-mono truncate flex items-center gap-1.5 mt-0.5">
                  <Mail className="size-3" />
                  <span>{clientUser.email}</span>
                </p>
                <div className="flex items-center gap-2 mt-2 flex-wrap">
                  <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold tracking-wider uppercase font-mono ${
                    isAdmin
                      ? 'bg-purple-500/10 text-purple-700 dark:text-purple-300 border border-purple-500/25'
                      : 'bg-muted text-muted-foreground border border-border'
                  }`}>
                    {isAdmin ? <ShieldCheck className="size-3" /> : <Shield className="size-3" />}
                    {isAdmin ? 'Administrator' : 'Customer'}
                  </span>
                  <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold tracking-wider uppercase font-mono ${
                    isActive
                      ? 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border border-emerald-500/25'
                      : 'bg-rose-500/10 text-rose-700 dark:text-rose-300 border border-rose-500/25'
                  }`}>
                    {isActive ? <CheckCircle2 className="size-3" /> : <AlertCircle className="size-3" />}
                    {isActive ? 'Active' : 'Deactivated'}
                  </span>
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium bg-muted/60 text-muted-foreground border border-border">
                    {isGoogle ? <GoogleIcon className="size-2.5" /> : <Key className="size-2.5" />}
                    {isGoogle ? 'Google OAuth' : 'Password'}
                  </span>
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={copyUserId}
              className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border border-border bg-muted/40 hover:bg-muted text-muted-foreground hover:text-foreground text-[11px] font-mono transition-colors cursor-pointer self-start sm:self-auto shrink-0"
              title="Copy Client ID"
            >
              {copied ? <Check className="size-3 text-emerald-600" /> : <Copy className="size-3" />}
              <span>{copied ? 'ID Copied' : 'Copy ID'}</span>
            </button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
            <div className="p-3 rounded-xl border border-border bg-card/80 text-center">
              <span className="text-xl font-bold font-mono text-foreground block">
                {stats.inquiriesCount}
              </span>
              <span className="text-[11px] text-muted-foreground flex items-center justify-center gap-1 mt-0.5">
                <MessageSquare className="size-3 text-neutral-500" />
                Inquiries
              </span>
            </div>
            <div className="p-3 rounded-xl border border-border bg-card/80 text-center">
              <span className="text-xl font-bold font-mono text-emerald-600 dark:text-emerald-400 block">
                {stats.repliedCount}
              </span>
              <span className="text-[11px] text-muted-foreground flex items-center justify-center gap-1 mt-0.5">
                <CheckCircle2 className="size-3 text-emerald-500" />
                Replied
              </span>
            </div>
            <div className="p-3 rounded-xl border border-border bg-card/80 text-center">
              <span className="text-xl font-bold font-mono text-rose-600 dark:text-rose-400 block">
                {stats.wishlistCount}
              </span>
              <span className="text-[11px] text-muted-foreground flex items-center justify-center gap-1 mt-0.5">
                <Heart className="size-3 text-rose-500" />
                Vault Saved
              </span>
            </div>
            <div className="p-3 rounded-xl border border-border bg-card/80 text-center">
              <span className="text-xs font-semibold font-mono text-foreground block truncate">
                {formatDate(clientUser.createdAt)}
              </span>
              <span className="text-[11px] text-muted-foreground flex items-center justify-center gap-1 mt-0.5">
                <Calendar className="size-3 text-blue-500" />
                Member Since
              </span>
            </div>
          </div>

          <div>
            <div className="flex items-center gap-2 border-b border-border pb-2 mb-3">
              <button
                type="button"
                onClick={() => setActiveTab('inquiries')}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer flex items-center gap-1.5 ${
                  activeTab === 'inquiries'
                    ? 'bg-foreground text-background shadow-xs'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                <MessageSquare className="size-3.5" />
                <span>Bespoke Inquiries ({inquiries.length})</span>
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('security')}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer flex items-center gap-1.5 ${
                  activeTab === 'security'
                    ? 'bg-foreground text-background shadow-xs'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                <Shield className="size-3.5" />
                <span>Security & Sessions</span>
              </button>
            </div>

            {loading ? (
              <div className="py-12 flex items-center justify-center border border-dashed border-border rounded-xl">
                <LumaSpin variant="amber" size={24} />
              </div>
            ) : activeTab === 'inquiries' ? (
              <div className="space-y-3">
                {inquiries.length === 0 ? (
                  <div className="py-10 text-center border border-dashed border-border rounded-xl bg-muted/10">
                    <Gem className="size-7 mx-auto text-muted-foreground/60 mb-2" />
                    <p className="text-xs font-semibold text-foreground">No Bespoke Inquiries Yet</p>
                    <p className="text-[11px] text-muted-foreground mt-0.5">
                      This client has not submitted custom requests through the inquiry forms.
                    </p>
                  </div>
                ) : (
                  inquiries.map((inq) => (
                    <div
                      key={inq._id}
                      className="p-3.5 rounded-xl border border-border bg-card hover:border-foreground/30 transition-colors space-y-2.5"
                    >
                      <div className="flex items-start justify-between gap-2 flex-wrap">
                        <div>
                          <span className="text-xs font-semibold text-foreground">
                            {inq.subject || 'Atelier Inquiry'}
                          </span>
                          <div className="flex items-center gap-2 text-[11px] text-muted-foreground mt-0.5">
                            <span>{inq.jewelryType}</span>
                            <span>•</span>
                            <span>{inq.preferredMetal}</span>
                            <span>•</span>
                            <span className="font-mono text-foreground font-medium">{inq.estimatedBudget}</span>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-medium font-mono uppercase ${
                            inq.status === 'Replied'
                              ? 'bg-emerald-500/10 text-emerald-600 border border-emerald-500/20'
                              : inq.status === 'Contacted'
                              ? 'bg-blue-500/10 text-blue-600 border border-blue-500/20'
                              : 'bg-neutral-100 text-neutral-800 border border-neutral-200 dark:bg-neutral-800 dark:text-neutral-200 dark:border-neutral-700'
                          }`}>
                            {inq.status}
                          </span>
                          <span className="text-[10px] text-muted-foreground font-mono">
                            {formatDate(inq.createdAt)}
                          </span>
                        </div>
                      </div>

                      <div className="p-2.5 rounded-lg bg-muted/40 text-xs text-muted-foreground leading-relaxed">
                        "{inq.message}"
                      </div>

                      {inq.replies && inq.replies.length > 0 && (
                        <div className="pl-3 border-l-2 border-emerald-500/50 space-y-1 pt-1">
                          <span className="text-[10px] font-mono text-emerald-600 dark:text-emerald-400 font-semibold uppercase tracking-wider block">
                            Atelier Reply ({inq.replies.length})
                          </span>
                          <p className="text-xs text-foreground/90">
                            {inq.replies[inq.replies.length - 1].message}
                          </p>
                        </div>
                      )}
                    </div>
                  ))
                )}
              </div>
            ) : (
              <div className="space-y-3">
                <div className="p-4 rounded-xl border border-border bg-card space-y-3 text-xs">
                  <div className="flex items-center justify-between py-1.5 border-b border-border/60">
                    <span className="text-muted-foreground flex items-center gap-2">
                      <User className="size-3.5" />
                      Client Internal ID
                    </span>
                    <span className="font-mono text-[11px] text-foreground">{clientUser._id}</span>
                  </div>
                  <div className="flex items-center justify-between py-1.5 border-b border-border/60">
                    <span className="text-muted-foreground flex items-center gap-2">
                      <Key className="size-3.5" />
                      Authentication Method
                    </span>
                    <span className="font-medium text-foreground capitalize">
                      {clientUser.authProvider === 'google' ? 'Google OAuth 2.0' : 'Email & Password'}
                    </span>
                  </div>
                  <div className="flex items-center justify-between py-1.5 border-b border-border/60">
                    <span className="text-muted-foreground flex items-center gap-2">
                      <Calendar className="size-3.5" />
                      Account Registered On
                    </span>
                    <span className="font-mono text-foreground">{formatDateTime(clientUser.createdAt)}</span>
                  </div>
                  <div className="flex items-center justify-between py-1.5 border-b border-border/60">
                    <span className="text-muted-foreground flex items-center gap-2">
                      <Clock className="size-3.5" />
                      Last Active / Login
                    </span>
                    <span className="font-mono text-foreground">{formatDateTime(clientUser.lastLoginAt || clientUser.updatedAt)}</span>
                  </div>
                  <div className="flex items-center justify-between py-1.5">
                    <span className="text-muted-foreground flex items-center gap-2">
                      <CheckCircle2 className="size-3.5" />
                      Portal Sign-In Status
                    </span>
                    <span className={`font-semibold ${isActive ? 'text-emerald-600' : 'text-rose-600'}`}>
                      {isActive ? 'Authorized (Active)' : 'Suspended (Deactivated)'}
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="px-5 py-3 border-t border-border bg-muted/20 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 shrink-0">
          <button
            type="button"
            onClick={onClose}
            className="px-3.5 py-1.5 rounded-lg border border-border bg-background hover:bg-muted text-xs font-medium text-foreground transition-colors cursor-pointer text-center"
          >
            Back to Directory
          </button>

          <div className="flex items-center gap-2 justify-end">
            {!isSelf && onToggleRole && (
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onToggleRole(clientUser);
                }}
                className="px-3 py-1.5 rounded-lg border border-purple-500/30 bg-purple-500/10 hover:bg-purple-500/20 text-purple-700 dark:text-purple-300 text-xs font-medium transition-colors cursor-pointer flex items-center gap-1.5"
              >
                <Shield className="size-3.5" />
                <span>{isAdmin ? 'Demote to Customer' : 'Make Administrator'}</span>
              </button>
            )}

            {!isSelf && onToggleStatus && (
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onToggleStatus(clientUser);
                }}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer flex items-center gap-1.5 text-white ${
                  isActive
                    ? 'bg-amber-600 hover:bg-amber-700'
                    : 'bg-emerald-600 hover:bg-emerald-700'
                }`}
              >
                {isActive ? <UserX className="size-3.5" /> : <UserCheck className="size-3.5" />}
                <span>{isActive ? 'Deactivate Account' : 'Activate Account'}</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
