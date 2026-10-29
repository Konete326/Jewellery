import React, { useState, useEffect, useRef, useMemo } from 'react';
import { X, Upload, Trash2, Calculator, Check, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { fetchCategories } from '@/api/categoryApi';
import { ratesApi } from '@/api/ratesApi';

const PURITY_HALLMARKS = {
  '24K': 'AU · 999.0',
  '22K': 'AU · 916.6',
  '21K': 'AU · 875.0',
  '18K': 'AU · 750.0'
};

const AVAILABILITY_OPTIONS = ['In Stock', 'Made to Order', 'Out of Stock'];

export function ProductModal({
  isOpen,
  onClose,
  onSave,
  initialData = null,
  loading = false
}) {
  const [title, setTitle] = useState('');
  const [sku, setSku] = useState('');
  const [category, setCategory] = useState('');
  const [categoriesList, setCategoriesList] = useState([]);
  const [purity, setPurity] = useState('22K');
  const [grossWeight, setGrossWeight] = useState('');
  const [netWeight, setNetWeight] = useState('');
  const [makingCharges, setMakingCharges] = useState('');
  const [wastagePercent, setWastagePercent] = useState('');
  const [stoneCharges, setStoneCharges] = useState('');
  const [price, setPrice] = useState('');
  const [stock, setStock] = useState('1');
  const [availability, setAvailability] = useState('In Stock');
  const [description, setDescription] = useState('');
  const [isPublished, setIsPublished] = useState(true);
  const [existingImages, setExistingImages] = useState([]);
  const [newFiles, setNewFiles] = useState([]);
  const [error, setError] = useState('');
  const [liveRates, setLiveRates] = useState(null);
  const fileInputRef = useRef(null);

  useEffect(() => {
    let isMounted = true;
    Promise.allSettled([
      fetchCategories({ isActive: true }),
      ratesApi.getRates()
    ]).then(([catRes, rateRes]) => {
      if (!isMounted) return;
      if (catRes.status === 'fulfilled') {
        const list = catRes.value?.data || [];
        if (list.length > 0) {
          const names = list.map((c) => c.name);
          setCategoriesList(names);
          if (!category) setCategory(names[0]);
        }
      }
      if (rateRes.status === 'fulfilled') {
        const rateData = rateRes.value?.data?.gold || rateRes.value?.data || null;
        setLiveRates(rateData);
      }
    }).catch(() => {});
    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    if (initialData) {
      setTitle(initialData.title || '');
      setSku(initialData.sku || '');
      setCategory(initialData.category || categoriesList[0] || '');
      setPurity(initialData.purity || '22K');
      setGrossWeight(initialData.grossWeight !== undefined ? String(initialData.grossWeight) : '');
      setNetWeight(initialData.netWeight !== undefined ? String(initialData.netWeight) : '');
      setMakingCharges(initialData.makingCharges !== undefined ? String(initialData.makingCharges) : '');
      setWastagePercent(initialData.wastagePercent !== undefined ? String(initialData.wastagePercent) : '');
      setStoneCharges(initialData.stoneCharges !== undefined ? String(initialData.stoneCharges) : '');
      setPrice(initialData.price !== undefined ? String(initialData.price) : '');
      setStock(initialData.stock !== undefined ? String(initialData.stock) : '1');
      setAvailability(initialData.availability || 'In Stock');
      setDescription(initialData.description || '');
      setIsPublished(initialData.isPublished !== false);
      setExistingImages(Array.isArray(initialData.images) ? initialData.images : []);
    } else {
      setTitle('');
      setSku('');
      setCategory(categoriesList[0] || '');
      setPurity('22K');
      setGrossWeight('');
      setNetWeight('');
      setMakingCharges('');
      setWastagePercent('');
      setStoneCharges('');
      setPrice('');
      setStock('1');
      setAvailability('In Stock');
      setDescription('');
      setIsPublished(true);
      setExistingImages([]);
    }
    setNewFiles([]);
    setError('');
  }, [initialData, isOpen, categoriesList]);

  const currentRatePerGram = useMemo(() => {
    if (!liveRates) return 0;
    return liveRates[purity]?.gram || 0;
  }, [liveRates, purity]);

  const pricingCalculations = useMemo(() => {
    const net = Number(netWeight) || 0;
    const rate = currentRatePerGram || 0;
    const pureValue = Math.round(net * rate);
    const wastePct = Number(wastagePercent) || 0;
    const wasteValue = Math.round(pureValue * (wastePct / 100));
    const goldTotal = pureValue + wasteValue;
    const making = Number(makingCharges) || 0;
    const stone = Number(stoneCharges) || 0;
    const total = goldTotal + making + stone;
    const lockAdvance90 = Math.round(pureValue * 0.9);

    return {
      ratePerGram: rate,
      pureGoldValue: pureValue,
      wastageAmount: wasteValue,
      totalGoldCost: goldTotal,
      makingCharges: making,
      stoneCharges: stone,
      calculatedTotal: total,
      minLockAdvance: lockAdvance90
    };
  }, [netWeight, currentRatePerGram, wastagePercent, makingCharges, stoneCharges]);

  if (!isOpen) return null;

  const handleFilesSelected = (e) => {
    const files = Array.from(e.target.files || []);
    if (files.length > 0) {
      const valid = files.filter((f) => f.type.startsWith('image/'));
      if (valid.length !== files.length) {
        setError('Some non-image files were excluded');
      }
      setNewFiles((prev) => [...prev, ...valid].slice(0, 6));
    }
  };

  const handleRemoveExistingImage = (idx) => {
    setExistingImages((prev) => prev.filter((_, i) => i !== idx));
  };

  const handleRemoveNewFile = (idx) => {
    setNewFiles((prev) => prev.filter((_, i) => i !== idx));
  };

  const applyCalculatedPrice = () => {
    if (pricingCalculations.calculatedTotal > 0) {
      setPrice(String(pricingCalculations.calculatedTotal));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim()) {
      setError('Product title is required');
      return;
    }
    if (!netWeight || Number(netWeight) <= 0) {
      setError('Net Gold Weight (grams) is required');
      return;
    }

    const finalPrice = price && Number(price) > 0 ? Number(price) : pricingCalculations.calculatedTotal;

    const formData = new FormData();
    formData.append('title', title.trim());
    formData.append('sku', sku.trim().toUpperCase());
    formData.append('category', category.trim() || categoriesList[0] || 'Uncategorized');
    formData.append('purity', purity);
    formData.append('grossWeight', Number(grossWeight) || 0);
    formData.append('netWeight', Number(netWeight) || 0);
    formData.append('makingCharges', Number(makingCharges) || 0);
    formData.append('wastagePercent', Number(wastagePercent) || 0);
    formData.append('stoneCharges', Number(stoneCharges) || 0);
    formData.append('price', finalPrice);
    formData.append('stock', Number(stock) || 0);
    formData.append('availability', availability);
    formData.append('description', description.trim());
    formData.append('isPublished', isPublished);

    existingImages.forEach((img) => formData.append('images', img));
    newFiles.forEach((file) => formData.append('images', file));

    onSave(formData);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs animate-in fade-in overflow-y-auto">
      <div className="w-full max-w-2xl rounded-2xl border border-border bg-card p-5 sm:p-6 shadow-2xl space-y-4 my-6 max-h-[92vh] overflow-y-auto">
        <div className="flex items-center justify-between pb-3 border-b border-border">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] uppercase font-mono tracking-widest text-amber-800 dark:text-amber-400 font-semibold">
                Saddar Atelier Catalog
              </span>
              <span className="text-[10px] font-mono px-1.5 py-0.5 rounded border border-border bg-muted/60 text-muted-foreground">
                {PURITY_HALLMARKS[purity]}
              </span>
            </div>
            <h3 className="font-serif text-lg font-semibold text-foreground">
              {initialData ? 'Edit Masterpiece Piece' : 'Add New Jewellery Product'}
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
                Product Name <span className="text-rose-500">*</span>
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
                Product Code / SKU
              </label>
              <input
                type="text"
                placeholder="e.g. KS-RNG-001"
                value={sku}
                onChange={(e) => setSku(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-border bg-background text-xs font-mono uppercase focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-foreground/20"
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
                {categoriesList.length === 0 && <option value="">No categories available</option>}
                {categoriesList.map((cat) => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-medium text-foreground flex items-center justify-between">
                <span>Gold Purity</span>
                <span className="text-[10px] font-mono text-muted-foreground">{PURITY_HALLMARKS[purity]}</span>
              </label>
              <select
                value={purity}
                onChange={(e) => setPurity(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-border bg-background text-xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-foreground/20 cursor-pointer font-mono"
              >
                <option value="24K">24K (Pure Gold · 999.0)</option>
                <option value="22K">22K (Standard Hallmark · 916.6)</option>
                <option value="21K">21K (Middle East Standard · 875.0)</option>
                <option value="18K">18K (Luxury Fine · 750.0)</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-medium text-foreground">
                Net Gold Weight (grams) <span className="text-rose-500">*</span>
              </label>
              <input
                type="number"
                step="0.001"
                min="0.001"
                required
                placeholder="e.g. 5.00"
                value={netWeight}
                onChange={(e) => setNetWeight(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-border bg-background text-xs font-mono focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-foreground/20"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-medium text-foreground">
                Gross Weight (grams) <span className="text-muted-foreground font-normal">(Optional)</span>
              </label>
              <input
                type="number"
                step="0.001"
                min="0"
                placeholder="e.g. 5.85 (with stones)"
                value={grossWeight}
                onChange={(e) => setGrossWeight(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-border bg-background text-xs font-mono focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-foreground/20"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-medium text-foreground">
                Wastage (%)
              </label>
              <input
                type="number"
                step="0.1"
                min="0"
                placeholder="e.g. 2.5 or 0"
                value={wastagePercent}
                onChange={(e) => setWastagePercent(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-border bg-background text-xs font-mono focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-foreground/20"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-medium text-foreground">
                Making Charges (PKR)
              </label>
              <input
                type="number"
                min="0"
                placeholder="e.g. 3000"
                value={makingCharges}
                onChange={(e) => setMakingCharges(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-border bg-background text-xs font-mono focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-foreground/20"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-medium text-foreground">
                Stone Charges (PKR)
              </label>
              <input
                type="number"
                min="0"
                placeholder="e.g. 1000"
                value={stoneCharges}
                onChange={(e) => setStoneCharges(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-border bg-background text-xs font-mono focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-foreground/20"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-medium text-foreground">
                Availability Status
              </label>
              <select
                value={availability}
                onChange={(e) => setAvailability(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-border bg-background text-xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-foreground/20 cursor-pointer"
              >
                {AVAILABILITY_OPTIONS.map((status) => (
                  <option key={status} value={status}>{status}</option>
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
                className="w-full px-3 py-2 rounded-lg border border-border bg-background text-xs font-mono focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-foreground/20"
              />
            </div>
          </div>

          <div className="rounded-xl border border-amber-500/20 bg-amber-500/5 p-3.5 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <Calculator className="size-4 text-amber-700 dark:text-amber-400" />
                <span className="text-xs font-serif font-bold text-foreground">
                  Dynamic Gold Cost & Pricing Engine
                </span>
              </div>
              <span className="text-[10px] font-mono text-muted-foreground">
                Live {purity} Rate: {currentRatePerGram ? `Rs. ${currentRatePerGram.toLocaleString()} / g` : 'Loading...'}
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[11px] font-mono">
              <div className="p-2 rounded-lg border border-border/80 bg-background/80">
                <span className="text-muted-foreground block text-[9px] uppercase tracking-wider">Pure Gold</span>
                <span className="font-bold text-foreground">Rs. {pricingCalculations.pureGoldValue.toLocaleString()}</span>
              </div>
              <div className="p-2 rounded-lg border border-border/80 bg-background/80">
                <span className="text-muted-foreground block text-[9px] uppercase tracking-wider">Wastage ({wastagePercent || 0}%)</span>
                <span className="font-bold text-foreground">Rs. {pricingCalculations.wastageAmount.toLocaleString()}</span>
              </div>
              <div className="p-2 rounded-lg border border-border/80 bg-background/80">
                <span className="text-muted-foreground block text-[9px] uppercase tracking-wider">Making + Stones</span>
                <span className="font-bold text-foreground">Rs. {(pricingCalculations.makingCharges + pricingCalculations.stoneCharges).toLocaleString()}</span>
              </div>
              <div className="p-2 rounded-lg border border-amber-500/30 bg-amber-500/10">
                <span className="text-amber-800 dark:text-amber-300 block text-[9px] uppercase tracking-wider">Live Total Price</span>
                <span className="font-bold text-amber-900 dark:text-amber-200">Rs. {pricingCalculations.calculatedTotal.toLocaleString()}</span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pt-2 border-t border-amber-500/20">
              <div className="text-[11px]">
                <span className="font-semibold text-foreground">90% Advance to Lock Rate: </span>
                <span className="font-mono font-bold text-emerald-600 dark:text-emerald-400">
                  Rs. {pricingCalculations.minLockAdvance.toLocaleString()}
                </span>
                <p className="text-[10px] text-muted-foreground mt-0.5">
                  Deposit ≥ 90% locks the gold rate permanently against future market spikes.
                </p>
              </div>

              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={applyCalculatedPrice}
                className="h-7 px-2.5 text-[11px] border-amber-500/30 hover:bg-amber-500/10 text-foreground cursor-pointer shrink-0"
              >
                <span>Use Calculated Price</span>
                <ArrowRight className="size-3 ml-1" />
              </Button>
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-medium text-foreground flex items-center justify-between">
              <span>Final Selling Price (PKR) <span className="text-rose-500">*</span></span>
              <span className="text-[10px] text-muted-foreground">Auto-populates from calculator if left empty</span>
            </label>
            <input
              type="number"
              min="0"
              placeholder={pricingCalculations.calculatedTotal > 0 ? String(pricingCalculations.calculatedTotal) : 'e.g. 450000'}
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-border bg-background text-xs font-mono font-bold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-foreground/20"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-medium text-foreground">
              Description <span className="text-muted-foreground font-normal">(Optional)</span>
            </label>
            <textarea
              rows={2}
              placeholder="Craftsmanship details, hallmarking, stone certification..."
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

            <div className="grid grid-cols-3 sm:grid-cols-6 gap-2 pt-1">
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
