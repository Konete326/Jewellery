import React, { useState } from 'react'
import { Sparkles, Package, Plus, Pencil, Trash2 } from 'lucide-react'
import { ProductFormModal } from './ProductFormModal'
import { ConfirmDeleteModal } from './ConfirmDeleteModal'
import { deleteProduct } from '@/api/productApi'
import { toast } from 'sonner'
import { Alert, AlertTitle } from '@/components/ui/alert'
import { CheckCheckIcon } from 'lucide-react'

export function InventoryOverview({ products = [], loading = false, onRefresh = () => {} }) {
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [editingProduct, setEditingProduct] = useState(null)
  const [deletingProduct, setDeletingProduct] = useState(null)
  const [deleteLoading, setDeleteLoading] = useState(false)

  const formatPrice = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0
    }).format(amount || 0)
  }

  const handleDelete = async () => {
    if (!deletingProduct?._id) return
    setDeleteLoading(true)
    try {
      await deleteProduct(deletingProduct._id)
      toast.custom(() => (
        <Alert className="border-emerald-600 text-emerald-600 dark:border-emerald-400 dark:text-emerald-400 *:[svg]:row-span-1">
          <CheckCheckIcon />
          <AlertTitle>Masterpiece deleted from catalog</AlertTitle>
        </Alert>
      ))
      setDeletingProduct(null)
      onRefresh()
    } catch (err) {
      toast.error(err.message || 'Failed to delete piece')
    } finally {
      setDeleteLoading(false)
    }
  }

  return (
    <div className="rounded-xl border border-border bg-card p-5 shadow-xs">
      <div className="flex items-center justify-between pb-4 border-b border-border">
        <div>
          <h3 className="font-semibold text-foreground text-base tracking-tight font-serif">Atelier Masterpieces</h3>
          <p className="text-xs text-muted-foreground mt-0.5">Database jewelry catalog & inventory</p>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs font-mono font-medium px-2 py-0.5 rounded-md bg-muted text-muted-foreground">
            {products.length} {products.length === 1 ? 'Piece' : 'Pieces'}
          </span>
          <button
            onClick={() => {
              setEditingProduct(null)
              setIsFormOpen(true)
            }}
            className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors cursor-pointer"
          >
            <Plus className="size-3.5" />
            <span>Add Piece</span>
          </button>
        </div>
      </div>

      {loading ? (
        <div className="py-10 text-center text-xs text-muted-foreground">Loading catalog...</div>
      ) : products.length === 0 ? (
        <div className="py-10 flex flex-col items-center justify-center text-center px-4">
          <div className="p-3 rounded-full bg-muted/50 border border-border/60 mb-3 text-muted-foreground">
            <Package className="size-5" />
          </div>
          <h4 className="text-sm font-medium text-foreground">Catalog is empty</h4>
          <p className="text-xs text-muted-foreground mt-1 max-w-xs">
            No jewelry pieces currently stored in the database.
          </p>
          <button
            onClick={() => {
              setEditingProduct(null)
              setIsFormOpen(true)
            }}
            className="mt-3 inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors cursor-pointer"
          >
            <Plus className="size-3.5" />
            <span>Add First Piece</span>
          </button>
        </div>
      ) : (
        <div className="mt-4 space-y-3">
          {products.map((item) => (
            <div
              key={item._id || item.slug}
              className="flex items-center justify-between p-3 rounded-lg border border-border/50 hover:border-border bg-muted/20 hover:bg-muted/40 transition-all gap-2"
            >
              <div className="flex items-center gap-3 min-w-0">
                <div className="size-12 rounded-lg bg-muted overflow-hidden border border-border/40 shrink-0 flex items-center justify-center">
                  {item.images?.[0] ? (
                    <img src={item.images[0]} alt={item.title} className="size-full object-cover" />
                  ) : (
                    <Sparkles className="size-4 text-amber-500/60" />
                  )}
                </div>
                <div className="min-w-0">
                  <div className="font-medium text-sm text-foreground truncate flex items-center gap-1.5">
                    {item.title}
                    {item.isFeatured && (
                      <span className="text-[9px] px-1.5 py-0.2 rounded-full bg-amber-500/20 text-amber-600 font-semibold uppercase">
                        Featured
                      </span>
                    )}
                  </div>
                  <div className="text-xs text-muted-foreground truncate">
                    {item.metal} • {item.category}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3 shrink-0">
                <div className="text-right">
                  <div className="font-semibold text-sm text-foreground">{formatPrice(item.price)}</div>
                  <span className="inline-block text-[10px] uppercase tracking-wider font-medium px-2 py-0.5 rounded-full mt-0.5 bg-emerald-500/10 text-emerald-600 border border-emerald-300/30">
                    {item.stock > 0 ? `${item.stock} in stock` : 'Out of Stock'}
                  </span>
                </div>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => {
                      setEditingProduct(item)
                      setIsFormOpen(true)
                    }}
                    className="p-1.5 text-muted-foreground hover:text-foreground hover:bg-muted rounded-md transition-colors cursor-pointer"
                    title="Edit piece"
                  >
                    <Pencil className="size-3.5" />
                  </button>
                  <button
                    onClick={() => setDeletingProduct(item)}
                    className="p-1.5 text-muted-foreground hover:text-rose-500 hover:bg-rose-500/10 rounded-md transition-colors cursor-pointer"
                    title="Delete piece"
                  >
                    <Trash2 className="size-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <ProductFormModal
        isOpen={isFormOpen}
        onClose={() => {
          setIsFormOpen(false)
          setEditingProduct(null)
        }}
        onSuccess={onRefresh}
        productToEdit={editingProduct}
      />

      <ConfirmDeleteModal
        isOpen={Boolean(deletingProduct)}
        onClose={() => setDeletingProduct(null)}
        onConfirm={handleDelete}
        title={deletingProduct?.title || ''}
        itemType="masterpiece"
        loading={deleteLoading}
      />
    </div>
  )
}
