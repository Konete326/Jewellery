import React, { useState, useEffect } from 'react';
import { Search, RefreshCw, Filter, Users as UsersIcon } from 'lucide-react';
import { usersApi } from '@/api/users.api.js';
import { getAuthUser } from '@/lib/auth.js';
import { UsersMetrics } from './UsersMetrics';
import { UsersTable } from './UsersTable';
import { ConfirmDeleteModal } from './ConfirmDeleteModal';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

export function UsersAdminView() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [providerFilter, setProviderFilter] = useState('All');
  const [roleFilter, setRoleFilter] = useState('All');
  const [deletingUser, setDeletingUser] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

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

  const handleRoleToggle = async (targetUser) => {
    const nextRole = targetUser.role === 'admin' ? 'customer' : 'admin';
    try {
      await usersApi.updateRole(targetUser._id, nextRole);
      toast.success(`Role updated for ${targetUser.name}`, {
        description: `Now assigned as ${nextRole}`
      });
      loadUsers();
    } catch (err) {
      toast.error('Failed to update role', {
        description: err.message || 'Unable to modify privileges'
      });
    }
  };

  const handleDeleteConfirm = async () => {
    if (!deletingUser?._id) return;
    try {
      setDeleteLoading(true);
      await usersApi.delete(deletingUser._id);
      toast.success('User account removed', {
        description: `${deletingUser.name} has been deleted.`
      });
      setDeletingUser(null);
      loadUsers();
    } catch (err) {
      toast.error('Failed to delete account', {
        description: err.message || 'Could not complete deletion'
      });
    } finally {
      setDeleteLoading(false);
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

    return matchesSearch && matchesProvider && matchesRole;
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
            Monitor registered buyers, VIP collectors, and authentication channels
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
            className="w-full pl-9 pr-4 py-2 text-xs rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500/40 text-foreground"
          />
        </div>

        <div className="flex items-center gap-2 overflow-x-auto pb-1 md:pb-0">
          <div className="flex items-center gap-1.5 p-1 rounded-lg border border-border bg-muted/30 text-xs">
            <Filter className="size-3.5 text-muted-foreground ml-1.5" />
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

          <div className="flex items-center gap-1.5 p-1 rounded-lg border border-border bg-muted/30 text-xs">
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
        </div>
      </div>

      <UsersTable
        users={filteredUsers}
        onRoleToggle={handleRoleToggle}
        onDelete={(u) => setDeletingUser(u)}
        currentAdminEmail={currentUser?.email}
      />

      <ConfirmDeleteModal
        isOpen={Boolean(deletingUser)}
        onClose={() => setDeletingUser(null)}
        onConfirm={handleDeleteConfirm}
        title={deletingUser ? `${deletingUser.name} (${deletingUser.email})` : ''}
        itemType="user account"
        loading={deleteLoading}
      />
    </div>
  );
}
