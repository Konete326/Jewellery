import React, { useState, useEffect, useRef } from 'react';
import { X, Trash2, Image as ImageIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function CategoryModal({
  isOpen,
  onClose,
  onSave,
  initialData = null,
  loading = false
}) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [isActive, setIsActive] = useState(true);
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState('');
  const [error, setError] = useState('');
  const fileInputRef = useRef(null);

  useEffect(() => {
    if (initialData) {
      setName(initialData.name || '');
      setDescription(initialData.description || '');
      setIsActive(initialData.isActive !== false);
      setPreviewUrl(initialData.imageUrl || '');
    } else {
      setName('');
      setDescription('');
      setIsActive(true);
      setPreviewUrl('');
    }
    setSelectedFile(null);
    setError('');
  }, [initialData, isOpen]);

  if (!isOpen) return null;

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
    const trimmedName = name.trim();
    if (!trimmedName) {
      setError('Category name is required');
      return;
    }

    const slug = (initialData?.slug || trimmedName).toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    const formData = new FormData();
    formData.append('name', trimmedName);
    formData.append('slug', slug);
    formData.append('description', description.trim());
    formData.append('metalStandard', initialData?.metalStandard || '22K Gold');
    formData.append('hallmark', initialData?.hallmark || 'AU · 916.6');
    formData.append('displayOrder', initialData?.displayOrder ?? 0);
    formData.append('isActive', isActive);

    if (selectedFile) {
      formData.append('image', selectedFile);
    } else if (initialData?.imageUrl && previewUrl) {
      formData.append('imageUrl', previewUrl);
    }

    onSave(formData);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in">
      <div className="w-full max-w-md rounded-2xl border border-border bg-card p-5 sm:p-6 shadow-xl space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-border">
          <div>
            <h3 className="font-serif text-lg font-semibold text-foreground">
              {initialData ? 'Edit Category' : 'Add Category'}
            </h3>
            <p className="text-xs text-muted-foreground mt-0.5">
              Organize your jewellery catalog and collections.
            </p>
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
          <div className="p-2.5 rounded-lg border border-rose-500/30 bg-rose-500/10 text-rose-600 dark:text-rose-400 text-xs">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-3.5">
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-foreground">
              Category Name <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              required
              autoFocus
              placeholder="e.g. Rings, Chains, Bangles, Bridal Sets"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                if (error) setError('');
              }}
              className="w-full px-3 py-2 rounded-lg border border-border bg-background text-xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-foreground/20"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-medium text-foreground">
              Showcase Image (Optional)
            </label>

            {previewUrl ? (
              <div className="relative w-full aspect-[16/7] rounded-lg overflow-hidden border border-border bg-neutral-900 group">
                <img
                  src={previewUrl}
                  alt="Category preview"
                  className="size-full object-cover"
                />
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => fileInputRef.current?.click()}
                    className="h-7 text-xs bg-background/90 cursor-pointer"
                  >
                    Change
                  </Button>
                  <Button
                    type="button"
                    variant="destructive"
                    size="sm"
                    onClick={handleRemoveImage}
                    className="h-7 text-xs cursor-pointer"
                  >
                    <Trash2 className="size-3.5" />
                  </Button>
                </div>
              </div>
            ) : (
              <div
                onClick={() => fileInputRef.current?.click()}
                className="w-full border border-dashed border-border hover:border-foreground/40 rounded-xl p-3.5 flex items-center justify-center gap-2.5 text-center cursor-pointer transition-colors bg-muted/20"
              >
                <div className="p-1.5 rounded-md border border-border bg-card text-muted-foreground">
                  <ImageIcon className="size-4" />
                </div>
                <div className="text-left">
                  <span className="text-xs font-medium text-foreground block">
                    Upload category image
                  </span>
                  <span className="text-[10px] text-muted-foreground block">
                    PNG, JPG or WEBP (Optional)
                  </span>
                </div>
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

          <div className="space-y-1.5">
            <label className="text-xs font-medium text-foreground">
              Description (Optional)
            </label>
            <textarea
              rows={2}
              placeholder="Brief note about this jewellery collection..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-border bg-background text-xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-foreground/20 resize-none"
            />
          </div>

          <div className="flex items-center justify-between pt-1 pb-1">
            <label htmlFor="cat-active-check" className="text-xs font-medium text-foreground cursor-pointer select-none">
              Active on Storefront
            </label>
            <input
              type="checkbox"
              id="cat-active-check"
              checked={isActive}
              onChange={(e) => setIsActive(e.target.checked)}
              className="size-4 rounded border-border text-foreground focus:ring-foreground cursor-pointer"
            />
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
              {loading ? 'Saving...' : initialData ? 'Update Category' : 'Save Category'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}