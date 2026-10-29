import React, { useState, useEffect, useMemo } from 'react';
import { Plus, RefreshCw, Search, Layers, SlidersHorizontal } from 'lucide-react';
import { toast } from 'sonner';
import { LumaSpin } from '@/components/ui/luma-spin';
import { Button } from '@/components/ui/button';
import { CategoryAdminMetrics } from './CategoryAdminMetrics';
import { CategoryAdminCard } from './CategoryAdminCard';
import { CategoryModal } from './CategoryModal';
import { CategoryDeleteModal } from './CategoryDeleteModal';
import {
  fetchCategories,
  createCategory,
  updateCategory,
  toggleCategoryStatus,
  deleteCategory
} from '@/api/categoryApi';

export function CategoriesAdminView() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [deletingCategory, setDeletingCategory] = useState(null);
  const [modalLoading, setModalLoading] = useState(false);
  const [actionLoadingId, setActionLoadingId] = useState(null);

  const loadCategories = async () => {
    setLoading(true);
    try {
      const res = await fetchCategories();
      const list = res?.data || (Array.isArray(res) ? res : []);
      setCategories(list);
    } catch {
      toast.error('Unable to load jewellery categories');
      setCategories([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCategories();
  }, []);

  const handleCreate = async (formData) => {
    setModalLoading(true);
    try {
      await createCategory(formData);
      toast.success('Category created successfully');
      setIsAddModalOpen(false);
      await loadCategories();
    } catch (err) {
      toast.error(err.message || 'Failed to create category');
    } finally {
      setModalLoading(false);
    }
  };

  const handleUpdate = async (formData) => {
    if (!editingCategory) return;
    setModalLoading(true);
    try {
      await updateCategory(editingCategory._id, formData);
      toast.success('Category updated successfully');
      setEditingCategory(null);
      await loadCategories();
    } catch (err) {
      toast.error(err.message || 'Failed to update category');
    } finally {
      setModalLoading(false);
    }
  };

  const handleToggleStatus = async (cat) => {
    setActionLoadingId(cat._id);
    try {
      await toggleCategoryStatus(cat._id);
      toast.success(`Category "${cat.name}" is now ${cat.isActive ? 'hidden' : 'live'}`);
      await loadCategories();
    } catch (err) {
      toast.error(err.message || 'Failed to update category status');
    } finally {
      setActionLoadingId(null);
    }
  };

  const handleDelete = async (cat) => {
    setModalLoading(true);
    try {
      await deleteCategory(cat._id);
      toast.success(`Category "${cat.name}" deleted successfully`);
      setDeletingCategory(null);
      await loadCategories();
    } catch (err) {
      toast.error(err.message || 'Failed to delete category');
    } finally {
      setModalLoading(false);
    }
  };

  const filteredCategories = useMemo(() => {
    return categories.filter((cat) => {
      if (statusFilter === 'Active' && !cat.isActive) return false;
      if (statusFilter === 'Hidden' && cat.isActive) return false;

      if (!searchQuery.trim()) return true;
      const q = searchQuery.toLowerCase().trim();
      const name = (cat.name || '').toLowerCase();
      const metal = (cat.metalStandard || '').toLowerCase();
      const hallmark = (cat.hallmark || '').toLowerCase();
      const desc = (cat.description || '').toLowerCase();
      return name.includes(q) || metal.includes(q) || hallmark.includes(q) || desc.includes(q);
    });
  }, [categories, statusFilter, searchQuery]);

  const activeCount = categories.filter((c) => c.isActive).length;
  const hiddenCount = categories.length - activeCount;

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] uppercase font-mono tracking-widest text-amber-800 dark:text-amber-400 font-semibold">
              Atelier Architecture
            </span>
            <span className="text-muted-foreground/40">•</span>
            <span className="text-[10px] font-mono tracking-wider text-muted-foreground">
              AU · 916.6 Standards
            </span>
          </div>
          <h2 className="font-serif text-xl sm:text-2xl font-bold tracking-tight text-foreground">
            Categories Management
          </h2>
          <p className="text-xs text-muted-foreground">
            Curate jewellery collections, bullion categories, assay standards, and storefront classifications
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <Button
            variant="outline"
            size="sm"
            onClick={loadCategories}
            disabled={loading}
            className="h-8 text-xs gap-1.5 cursor-pointer"
          >
            <RefreshCw className={`size-3.5 ${loading ? 'animate-spin' : ''}`} />
            <span>Refresh</span>
          </Button>

          <Button
            size="sm"
            onClick={() => setIsAddModalOpen(true)}
            className="h-8 bg-foreground hover:bg-neutral-800 text-background text-xs gap-1.5 cursor-pointer shadow-xs"
          >
            <Plus className="size-3.5" />
            <span>Add Category</span>
          </Button>
        </div>
      </div>

      <CategoryAdminMetrics categories={categories} />

      <div className="rounded-xl border border-border bg-card p-3 sm:p-4 shadow-xs space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="relative flex-1 max-w-md">
            <Search className="size-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search by collection title, metal standard, or hallmark..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-1.5 rounded-lg border border-border bg-background text-xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-foreground/20"
            />
          </div>

          <div className="flex items-center gap-1 p-0.5 rounded-lg bg-muted border border-border shrink-0">
            {[
              { id: 'All', label: 'All', count: categories.length },
              { id: 'Active', label: 'Active', count: activeCount },
              { id: 'Hidden', label: 'Hidden', count: hiddenCount }
            ].map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setStatusFilter(tab.id)}
                className={`px-3 py-1 rounded-md text-xs font-medium transition-colors cursor-pointer flex items-center gap-1.5 ${
                  statusFilter === tab.id
                    ? 'bg-background shadow-xs text-foreground font-semibold'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                <span>{tab.label}</span>
                <span className="text-[10px] font-mono opacity-75">({tab.count})</span>
              </button>
            ))}
          </div>
        </div>

        {loading ? (
          <div className="py-20 flex items-center justify-center">
            <LumaSpin size={28} />
          </div>
        ) : filteredCategories.length === 0 ? (
          <div className="py-16 text-center border border-dashed border-border rounded-xl flex flex-col items-center justify-center px-4">
            <Layers className="size-8 text-muted-foreground/40 mb-2" />
            <h4 className="text-sm font-medium text-foreground">No categories found</h4>
            <p className="text-xs text-muted-foreground mt-1 max-w-sm">
              {searchQuery || statusFilter !== 'All'
                ? 'Try adjusting your search query or status filter.'
                : 'No classifications created yet. Click "+ Add Category" above to create one.'}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pt-1">
            {filteredCategories.map((cat) => (
              <CategoryAdminCard
                key={cat._id}
                category={cat}
                onEdit={(c) => setEditingCategory(c)}
                onDelete={(c) => setDeletingCategory(c)}
                onToggleStatus={handleToggleStatus}
                actionLoading={actionLoadingId === cat._id}
              />
            ))}
          </div>
        )}
      </div>

      <CategoryModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSave={handleCreate}
        initialData={null}
        loading={modalLoading}
      />

      <CategoryModal
        isOpen={Boolean(editingCategory)}
        onClose={() => setEditingCategory(null)}
        onSave={handleUpdate}
        initialData={editingCategory}
        loading={modalLoading}
      />

      <CategoryDeleteModal
        isOpen={Boolean(deletingCategory)}
        onClose={() => setDeletingCategory(null)}
        onConfirm={handleDelete}
        category={deletingCategory}
        loading={modalLoading}
      />
    </div>
  );
}
