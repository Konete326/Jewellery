import React from 'react';
import { X, UserX, UserCheck } from 'lucide-react';
import { LumaSpin } from '@/components/ui/luma-spin';

export function ConfirmStatusModal({ isOpen, onClose, onConfirm, user, loading }) {
  if (!isOpen || !user) return null;

  const isCurrentlyActive = user.isActive !== false;
  const targetAction = isCurrentlyActive ? 'Deactivate' : 'Activate';

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
          className="absolute top-4 right-4 text-muted-foreground hover:text-foreground cursor-pointer focus-visible:ring-2 focus-visible:ring-amber-500/50 focus-visible:outline-none rounded-md"
        >
          <X className="size-4" />
        </button>

        <div className="flex items-center gap-3 mb-4">
          <div className={`size-11 rounded-full flex items-center justify-center shrink-0 border ${
            isCurrentlyActive
              ? 'bg-amber-500/10 text-amber-600 border-amber-500/20'
              : 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20'
          }`}>
            {isCurrentlyActive ? <UserX className="size-5" /> : <UserCheck className="size-5" />}
          </div>
          <div>
            <h3 className="font-serif text-lg font-semibold text-foreground">
              {targetAction} Client Account
            </h3>
            <p className="text-xs text-muted-foreground">
              {isCurrentlyActive ? 'Suspend client portal access' : 'Restore client portal access'}
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
            <div className="size-9 rounded-full bg-amber-500/15 text-amber-700 dark:text-amber-400 font-semibold flex items-center justify-center text-xs shrink-0">
              {(user.name || user.email || 'U').charAt(0).toUpperCase()}
            </div>
          )}
          <div className="min-w-0">
            <p className="text-xs font-semibold text-foreground truncate">{user.name}</p>
            <p className="text-[11px] text-muted-foreground truncate font-mono">{user.email}</p>
          </div>
        </div>

        <p className="text-xs text-muted-foreground mb-6 leading-relaxed">
          {isCurrentlyActive ? (
            <>
              Are you sure you want to deactivate <strong className="text-foreground">{user.name}</strong>?
              The client will not be able to log in to their account, but their saved heirlooms and past inquiry records will remain safely preserved.
            </>
          ) : (
            <>
              Activate <strong className="text-foreground">{user.name}</strong>'s account?
              The client will immediately regain sign-in privileges and access to their personal collection vault.
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
              isCurrentlyActive
                ? 'bg-amber-600 hover:bg-amber-700'
                : 'bg-emerald-600 hover:bg-emerald-700'
            }`}
          >
            {loading && <LumaSpin variant="white" size={14} />}
            <span>{isCurrentlyActive ? 'Deactivate Account' : 'Activate Account'}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
