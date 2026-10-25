import React, { useState, useEffect } from 'react';
import { X, Gem, Loader2, Save } from 'lucide-react';
import { JEWELLERY_CATEGORIES } from '@/constants/categories';

export function EditGalleryModal({ isOpen, onClose, onSave, item, loading }) {
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState(JEWELLERY_CATEGORIES[0]);
  const [description, setDescription] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    if (item) {
      setTitle(item.title || '');
      setCategory(item.category || JEWELLERY_CATEGORIES[0]);
      setDescription(item.description || '');
      setErrorMsg('');
    }
  }, [item]);

  if (!isOpen || !item) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim()) {
      setErrorMsg('Project title cannot be empty.');
      return;
    }
    onSave(item._id, {
      title: title.trim(),
      category: category || JEWELLERY_CATEGORIES[0],
      description: description.trim()
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div 
        className="w-full max-w-lg rounded-2xl border border-border bg-card p-6 shadow-2xl relative animate-in zoom-in-95 duration-200"
        role="dialog"
        aria-modal="true"
      >
        <button
          onClick={onClose}
          disabled={loading}
          className="absolute top-4 right-4 p-1.5 rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground transition-colors cursor-pointer"
        >
          <X className="size-4" />
        </button>

        <div className="flex items-center gap-2 mb-2">
          <div className="size-8 rounded-lg bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-600 dark:text-amber-400">
            <Gem className="size-4" />
          </div>
          <div>
            <h3 className="font-serif text-lg font-semibold text-foreground">
              Edit Gallery Masterpiece
            </h3>
            <p className="text-xs text-muted-foreground">
              Modify title and description for live display.
            </p>
          </div>
        </div>

        {errorMsg && (
          <div className="mt-3 p-2.5 rounded-lg bg-rose-500/10 border border-rose-500/20 text-rose-600 dark:text-rose-400 text-xs">
            {errorMsg}
          </div>
        )}

        <form onSubmit={handleSubmit} className="mt-4 space-y-4">
          <div className="flex items-center gap-4 p-3 rounded-xl border border-border bg-muted/20">
            <img
              src={item.imageUrl}
              alt={item.title}
              className="size-16 rounded-lg object-cover border border-border"
            />
            <div className="min-w-0 flex-1">
              <span className="text-[10px] uppercase tracking-widest font-mono text-muted-foreground">
                Photograph
              </span>
              <p className="text-xs text-muted-foreground truncate">{item.imageUrl}</p>
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-foreground mb-1">
              Project Title <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Masterpiece title"
              className="w-full h-10 px-3 rounded-lg border border-border bg-background text-foreground text-xs focus:outline-none focus:ring-1 focus:ring-amber-500"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-foreground mb-1">
              Jewellery Category <span className="text-rose-500">*</span>
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full h-10 px-3 rounded-lg border border-border bg-background text-foreground text-xs focus:outline-none focus:ring-1 focus:ring-amber-500 cursor-pointer"
            >
              {JEWELLERY_CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-medium text-foreground mb-1">
              Description
            </label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Details regarding materials, craft, or provenance"
              className="w-full p-3 rounded-lg border border-border bg-background text-foreground text-xs focus:outline-none focus:ring-1 focus:ring-amber-500 resize-none"
            />
          </div>

          <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-border">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="px-4 py-2 rounded-lg border border-border bg-background hover:bg-muted text-xs font-medium text-foreground transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-amber-600 hover:bg-amber-700 text-white text-xs font-medium transition-colors shadow-xs cursor-pointer disabled:opacity-50"
            >
              {loading ? (
                <>
                  <Loader2 className="size-3.5 animate-spin" />
                  <span>Saving...</span>
                </>
              ) : (
                <>
                  <Save className="size-3.5" />
                  <span>Save Changes</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
