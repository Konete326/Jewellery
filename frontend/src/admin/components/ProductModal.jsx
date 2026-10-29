import React, { useState, useEffect, useRef } from 'react';
import { X, Upload, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { fetchCategories } from '@/api/categoryApi';
import { JEWELLERY_CATEGORIES } from '@/constants/categories';

const PRESET_METALS = [
  '22K Gold',
  '24K Pure Gold',
  '18K / 21K Gold',
  '18K White Gold',
  '18K Rose Gold',
  'Platinum'
];

const PRESET_HALLMARKS = [
  'AU · 916.6',
  'AU · 999.0',
  'AU · 750.0',
  'AU · 875.0'
];

export function ProductModal({
  isOpen,
  onClose,
  onSave,
  initialData = null,
  loading = false
}) {
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('');
  const [categoriesList, setCategoriesList] = useState(JEWELLERY_CATEGORIES);
  const [price, setPrice] = useState('');
  const [stock, setStock] = useState('1');
  const [metal, setMetal] = useState('22K Gold');
  const [hallmark, setHallmark] = useState('AU · 916.6');
  const [weight, setWeight] = useState('');
  const [description, setDescription] = useState('');
  const [isPublished, setIsPublished] = useState(true);
  const [existingImages, setExistingImages] = useState([]);
  const [newFiles, setNewFiles] = useState([]);
  const [error, setError] = useState('');
  const fileInputRef = useRef(null);

  useEffect(() => {
    let isMounted = true;
    fetchCategories({ isActive: true })
      .then((res) => {
        if (!isMounted) return;
        const list = res?.data || [];
        if (list.length > 0) {
          const names = list.map((c) => c.name);
          setCategoriesList(names);
          if (!category) {
            setCategory(names[0]);
          }
        }
      })
      .catch(() => {});
    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    if (initialData) {
      setTitle(initialData.title || '');
      setCategory(initialData.category || categoriesList[0] || 'Bridal Sets');
      setPrice(initialData.price !== undefined ? String(initialData.price) : '');
      setStock(initialData.stock !== undefined ? String(initialData.stock) : '1');
      setMetal(initialData.metal || '22K Gold');
      setHallmark(initialData.hallmark || 'AU · 916.6');
      setWeight(initialData.weight || '');
      setDescription(initialData.description || '');
      setIsPublished(initialData.isPublished !== false);
      setExistingImages(Array.isArray(initialData.images) ? initialData.images : []);
    } else {
      setTitle('');
      setCategory(categoriesList[0] || 'Bridal Sets');
      setPrice('');
      setStock('1');
      setMetal('22K Gold');
      setHallmark('AU · 916.6');
      setWeight('');
      setDescription('');
      setIsPublished(true);
      setExistingImages([]);
    }
    setNewFiles([]);
    setError('');
  }, [initialData, isOpen]);

  if (!isOpen) return null;

  const handleFilesSelected = (e) => {
    const files = Array.from(e.target.files || []);
    if (files.length > 0) {
      const valid = files.filter((f) => f.type.startsWith('image/'));
      if (valid.length !== files.length) {
        setError('Some files were ignored because they are not valid images');
      }
      setNewFiles((prev) => [...prev, ...valid].slice(0, 6));
    }
  };

  const handleRemoveExistingImage = (indexToRemove) => {
    setExistingImages((prev) => prev.filter((_, i) => i !== indexToRemove));
  };

  const handleRemoveNewFile = (indexToRemove) => {
    setNewFiles((prev) => prev.filter((_, i) => i !== indexToRemove));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim()) {
      setError('Product title is required');
      return;
    }
    if (!price || Number(price) <= 0) {
      setError('Please specify a valid price');
      return;
    }

    const formData = new FormData();
    formData.append('title', title.trim());
    formData.append('category', category.trim() || categoriesList[0]);
    formData.append('price', Number(price));
    formData.append('stock', Number(stock) || 0);
    formData.append('metal', metal.trim());
    formData.append('hallmark', hallmark.trim());
    formData.append('weight', weight.trim());
    formData.append('description', description.trim());
    formData.append('isPublished', isPublished);

    existingImages.forEach((img) => {
      formData.append('images', img);
    });

    newFiles.forEach((file) => {
      formData.append('images', file);
    });

    onSave(formData);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in overflow-y-auto">
      <div className="w-full max-w-xl rounded-2xl border border-border bg-card p-5 sm:p-6 shadow-xl space-y-4 my-8">
        <div className="flex items-center justify-between pb-3 border-b border-border">
          <div>
            <span className="text-[10px] uppercase font-mono tracking-widest text-amber-800 dark:text-amber-400 font-semibold block">
              Inventory Catalog
            </span>
            <h3 className="font-serif text-lg font-semibold text-foreground">
              {initialData ? 'Edit Product' : 'Add New Product'}
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
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div className="space-y-1.5 md:col-span-2">
              <label className="text-xs font-medium text-foreground">
                Product Title <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Royal Solitaire Diamond Engagement Ring"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-border bg-background text-xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-foreground/20"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-medium text-foreground">
                Category <span className="text-rose-500">*</span>
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-border bg-background text-xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-foreground/20 cursor-pointer"
              >
                {categoriesList.map((cat) => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-medium text-foreground">
                Price (PKR) <span className="text-rose-500">*</span>
              </label>
              <input
                type="number"
                required
                min="0"
                placeholder="e.g. 450000"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-border bg-background text-xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-foreground/20"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-medium text-foreground">
                Metal Standard
              </label>
              <select
                value={metal}
                onChange={(e) => setMetal(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-border bg-background text-xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-foreground/20"
              >
                {PRESET_METALS.map((m) => (
                  <option key={m} value={m}>{m}</option>
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

            <div className="space-y-1.5">
              <label className="text-xs font-medium text-foreground">
                Stock Quantity
              </label>
              <input
                type="number"
                min="0"
                value={stock}
                onChange={(e) => setStock(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-border bg-background text-xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-foreground/20"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-medium text-foreground">
                Gold Weight <span className="text-muted-foreground font-normal">(Optional)</span>
              </label>
              <input
                type="text"
                placeholder="e.g. 14.5g or 1.25 tola"
                value={weight}
                onChange={(e) => setWeight(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-border bg-background text-xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-foreground/20"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-medium text-foreground">
              Description <span className="text-muted-foreground font-normal">(Optional)</span>
            </label>
            <textarea
              rows={2}
              placeholder="Product craftsmanship details, stone certification..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-border bg-background text-xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-foreground/20 resize-none"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-medium text-foreground flex items-center justify-between">
              <span>Product Photographs (Optional)</span>
              <span className="text-[10px] text-muted-foreground font-mono">Up to 6 images • Cloudinary</span>
            </label>

            <div className="grid grid-cols-3 sm:grid-cols-4 gap-2 pt-1">
              {existingImages.map((img, i) => (
                <div key={img} className="relative aspect-square rounded-lg overflow-hidden border border-border bg-neutral-900 group">
                  <img src={img} alt="Product" className="size-full object-cover" />
                  <button
                    type="button"
                    onClick={() => handleRemoveExistingImage(i)}
                    className="absolute top-1 right-1 p-1 rounded-md bg-black/75 text-rose-400 hover:text-rose-300 transition-colors cursor-pointer"
                  >
                    <Trash2 className="size-3" />
                  </button>
                </div>
              ))}

              {newFiles.map((file, i) => (
                <div key={file.name + i} className="relative aspect-square rounded-lg overflow-hidden border border-border bg-neutral-900 group">
                  <img src={URL.createObjectURL(file)} alt="Preview" className="size-full object-cover" />
                  <button
                    type="button"
                    onClick={() => handleRemoveNewFile(i)}
                    className="absolute top-1 right-1 p-1 rounded-md bg-black/75 text-rose-400 hover:text-rose-300 transition-colors cursor-pointer"
                  >
                    <Trash2 className="size-3" />
                  </button>
                </div>
              ))}

              {existingImages.length + newFiles.length < 6 && (
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="aspect-square border-2 border-dashed border-border hover:border-foreground/40 rounded-lg flex flex-col items-center justify-center gap-1 text-center cursor-pointer transition-colors bg-muted/20 text-muted-foreground hover:text-foreground"
                >
                  <Upload className="size-4" />
                  <span className="text-[10px] font-medium">Add Photo</span>
                </button>
              )}
            </div>

            <input
              ref={fileInputRef}
              type="file"
              multiple
              accept="image/*"
              onChange={handleFilesSelected}
              className="hidden"
            />
          </div>

          <div className="flex items-center gap-2.5 pt-2">
            <input
              type="checkbox"
              id="product-publish-check"
              checked={isPublished}
              onChange={(e) => setIsPublished(e.target.checked)}
              className="size-4 rounded border-border text-foreground focus:ring-foreground cursor-pointer"
            />
            <label htmlFor="product-publish-check" className="text-xs font-medium text-foreground cursor-pointer select-none">
              Publish Product Live on Storefront
            </label>
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
              {loading ? 'Saving...' : initialData ? 'Update Product' : 'Create Product'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
