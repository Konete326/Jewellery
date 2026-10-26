import React from 'react';
import { X, ShieldCheck, ShieldAlert } from 'lucide-react';
import { LumaSpin } from '@/components/ui/luma-spin';

export function ConfirmRoleModal({ isOpen, onClose, onConfirm, user, loading }) {
  if (!isOpen || !user) return null;

  const isCurrentAdmin = user.role === 'admin';
  const targetRole = isCurrentAdmin ? 'customer' : 'admin';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <button
        type="button"
        aria-label="Close dialog overlay"
        onClick={onClose}
        className="absolute inset-0 bg-black/60 backdrop-blur-xs cursor-default w-full h-full border-0 p-0 focus-visible:outline-none"
        tabIndex={-1}
      />
      <div className="relative w-full max-w-md rounded-2xl border border-border bg-card p-6 shadow-2xl animate-in fade-in zoom-in-95 duration-150">
        <button
          type="button"
          aria-label="Close"
          onClick={onClose}
          disabled={loading}
          className="absolute top-4 right-4 text-muted-foreground hover:text-foreground cursor-pointer focus-visible:ring-2 focus-visible:ring-foreground/20 focus-visible:outline-none rounded-md"
        >
          <X className="size-4" />
        </button>

        <div className="flex items-center gap-3 mb-4">
          <div className={`size-11 rounded-full flex items-center justify-center shrink-0 border ${
            isCurrentAdmin
              ? 'bg-neutral-100 text-neutral-800 border-neutral-200 dark:bg-neutral-800 dark:text-neutral-200 dark:border-neutral-700'
              : 'bg-purple-500/10 text-purple-600 border-purple-500/20'
          }`}>
            {isCurrentAdmin ? <ShieldAlert className="size-5" /> : <ShieldCheck className="size-5" />}
          </div>
          <div>
            <h3 className="font-serif text-lg font-semibold text-foreground">
              {isCurrentAdmin ? 'Revoke Administrator Access' : 'Promote to Administrator'}
            </h3>
            <p className="text-xs text-muted-foreground">
              Change privileges for {user.name}
            </p>
          </div>
        </div>

        <div className="p-3 rounded-xl bg-muted/30 border border-border/70 mb-4 flex items-center gap-3">
          {user.avatar ? (
            <img
              src={user.avatar}
              alt={user.name}
              referrerPolicy="no-referrer"
              className="size-9 rounded-full object-cover shrink-0 border border-border"
            />
          ) : (
            <div className="size-9 rounded-full bg-neutral-100 dark:bg-neutral-800 text-neutral-800 dark:text-neutral-200 border border-neutral-200 dark:border-neutral-700 font-semibold flex items-center justify-center text-xs shrink-0">
              {(user.name || user.email || 'U').charAt(0).toUpperCase()}
            </div>
          )}
          <div className="min-w-0 flex-1">
            <p className="text-xs font-semibold text-foreground truncate">{user.name}</p>
            <p className="text-[11px] text-muted-foreground truncate font-mono">{user.email}</p>
          </div>
          <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded-full border border-border bg-background">
            {user.role} → {targetRole}
          </span>
        </div>

        <p className="text-xs text-muted-foreground mb-6 leading-relaxed">
          {isCurrentAdmin ? (
            <>
              Are you sure you want to demote <strong className="text-foreground">{user.name}</strong> to a regular customer? They will immediately lose access to the administrative dashboard, customer inquiries, and gallery management.
            </>
          ) : (
            <>
              Are you sure you want to promote <strong className="text-foreground">{user.name}</strong> to an Administrator? They will be granted full access to view inquiries, reply to clients, and manage catalog pieces.
            </>
          )}
        </p>

        <div className="flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            disabled={loading}
            className="px-4 py-2 text-xs font-medium rounded-lg border border-border bg-background hover:bg-muted text-foreground transition-colors cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={loading}
            className={`px-4 py-2 text-xs font-medium rounded-lg text-white transition-colors cursor-pointer flex items-center gap-2 disabled:opacity-50 ${
              isCurrentAdmin
                ? 'bg-amber-600 hover:bg-amber-700'
                : 'bg-purple-600 hover:bg-purple-700'
            }`}
          >
            {loading && <LumaSpin variant="white" size={14} />}
            <span>{isCurrentAdmin ? 'Demote to Customer' : 'Confirm Admin Access'}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
