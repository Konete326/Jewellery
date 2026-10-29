import React, { useState, useEffect, useRef } from 'react';
import { X, Upload, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

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
  const [displayOrder, setDisplayOrder] = useState(0);
  const [isActive, setIsActive] = useState(true);
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState('');
  const [error, setError] = useState('');
  const fileInputRef = useRef(null);

  useEffect(() => {
    if (initialData) {
      setName(initialData.name || '');
      setSlug(initialData.slug || '');
      setMetalStandard(initialData.metalStandard || '22K Gold');
      setHallmark(initialData.hallmark || 'AU · 916.6');
      setDescription(initialData.description || '');
      setDisplayOrder(initialData.displayOrder ?? 0);
      setIsActive(initialData.isActive !== false);
      setPreviewUrl(initialData.imageUrl || '');
    } else {
      setName('');
      setSlug('');
      setMetalStandard('22K Gold');
      setHallmark('AU · 916.6');
      setDescription('');
      setDisplayOrder(0);
      setIsActive(true);
      setPreviewUrl('');
    }
    setSelectedFile(null);
    setError('');
  }, [initialData, isOpen]);

  if (!isOpen) return null;

  const handleNameChange = (val) => {
    setName(val);
    if (!initialData || !initialData.slug) {
      setSlug(val.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''));
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        setError('Please select a valid image file');
        return;
      }
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
      setError('');
    }
  };

  const handleRemoveImage = () => {
    setSelectedFile(null);
    setPreviewUrl('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim()) {
      setError('Category title is required');
      return;
    }
    const formData = new FormData();
    formData.append('name', name.trim());
    formData.append('slug', slug.trim() || name.toLowerCase().replace(/[^a-z0-9]+/g, '-'));
    formData.append('metalStandard', metalStandard.trim());
    formData.append('hallmark', hallmark.trim());
    formData.append('description', description.trim());
    formData.append('displayOrder', Number(displayOrder) || 0);
    formData.append('isActive', isActive);

    if (selectedFile) {
      formData.append('image', selectedFile);
    } else if (initialData?.imageUrl) {
      formData.append('imageUrl', previewUrl);
    }

    onSave(formData);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in overflow-y-auto">
      <div className="w-full max-w-lg rounded-2xl border border-border bg-card p-5 sm:p-6 shadow-xl space-y-4 my-8">
        <div className="flex items-center justify-between pb-3 border-b border-border">
          <div>
            <span className="text-[10px] uppercase font-mono tracking-widest text-amber-800 dark:text-amber-400 font-semibold block">
              Atelier Architecture
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
              Description (Optional)
            </label>
            <textarea
              rows={2}
              placeholder="Brief description of this jewellery collection..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-border bg-background text-xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-foreground/20 resize-none"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-medium text-foreground flex items-center justify-between">
              <span>Showcase Image (Optional)</span>
              <span className="text-[10px] text-muted-foreground font-mono">Cloudinary Powered</span>
            </label>

            {previewUrl ? (
              <div className="relative w-full aspect-[16/7] rounded-lg overflow-hidden border border-border bg-neutral-900 group">
                <img
                  src={previewUrl}
                  alt="Category preview"
                  className="size-full object-cover"
                />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => fileInputRef.current?.click()}
                    className="h-8 text-xs bg-background/90 cursor-pointer"
                  >
                    Change Image
                  </Button>
                  <Button
                    type="button"
                    variant="destructive"
                    size="sm"
                    onClick={handleRemoveImage}
                    className="h-8 text-xs cursor-pointer"
                  >
                    <Trash2 className="size-3.5" />
                  </Button>
                </div>
              </div>
            ) : (
              <div
                onClick={() => fileInputRef.current?.click()}
                className="w-full border-2 border-dashed border-border hover:border-foreground/40 rounded-xl p-4 sm:p-5 flex flex-col items-center justify-center gap-1.5 text-center cursor-pointer transition-colors bg-muted/20"
              >
                <div className="p-2 rounded-lg border border-border bg-card text-muted-foreground">
                  <Upload className="size-4" />
                </div>
                <span className="text-xs font-medium text-foreground">
                  Click to select an image from your computer
                </span>
                <span className="text-[10px] text-muted-foreground">
                  PNG, JPG, WEBP up to 10MB • Uploads to Cloudinary
                </span>
              </div>
            )}

            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="hidden"
            />
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
