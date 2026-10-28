import React, { useState, useEffect, useMemo } from 'react';
import {
  Landmark,
  Plus,
  Search,
  RefreshCw,
  CreditCard,
  CheckCircle2,
  Sparkles,
  ArrowUpDown
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
import { LumaSpin } from '@/components/ui/luma-spin';

export function PaymentAccountsAdminView() {
  const [accounts, setAccounts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingAccount, setEditingAccount] = useState(null);
  const [modalLoading, setModalLoading] = useState(false);

  const [deletingAccount, setDeletingAccount] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const [actionLoadingId, setActionLoadingId] = useState(null);

  const loadAccounts = async (silent = false) => {
    if (!silent) setLoading(true);
    try {
      const res = await fetchPaymentAccounts();
      if (res && res.data) {
        setAccounts(res.data);
      }
    } catch (err) {
      toast.error('Failed to load payment accounts', {
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
        toast.success('Payment Account Updated', {
          description: `${formData.bankName} details saved.`
        });
      } else {
        await createPaymentAccount(formData);
        toast.success('Payment Account Added', {
          description: `${formData.bankName} added to settlement accounts.`
        });
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
      toast.success('Default Account Updated', {
        description: `${account.bankName} set as primary settlement account.`
      });
      await loadAccounts(true);
    } catch (err) {
      toast.error('Failed to set default account', {
        description: err.message
      });
    } finally {
      setActionLoadingId(null);
    }
  };

  const handleToggleStatus = async (account) => {
    setActionLoadingId(account._id);
    const newStatus = !account.isActive;
    try {
      await updatePaymentAccount(account._id, { ...account, isActive: newStatus });
      toast.success(`Account ${newStatus ? 'Activated' : 'Deactivated'}`, {
        description: `${account.bankName} status updated.`
      });
      await loadAccounts(true);
    } catch (err) {
      toast.error('Failed to update status', {
        description: err.message
      });
    } finally {
      setActionLoadingId(null);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!deletingAccount) return;
    setDeleteLoading(true);
    try {
      await deletePaymentAccount(deletingAccount._id);
      toast.success('Account Removed', {
        description: `${deletingAccount.bankName} removed from atelier accounts.`
      });
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
        accountTitle: 'Khalil & Sons Jewellers (Pvt) Ltd',
        accountNumber: '01080105829101',
        iban: 'PK36MEZN0001080105829101',
        branchName: 'Cloth Market Branch (0108), Saddar, Karachi',
        accountType: 'Corporate Account',
        swiftCode: 'MEZNPKKA',
        instructions: 'Please WhatsApp payment confirmation slip with your order or inquiry ID to verify booking.',
        isDefault: true,
        isActive: true
      });
      await createPaymentAccount({
        bankName: 'Raast Digital ID',
        accountTitle: 'Khalil & Sons Jewellers',
        accountNumber: '03331234567',
        iban: '',
        branchName: 'State Bank of Pakistan Raast Gateway',
        accountType: 'Raast ID',
        swiftCode: '',
        instructions: 'Instant zero-fee settlement via any Pakistani banking app using Raast ID.',
        isDefault: false,
        isActive: true
      });
      toast.success('Default Accounts Initialized');
      await loadAccounts(true);
    } catch (err) {
      toast.error('Failed to initialize default accounts', {
        description: err.message
      });
    } finally {
      setLoading(false);
    }
  };

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

      if (statusFilter === 'Active') return acc.isActive === true;
      if (statusFilter === 'Inactive') return acc.isActive === false;
      if (statusFilter === 'Digital') {
        return (
          acc.accountType === 'Digital Wallet' ||
          acc.accountType === 'Raast ID' ||
          acc.bankName?.toLowerCase().includes('raast')
        );
      }

      return true;
    });
  }, [accounts, searchQuery, statusFilter]);

  const defaultAccount = useMemo(() => {
    return accounts.find((a) => a.isDefault);
  }, [accounts]);

  const activeCount = useMemo(() => {
    return accounts.filter((a) => a.isActive).length;
  }, [accounts]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-border/70">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="font-serif text-2xl font-light text-foreground tracking-tight">
              Payment & Settlement Accounts
            </h1>
            <span className="font-mono text-[9px] uppercase tracking-widest text-amber-800 dark:text-amber-300 border border-amber-500/25 bg-amber-500/10 px-2.5 py-0.5 rounded-full font-medium">
              AU · TREASURY
            </span>
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            Manage receiving bank accounts, IBANs, and online settlement options for orders and bespoke advances.
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

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="rounded-2xl border border-border/80 bg-card p-4 sm:p-5 shadow-xs">
          <div className="flex items-center justify-between text-muted-foreground text-xs mb-2">
            <span>Total Accounts</span>
            <Landmark className="size-4 text-amber-600" />
          </div>
          <div className="text-2xl font-serif font-light text-foreground">
            {accounts.length}
          </div>
          <p className="text-[11px] text-muted-foreground mt-1 font-light">
            Configured settlement channels
          </p>
        </div>

        <div className="rounded-2xl border border-border/80 bg-card p-4 sm:p-5 shadow-xs">
          <div className="flex items-center justify-between text-muted-foreground text-xs mb-2">
            <span>Active Settlement Channels</span>
            <CheckCircle2 className="size-4 text-emerald-600" />
          </div>
          <div className="text-2xl font-serif font-light text-foreground">
            {activeCount}
          </div>
          <p className="text-[11px] text-muted-foreground mt-1 font-light">
            Available for customer payments
          </p>
        </div>

        <div className="rounded-2xl border border-border/80 bg-card p-4 sm:p-5 shadow-xs">
          <div className="flex items-center justify-between text-muted-foreground text-xs mb-2">
            <span>Primary Settlement Account</span>
            <CreditCard className="size-4 text-amber-600" />
          </div>
          <div className="text-base font-serif font-semibold text-foreground truncate">
            {defaultAccount ? defaultAccount.bankName : 'None Configured'}
          </div>
          <p className="text-[11px] text-muted-foreground mt-1 font-mono truncate">
            {defaultAccount ? defaultAccount.accountNumber : 'Select a primary account'}
          </p>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div className="relative flex-1 max-w-md">
          <Search className="size-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search bank name, title, account, IBAN..."
            className="w-full bg-background border border-input rounded-xl pl-9 pr-3.5 py-2 text-xs text-foreground placeholder:text-muted-foreground focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-foreground/30"
          />
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
          {['All', 'Active', 'Inactive', 'Digital'].map((filter) => (
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
        <div className="min-h-[280px] flex flex-col items-center justify-center gap-3">
          <LumaSpin size={32} />
          <p className="text-xs text-muted-foreground font-light">Loading payment accounts...</p>
        </div>
      ) : filteredAccounts.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-border p-8 sm:p-12 text-center bg-card/50">
          <div className="size-12 rounded-full border border-amber-500/30 bg-amber-500/10 text-amber-700 dark:text-amber-400 mx-auto flex items-center justify-center mb-3">
            <Landmark className="size-6" />
          </div>
          <h3 className="font-serif text-lg font-semibold text-foreground mb-1">
            {searchQuery || statusFilter !== 'All' ? 'No Matching Accounts' : 'No Payment Accounts Yet'}
          </h3>
          <p className="text-xs text-muted-foreground max-w-md mx-auto mb-5 leading-relaxed font-light">
            {searchQuery || statusFilter !== 'All'
              ? 'Try adjusting your search criteria or clearing filter tabs.'
              : 'Add your atelier bank account details or digital payment addresses so clients can verify payments easily.'}
          </p>
          <div className="flex items-center justify-center gap-3 flex-wrap">
            <Button
              type="button"
              onClick={handleOpenAdd}
              className="h-9 px-4 text-xs bg-foreground text-background hover:bg-neutral-800 cursor-pointer"
            >
              <Plus className="size-3.5 mr-1.5" />
              Add Payment Account
            </Button>
            {accounts.length === 0 && (
              <Button
                type="button"
                variant="outline"
                onClick={handleSeedDefaults}
                className="h-9 px-4 text-xs cursor-pointer"
              >
                <Sparkles className="size-3.5 mr-1.5 text-amber-600" />
                Initialize Standard Accounts
              </Button>
            )}
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
          {filteredAccounts.map((account) => (
            <PaymentAccountCard
              key={account._id}
              account={account}
              onEdit={handleOpenEdit}
              onDelete={(acc) => setDeletingAccount(acc)}
              onSetDefault={handleSetDefault}
              onToggleStatus={handleToggleStatus}
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
        loading={modalLoading}
      />

      <ConfirmDeleteModal
        isOpen={Boolean(deletingAccount)}
        onClose={() => setDeletingAccount(null)}
        onConfirm={handleDeleteConfirm}
        title={deletingAccount ? `${deletingAccount.bankName} (${deletingAccount.accountNumber})` : ''}
        itemType="payment account"
        loading={deleteLoading}
      />
    </div>
  );
}
