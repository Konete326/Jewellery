import React from 'react';
import { Key, Shield, ShieldCheck, ShieldAlert, User, Eye, UserX, UserCheck } from 'lucide-react';
import { GoogleIcon } from '@/components/google-icon';

export function UsersTable({
  users = [],
  onViewActivities,
  onRoleChange,
  onStatusToggle,
  currentAdminEmail
}) {
  const formatDate = (dateString) => {
    if (!dateString) return '—';
    try {
      const d = new Date(dateString);
      return d.toLocaleDateString('en-GB', {
        day: '2-digit',
        month: 'short',
        year: 'numeric'
      });
    } catch {
      return '—';
    }
  };

  const formatTimeAgo = (dateString) => {
    if (!dateString) return 'Never';
    try {
      const d = new Date(dateString);
      const diffMs = Date.now() - d.getTime();
      const diffMins = Math.floor(diffMs / 60000);
      if (diffMins < 1) return 'Just now';
      if (diffMins < 60) return `${diffMins}m ago`;
      const diffHours = Math.floor(diffMins / 60);
      if (diffHours < 24) return `${diffHours}h ago`;
      const diffDays = Math.floor(diffHours / 24);
      if (diffDays < 7) return `${diffDays}d ago`;
      return formatDate(dateString);
    } catch {
      return '—';
    }
  };

  const getInitials = (name = 'User') => {
    return name
      .split(' ')
      .filter(Boolean)
      .slice(0, 2)
      .map((part) => part[0]?.toUpperCase())
      .join('') || 'U';
  };

  if (!users.length) {
    return (
      <div className="py-16 text-center border border-dashed border-border rounded-xl bg-card/40">
        <User className="size-10 mx-auto text-muted-foreground/60 mb-3" />
        <h4 className="font-serif text-base font-semibold text-foreground">No Users Found</h4>
        <p className="text-xs text-muted-foreground max-w-sm mx-auto mt-1">
          No registered clientele or collectors match the selected criteria.
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-xl border border-border bg-card shadow-xs">
      <table className="w-full text-left border-collapse text-xs">
        <thead>
          <tr className="border-b border-border/80 bg-muted/30 text-muted-foreground uppercase text-[10px] tracking-wider font-medium">
            <th className="py-3 px-4">Client / Collector</th>
            <th className="py-3 px-4">Auth Method</th>
            <th className="py-3 px-4">Atelier Role</th>
            <th className="py-3 px-4">Account Status</th>
            <th className="py-3 px-4">Joined Date</th>
            <th className="py-3 px-4">Last Activity</th>
            <th className="py-3 px-4 text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-border/60">
          {users.map((user) => {
            const isGoogle = user.authProvider === 'google';
            const isAdmin = user.role === 'admin';
            const isActive = user.isActive !== false;
            const isSelf = user.email?.toLowerCase() === currentAdminEmail?.toLowerCase();

            return (
              <tr
                key={user._id}
                className="hover:bg-muted/40 transition-colors group"
              >
                <td className="py-3 px-4">
                  <div className="flex items-center gap-3">
                    {user.avatar ? (
                      <img
                        src={user.avatar}
                        alt={user.name}
                        referrerPolicy="no-referrer"
                        className="size-8 rounded-full object-cover border border-border/80 shrink-0"
                      />
                    ) : (
                      <div className="size-8 rounded-full bg-neutral-100 dark:bg-neutral-800 text-neutral-800 dark:text-neutral-200 border border-neutral-200 dark:border-neutral-700 flex items-center justify-center font-semibold text-xs shrink-0">
                        {getInitials(user.name)}
                      </div>
                    )}
                    <div className="min-w-0">
                      <p className="font-medium text-foreground truncate max-w-[180px] sm:max-w-xs">
                        {user.name}
                        {isSelf && (
                          <span className="ml-1.5 text-[9px] px-1.5 py-0.5 rounded bg-muted text-muted-foreground">
                            You
                          </span>
                        )}
                      </p>
                      <p className="text-[11px] text-muted-foreground truncate max-w-[180px] sm:max-w-xs font-mono">
                        {user.email}
                      </p>
                    </div>
                  </div>
                </td>

                <td className="py-3 px-4">
                  {isGoogle ? (
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-medium bg-blue-500/10 text-blue-700 dark:text-blue-300 border border-blue-500/20">
                      <GoogleIcon className="size-3.5 shrink-0" />
                      Google Auth
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-medium bg-neutral-500/10 text-neutral-700 dark:text-neutral-300 border border-neutral-500/20">
                      <Key className="size-3 shrink-0" />
                      Email & Password
                    </span>
                  )}
                </td>

                <td className="py-3 px-4">
                  <span
                    className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-medium border ${
                      isAdmin
                        ? 'bg-purple-500/10 text-purple-700 dark:text-purple-300 border-purple-500/25'
                        : 'bg-muted text-muted-foreground border-border'
                    }`}
                  >
                    {isAdmin ? (
                      <ShieldCheck className="size-3 shrink-0" />
                    ) : (
                      <User className="size-3 shrink-0" />
                    )}
                    <span className="capitalize">{user.role}</span>
                  </span>
                </td>

                <td className="py-3 px-4">
                  <span
                    className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-medium border ${
                      isActive
                        ? 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border-emerald-500/25'
                        : 'bg-rose-500/10 text-rose-700 dark:text-rose-300 border-rose-500/25'
                    }`}
                  >
                    <span className={`size-1.5 rounded-full ${isActive ? 'bg-emerald-500' : 'bg-rose-500'}`} />
                    <span>{isActive ? 'Active' : 'Deactivated'}</span>
                  </span>
                </td>

                <td className="py-3 px-4 text-muted-foreground font-mono text-[11px]">
                  {formatDate(user.createdAt)}
                </td>

                <td className="py-3 px-4 text-muted-foreground font-mono text-[11px]">
                  {formatTimeAgo(user.lastLoginAt || user.updatedAt)}
                </td>

                <td className="py-3 px-4 text-right">
                  <div className="flex items-center justify-end gap-1">
                    <button
                      type="button"
                      onClick={() => onViewActivities && onViewActivities(user)}
                      title="View client activity & dossier"
                      className="p-1.5 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted transition-colors cursor-pointer"
                    >
                      <Eye className="size-4" />
                    </button>

                    <button
                      type="button"
                      disabled={isSelf}
                      onClick={() => onRoleChange && onRoleChange(user)}
                      title={isSelf ? 'Cannot modify own privileges' : (isAdmin ? 'Demote to Customer' : 'Promote to Administrator')}
                      className={`p-1.5 rounded-md text-muted-foreground transition-colors ${
                        isSelf
                          ? 'opacity-30 cursor-not-allowed'
                          : 'hover:text-purple-600 hover:bg-purple-500/10 cursor-pointer'
                      }`}
                    >
                      {isAdmin ? <ShieldAlert className="size-4" /> : <ShieldCheck className="size-4" />}
                    </button>

                    <button
                      type="button"
                      disabled={isSelf}
                      onClick={() => onStatusToggle && onStatusToggle(user)}
                      title={isSelf ? 'Cannot deactivate own account' : (isActive ? 'Deactivate Account' : 'Activate Account')}
                      className={`p-1.5 rounded-md transition-colors ${
                        isSelf
                          ? 'opacity-30 cursor-not-allowed text-muted-foreground'
                          : isActive
                          ? 'text-muted-foreground hover:text-foreground hover:bg-muted cursor-pointer'
                          : 'text-rose-600 hover:text-emerald-600 hover:bg-emerald-500/10 cursor-pointer'
                      }`}
                    >
                      {isActive ? <UserX className="size-4" /> : <UserCheck className="size-4" />}
                    </button>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
