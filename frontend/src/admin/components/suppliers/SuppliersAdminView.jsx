import React, { useState, useEffect, useCallback } from 'react';
import {
  Building2,
  Plus,
  RefreshCw,
  Search,
  SlidersHorizontal,
  AlertCircle
} from 'lucide-react';
import { toast } from 'sonner';
import { LumaSpin } from '@/components/ui/luma-spin';
import {
  fetchSuppliers,
  createSupplier,
  updateSupplier,
  archiveSupplier,
  restoreSupplier,
  deleteSupplier
} from '@/api/supplierApi';
import { SupplierMetrics } from './SupplierMetrics';
import { SuppliersTable } from './SuppliersTable';
import { SupplierModal } from './SupplierModal';
import { SupplierDetailModal } from './SupplierDetailModal';
import { SupplierArchiveModal } from './SupplierArchiveModal';

const CATEGORY_TABS = [
  'All',
  'Gold',
  'Silver',
  'Stones',
  'Diamonds',
  'Jewellery',
  'Other'
];

export function SuppliersAdminView() {
  const [suppliers, setSuppliers] = useState([]);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 1,
    hasNextPage: false,
    hasPrevPage: false
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('active');
  const [currentPage, setCurrentPage] = useState(1);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSupplier, setEditingSupplier] = useState(null);
  const [modalLoading, setModalLoading] = useState(false);

  const [inspectingSupplier, setInspectingSupplier] = useState(null);

  const [archiveTarget, setArchiveTarget] = useState(null);
  const [archiveActionType, setArchiveActionType] = useState('archive');
  const [archiveLoading, setArchiveLoading] = useState(false);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(searchQuery);
      setCurrentPage(1);
    }, 350);
    return () => clearTimeout(handler);
  }, [searchQuery]);

  const loadSuppliers = useCallback(
    async (silent = false) => {
      if (!silent) setLoading(true);
      setError(null);
      try {
        const res = await fetchSuppliers(
          {
            page: currentPage,
            limit: 10,
            search: debouncedSearch,
            category: categoryFilter,
            status: statusFilter
          },
          { silent }
        );

        if (res && res.data) {
          setSuppliers(res.data.items || []);
          if (res.data.pagination) {
            setPagination(res.data.pagination);
          }
        }
      } catch (err) {
        setError(err.message || 'Failed to load suppliers.');
        toast.error('Unable to fetch sourcing partners', {
          description: err.message
        });
      } finally {
        if (!silent) setLoading(false);
      }
    },
    [currentPage, debouncedSearch, categoryFilter, statusFilter]
  );

  useEffect(() => {
    loadSuppliers();
  }, [loadSuppliers]);

  const handleOpenAdd = () => {
    setEditingSupplier(null);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (supplier) => {
    setEditingSupplier(supplier);
    setIsModalOpen(true);
  };

  const handleOpenDetail = (supplier) => {
    setInspectingSupplier(supplier);
  };

  const handleSaveSupplier = async (formData) => {
    setModalLoading(true);
    try {
      if (editingSupplier) {
        await updateSupplier(editingSupplier._id, formData);
        toast.success(`Partner "${formData.name}" updated successfully`);
      } else {
        await createSupplier(formData);
        toast.success(`Partner "${formData.name}" registered successfully`);
      }
      setIsModalOpen(false);
      setEditingSupplier(null);
      await loadSuppliers(true);
    } catch (err) {
      throw err;
    } finally {
      setModalLoading(false);
    }
  };

  const handlePromptArchive = (supplier) => {
    setArchiveTarget(supplier);
    setArchiveActionType('archive');
  };

  const handlePromptRestore = (supplier) => {
    setArchiveTarget(supplier);
    setArchiveActionType('restore');
  };

  const handlePromptDelete = (supplier) => {
    setArchiveTarget(supplier);
    setArchiveActionType('delete');
  };

  const handleConfirmArchive = async () => {
    if (!archiveTarget) return;
    setArchiveLoading(true);
    try {
      if (archiveActionType === 'restore') {
        await restoreSupplier(archiveTarget._id);
        toast.success(`"${archiveTarget.name}" restored to active partners`);
      } else if (archiveActionType === 'delete') {
        await deleteSupplier(archiveTarget._id);
        toast.success(`"${archiveTarget.name}" archived safely`);
      } else {
        await archiveSupplier(archiveTarget._id);
        toast.success(`"${archiveTarget.name}" moved to archives`);
      }
      setArchiveTarget(null);
      if (inspectingSupplier && inspectingSupplier._id === archiveTarget._id) {
        setInspectingSupplier(null);
      }
      await loadSuppliers(true);
    } catch (err) {
      toast.error('Operation failed', {
        description: err.message || 'Could not update supplier status.'
      });
    } finally {
      setArchiveLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] font-mono tracking-wider px-2 py-0.5 rounded border border-amber-500/30 bg-amber-500/10 text-amber-700 dark:text-amber-300">
              ATELIER SUPPLY CHAIN
            </span>
            <span className="text-xs text-muted-foreground font-mono">
              {pagination.total} Total Records
            </span>
          </div>
          <h1 className="font-serif text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
            Supplier Management
          </h1>
          <p className="text-xs text-muted-foreground mt-1 max-w-2xl font-light">
            Manage precious metals bullion houses, certified diamond cutters, gemstone merchants, and bespoke jewellery mounting ateliers.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => loadSuppliers()}
            disabled={loading}
            className="flex items-center gap-1.5 px-3 py-2 text-xs font-medium rounded-lg border border-border bg-background hover:bg-muted text-foreground transition-colors cursor-pointer disabled:opacity-50"
          >
            <RefreshCw className={`size-3.5 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </button>
          <button
            type="button"
            onClick={handleOpenAdd}
            className="flex items-center gap-2 px-4 py-2 text-xs font-medium rounded-lg bg-foreground text-background hover:opacity-90 transition-opacity cursor-pointer shadow-xs"
          >
            <Plus className="size-4" />
            Register Supplier
          </button>
        </div>
      </div>

      <SupplierMetrics suppliers={suppliers} pagination={pagination} />

      <div className="rounded-xl border border-border/80 bg-card p-4 space-y-4 shadow-xs">
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-3.5 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search by supplier name, contact person, phone, or city..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 rounded-lg border border-border bg-background text-xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-foreground/20"
            />
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <div className="inline-flex rounded-lg border border-border/80 bg-muted/40 p-0.5 text-xs">
              <button
                type="button"
                onClick={() => {
                  setStatusFilter('active');
                  setCurrentPage(1);
                }}
                className={`px-3 py-1 rounded-md text-[11px] font-mono transition-colors cursor-pointer ${
                  statusFilter === 'active'
                    ? 'bg-background text-foreground font-semibold shadow-xs'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                Active
              </button>
              <button
                type="button"
                onClick={() => {
                  setStatusFilter('archived');
                  setCurrentPage(1);
                }}
                className={`px-3 py-1 rounded-md text-[11px] font-mono transition-colors cursor-pointer ${
                  statusFilter === 'archived'
                    ? 'bg-background text-foreground font-semibold shadow-xs'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                Archived
              </button>
              <button
                type="button"
                onClick={() => {
                  setStatusFilter('all');
                  setCurrentPage(1);
                }}
                className={`px-3 py-1 rounded-md text-[11px] font-mono transition-colors cursor-pointer ${
                  statusFilter === 'all'
                    ? 'bg-background text-foreground font-semibold shadow-xs'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                All
              </button>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 pt-1 border-t border-border/60">
          <span className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground mr-1 shrink-0 flex items-center gap-1">
            <SlidersHorizontal className="size-3" />
            Category:
          </span>
          {CATEGORY_TABS.map((cat) => {
            const isSelected = categoryFilter === cat;
            return (
              <button
                key={cat}
                type="button"
                onClick={() => {
                  setCategoryFilter(cat);
                  setCurrentPage(1);
                }}
                className={`px-2.5 py-1 rounded-md text-[11px] font-mono transition-colors cursor-pointer shrink-0 border ${
                  isSelected
                    ? 'border-amber-500/50 bg-amber-500/10 text-amber-700 dark:text-amber-300 font-semibold'
                    : 'border-border/60 bg-background text-muted-foreground hover:bg-muted'
                }`}
              >
                {cat}
              </button>
            );
          })}
        </div>
      </div>

      {loading ? (
        <div className="py-20 flex flex-col items-center justify-center gap-3">
          <LumaSpin className="size-8" />
          <p className="text-xs text-muted-foreground font-mono">
            Loading atelier suppliers...
          </p>
        </div>
      ) : error ? (
        <div className="py-16 text-center rounded-2xl border border-rose-500/30 bg-rose-500/5 p-8">
          <AlertCircle className="size-8 mx-auto text-rose-500 mb-2" />
          <h3 className="font-serif text-base font-semibold text-foreground mb-1">
            Failed to Load Suppliers
          </h3>
          <p className="text-xs text-muted-foreground max-w-sm mx-auto mb-4">
            {error}
          </p>
          <button
            type="button"
            onClick={() => loadSuppliers()}
            className="px-4 py-2 text-xs font-medium rounded-lg border border-border bg-background hover:bg-muted text-foreground transition-colors cursor-pointer"
          >
            Retry Loading
          </button>
        </div>
      ) : (
        <SuppliersTable
          suppliers={suppliers}
          pagination={pagination}
          onPageChange={(newPage) => setCurrentPage(newPage)}
          onViewSupplier={handleOpenDetail}
          onEditSupplier={handleOpenEdit}
          onArchiveSupplier={handlePromptArchive}
          onRestoreSupplier={handlePromptRestore}
          onDeleteSupplier={handlePromptDelete}
          onOpenAddModal={handleOpenAdd}
        />
      )}

      <SupplierModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingSupplier(null);
        }}
        onSave={handleSaveSupplier}
        initialData={editingSupplier}
        loading={modalLoading}
      />

      <SupplierDetailModal
        isOpen={Boolean(inspectingSupplier)}
        onClose={() => setInspectingSupplier(null)}
        supplier={inspectingSupplier}
        onEdit={handleOpenEdit}
        onToggleArchive={(sup) => {
          if (sup.status === 'active') {
            handlePromptArchive(sup);
          } else {
            handlePromptRestore(sup);
          }
        }}
      />

      <SupplierArchiveModal
        isOpen={Boolean(archiveTarget)}
        onClose={() => setArchiveTarget(null)}
        onConfirm={handleConfirmArchive}
        supplier={archiveTarget}
        actionType={archiveActionType}
        loading={archiveLoading}
      />
    </div>
  );
}

