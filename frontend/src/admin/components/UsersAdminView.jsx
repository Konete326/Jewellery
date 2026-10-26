import React, { useState, useEffect } from 'react';
import { Search, RefreshCw, Filter, Users as UsersIcon } from 'lucide-react';
import { usersApi } from '@/api/users.api.js';
import { getAuthUser } from '@/lib/auth.js';
import { UsersMetrics } from './UsersMetrics';
import { UsersTable } from './UsersTable';
import { ConfirmStatusModal } from './ConfirmStatusModal';
import { ConfirmRoleModal } from './ConfirmRoleModal';
import { UserActivityModal } from './UserActivityModal';
import { Button } from '@/components/ui/button';
import { LumaSpin } from '@/components/ui/luma-spin';
import { toast } from 'sonner';

export function UsersAdminView() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [providerFilter, setProviderFilter] = useState('All');
  const [roleFilter, setRoleFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');

  const [activityUser, setActivityUser] = useState(null);
  const [statusTargetUser, setStatusTargetUser] = useState(null);
  const [statusLoading, setStatusLoading] = useState(false);
  const [roleTargetUser, setRoleTargetUser] = useState(null);
  const [roleLoading, setRoleLoading] = useState(false);

  const currentUser = getAuthUser();

  const loadUsers = async () => {
    try {
      setLoading(true);
      const res = await usersApi.getAll();
      if (res?.data && Array.isArray(res.data)) {
        setUsers(res.data);
      } else if (Array.isArray(res)) {
        setUsers(res);
      }
    } catch (err) {
      toast.error('Failed to load clientele directory', {
        description: err.message || 'Please check backend server connection.'
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const handleStatusToggleConfirm = async () => {
    if (!statusTargetUser?._id) return;
    const nextStatus = statusTargetUser.isActive === false;
    try {
      setStatusLoading(true);
      await usersApi.updateStatus(statusTargetUser._id, nextStatus);
      toast.success(`Account ${nextStatus ? 'activated' : 'deactivated'}`, {
        description: `${statusTargetUser.name}'s sign-in access is now ${nextStatus ? 'enabled' : 'suspended'}.`
      });
      setStatusTargetUser(null);
      loadUsers();
    } catch (err) {
      toast.error('Failed to update account status', {
        description: err.message || 'Unable to modify status'
      });
    } finally {
      setStatusLoading(false);
    }
  };

  const handleRoleChangeConfirm = async () => {
    if (!roleTargetUser?._id) return;
    const nextRole = roleTargetUser.role === 'admin' ? 'customer' : 'admin';
    try {
      setRoleLoading(true);
      await usersApi.updateRole(roleTargetUser._id, nextRole);
      toast.success(`Role updated for ${roleTargetUser.name}`, {
        description: `Privileges changed to ${nextRole === 'admin' ? 'Administrator' : 'Customer'}`
      });
      setRoleTargetUser(null);
      loadUsers();
    } catch (err) {
      toast.error('Failed to change role', {
        description: err.message || 'Unable to modify privileges'
      });
    } finally {
      setRoleLoading(false);
    }
  };

  const filteredUsers = users.filter((u) => {
    const q = searchQuery.toLowerCase().trim();
    const matchesSearch =
      !q ||
      u.name?.toLowerCase().includes(q) ||
      u.email?.toLowerCase().includes(q);

    const matchesProvider =
      providerFilter === 'All' || u.authProvider === providerFilter;

    const matchesRole =
      roleFilter === 'All' || u.role === roleFilter;

    const matchesStatus =
      statusFilter === 'All' ||
      (statusFilter === 'active' && u.isActive !== false) ||
      (statusFilter === 'deactivated' && u.isActive === false);

    return matchesSearch && matchesProvider && matchesRole && matchesStatus;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="p-1.5 rounded-lg bg-amber-500/10 text-amber-600 border border-amber-500/20">
              <UsersIcon className="size-4" />
            </span>
            <h2 className="font-serif text-2xl font-bold tracking-tight text-foreground">
              Clientele Directory
            </h2>
          </div>
          <p className="text-xs text-muted-foreground">
            Manage collector access, administrative privileges, and dossier activity records
          </p>
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={loadUsers}
          disabled={loading}
          className="self-start sm:self-auto cursor-pointer"
        >
          <RefreshCw className={`size-3.5 mr-2 ${loading ? 'animate-spin' : ''}`} />
          Refresh Directory
        </Button>
      </div>

      <UsersMetrics users={users} />

      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-2.5 size-4 text-muted-foreground" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by client name or email..."
            className="w-full pl-9 pr-4 py-2 text-xs rounded-lg border border-border bg-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500/20 focus-visible:border-amber-500/40 text-foreground"
          />
        </div>

        <div className="flex items-center gap-2 overflow-x-auto pb-1 md:pb-0 flex-wrap">
          <div className="flex items-center gap-1 p-1 rounded-lg border border-border bg-muted/30 text-xs">
            <Filter className="size-3.5 text-muted-foreground ml-1.5 mr-0.5" />
            <button
              onClick={() => setProviderFilter('All')}
              className={`px-2.5 py-1 rounded-md text-xs font-medium transition-colors cursor-pointer ${
                providerFilter === 'All'
                  ? 'bg-background shadow-xs text-foreground'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              All
            </button>
            <button
              onClick={() => setProviderFilter('google')}
              className={`px-2.5 py-1 rounded-md text-xs font-medium transition-colors cursor-pointer ${
                providerFilter === 'google'
                  ? 'bg-background shadow-xs text-foreground'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              Google
            </button>
            <button
              onClick={() => setProviderFilter('local')}
              className={`px-2.5 py-1 rounded-md text-xs font-medium transition-colors cursor-pointer ${
                providerFilter === 'local'
                  ? 'bg-background shadow-xs text-foreground'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              Email/Pass
            </button>
          </div>

          <div className="flex items-center gap-1 p-1 rounded-lg border border-border bg-muted/30 text-xs">
            <button
              onClick={() => setRoleFilter('All')}
              className={`px-2.5 py-1 rounded-md text-xs font-medium transition-colors cursor-pointer ${
                roleFilter === 'All'
                  ? 'bg-background shadow-xs text-foreground'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              All Roles
            </button>
            <button
              onClick={() => setRoleFilter('customer')}
              className={`px-2.5 py-1 rounded-md text-xs font-medium transition-colors cursor-pointer ${
                roleFilter === 'customer'
                  ? 'bg-background shadow-xs text-foreground'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              Customers
            </button>
            <button
              onClick={() => setRoleFilter('admin')}
              className={`px-2.5 py-1 rounded-md text-xs font-medium transition-colors cursor-pointer ${
                roleFilter === 'admin'
                  ? 'bg-background shadow-xs text-foreground'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              Admins
            </button>
          </div>

          <div className="flex items-center gap-1 p-1 rounded-lg border border-border bg-muted/30 text-xs">
            <button
              onClick={() => setStatusFilter('All')}
              className={`px-2.5 py-1 rounded-md text-xs font-medium transition-colors cursor-pointer ${
                statusFilter === 'All'
                  ? 'bg-background shadow-xs text-foreground'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              All Status
            </button>
            <button
              onClick={() => setStatusFilter('active')}
              className={`px-2.5 py-1 rounded-md text-xs font-medium transition-colors cursor-pointer ${
                statusFilter === 'active'
                  ? 'bg-background shadow-xs text-foreground'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              Active
            </button>
            <button
              onClick={() => setStatusFilter('deactivated')}
              className={`px-2.5 py-1 rounded-md text-xs font-medium transition-colors cursor-pointer ${
                statusFilter === 'deactivated'
                  ? 'bg-background shadow-xs text-foreground'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              Deactivated
            </button>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="py-20 flex items-center justify-center border border-dashed border-border rounded-xl bg-card/40">
          <LumaSpin variant="amber" size={28} />
        </div>
      ) : (
        <UsersTable
          users={filteredUsers}
          onViewActivities={(u) => setActivityUser(u)}
          onRoleChange={(u) => setRoleTargetUser(u)}
          onStatusToggle={(u) => setStatusTargetUser(u)}
          currentAdminEmail={currentUser?.email}
        />
      )}

      <UserActivityModal
        isOpen={Boolean(activityUser)}
        onClose={() => setActivityUser(null)}
        user={activityUser}
        onToggleStatus={(u) => setStatusTargetUser(u)}
        onToggleRole={(u) => setRoleTargetUser(u)}
        isSelf={activityUser?.email?.toLowerCase() === currentUser?.email?.toLowerCase()}
      />

      <ConfirmStatusModal
        isOpen={Boolean(statusTargetUser)}
        onClose={() => setStatusTargetUser(null)}
        onConfirm={handleStatusToggleConfirm}
        user={statusTargetUser}
        loading={statusLoading}
      />

      <ConfirmRoleModal
        isOpen={Boolean(roleTargetUser)}
        onClose={() => setRoleTargetUser(null)}
        onConfirm={handleRoleChangeConfirm}
        user={roleTargetUser}
        loading={roleLoading}
      />
    </div>
  );
}
