import React, { useState, useEffect } from 'react';
import { Sparkles, UploadCloud, Trash2, Pencil, Image as ImageIcon, Loader2 } from 'lucide-react';
import { galleryApi } from '@/api/galleryApi';
import { ConfirmDeleteModal } from './ConfirmDeleteModal';
import { EditGalleryModal } from './EditGalleryModal';

export function GalleryManagement() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  const [itemToDelete, setItemToDelete] = useState(null);
  const [itemToEdit, setItemToEdit] = useState(null);
  const [savingEdit, setSavingEdit] = useState(false);

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [file, setFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const loadGallery = async () => {
    setLoading(true);
    try {
      const res = await galleryApi.getAll();
      if (res?.data) {
        setItems(res.data);
      }
    } catch {
      setItems([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadGallery();
  }, []);

  const handleFileChange = (e) => {
    const selected = e.target.files?.[0];
    if (selected) {
      setFile(selected);
      const url = URL.createObjectURL(selected);
      setPreviewUrl(url);
      setErrorMsg('');
    }
  };

  const handleRemoveSelectedFile = () => {
    setFile(null);
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
      setPreviewUrl('');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    if (!title.trim()) {
      setErrorMsg('Please specify a project title.');
      return;
    }

    if (!file) {
      setErrorMsg('Please upload a project image.');
      return;
    }

    setSubmitting(true);
    try {
      const formData = new FormData();
      formData.append('title', title.trim());
      if (description.trim()) {
        formData.append('description', description.trim());
      }
      formData.append('image', file);

      const res = await galleryApi.create(formData);
      if (res?.success) {
        setSuccessMsg('Project published to Cloudinary & live gallery!');
        setTitle('');
        setDescription('');
        handleRemoveSelectedFile();
        loadGallery();
        setTimeout(() => setSuccessMsg(''), 4000);
      }
    } catch (err) {
      setErrorMsg(err.message || 'Failed to upload project. Check Cloudinary settings.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleEditSave = async (id, updatedData) => {
    setSavingEdit(true);
    try {
      await galleryApi.update(id, updatedData);
      setSuccessMsg('Masterpiece details updated successfully!');
      setItemToEdit(null);
      loadGallery();
      setTimeout(() => setSuccessMsg(''), 4000);
    } catch (err) {
      setErrorMsg(err.message || 'Failed to update project.');
    } finally {
      setSavingEdit(false);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!itemToDelete) return;
    setDeletingId(itemToDelete._id);
    try {
      await galleryApi.delete(itemToDelete._id);
      setItemToDelete(null);
      loadGallery();
    } catch (err) {
      setErrorMsg(err.message || 'Failed to delete project.');
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="space-y-6">
      <div className="rounded-xl border border-border bg-card p-6 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6">
          <div>
            <h3 className="font-serif text-lg font-semibold text-foreground">
              Add New Gallery Project
            </h3>
            <p className="text-xs text-muted-foreground mt-0.5">
              Upload handcrafted jewelry projects to appear dynamically on the live client gallery slider.
            </p>
          </div>
        </div>

        {errorMsg && (
          <div className="mb-4 p-3 rounded-lg bg-rose-500/10 border border-rose-500/20 text-rose-600 dark:text-rose-400 text-xs">
            {errorMsg}
          </div>
        )}

        {successMsg && (
          <div className="mb-4 p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-xs font-medium">
            {successMsg}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-foreground mb-1">
                Project Title <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. The Florentine Aurelian Sigil"
                className="w-full h-10 px-3 rounded-lg border border-border bg-background text-foreground text-xs focus:outline-none focus:ring-1 focus:ring-amber-500"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-foreground mb-1">
                Description <span className="text-muted-foreground font-normal">(Optional)</span>
              </label>
              <input
                type="text"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="e.g. 18K Hand-hammered gold with raw uncut diamond"
                className="w-full h-10 px-3 rounded-lg border border-border bg-background text-foreground text-xs focus:outline-none focus:ring-1 focus:ring-amber-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-foreground mb-1">
              Project Photograph <span className="text-rose-500">*</span>
            </label>
            {!previewUrl ? (
              <label className="flex flex-col items-center justify-center border-2 border-dashed border-border rounded-xl p-6 bg-muted/20 hover:bg-muted/40 cursor-pointer transition-colors group">
                <UploadCloud className="size-8 text-muted-foreground group-hover:text-amber-500 transition-colors mb-2" />
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
                  <p className="text-[10px] text-muted-foreground">{(file?.size / (1024 * 1024)).toFixed(2)} MB</p>
                </div>
                <button
                  type="button"
                  onClick={handleRemoveSelectedFile}
                  className="p-2 text-muted-foreground hover:text-rose-500 cursor-pointer transition-colors"
                >
                  <Trash2 className="size-4" />
                </button>
              </div>
            )}
          </div>

          <div className="flex justify-end pt-2">
            <button
              type="submit"
              disabled={submitting}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-amber-600 hover:bg-amber-700 text-white text-xs font-medium transition-colors shadow-xs cursor-pointer disabled:opacity-50"
            >
              {submitting ? (
                <>
                  <Loader2 className="size-3.5 animate-spin" />
                  <span>Uploading to Cloudinary...</span>
                </>
              ) : (
                <>
                  <UploadCloud className="size-3.5" />
                  <span>Publish to Gallery</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>

      <div className="rounded-xl border border-border bg-card p-6 shadow-xs">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-serif text-lg font-semibold text-foreground">
            Current Atelier Projects ({items.length})
          </h3>
          <span className="text-xs text-muted-foreground">Synchronized with live carousel</span>
        </div>

        {loading ? (
          <div className="py-12 flex flex-col items-center justify-center gap-2 text-muted-foreground">
            <Loader2 className="size-6 animate-spin text-amber-500" />
            <span className="text-xs">Loading atelier archive...</span>
          </div>
        ) : items.length === 0 ? (
          <div className="py-12 flex flex-col items-center justify-center text-center p-4 border border-dashed border-border rounded-xl">
            <ImageIcon className="size-8 text-muted-foreground/50 mb-2" />
            <p className="text-xs font-medium text-foreground">No gallery projects published yet</p>
            <p className="text-[11px] text-muted-foreground mt-0.5">Use the form above to upload your first atelier masterpiece.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {items.map((item) => (
              <div
                key={item._id}
                className="group relative rounded-xl border border-border bg-background overflow-hidden shadow-xs hover:border-amber-500/40 transition-all"
              >
                <div className="aspect-[4/3] w-full overflow-hidden bg-neutral-900">
                  <img
                    src={item.imageUrl}
                    alt={item.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
                <div className="p-3.5 flex items-start justify-between gap-2">
                  <div className="min-w-0 flex-1">
                    <h4 className="font-serif text-sm font-semibold text-foreground truncate">{item.title}</h4>
                    {item.description && (
                      <p className="text-[11px] text-muted-foreground mt-0.5 line-clamp-2 leading-relaxed">
                        {item.description}
                      </p>
                    )}
                    <span className="text-[9px] font-mono text-muted-foreground/70 mt-1 block">
                      {new Date(item.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="flex items-center gap-1 shrink-0">
                    <button
                      onClick={() => setItemToEdit(item)}
                      className="p-1.5 rounded-md text-muted-foreground hover:bg-amber-500/10 hover:text-amber-600 transition-colors cursor-pointer"
                      title="Edit project"
                    >
                      <Pencil className="size-3.5" />
                    </button>
                    <button
                      onClick={() => setItemToDelete(item)}
                      className="p-1.5 rounded-md text-muted-foreground hover:bg-rose-500/10 hover:text-rose-500 transition-colors cursor-pointer"
                      title="Remove project"
                    >
                      <Trash2 className="size-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <EditGalleryModal
        isOpen={Boolean(itemToEdit)}
        onClose={() => setItemToEdit(null)}
        onSave={handleEditSave}
        item={itemToEdit}
        loading={savingEdit}
      />

      <ConfirmDeleteModal
        isOpen={Boolean(itemToDelete)}
        onClose={() => setItemToDelete(null)}
        onConfirm={handleDeleteConfirm}
        title={itemToDelete?.title}
        loading={Boolean(deletingId)}
      />
    </div>
  );
}
