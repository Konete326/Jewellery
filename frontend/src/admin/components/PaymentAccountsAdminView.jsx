import React, { useState, useEffect, useMemo } from 'react';
import {
  Landmark,
  Plus,
  Search,
  RefreshCw,
  Wallet,
  Zap,
  Building2
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import {
  fetchPaymentAccounts,
  createPaymentAccount,
  updatePaymentAccount,
  deletePaymentAccount
} from '@/api/paymentAccountsApi';
import { PaymentAccountCard } from './PaymentAccountCard';
import { PaymentAccountModal } from './PaymentAccountModal';
import { ConfirmDeleteModal } from './ConfirmDeleteModal';
import { ConfirmAccountStatusModal } from './ConfirmAccountStatusModal';
import { LumaSpin } from '@/components/ui/luma-spin';

export function PaymentAccountsAdminView() {
  const [accounts, setAccounts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingAccount, setEditingAccount] = useState(null);
  const [modalLoading, setModalLoading] = useState(false);

  const [deletingAccount, setDeletingAccount] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [actionLoadingId, setActionLoadingId] = useState(null);

  const [statusConfirmAccount, setStatusConfirmAccount] = useState(null);
  const [statusActionLoading, setStatusActionLoading] = useState(false);

  const loadAccounts = async (silent = false) => {
    if (!silent) setLoading(true);
    try {
      const res = await fetchPaymentAccounts();
      if (res && res.data) {
        setAccounts(res.data);
      }
    } catch (err) {
      toast.error('Failed to load accounts', {
        description: err.message
      });
    } finally {
      if (!silent) setLoading(false);
    }
  };

  useEffect(() => {
    loadAccounts();
  }, []);

  const handleOpenAdd = () => {
    setEditingAccount(null);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (account) => {
    setEditingAccount(account);
    setIsModalOpen(true);
  };

  const handleSaveAccount = async (formData) => {
    setModalLoading(true);
    try {
      if (editingAccount) {
        await updatePaymentAccount(editingAccount._id, formData);
        toast.success(`${formData.bankName} updated`);
      } else {
        await createPaymentAccount(formData);
        toast.success(`${formData.bankName} added`);
      }
      setIsModalOpen(false);
      setEditingAccount(null);
      await loadAccounts(true);
    } catch (err) {
      toast.error(editingAccount ? 'Failed to update account' : 'Failed to create account', {
        description: err.message
      });
    } finally {
      setModalLoading(false);
    }
  };

  const handleSetDefault = async (account) => {
    setActionLoadingId(account._id);
    try {
      await updatePaymentAccount(account._id, { ...account, isDefault: true });
      toast.success(`${account.bankName} set as primary`);
      await loadAccounts(true);
    } catch (err) {
      toast.error('Failed to update primary account', {
        description: err.message
      });
    } finally {
      setActionLoadingId(null);
    }
  };

  const handleToggleStatus = async (account) => {
    setActionLoadingId(account._id);
    const newStatus = !account.isActive;

    if (!newStatus && account.isDefault) {
      const otherActive = accounts.filter(
        (a) => a._id !== account._id && a.isActive
      );

      if (otherActive.length === 0) {
        toast.error('Primary Account Protection', {
          description:
            'Cannot deactivate the primary account when no other active accounts exist. Please activate or add another account first.'
        });
        setActionLoadingId(null);
        return;
      }

      const nextPrimary = otherActive[0];
      try {
        await updatePaymentAccount(nextPrimary._id, {
          ...nextPrimary,
          isDefault: true
        });
        await updatePaymentAccount(account._id, {
          ...account,
          isActive: false,
          isDefault: false
        });
        toast.info('Primary Reassigned', {
          description: `${nextPrimary.bankName} is now set as the primary payment account.`
        });
        toast.success(`${account.bankName} deactivated`);
        await loadAccounts(true);
      } catch (err) {
        toast.error('Failed to update account', {
          description: err.message
        });
      } finally {
        setActionLoadingId(null);
      }
      return;
    }

    try {
      await updatePaymentAccount(account._id, { ...account, isActive: newStatus });
      toast.success(`Account ${newStatus ? 'activated' : 'deactivated'}`);
      await loadAccounts(true);
    } catch (err) {
      toast.error('Failed to update status', {
        description: err.message
      });
    } finally {
      setActionLoadingId(null);
    }
  };

  const handleConfirmStatusChange = async () => {
    if (!statusConfirmAccount) return;
    setStatusActionLoading(true);
    await handleToggleStatus(statusConfirmAccount);
    setStatusActionLoading(false);
    setStatusConfirmAccount(null);
  };

  const handleDeleteConfirm = async () => {
    if (!deletingAccount) return;
    setDeleteLoading(true);
    try {
      if (deletingAccount.isDefault) {
        const otherActive = accounts.filter(
          (a) => a._id !== deletingAccount._id && a.isActive
        );
        if (otherActive.length > 0) {
          await updatePaymentAccount(otherActive[0]._id, {
            ...otherActive[0],
            isDefault: true
          });
          toast.info('Primary Reassigned', {
            description: `${otherActive[0].bankName} is now set as the primary payment account.`
          });
        }
      }
      await deletePaymentAccount(deletingAccount._id);
      toast.success(`${deletingAccount.bankName} removed`);
      setDeletingAccount(null);
      await loadAccounts(true);
    } catch (err) {
      toast.error('Failed to remove account', {
        description: err.message
      });
    } finally {
      setDeleteLoading(false);
    }
  };

  const handleSeedDefaults = async () => {
    setLoading(true);
    try {
      await createPaymentAccount({
        bankName: 'Meezan Bank',
        accountTitle: 'Khalil & Sons Jewellers',
        accountNumber: '01080105829101',
        iban: 'PK36MEZN0001080105829101',
        accountType: 'Bank Account',
        isDefault: true,
        isInstantSettlement: false,
        isActive: true
      });
      await createPaymentAccount({
        bankName: 'Raast ID',
        accountTitle: 'Khalil & Sons Jewellers',
        accountNumber: '03331234567',
        iban: '',
        accountType: 'Raast ID',
        isDefault: false,
        isInstantSettlement: true,
        isActive: true
      });
      toast.success('Default accounts added');
      await loadAccounts(true);
    } catch (err) {
      toast.error('Failed to add accounts', {
        description: err.message
      });
    } finally {
      setLoading(false);
    }
  };

  const counts = useMemo(() => {
    const total = accounts.length;
    const bankAccounts = accounts.filter(
      (a) => a.accountType !== 'Raast ID' && a.accountType !== 'Digital Wallet'
    ).length;
    const raast = accounts.filter((a) => a.accountType === 'Raast ID').length;
    const wallets = accounts.filter((a) => a.accountType === 'Digital Wallet').length;
    return { total, bankAccounts, raast, wallets };
  }, [accounts]);

  const filteredAccounts = useMemo(() => {
    return accounts.filter((acc) => {
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        acc.bankName?.toLowerCase().includes(q) ||
        acc.accountTitle?.toLowerCase().includes(q) ||
        acc.accountNumber?.toLowerCase().includes(q) ||
        acc.iban?.toLowerCase().includes(q);

      if (!matchesSearch) return false;

      if (categoryFilter === 'Bank Accounts') {
        if (acc.accountType === 'Raast ID' || acc.accountType === 'Digital Wallet') return false;
      } else if (categoryFilter === 'Raast') {
        if (acc.accountType !== 'Raast ID') return false;
      } else if (categoryFilter === 'Wallets') {
        if (acc.accountType !== 'Digital Wallet') return false;
      }

      if (statusFilter === 'Active') return acc.isActive === true;
      if (statusFilter === 'Inactive') return acc.isActive === false;

      return true;
    });
  }, [accounts, searchQuery, categoryFilter, statusFilter]);

  const categoryTabs = [
    { label: 'All', count: counts.total, icon: Landmark },
    { label: 'Bank Accounts', count: counts.bankAccounts, icon: Building2 },
    { label: 'Raast', count: counts.raast, icon: Zap },
    { label: 'Wallets', count: counts.wallets, icon: Wallet }
  ];

  return (
    <div className="w-full space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-border/70">
        <div>
          <h1 className="font-serif text-2xl font-light text-foreground tracking-tight">
            Bank Accounts & Settlement
          </h1>
          <p className="text-xs text-muted-foreground mt-0.5">
            Manage receiving bank accounts, Raast IDs, and digital wallets for online orders
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => loadAccounts()}
            disabled={loading}
            className="h-9 px-3 text-xs cursor-pointer"
          >
            <RefreshCw className={`size-3.5 mr-1.5 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>

          <Button
            type="button"
            size="sm"
            onClick={handleOpenAdd}
            className="h-9 px-4 text-xs bg-foreground text-background hover:bg-neutral-800 cursor-pointer shadow-xs"
          >
            <Plus className="size-3.5 mr-1.5" />
            Add Account
          </Button>
        </div>
      </div>

      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        {categoryTabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = categoryFilter === tab.label;
          return (
            <button
              key={tab.label}
              type="button"
              onClick={() => setCategoryFilter(tab.label)}
              className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-mono transition-colors cursor-pointer shrink-0 border ${
                isActive
                  ? 'bg-foreground text-background border-foreground font-semibold shadow-xs'
                  : 'bg-card border-border/80 text-muted-foreground hover:bg-muted hover:text-foreground'
              }`}
            >
              <Icon className="size-3" />
              <span>{tab.label}</span>
              <span
                className={`text-[10px] px-1.5 py-0.2 rounded-full font-sans ${
                  isActive
                    ? 'bg-background/20 text-background'
                    : 'bg-muted text-muted-foreground'
                }`}
              >
                {tab.count}
              </span>
            </button>
          );
        })}
      </div>

      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search className="size-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search bank name, title, or IBAN..."
            className="w-full bg-background border border-input rounded-xl pl-9 pr-3.5 py-2 text-xs text-foreground placeholder:text-muted-foreground focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-foreground/30 font-mono"
          />
        </div>

        <div className="flex items-center gap-1.5">
          {['All', 'Active', 'Inactive'].map((filter) => (
            <button
              key={filter}
              type="button"
              onClick={() => setStatusFilter(filter)}
              className={`px-3 py-1.5 rounded-xl text-xs font-medium border transition-colors cursor-pointer shrink-0 ${
                statusFilter === filter
                  ? 'bg-foreground text-background border-foreground'
                  : 'bg-background border-border/80 text-muted-foreground hover:bg-muted'
              }`}
            >
              {filter}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="min-h-[200px] flex flex-col items-center justify-center gap-2">
          <LumaSpin size={28} />
          <p className="text-xs text-muted-foreground font-light">Loading accounts...</p>
        </div>
      ) : filteredAccounts.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-border p-8 text-center bg-card/40">
          <Landmark className="size-8 text-muted-foreground mx-auto mb-2 opacity-60" />
          <h3 className="font-serif text-base font-semibold text-foreground mb-1">
            {searchQuery || categoryFilter !== 'All' || statusFilter !== 'All'
              ? 'No Accounts Match Current Filter'
              : 'No Bank Accounts Yet'}
          </h3>
          <p className="text-xs text-muted-foreground max-w-sm mx-auto mb-4 font-light">
            {searchQuery || categoryFilter !== 'All' || statusFilter !== 'All'
              ? 'Try selecting a different filter tab or clearing your search.'
              : 'Add bank details so customers can transfer payments.'}
          </p>
          <div className="flex items-center justify-center gap-2.5">
            <Button
              type="button"
              onClick={handleOpenAdd}
              className="h-8 px-3.5 text-xs bg-foreground text-background hover:bg-neutral-800 cursor-pointer"
            >
              <Plus className="size-3.5 mr-1.5" />
              Add Account
            </Button>
            {accounts.length === 0 && (
              <Button
                type="button"
                variant="outline"
                onClick={handleSeedDefaults}
                className="h-8 px-3.5 text-xs cursor-pointer"
              >
                Add Sample Accounts
              </Button>
            )}
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {filteredAccounts.map((account) => (
            <PaymentAccountCard
              key={account._id}
              account={account}
              onEdit={handleOpenEdit}
              onDelete={(acc) => setDeletingAccount(acc)}
              onSetDefault={handleSetDefault}
              onToggleStatus={(acc) => setStatusConfirmAccount(acc)}
              actionLoading={actionLoadingId === account._id}
            />
          ))}
        </div>
      )}

      <PaymentAccountModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingAccount(null);
        }}
        onSave={handleSaveAccount}
        account={editingAccount}
        existingAccounts={accounts}
        loading={modalLoading}
      />

      <ConfirmDeleteModal
        isOpen={Boolean(deletingAccount)}
        onClose={() => setDeletingAccount(null)}
        onConfirm={handleDeleteConfirm}
        title={deletingAccount ? `${deletingAccount.bankName} (${deletingAccount.accountNumber || deletingAccount.iban})` : ''}
        itemType="payment account"
        loading={deleteLoading}
      />

      <ConfirmAccountStatusModal
        isOpen={Boolean(statusConfirmAccount)}
        onClose={() => setStatusConfirmAccount(null)}
        onConfirm={handleConfirmStatusChange}
        account={statusConfirmAccount}
        loading={statusActionLoading}
      />
    </div>
  );
}
