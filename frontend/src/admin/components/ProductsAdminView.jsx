import React, { useState, useEffect, useMemo } from 'react';
import { Plus, RefreshCw, Search, ShoppingBag } from 'lucide-react';
import { toast } from 'sonner';
import { LumaSpin } from '@/components/ui/luma-spin';
import { Button } from '@/components/ui/button';
import { ProductAdminMetrics } from './ProductAdminMetrics';
import { ProductAdminCard } from './ProductAdminCard';
import { ProductModal } from './ProductModal';
import { ProductDeleteModal } from './ProductDeleteModal';
import {
  fetchProducts,
  createProduct,
  updateProduct,
  toggleProductPublish,
  deleteProduct
} from '@/api/productApi';
import { fetchCategories } from '@/api/categoryApi';

export function ProductsAdminView() {
  const [products, setProducts] = useState([]);
  const [categoriesList, setCategoriesList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [availabilityFilter, setAvailabilityFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [deletingProduct, setDeletingProduct] = useState(null);
  const [modalLoading, setModalLoading] = useState(false);
  const [actionLoadingId, setActionLoadingId] = useState(null);

  const loadData = async () => {
    setLoading(true);
    try {
      const [prodRes, catRes] = await Promise.allSettled([
        fetchProducts({ limit: 100 }),
        fetchCategories({ isActive: true })
      ]);
      if (prodRes.status === 'fulfilled') {
        const list = prodRes.value?.data?.items || prodRes.value?.data || [];
        setProducts(Array.isArray(list) ? list : []);
      } else {
        setProducts([]);
      }
      if (catRes.status === 'fulfilled') {
        const catList = catRes.value?.data || [];
        setCategoriesList(Array.isArray(catList) ? catList.map((c) => c.name) : []);
      }
    } catch {
      toast.error('Unable to load products inventory');
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleCreate = async (formData) => {
    setModalLoading(true);
    try {
      await createProduct(formData);
      toast.success('Product created successfully');
      setIsAddModalOpen(false);
      await loadData();
    } catch (err) {
      toast.error(err.message || 'Failed to create product');
    } finally {
      setModalLoading(false);
    }
  };

  const handleUpdate = async (formData) => {
    if (!editingProduct) return;
    setModalLoading(true);
    try {
      await updateProduct(editingProduct._id, formData);
      toast.success('Product updated successfully');
      setEditingProduct(null);
      await loadData();
    } catch (err) {
      toast.error(err.message || 'Failed to update product');
    } finally {
      setModalLoading(false);
    }
  };

  const handleTogglePublish = async (prod) => {
    setActionLoadingId(prod._id);
    try {
      await toggleProductPublish(prod._id);
      toast.success(`Product "${prod.title}" is now ${prod.isPublished ? 'hidden' : 'published'}`);
      await loadData();
    } catch (err) {
      toast.error(err.message || 'Failed to update product status');
    } finally {
      setActionLoadingId(null);
    }
  };

  const handleDelete = async (prod) => {
    setModalLoading(true);
    try {
      await deleteProduct(prod._id);
      toast.success(`Product "${prod.title}" deleted successfully`);
      setDeletingProduct(null);
      await loadData();
    } catch (err) {
      toast.error(err.message || 'Failed to delete product');
    } finally {
      setModalLoading(false);
    }
  };

  const filteredProducts = useMemo(() => {
    return products.filter((prod) => {
      if (statusFilter === 'Published' && !prod.isPublished) return false;
      if (statusFilter === 'Hidden' && prod.isPublished) return false;
      if (selectedCategory !== 'All' && prod.category !== selectedCategory) return false;
      if (availabilityFilter !== 'All' && prod.availability !== availabilityFilter) return false;

      if (!searchQuery.trim()) return true;
      const q = searchQuery.toLowerCase().trim();
      const title = (prod.title || '').toLowerCase();
      const sku = (prod.sku || '').toLowerCase();
      const cat = (prod.category || '').toLowerCase();
      const purity = (prod.purity || '').toLowerCase();
      const avail = (prod.availability || '').toLowerCase();
      return title.includes(q) || sku.includes(q) || cat.includes(q) || purity.includes(q) || avail.includes(q);
    });
  }, [products, statusFilter, selectedCategory, availabilityFilter, searchQuery]);

  const publishedCount = products.filter((p) => p.isPublished).length;
  const hiddenCount = products.length - publishedCount;

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] uppercase font-mono tracking-widest text-amber-800 dark:text-amber-400 font-semibold">
              Atelier Inventory
            </span>
            <span className="text-muted-foreground/40">•</span>
            <span className="text-[10px] font-mono tracking-wider text-muted-foreground">
              Dynamic Gold Calculation
            </span>
          </div>
          <h2 className="font-serif text-xl sm:text-2xl font-bold tracking-tight text-foreground">
            Products Management
          </h2>
          <p className="text-xs text-muted-foreground">
            Manage jewellery pieces, weights, making & stone charges with real-time Sarafa bullion rate pricing
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <Button
            variant="outline"
            size="sm"
            onClick={loadData}
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
            <span>Add Product</span>
          </Button>
        </div>
      </div>

      <ProductAdminMetrics products={products} />

      <div className="rounded-xl border border-border bg-card p-3 sm:p-4 shadow-xs space-y-3">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
          <div className="relative flex-1 max-w-md">
            <Search className="size-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search by title, SKU code, category, or purity..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-1.5 rounded-lg border border-border bg-background text-xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-foreground/20"
            />
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="h-8 px-2.5 rounded-lg border border-border bg-background text-xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-foreground/20 cursor-pointer"
            >
              <option value="All">All Categories</option>
              {categoriesList.map((cat) => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>

            <select
              value={availabilityFilter}
              onChange={(e) => setAvailabilityFilter(e.target.value)}
              className="h-8 px-2.5 rounded-lg border border-border bg-background text-xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-foreground/20 cursor-pointer"
            >
              <option value="All">All Statuses</option>
              <option value="In Stock">In Stock</option>
              <option value="Made to Order">Made to Order</option>
              <option value="Out of Stock">Out of Stock</option>
            </select>

            <div className="flex items-center gap-1 p-0.5 rounded-lg bg-muted border border-border shrink-0">
              {[
                { id: 'All', label: 'All', count: products.length },
                { id: 'Published', label: 'Live', count: publishedCount },
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
        </div>

        {loading ? (
          <div className="py-20 flex items-center justify-center">
            <LumaSpin size={28} />
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="py-16 text-center border border-dashed border-border rounded-xl flex flex-col items-center justify-center px-4">
            <ShoppingBag className="size-8 text-muted-foreground/40 mb-2" />
            <h4 className="text-sm font-medium text-foreground">No products found</h4>
            <p className="text-xs text-muted-foreground mt-1 max-w-sm">
              {searchQuery || selectedCategory !== 'All' || statusFilter !== 'All' || availabilityFilter !== 'All'
                ? 'Try adjusting your search criteria or filter selections.'
                : 'No jewellery products registered yet. Click "+ Add Product" to publish your first piece.'}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pt-1">
            {filteredProducts.map((prod) => (
              <ProductAdminCard
                key={prod._id}
                product={prod}
                onEdit={(p) => setEditingProduct(p)}
                onDelete={(p) => setDeletingProduct(p)}
                onTogglePublish={handleTogglePublish}
                actionLoading={actionLoadingId === prod._id}
              />
            ))}
          </div>
        )}
      </div>

      <ProductModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSave={handleCreate}
        initialData={null}
        loading={modalLoading}
      />

      <ProductModal
        isOpen={Boolean(editingProduct)}
        onClose={() => setEditingProduct(null)}
        onSave={handleUpdate}
        initialData={editingProduct}
        loading={modalLoading}
      />

      <ProductDeleteModal
        isOpen={Boolean(deletingProduct)}
        onClose={() => setDeletingProduct(null)}
        onConfirm={handleDelete}
        product={deletingProduct}
        loading={modalLoading}
      />
    </div>
  );
}
