import React, { useState, useEffect } from 'react';
import { X, Sparkles, Image as ImageIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';

const PRESET_IMAGES = [
  { label: 'Rings', url: '/assets/categories/rings.jpg' },
  { label: 'Chokers', url: '/assets/categories/chokers.jpg' },
  { label: 'Kadas', url: '/assets/categories/kadas.jpg' },
  { label: 'Jhumkas', url: '/assets/categories/jhumkas.jpg' },
  { label: 'Bridal Suites', url: '/assets/categories/bridal-suites.jpg' },
  { label: 'Ruby Choker', url: '/assets/products/choker-ruby-01.jpg' },
  { label: 'Emerald Necklace', url: '/assets/products/necklace-emerald-01.jpg' },
  { label: 'Polki Bangles', url: '/assets/products/bangles-mughal-01.jpg' },
  { label: 'Pure Bullion', url: '/assets/products/guluband-01.jpg' }
];

const PRESET_STANDARDS = [
  '22K Gold',
  '24K Pure Gold',
  '18K / 21K Gold',
  '22K Gold & Polki',
  'Bespoke Alloys'
];

const PRESET_HALLMARKS = [
  'AU · 916.6',
  'AU · 999.0',
  'AU · 750.0',
  'AU · 875.0'
];

export function CategoryModal({
  isOpen,
  onClose,
  onSave,
  initialData = null,
  loading = false
}) {
  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');
  const [metalStandard, setMetalStandard] = useState('22K Gold');
  const [hallmark, setHallmark] = useState('AU · 916.6');
  const [description, setDescription] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [displayOrder, setDisplayOrder] = useState(0);
  const [isActive, setIsActive] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (initialData) {
      setName(initialData.name || '');
      setSlug(initialData.slug || '');
      setMetalStandard(initialData.metalStandard || '22K Gold');
      setHallmark(initialData.hallmark || 'AU · 916.6');
      setDescription(initialData.description || '');
      setImageUrl(initialData.imageUrl || '');
      setDisplayOrder(initialData.displayOrder ?? 0);
      setIsActive(initialData.isActive !== false);
    } else {
      setName('');
      setSlug('');
      setMetalStandard('22K Gold');
      setHallmark('AU · 916.6');
      setDescription('');
      setImageUrl(PRESET_IMAGES[0].url);
      setDisplayOrder(0);
      setIsActive(true);
    }
    setError('');
  }, [initialData, isOpen]);

  if (!isOpen) return null;

  const handleNameChange = (val) => {
    setName(val);
    if (!initialData || !initialData.slug) {
      setSlug(val.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim()) {
      setError('Category title is required');
      return;
    }
    onSave({
      name: name.trim(),
      slug: slug.trim() || name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      metalStandard: metalStandard.trim(),
      hallmark: hallmark.trim(),
      description: description.trim(),
      imageUrl: imageUrl.trim(),
      displayOrder: Number(displayOrder) || 0,
      isActive
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in overflow-y-auto">
      <div className="w-full max-w-lg rounded-2xl border border-border bg-card p-5 sm:p-6 shadow-xl space-y-4 my-8">
        <div className="flex items-center justify-between pb-3 border-b border-border">
          <div>
            <span className="text-[10px] uppercase font-mono tracking-widest text-amber-800 dark:text-amber-400 font-semibold block">
              Atelier Classification
            </span>
            <h3 className="font-serif text-lg font-semibold text-foreground">
              {initialData ? 'Edit Category' : 'Create New Category'}
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-muted-foreground hover:text-foreground p-1 rounded-lg hover:bg-muted transition-colors cursor-pointer"
          >
            <X className="size-4" />
          </button>
        </div>

        {error && (
          <div className="p-3 rounded-lg border border-rose-500/30 bg-rose-500/10 text-rose-600 dark:text-rose-400 text-xs">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-foreground">
              Category Title <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Rings & Solitaires, Chains, Bridal Sets"
              value={name}
              onChange={(e) => handleNameChange(e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-border bg-background text-xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-foreground/20"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-foreground">
                Metal Standard
              </label>
              <select
                value={metalStandard}
                onChange={(e) => setMetalStandard(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-border bg-background text-xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-foreground/20"
              >
                {PRESET_STANDARDS.map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-medium text-foreground">
                Assay Hallmark Stamp
              </label>
              <select
                value={hallmark}
                onChange={(e) => setHallmark(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-border bg-background text-xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-foreground/20 font-mono"
              >
                {PRESET_HALLMARKS.map((h) => (
                  <option key={h} value={h}>{h}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-medium text-foreground">
              Description
            </label>
            <textarea
              rows={2}
              placeholder="Brief description of this jewellery category..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-border bg-background text-xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-foreground/20 resize-none"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-medium text-foreground">
              Showcase Image URL
            </label>
            <input
              type="text"
              placeholder="/assets/categories/rings.jpg or https://..."
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-border bg-background text-xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-foreground/20"
            />
            <div className="flex items-center gap-1.5 pt-1 overflow-x-auto pb-1">
              <span className="text-[10px] font-mono text-muted-foreground shrink-0">Presets:</span>
              {PRESET_IMAGES.map((preset) => (
                <button
                  key={preset.url}
                  type="button"
                  onClick={() => setImageUrl(preset.url)}
                  className={`px-2 py-0.5 rounded text-[10px] font-mono border transition-colors shrink-0 cursor-pointer ${
                    imageUrl === preset.url
                      ? 'bg-foreground text-background border-foreground font-semibold'
                      : 'border-border bg-muted/60 text-muted-foreground hover:text-foreground'
                  }`}
                >
                  {preset.label}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 items-center">
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-foreground">
                Display Order
              </label>
              <input
                type="number"
                min="0"
                value={displayOrder}
                onChange={(e) => setDisplayOrder(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-border bg-background text-xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-foreground/20"
              />
            </div>

            <div className="flex items-center gap-2.5 pt-4">
              <input
                type="checkbox"
                id="cat-active-check"
                checked={isActive}
                onChange={(e) => setIsActive(e.target.checked)}
                className="size-4 rounded border-border text-foreground focus:ring-foreground cursor-pointer"
              />
              <label htmlFor="cat-active-check" className="text-xs font-medium text-foreground cursor-pointer select-none">
                Active on Storefront
              </label>
            </div>
          </div>

          <div className="flex items-center justify-end gap-2 pt-3 border-t border-border">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={onClose}
              disabled={loading}
              className="cursor-pointer"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              size="sm"
              disabled={loading}
              className="bg-foreground text-background hover:bg-neutral-800 cursor-pointer"
            >
              {loading ? 'Saving...' : initialData ? 'Update Category' : 'Create Category'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
