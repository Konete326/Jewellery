import React, { useState, useEffect, useCallback } from 'react';
import { RefreshCw, AlertCircle } from 'lucide-react';
import { fetchSuppliers, fetchSupplierById } from '@/api/supplierApi';

export function ProductSupplierSelector({
  value = '',
  onChange,
  initialSupplier = null,
  disabled = false
}) {
  const [suppliers, setSuppliers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [archivedSupplier, setArchivedSupplier] = useState(null);

  const initialSupplierId = initialSupplier
    ? typeof initialSupplier === 'object'
      ? initialSupplier._id
      : initialSupplier
    : null;

  const loadSuppliers = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const res = await fetchSuppliers({ status: 'active', limit: 100 }, { silent: true });
      const list = res.data?.items || res.data || [];
      const activeList = Array.isArray(list) ? list : [];
      setSuppliers(activeList);

      if (initialSupplierId) {
        const foundActive = activeList.some((s) => String(s._id) === String(initialSupplierId));
        if (!foundActive) {
          if (initialSupplier && typeof initialSupplier === 'object' && initialSupplier.name) {
            setArchivedSupplier({
              _id: String(initialSupplier._id || initialSupplierId),
              name: initialSupplier.name,
              city: initialSupplier.city || '',
              status: initialSupplier.status || 'archived'
            });
          } else {
            try {
              const singleRes = await fetchSupplierById(initialSupplierId);
              const single = singleRes.data;
              if (single) {
                setArchivedSupplier({
                  _id: String(single._id),
                  name: single.name,
                  city: single.city || '',
                  status: single.status || 'archived'
                });
              }
            } catch {
              setArchivedSupplier({
                _id: String(initialSupplierId),
                name: 'Assigned Partner',
                city: '',
                status: 'archived'
              });
            }
          }
        } else {
          setArchivedSupplier(null);
        }
      } else {
        setArchivedSupplier(null);
      }
    } catch {
      setError('Unable to load suppliers');
      if (initialSupplier && typeof initialSupplier === 'object' && initialSupplier.name) {
        setArchivedSupplier({
          _id: String(initialSupplier._id || initialSupplierId),
          name: initialSupplier.name,
          city: initialSupplier.city || '',
          status: initialSupplier.status || 'archived'
        });
      }
    } finally {
      setLoading(false);
    }
  }, [initialSupplierId, initialSupplier]);

  useEffect(() => {
    loadSuppliers();
  }, [loadSuppliers]);

  const isCurrentArchived = archivedSupplier && String(value) === String(archivedSupplier._id);

  return (
    <div className="space-y-1">
      <div className="flex items-center justify-between">
        <label className="text-xs font-medium text-foreground">
          Sourcing Partner / Supplier
        </label>
        <div className="flex items-center gap-1.5 text-[10px] font-mono">
          {loading ? (
            <span className="text-muted-foreground flex items-center gap-1">
              <RefreshCw className="size-2.5 animate-spin" />
              <span>Loading...</span>
            </span>
          ) : error ? (
            <button
              type="button"
              onClick={loadSuppliers}
              className="text-amber-800 dark:text-amber-400 hover:underline cursor-pointer flex items-center gap-1"
            >
              <RefreshCw className="size-2.5" />
              <span>Retry</span>
            </button>
          ) : (
            <span className="text-muted-foreground">Optional</span>
          )}
        </div>
      </div>

      <div className="relative">
        <select
          value={value || ''}
          onChange={(e) => onChange?.(e.target.value)}
          disabled={disabled || loading}
          className={`w-full px-3 py-2 rounded-lg border bg-background text-xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-foreground/20 cursor-pointer ${
            error ? 'border-amber-500/50' : 'border-border'
          } ${disabled || loading ? 'opacity-60 cursor-not-allowed' : ''}`}
        >
          <option value="">No supplier assigned</option>

          {archivedSupplier && (
            <option value={archivedSupplier._id}>
              {archivedSupplier.name}
              {archivedSupplier.city ? ` (${archivedSupplier.city})` : ''} [Archived]
            </option>
          )}

          {suppliers.map((supp) => (
            <option key={supp._id} value={supp._id}>
              {supp.name}
              {supp.city ? ` (${supp.city})` : ''}
            </option>
          ))}
        </select>
      </div>

      {isCurrentArchived && (
        <p className="text-[11px] text-amber-700 dark:text-amber-400 font-mono">
          Assigned partner is archived. Keep as-is or select an active supplier.
        </p>
      )}

      {error && !loading && (
        <div className="text-[11px] text-amber-700 dark:text-amber-400 flex items-center gap-1 pt-0.5">
          <AlertCircle className="size-3 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {!loading && !error && suppliers.length === 0 && !archivedSupplier && (
        <p className="text-[11px] text-muted-foreground font-mono">
          No active suppliers registered yet.
        </p>
      )}
    </div>
  );
}
