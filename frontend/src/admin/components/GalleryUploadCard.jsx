import React, { useState } from 'react';
import { UploadCloud, Trash2, Loader2, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { JEWELLERY_CATEGORIES } from '@/constants/categories';
import { galleryApi } from '@/api/galleryApi';

export function GalleryUploadCard({ isOpen, onClose, onUploaded }) {
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState(JEWELLERY_CATEGORIES[0]);
  const [description, setDescription] = useState('');
  const [file, setFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  if (!isOpen) return null;

  const handleFileChange = (e) => {
    const selected = e.target.files?.[0];
    if (selected) {
      setFile(selected);
      const url = URL.createObjectURL(selected);
      setPreviewUrl(url);
      setErrorMsg('');
    }
  };

  const handleRemoveFile = () => {
    setFile(null);
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
      setPreviewUrl('');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');

    if (!title.trim()) {
      setErrorMsg('Please specify a piece title.');
      return;
    }
    if (!file) {
      setErrorMsg('Please upload a high-resolution photograph.');
      return;
    }

    setSubmitting(true);
    try {
      const formData = new FormData();
      formData.append('title', title.trim());
      formData.append('category', category || JEWELLERY_CATEGORIES[0]);
      if (description.trim()) {
        formData.append('description', description.trim());
      }
      formData.append('image', file);

      const res = await galleryApi.create(formData);
      if (res?.success) {
        setTitle('');
        setCategory(JEWELLERY_CATEGORIES[0]);
        setDescription('');
        handleRemoveFile();
        onUploaded?.();
        onClose?.();
      }
    } catch (err) {
      setErrorMsg(err.message || 'Failed to upload piece to Cloudinary.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="rounded-xl border border-border/80 bg-card p-5 sm:p-6 shadow-xs relative">
      <div className="flex items-center justify-between pb-4 mb-4 border-b border-border/60">
        <div>
          <h3 className="font-serif text-lg font-semibold text-foreground">
            Publish New Masterpiece
          </h3>
          <p className="text-xs text-muted-foreground mt-0.5">
            Add high-jewellery photography to live storefront & carousel slider.
          </p>
        </div>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          onClick={onClose}
          className="size-8 text-muted-foreground hover:text-foreground cursor-pointer"
        >
          <X className="size-4" />
        </Button>
      </div>

      {errorMsg && (
        <div className="mb-4 p-3 rounded-lg bg-rose-500/10 border border-rose-500/20 text-rose-600 dark:text-rose-400 text-xs">
          {errorMsg}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-medium text-foreground mb-1">
              Piece Title <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. 22K Royal Polki Bridal Guluband"
              className="w-full h-10 px-3 rounded-lg border border-border bg-background text-foreground text-xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-foreground/20"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-foreground mb-1">
              Jewellery Category <span className="text-rose-500">*</span>
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full h-10 px-3 rounded-lg border border-border bg-background text-foreground text-xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-foreground/20 cursor-pointer"
            >
              {JEWELLERY_CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          <div className="md:col-span-2">
            <label className="block text-xs font-medium text-foreground mb-1">
              Description <span className="text-muted-foreground font-normal">(Optional)</span>
            </label>
            <input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="e.g. Handcrafted in 22K yellow gold with emerald teardrops"
              className="w-full h-10 px-3 rounded-lg border border-border bg-background text-foreground text-xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-foreground/20"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-medium text-foreground mb-1">
            Masterpiece Photograph <span className="text-rose-500">*</span>
          </label>
          {!previewUrl ? (
            <label className="flex flex-col items-center justify-center border-2 border-dashed border-border/80 rounded-xl p-6 bg-muted/20 hover:bg-muted/40 cursor-pointer transition-colors group">
              <UploadCloud className="size-8 text-muted-foreground group-hover:text-foreground transition-colors mb-2" />
              <span className="text-xs font-medium text-foreground">Click to upload photo or drag & drop</span>
              <span className="text-[10px] text-muted-foreground mt-0.5">PNG, JPG, WEBP up to 10MB</span>
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
              />
            </label>
          ) : (
            <div className="flex items-center gap-4 p-3 rounded-xl border border-border bg-muted/30">
              <img
                src={previewUrl}
                alt="Upload preview"
                className="size-16 object-cover rounded-lg border border-border"
              />
              <div className="flex-1 min-w-0">
                <p className="text-xs font-medium text-foreground truncate">{file?.name}</p>
                <p className="text-[10px] text-muted-foreground">
                  {(file?.size / (1024 * 1024)).toFixed(2)} MB
                </p>
              </div>
              <button
                type="button"
                onClick={handleRemoveFile}
                className="p-2 text-muted-foreground hover:text-rose-500 cursor-pointer transition-colors"
              >
                <Trash2 className="size-4" />
              </button>
            </div>
          )}
        </div>

        <div className="flex justify-end gap-2 pt-2 border-t border-border/60">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={onClose}
            className="cursor-pointer text-xs"
          >
            Cancel
          </Button>
          <Button
            type="submit"
            size="sm"
            disabled={submitting}
            className="cursor-pointer text-xs gap-1.5"
          >
            {submitting ? (
              <>
                <Loader2 className="size-3.5 animate-spin" />
                <span>Uploading...</span>
              </>
            ) : (
              <>
                <UploadCloud className="size-3.5" />
                <span>Publish Piece</span>
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}
