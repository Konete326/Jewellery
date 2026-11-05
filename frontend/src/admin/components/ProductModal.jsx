import React, { useState, useEffect, useRef, useMemo } from 'react';
import { X, Upload, Trash2, Calculator, Sparkles, Check, AlertCircle, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { fetchCategories } from '@/api/categoryApi';
import { ratesApi } from '@/api/ratesApi';
import { ProductSupplierSelector } from './ProductSupplierSelector';

const PURITY_HALLMARKS = {
  '24K': 'AU · 999.0',
  '22K': 'AU · 916.6',
  '21K': 'AU · 875.0',
  '18K': 'AU · 750.0'
};

const AVAILABILITY_OPTIONS = ['In Stock', 'Made to Order', 'Out of Stock'];

const SKU_REGEX = /^[A-Z0-9-]+$/;

const getCategoryPrefix = (categoryName) => {
  const clean = (categoryName || '').replace(/[^a-zA-Z]/g, '').toUpperCase();
  if (clean.includes('RING')) return 'RNG';
  if (clean.includes('CHAIN')) return 'CHN';
  if (clean.includes('BANGLE')) return 'BNG';
  if (clean.includes('BRACELET')) return 'BRC';
  if (clean.includes('EARRING')) return 'EAR';
  if (clean.includes('NECKLACE')) return 'NCK';
  if (clean.includes('SET') || clean.includes('BRIDAL')) return 'SET';
  if (clean.includes('COIN') || clean.includes('BAR')) return 'BAR';
  return clean.slice(0, 3) || 'JWL';
};

const generateUniqueSku = (catName, existingList = [], currentId = null) => {
  const prefix = getCategoryPrefix(catName);
  let candidate = '';
  let attempts = 0;
  do {
    const randomNum = Math.floor(1000 + Math.random() * 9000);
    candidate = `KS-${prefix}-${randomNum}`;
    attempts++;
  } while (
    existingList.some((p) => p.sku && p.sku.toUpperCase() === candidate && p._id !== currentId) &&
    attempts < 100
  );
  return candidate;
};

export function ProductModal({
  isOpen,
  onClose,
  onSave,
  initialData = null,
  loading = false,
  existingProducts = []
}) {
  const [title, setTitle] = useState('');
  const [sku, setSku] = useState('');
  const [isSkuManuallyEdited, setIsSkuManuallyEdited] = useState(false);
  const [category, setCategory] = useState('');
  const [categoriesList, setCategoriesList] = useState([]);
  const [supplierId, setSupplierId] = useState('');
  const [purity, setPurity] = useState('22K');
  const [grossWeight, setGrossWeight] = useState('');
  const [netWeight, setNetWeight] = useState('');
  const [makingCharges, setMakingCharges] = useState('');
  const [wastagePercent, setWastagePercent] = useState('0');
  const [stoneCharges, setStoneCharges] = useState('');
  const [price, setPrice] = useState('');
  const [isPriceManuallyEdited, setIsPriceManuallyEdited] = useState(false);
  const [stock, setStock] = useState('1');
  const [availability, setAvailability] = useState('In Stock');
  const [description, setDescription] = useState('');
  const [isPublished, setIsPublished] = useState(true);
  const [existingImages, setExistingImages] = useState([]);
  const [newFiles, setNewFiles] = useState([]);
  const [formError, setFormError] = useState('');
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
      setIsSkuManuallyEdited(true);
      setCategory(initialData.category || categoriesList[0] || '');
      setPurity(initialData.purity || '22K');
      setGrossWeight(initialData.grossWeight !== undefined ? String(initialData.grossWeight) : '');
      setNetWeight(initialData.netWeight !== undefined ? String(initialData.netWeight) : '');
      setMakingCharges(initialData.makingCharges !== undefined ? String(initialData.makingCharges) : '');
      setWastagePercent(initialData.wastagePercent !== undefined ? String(initialData.wastagePercent) : '0');
      setStoneCharges(initialData.stoneCharges !== undefined ? String(initialData.stoneCharges) : '');
      setPrice(initialData.price !== undefined ? String(initialData.price) : '');
      setIsPriceManuallyEdited(true);
      setStock(initialData.stock !== undefined ? String(initialData.stock) : '1');
      setAvailability(initialData.availability || 'In Stock');
      setDescription(initialData.description || '');
      setIsPublished(initialData.isPublished !== false);
      setExistingImages(Array.isArray(initialData.images) ? initialData.images : []);
      const initialSuppId = (initialData.supplier && initialData.supplier._id)
        || (initialData.supplierId && typeof initialData.supplierId === 'object' ? initialData.supplierId._id : initialData.supplierId)
        || '';
      setSupplierId(initialSuppId ? String(initialSuppId) : '');
    } else {
      const defaultCat = categoriesList[0] || 'Rings';
      setTitle('');
      setCategory(defaultCat);
      setSupplierId('');
      setPurity('22K');
      setGrossWeight('');
      setNetWeight('');
      setMakingCharges('');
      setWastagePercent('0');
      setStoneCharges('');
      setPrice('');
      setIsPriceManuallyEdited(false);
      setStock('1');
      setAvailability('In Stock');
      setDescription('');
      setIsPublished(true);
      setExistingImages([]);
      const autoSku = generateUniqueSku(defaultCat, existingProducts, null);
      setSku(autoSku);
      setIsSkuManuallyEdited(false);
    }
    setNewFiles([]);
    setFormError('');
  }, [initialData, isOpen, categoriesList]);

  const handleCategoryChange = (newCat) => {
    setCategory(newCat);
    if (!isSkuManuallyEdited && !initialData) {
      const newSku = generateUniqueSku(newCat, existingProducts, null);
      setSku(newSku);
    }
  };

  const handleRegenerateSku = () => {
    const newSku = generateUniqueSku(category || categoriesList[0] || 'Gold', existingProducts, initialData?._id);
    setSku(newSku);
    setIsSkuManuallyEdited(false);
    setFormError('');
  };

  const handleSkuChange = (val) => {
    const formatted = val.toUpperCase().replace(/\s+/g, '-');
    setSku(formatted);
    setIsSkuManuallyEdited(true);
  };

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

  useEffect(() => {
    if (!isPriceManuallyEdited && pricingCalculations.calculatedTotal > 0) {
      setPrice(String(pricingCalculations.calculatedTotal));
    }
  }, [pricingCalculations.calculatedTotal, isPriceManuallyEdited]);

  const trimmedSku = sku.trim().toUpperCase();
  const isSkuFormatValid = !trimmedSku || SKU_REGEX.test(trimmedSku);
  const isDuplicateSku = Boolean(
    trimmedSku &&
    existingProducts.some(
      (p) => p.sku && p.sku.toUpperCase() === trimmedSku && p._id !== initialData?._id
    )
  );

  if (!isOpen) return null;

  const handleFilesSelected = (e) => {
    const files = Array.from(e.target.files || []);
    if (files.length > 0) {
      const valid = files.filter((f) => f.type.startsWith('image/'));
      if (valid.length !== files.length) {
        setFormError('Some non-image files were excluded');
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

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim()) {
      setFormError('Product title is required');
      return;
    }
    if (!netWeight || Number(netWeight) <= 0) {
      setFormError('Net Gold Weight (grams) is required');
      return;
    }
    if (!isSkuFormatValid) {
      setFormError('SKU contains invalid characters. Use uppercase letters, numbers, and hyphens only.');
      return;
    }
    if (isDuplicateSku) {
      setFormError(`Product Code / SKU "${trimmedSku}" is already in use by another piece.`);
      return;
    }

    const finalPrice = price && Number(price) > 0 ? Number(price) : pricingCalculations.calculatedTotal;
    const finalGrossWeight = grossWeight && Number(grossWeight) > 0 ? Number(grossWeight) : Number(netWeight);

    const formData = new FormData();
    formData.append('title', title.trim());
    formData.append('sku', trimmedSku);
    formData.append('category', category.trim() || categoriesList[0] || 'Uncategorized');
    formData.append('purity', purity);
    formData.append('grossWeight', finalGrossWeight);
    formData.append('netWeight', Number(netWeight) || 0);
    formData.append('makingCharges', Number(makingCharges) || 0);
    formData.append('wastagePercent', Number(wastagePercent) || 0);
    formData.append('stoneCharges', Number(stoneCharges) || 0);
    formData.append('price', finalPrice);
    formData.append('stock', Number(stock) || 1);
    formData.append('availability', availability);
    formData.append('description', description.trim());
    formData.append('isPublished', isPublished);
    formData.append('supplierId', supplierId ? String(supplierId) : '');

    existingImages.forEach((img) => formData.append('images', img));
    newFiles.forEach((file) => formData.append('images', file));

    onSave(formData);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs animate-in fade-in">
      <div className="w-full max-w-4xl rounded-2xl border border-border bg-card p-5 sm:p-6 shadow-2xl space-y-4 max-h-[92vh] overflow-y-auto">
        <div className="flex items-center justify-between pb-3 border-b border-border">
          <div>
            <div className="flex items-center gap-2 mb-0.5">
              <span className="text-[10px] uppercase font-mono tracking-widest text-amber-800 dark:text-amber-400 font-semibold">
                Jewellery Inventory
              </span>
              <span className="text-[10px] font-mono px-1.5 py-0.2 rounded border border-border bg-muted/60 text-muted-foreground">
                {PURITY_HALLMARKS[purity]}
              </span>
            </div>
            <h3 className="font-serif text-lg font-semibold text-foreground">
              {initialData ? 'Edit Jewellery Product' : 'Add Jewellery Product'}
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

        {formError && (
          <div className="p-3 rounded-lg border border-rose-500/30 bg-rose-500/10 text-rose-600 dark:text-rose-400 text-xs flex items-center gap-2">
            <AlertCircle className="size-4 shrink-0" />
            <span>{formError}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-3.5">
              <div className="space-y-1">
                <label className="text-xs font-medium text-foreground">
                  Product Name <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  autoFocus
                  placeholder="e.g. 22K Traditional Bridal Choker"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-border bg-background text-xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-foreground/20"
                />
              </div>

              <div className="grid grid-cols-2 gap-2.5">
                <div className="space-y-1">
                  <label className="text-xs font-medium text-foreground">
                    Category <span className="text-rose-500">*</span>
                  </label>
                  <select
                    value={category}
                    onChange={(e) => handleCategoryChange(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-border bg-background text-xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-foreground/20 cursor-pointer"
                  >
                    {categoriesList.length === 0 && <option value="">No categories</option>}
                    {categoriesList.map((cat) => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-medium text-foreground">
                    Gold Purity
                  </label>
                  <select
                    value={purity}
                    onChange={(e) => setPurity(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-border bg-background text-xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-foreground/20 cursor-pointer font-mono"
                  >
                    <option value="22K">22K (AU · 916.6)</option>
                    <option value="24K">24K (AU · 999.0 Pure)</option>
                    <option value="21K">21K (AU · 875.0)</option>
                    <option value="18K">18K (AU · 750.0)</option>
                  </select>
                </div>
              </div>

              <ProductSupplierSelector
                value={supplierId}
                onChange={setSupplierId}
                initialSupplier={initialData?.supplier || initialData?.supplierId}
                disabled={loading}
              />

              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-medium text-foreground">
                    Product Code / SKU
                  </label>
                  <button
                    type="button"
                    onClick={handleRegenerateSku}
                    className="inline-flex items-center gap-1 text-[11px] font-mono text-amber-800 dark:text-amber-400 hover:underline cursor-pointer"
                    title="Generate fresh unique SKU"
                  >
                    <Sparkles className="size-3" />
                    <span>Auto Generate</span>
                  </button>
                </div>
                <div className="relative">
                  <input
                    type="text"
                    placeholder="e.g. KS-RNG-1049"
                    value={sku}
                    onChange={(e) => handleSkuChange(e.target.value)}
                    className={`w-full px-3 py-2 rounded-lg border text-xs font-mono uppercase focus-visible:outline-none focus-visible:ring-2 bg-background ${
                      isDuplicateSku || !isSkuFormatValid
                        ? 'border-rose-500 text-rose-600 focus-visible:ring-rose-500/20'
                        : 'border-border focus-visible:ring-foreground/20'
                    }`}
                  />
                  {trimmedSku && !isDuplicateSku && isSkuFormatValid && (
                    <span className="absolute right-2.5 top-1/2 -translate-y-1/2 text-emerald-600 text-[11px] font-mono flex items-center gap-1">
                      <Check className="size-3" />
                      <span>Valid</span>
                    </span>
                  )}
                </div>
                {isDuplicateSku && (
                  <p className="text-[11px] text-rose-500 font-medium">
                    This SKU is already used by another piece. Click Auto Generate or enter a unique code.
                  </p>
                )}
                {!isSkuFormatValid && (
                  <p className="text-[11px] text-rose-500 font-medium">
                    Use only uppercase letters, numbers, and hyphens (e.g. KS-RNG-1001).
                  </p>
                )}
              </div>

              <div className="grid grid-cols-2 gap-2.5">
                <div className="space-y-1">
                  <label className="text-xs font-medium text-foreground">
                    Net Gold Weight (g) <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="number"
                    step="0.001"
                    min="0.001"
                    required
                    placeholder="e.g. 5.00"
                    value={netWeight}
                    onChange={(e) => {
                      setNetWeight(e.target.value);
                      if (!grossWeight || grossWeight === netWeight) {
                        setGrossWeight(e.target.value);
                      }
                    }}
                    className="w-full px-3 py-2 rounded-lg border border-border bg-background text-xs font-mono font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-foreground/20"
                  />
                </div>

                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-medium text-foreground">
                      Gross Weight (g)
                    </label>
                    {netWeight && (
                      <button
                        type="button"
                        onClick={() => setGrossWeight(netWeight)}
                        className="text-[10px] text-muted-foreground hover:text-foreground cursor-pointer"
                      >
                        = Net
                      </button>
                    )}
                  </div>
                  <input
                    type="number"
                    step="0.001"
                    min="0"
                    placeholder="e.g. 5.50 (with stones)"
                    value={grossWeight}
                    onChange={(e) => setGrossWeight(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-border bg-background text-xs font-mono focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-foreground/20"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2.5">
                <div className="space-y-1">
                  <label className="text-xs font-medium text-foreground">
                    Making (PKR)
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

                <div className="space-y-1">
                  <label className="text-xs font-medium text-foreground">
                    Stone (PKR)
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

                <div className="space-y-1">
                  <label className="text-xs font-medium text-foreground">
                    Wastage (%)
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    min="0"
                    placeholder="0"
                    value={wastagePercent}
                    onChange={(e) => setWastagePercent(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-border bg-background text-xs font-mono focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-foreground/20"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2.5">
                <div className="space-y-1">
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

                <div className="space-y-1">
                  <label className="text-xs font-medium text-foreground">
                    Availability
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
              </div>
            </div>

            <div className="space-y-3.5">
              <div className="rounded-xl border border-amber-500/25 bg-amber-500/5 p-3.5 space-y-2.5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <Calculator className="size-4 text-amber-700 dark:text-amber-400" />
                    <span className="text-xs font-serif font-bold text-foreground">
                      Automated Live Pricing
                    </span>
                  </div>
                  <span className="text-[10px] font-mono text-muted-foreground">
                    {currentRatePerGram ? `Rs. ${currentRatePerGram.toLocaleString()} / g` : 'Fetching rate...'}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2 text-[11px] font-mono">
                  <div className="p-2 rounded-lg border border-border/80 bg-background/80">
                    <span className="text-muted-foreground block text-[9px] uppercase tracking-wider">Pure Gold ({netWeight || 0}g)</span>
                    <span className="font-bold text-foreground">Rs. {pricingCalculations.pureGoldValue.toLocaleString()}</span>
                  </div>
                  <div className="p-2 rounded-lg border border-border/80 bg-background/80">
                    <span className="text-muted-foreground block text-[9px] uppercase tracking-wider">Making + Stones</span>
                    <span className="font-bold text-foreground">Rs. {(pricingCalculations.makingCharges + pricingCalculations.stoneCharges).toLocaleString()}</span>
                  </div>
                </div>

                <div className="p-2.5 rounded-lg border border-amber-500/30 bg-amber-500/10 flex items-center justify-between">
                  <div>
                    <span className="text-amber-900 dark:text-amber-200 block text-[9px] font-mono uppercase tracking-wider font-semibold">
                      Live Calculated Price
                    </span>
                    <span className="text-sm font-mono font-bold text-amber-950 dark:text-amber-100">
                      Rs. {pricingCalculations.calculatedTotal.toLocaleString()}
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="text-emerald-700 dark:text-emerald-400 block text-[9px] font-mono uppercase tracking-wider font-semibold">
                      90% Lock Advance
                    </span>
                    <span className="text-xs font-mono font-bold text-emerald-800 dark:text-emerald-300">
                      Rs. {pricingCalculations.minLockAdvance.toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>

              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-medium text-foreground">
                    Final Selling Price (PKR) <span className="text-rose-500">*</span>
                  </label>
                  {isPriceManuallyEdited ? (
                    <button
                      type="button"
                      onClick={() => {
                        setIsPriceManuallyEdited(false);
                        if (pricingCalculations.calculatedTotal > 0) {
                          setPrice(String(pricingCalculations.calculatedTotal));
                        }
                      }}
                      className="text-[10px] font-mono text-amber-800 dark:text-amber-400 hover:underline cursor-pointer"
                    >
                      Reset to Live Rate
                    </button>
                  ) : (
                    <span className="text-[10px] font-mono text-emerald-600 dark:text-emerald-400">
                      ● Auto-synced with Live Rate
                    </span>
                  )}
                </div>
                <input
                  type="number"
                  min="0"
                  placeholder={pricingCalculations.calculatedTotal > 0 ? String(pricingCalculations.calculatedTotal) : 'e.g. 150000'}
                  value={price}
                  onChange={(e) => {
                    setPrice(e.target.value);
                    setIsPriceManuallyEdited(true);
                  }}
                  className="w-full px-3 py-2 rounded-lg border border-border bg-background text-xs font-mono font-bold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-foreground/20"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-medium text-foreground flex items-center justify-between">
                  <span>Product Photographs (Optional)</span>
                  <span className="text-[10px] text-muted-foreground font-mono">Up to 6 photos</span>
                </label>

                <div className="grid grid-cols-3 sm:grid-cols-6 gap-2 pt-0.5">
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
                      className="aspect-square border border-dashed border-border hover:border-foreground/40 rounded-lg flex flex-col items-center justify-center gap-1 text-center cursor-pointer transition-colors bg-muted/20 text-muted-foreground hover:text-foreground"
                    >
                      <Upload className="size-3.5" />
                      <span className="text-[9px] font-medium">Add Photo</span>
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

              <div className="space-y-1">
                <label className="text-xs font-medium text-foreground">
                  Description (Optional)
                </label>
                <textarea
                  rows={2}
                  placeholder="Design hallmark, filigree detailing, stones..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full px-3 py-1.5 rounded-lg border border-border bg-background text-xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-foreground/20 resize-none"
                />
              </div>

              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="product-publish-check"
                  checked={isPublished}
                  onChange={(e) => setIsPublished(e.target.checked)}
                  className="size-4 rounded border-border text-foreground focus:ring-foreground cursor-pointer"
                />
                <label htmlFor="product-publish-check" className="text-xs font-medium text-foreground cursor-pointer select-none">
                  Publish Live on Storefront
                </label>
              </div>
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
              disabled={loading || isDuplicateSku || !isSkuFormatValid}
              className="bg-foreground text-background hover:bg-neutral-800 cursor-pointer"
            >
              {loading ? 'Saving...' : initialData ? 'Update Product' : 'Save Product'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}