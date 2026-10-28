import React, { useState, useEffect } from 'react';
import { LumaSpin } from '@/components/ui/luma-spin';
import { galleryApi } from '@/api/galleryApi';
import { GalleryBentoHero } from './GalleryBentoHero';
import { GalleryCarouselShowcase } from './GalleryCarouselShowcase';
import { GalleryCatalogGrid } from './GalleryCatalogGrid';
import { GalleryUploadCard } from './GalleryUploadCard';
import { ConfirmDeleteModal } from './ConfirmDeleteModal';
import { EditGalleryModal } from './EditGalleryModal';
import { ProductReviewsModal } from './ProductReviewsModal';
import { toast } from 'sonner';

export function GalleryManagement() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  const [itemToDelete, setItemToDelete] = useState(null);
  const [itemToEdit, setItemToEdit] = useState(null);
  const [reviewItemToInspect, setReviewItemToInspect] = useState(null);
  const [savingEdit, setSavingEdit] = useState(false);

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

  const handleEditSave = async (id, updatedData) => {
    setSavingEdit(true);
    try {
      await galleryApi.update(id, updatedData);
      toast.success('Masterpiece updated', {
        description: 'Changes synchronized to live gallery and carousel.'
      });
      setItemToEdit(null);
      loadGallery();
    } catch (err) {
      toast.error('Update failed', {
        description: err.message || 'Could not update jewelry piece.'
      });
    } finally {
      setSavingEdit(false);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!itemToDelete) return;
    setDeletingId(itemToDelete._id);
    try {
      await galleryApi.delete(itemToDelete._id);
      toast.success('Piece removed', {
        description: `${itemToDelete.title} removed from atelier gallery.`
      });
      setItemToDelete(null);
      loadGallery();
    } catch (err) {
      toast.error('Deletion failed', {
        description: err.message || 'Could not remove jewelry piece.'
      });
    } finally {
      setDeletingId(null);
    }
  };

  const handleReviewUpdated = (pieceId, updatedReviews) => {
    setItems((prev) =>
      prev.map((it) => {
        if (String(it._id) === String(pieceId)) {
          const totalScore = updatedReviews.reduce((sum, r) => sum + Number(r.rating || 5), 0);
          const newAvg = updatedReviews.length > 0 ? Number((totalScore / updatedReviews.length).toFixed(1)) : 0;
          return {
            ...it,
            reviews: updatedReviews,
            reviewCount: updatedReviews.length,
            averageRating: newAvg,
          };
        }
        return it;
      })
    );
  };

  const handleUploaded = () => {
    toast.success('Piece published', {
      description: 'Masterpiece is now live on the storefront slider.'
    });
    loadGallery();
  };

  if (loading) {
    return (
      <div className="py-24 flex items-center justify-center">
        <LumaSpin size={32} />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <GalleryBentoHero
        items={items}
        onOpenUpload={() => setIsUploadOpen((prev) => !prev)}
      />

      {isUploadOpen && (
        <GalleryUploadCard
          isOpen={isUploadOpen}
          onClose={() => setIsUploadOpen(false)}
          onUploaded={handleUploaded}
        />
      )}

      <GalleryCarouselShowcase
        items={items}
        onEdit={setItemToEdit}
        onDelete={setItemToDelete}
        onInspectReviews={setReviewItemToInspect}
      />

      <GalleryCatalogGrid
        items={items}
        onEdit={setItemToEdit}
        onDelete={setItemToDelete}
        onInspectReviews={setReviewItemToInspect}
      />

      <ProductReviewsModal
        isOpen={Boolean(reviewItemToInspect)}
        onClose={() => setReviewItemToInspect(null)}
        item={reviewItemToInspect}
        onReviewUpdated={handleReviewUpdated}
      />

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
