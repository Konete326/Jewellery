import React from 'react';
import {
  Building2,
  Eye,
  Pencil,
  Archive,
  RotateCcw,
  Trash2,
  Phone,
  MessageCircle,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { openWhatsAppChat } from '@/utils/whatsapp';

export function SuppliersTable({
  suppliers = [],
  pagination = {},
  onPageChange,
  onViewSupplier,
  onEditSupplier,
  onArchiveSupplier,
  onRestoreSupplier,
  onDeleteSupplier,
  onOpenAddModal
}) {
  if (suppliers.length === 0) {
    return (
      <div className="py-16 text-center rounded-2xl border border-dashed border-border/80 bg-card/40 p-8">
        <Building2 className="size-8 mx-auto text-muted-foreground/60 mb-2" />
        <h3 className="font-serif text-base font-semibold text-foreground mb-1">
          No Sourcing Partners Found
        </h3>
        <p className="text-xs text-muted-foreground max-w-sm mx-auto font-light mb-4">
          No suppliers match your current filter criteria. Register trusted sarafa bullion dealers, gemstone houses, and atelier craftsmen.
        </p>
        {onOpenAddModal && (
          <button
            type="button"
            onClick={onOpenAddModal}
            className="px-4 py-2 text-xs font-medium rounded-lg bg-foreground text-background hover:opacity-90 transition-opacity cursor-pointer inline-flex items-center gap-2"
          >
            <Building2 className="size-3.5" />
            Register First Supplier
          </button>
        )}
      </div>
    );
  }

  const handleWhatsApp = (supplier) => {
    const rawNumber = supplier.whatsapp || supplier.phone;
    const cleanNumber = (rawNumber || '').replace(/[^\d+]/g, '');
    const message = `Greetings from Khalil & Sons Jewellers, Karachi. Reaching out regarding bullion rates and material inventory.`;
    openWhatsAppChat(message, cleanNumber);
  };

  const {
    page = 1,
    totalPages = 1,
    total = suppliers.length,
    hasNextPage = false,
    hasPrevPage = false
  } = pagination;

  return (
    <div className="rounded-xl border border-border/80 bg-card overflow-hidden shadow-xs">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead className="border-b border-border/80 bg-muted/40 text-[10px] font-mono uppercase tracking-wider text-muted-foreground">
            <tr>
              <th className="py-3 px-4">Supplier / Firm</th>
              <th className="py-3 px-4">Contact Person</th>
              <th className="py-3 px-4">Contact Channels</th>
              <th className="py-3 px-4">Market / City</th>
              <th className="py-3 px-4">Supplied Categories</th>
              <th className="py-3 px-4">Status</th>
              <th className="py-3 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border/60">
            {suppliers.map((supplier) => {
              const isActive = supplier.status === 'active';
              return (
                <tr
                  key={supplier._id}
                  className="hover:bg-muted/30 transition-colors group"
                >
                  <td className="py-3.5 px-4">
                    <div className="font-serif font-semibold text-foreground text-sm">
                      {supplier.name}
                    </div>
                    {supplier.notes && (
                      <div className="text-[11px] text-muted-foreground line-clamp-1 max-w-xs mt-0.5">
                        {supplier.notes}
                      </div>
                    )}
                  </td>

                  <td className="py-3.5 px-4 text-foreground font-medium">
                    {supplier.contactPerson || (
                      <span className="text-muted-foreground font-normal">Direct Desk</span>
                    )}
                  </td>

                  <td className="py-3.5 px-4">
                    <div className="flex flex-col gap-1 font-mono text-[11px]">
                      <a
                        href={`tel:${supplier.phone}`}
                        className="flex items-center gap-1.5 text-foreground hover:text-amber-600 dark:hover:text-amber-400 transition-colors"
                      >
                        <Phone className="size-3 text-muted-foreground" />
                        {supplier.phone}
                      </a>
                      {supplier.whatsapp && (
                        <button
                          type="button"
                          onClick={() => handleWhatsApp(supplier)}
                          className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400 hover:underline cursor-pointer text-left"
                        >
                          <MessageCircle className="size-3" />
                          {supplier.whatsapp}
                        </button>
                      )}
                    </div>
                  </td>

                  <td className="py-3.5 px-4">
                    <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-mono border border-border/80 bg-background text-foreground">
                      {supplier.city}
                    </span>
                  </td>

                  <td className="py-3.5 px-4">
                    <div className="flex flex-wrap gap-1 max-w-xs">
                      {(supplier.suppliedCategories || []).map((cat) => (
                        <span
                          key={cat}
                          className="px-1.5 py-0.5 rounded text-[10px] font-mono border border-border/70 bg-muted/20 text-muted-foreground"
                        >
                          {cat}
                        </span>
                      ))}
                    </div>
                  </td>

                  <td className="py-3.5 px-4">
                    <span
                      className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-mono uppercase tracking-wider border ${
                        isActive
                          ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300'
                          : 'border-border/80 bg-muted/40 text-muted-foreground'
                      }`}
                    >
                      {supplier.status}
                    </span>
                  </td>

                  <td className="py-3.5 px-4 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        type="button"
                        title="View Supplier Profile"
                        onClick={() => onViewSupplier(supplier)}
                        className="p-1.5 rounded-md hover:bg-muted text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
                      >
                        <Eye className="size-3.5" />
                      </button>
                      <button
                        type="button"
                        title="Edit Supplier"
                        onClick={() => onEditSupplier(supplier)}
                        className="p-1.5 rounded-md hover:bg-muted text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
                      >
                        <Pencil className="size-3.5" />
                      </button>
                      {isActive ? (
                        <button
                          type="button"
                          title="Archive Supplier"
                          onClick={() => onArchiveSupplier(supplier)}
                          className="p-1.5 rounded-md hover:bg-amber-500/10 text-muted-foreground hover:text-amber-600 dark:hover:text-amber-400 transition-colors cursor-pointer"
                        >
                          <Archive className="size-3.5" />
                        </button>
                      ) : (
                        <button
                          type="button"
                          title="Restore Supplier"
                          onClick={() => onRestoreSupplier(supplier)}
                          className="p-1.5 rounded-md hover:bg-emerald-500/10 text-muted-foreground hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors cursor-pointer"
                        >
                          <RotateCcw className="size-3.5" />
                        </button>
                      )}
                      <button
                        type="button"
                        title="Safely Archive Record"
                        onClick={() => onDeleteSupplier(supplier)}
                        className="p-1.5 rounded-md hover:bg-rose-500/10 text-muted-foreground hover:text-rose-600 dark:hover:text-rose-400 transition-colors cursor-pointer"
                      >
                        <Trash2 className="size-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 px-4 py-3 border-t border-border/80 bg-muted/20 text-xs text-muted-foreground">
        <div className="text-[11px] font-mono">
          Showing <span className="font-semibold text-foreground">{suppliers.length}</span> of{' '}
          <span className="font-semibold text-foreground">{total}</span> sourcing partners
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[11px] font-mono mr-2">
            Page {page} of {totalPages}
          </span>
          <button
            type="button"
            disabled={!hasPrevPage}
            onClick={() => onPageChange(page - 1)}
            className="flex items-center gap-1 px-2.5 py-1 rounded-md border border-border bg-background hover:bg-muted text-foreground transition-colors cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <ChevronLeft className="size-3.5" />
            Prev
          </button>
          <button
            type="button"
            disabled={!hasNextPage}
            onClick={() => onPageChange(page + 1)}
            className="flex items-center gap-1 px-2.5 py-1 rounded-md border border-border bg-background hover:bg-muted text-foreground transition-colors cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
          >
            Next
            <ChevronRight className="size-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}

