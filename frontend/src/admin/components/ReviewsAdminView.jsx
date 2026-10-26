import React, { useState, useEffect, useMemo } from 'react';
import {
  Star,
  Search,
  RefreshCw,
  Plus,
  Pencil,
  Trash2,
  MessageSquare,
  ExternalLink,
  ShieldCheck,
  Gem,
  LayoutGrid,
  Layers
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { galleryApi } from '@/api/galleryApi';
import { ReviewsMetrics } from './ReviewsMetrics';
import { EditReviewModal } from './EditReviewModal';
import { AddReviewModal } from './AddReviewModal';
import { ConfirmDeleteModal } from './ConfirmDeleteModal';
import { CalendlyCarousel } from '@/components/ui/connected-carousel';
import { LumaSpin } from '@/components/ui/luma-spin';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

export function ReviewsAdminView() {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [ratingFilter, setRatingFilter] = useState('All');
  const [viewLayout, setViewLayout] = useState('carousel');

  const [editingReview, setEditingReview] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editLoading, setEditLoading] = useState(false);

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [addLoading, setAddLoading] = useState(false);

  const [deletingReview, setDeletingReview] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const loadReviews = async () => {
    setLoading(true);
    try {
      const res = await galleryApi.getAllReviews();
      const list = res?.data || (Array.isArray(res) ? res : []);
      setReviews(list);
    } catch {
      toast.error('Unable to fetch client appraisals');
      setReviews([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadReviews();
  }, []);

  const handleEditClick = (review) => {
    setEditingReview(review);
    setIsEditModalOpen(true);
  };

  const handleEditSave = async (updatedData) => {
    if (!editingReview) return;
    setEditLoading(true);
    try {
      await galleryApi.updateReview(
        editingReview.masterpieceId,
        editingReview._id,
        updatedData
      );
      toast.success('Patron appraisal updated successfully');
      setIsEditModalOpen(false);
      setEditingReview(null);
      await loadReviews();
    } catch {
      toast.error('Failed to update appraisal record');
    } finally {
      setEditLoading(false);
    }
  };

  const handleAddSave = async (newReviewData) => {
    setAddLoading(true);
    try {
      await galleryApi.addReview(newReviewData.pieceId, {
        userName: newReviewData.userName,
        userEmail: newReviewData.userEmail,
        rating: newReviewData.rating,
        comment: newReviewData.comment,
        title: newReviewData.title,
        imageUrl: newReviewData.imageUrl
      });
      toast.success('Appraisal added to collection');
      setIsAddModalOpen(false);
      await loadReviews();
    } catch {
      toast.error('Failed to add client appraisal');
    } finally {
      setAddLoading(false);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!deletingReview) return;
    setDeleteLoading(true);
    try {
      await galleryApi.deleteReview(
        deletingReview.masterpieceId,
        deletingReview._id
      );
      toast.success('Appraisal removed permanently');
      setDeletingReview(null);
      await loadReviews();
    } catch {
      toast.error('Failed to delete appraisal');
    } finally {
      setDeleteLoading(false);
    }
  };

  const filteredReviews = useMemo(() => {
    return reviews.filter((rev) => {
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        (rev.userName && rev.userName.toLowerCase().includes(q)) ||
        (rev.userEmail && rev.userEmail.toLowerCase().includes(q)) ||
        (rev.comment && rev.comment.toLowerCase().includes(q)) ||
        (rev.masterpieceTitle && rev.masterpieceTitle.toLowerCase().includes(q));

      const matchesRating =
        ratingFilter === 'All' || Number(rev.rating) === Number(ratingFilter);

      return matchesSearch && matchesRating;
    });
  }, [reviews, searchQuery, ratingFilter]);

  const carouselItems = useMemo(() => {
    return filteredReviews.map((rev) => ({
      id: rev._id,
      stat: `${Number(rev.rating || 5).toFixed(1)} ★ ${rev.title || 'Client Appraisal'}`,
      quote: rev.comment || 'Exquisite master goldsmithing from Khalil & Sons atelier.',
      author: rev.userName || 'Valued Patron',
      role: `${rev.userEmail || 'Client'} • ${rev.masterpieceTitle || 'Fine Jewellery'}`,
      defaultImage: rev.masterpieceImage || '/assets/products/choker-ruby-01.jpg',
      selectedImage: rev.masterpieceImage || '/assets/products/choker-ruby-01.jpg',
      alt: rev.masterpieceTitle || 'Masterpiece',
      rawReview: rev
    }));
  }, [filteredReviews]);

  const formatDate = (dateString) => {
    if (!dateString) return '—';
    try {
      return new Date(dateString).toLocaleDateString('en-GB', {
        day: '2-digit',
        month: 'short',
        year: 'numeric'
      });
    } catch {
      return '—';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="font-serif text-2xl font-bold tracking-tight text-foreground">
            Client Appraisals & Reviews
          </h2>
          <p className="text-xs text-muted-foreground mt-1">
            Manage evaluations, ratings, and customer testimonials across all masterpieces
          </p>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <Button
            variant="outline"
            size="sm"
            onClick={loadReviews}
            disabled={loading}
            className="text-xs gap-1.5 cursor-pointer"
          >
            <RefreshCw className={`size-3.5 ${loading ? 'animate-spin' : ''}`} />
            <span>Refresh</span>
          </Button>
          <Button
            size="sm"
            onClick={() => setIsAddModalOpen(true)}
            className="bg-foreground hover:bg-neutral-800 text-background text-xs gap-1.5 cursor-pointer shadow-xs"
          >
            <Plus className="size-3.5" />
            <span>Add In-Store Appraisal</span>
          </Button>
        </div>
      </div>

      <ReviewsMetrics reviews={reviews} loading={loading} />

      <div className="rounded-xl border border-border bg-card p-4 sm:p-5 shadow-xs space-y-4">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
          <div className="relative flex-1 max-w-md">
            <Search className="size-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search appraisals by patron, piece, or comment..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 rounded-lg border border-border bg-background text-xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-foreground/20"
            />
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <div className="flex items-center gap-1.5 p-1 rounded-lg bg-muted border border-border shrink-0 overflow-x-auto">
              {['All', '5', '4', '3', '2', '1'].map((r) => (
                <button
                  key={r}
                  type="button"
                  onClick={() => setRatingFilter(r)}
                  className={`px-2.5 py-1 rounded-md text-xs font-medium transition-colors cursor-pointer ${
                    ratingFilter === r
                      ? 'bg-background shadow-xs text-foreground font-semibold'
                      : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  {r === 'All' ? 'All Ratings' : `${r} ★`}
                </button>
              ))}
            </div>

            <div className="flex items-center p-1 rounded-lg bg-muted border border-border">
              <button
                type="button"
                onClick={() => setViewLayout('carousel')}
                className={`flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-medium transition-colors cursor-pointer ${
                  viewLayout === 'carousel'
                    ? 'bg-background text-foreground shadow-xs'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                <Layers className="size-3.5" />
                <span className="hidden sm:inline">Carousel</span>
              </button>
              <button
                type="button"
                onClick={() => setViewLayout('grid')}
                className={`flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-medium transition-colors cursor-pointer ${
                  viewLayout === 'grid'
                    ? 'bg-background text-foreground shadow-xs'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                <LayoutGrid className="size-3.5" />
                <span className="hidden sm:inline">Grid</span>
              </button>
            </div>
          </div>
        </div>

        {loading ? (
          <div className="py-20 flex items-center justify-center">
            <LumaSpin size={28} />
          </div>
        ) : filteredReviews.length === 0 ? (
          <div className="py-16 text-center border border-dashed border-border rounded-xl flex flex-col items-center justify-center px-4">
            <MessageSquare className="size-8 text-muted-foreground/50 mb-2" />
            <h4 className="text-sm font-medium text-foreground">No appraisals found</h4>
            <p className="text-xs text-muted-foreground mt-1 max-w-sm">
              {searchQuery || ratingFilter !== 'All'
                ? 'Try adjusting your search criteria or rating filter.'
                : 'Customer appraisals submitted online or in-store will populate here.'}
            </p>
          </div>
        ) : viewLayout === 'carousel' ? (
          <div className="py-2 w-full overflow-hidden">
            <CalendlyCarousel
              items={carouselItems}
              autoPlayInterval={6000}
              pauseOnHover={true}
              onAction={(rawReview) => (
                <div className="flex flex-wrap items-center gap-2 pt-2">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => handleEditClick(rawReview)}
                    className="h-7 px-2.5 text-xs gap-1 cursor-pointer bg-background"
                  >
                    <Pencil className="size-3" />
                    <span>Edit</span>
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => setDeletingReview(rawReview)}
                    className="h-7 px-2.5 text-xs text-rose-500 hover:text-rose-600 hover:bg-rose-500/10 gap-1 cursor-pointer"
                  >
                    <Trash2 className="size-3" />
                    <span>Delete</span>
                  </Button>
                  {rawReview.masterpieceId && (
                    <Link
                      to={`/gallery/${rawReview.masterpieceId}`}
                      target="_blank"
                      className="inline-flex items-center gap-1 h-7 px-2.5 rounded-md border border-border bg-background text-xs text-muted-foreground hover:text-foreground cursor-pointer"
                    >
                      <ExternalLink className="size-3" />
                      <span>Storefront Piece</span>
                    </Link>
                  )}
                </div>
              )}
            />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredReviews.map((rev) => {
              const rating = Number(rev.rating) || 5;

              return (
                <div
                  key={rev._id}
                  className="p-4 rounded-xl border border-border/80 bg-background flex flex-col justify-between space-y-3 hover:border-foreground/40 transition-colors shadow-xs"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between pb-3 border-b border-border/80">
                      <div className="flex items-center gap-3 min-w-0">
                        {rev.masterpieceImage ? (
                          <img
                            src={rev.masterpieceImage}
                            alt={rev.masterpieceTitle || 'Piece'}
                            className="size-12 rounded-lg object-cover border border-border shrink-0"
                          />
                        ) : (
                          <div className="size-12 rounded-lg bg-neutral-100 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 flex items-center justify-center text-foreground shrink-0">
                            <Gem className="size-5" />
                          </div>
                        )}
                        <div className="min-w-0">
                          <span className="text-[10px] uppercase font-mono tracking-wider text-muted-foreground block truncate">
                            {rev.masterpieceCategory || 'Jewellery'}
                          </span>
                          <span className="text-xs font-semibold text-foreground truncate block">
                            {rev.masterpieceTitle || 'Untitled Masterpiece'}
                          </span>
                        </div>
                      </div>

                      {rev.masterpieceId && (
                        <Link
                          to={`/gallery/${rev.masterpieceId}`}
                          className="text-muted-foreground hover:text-foreground p-1.5 rounded-lg hover:bg-muted transition-colors cursor-pointer shrink-0"
                          title="View live piece on storefront"
                        >
                          <ExternalLink className="size-3.5" />
                        </Link>
                      )}
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <span className="text-xs font-medium text-foreground block">
                          {rev.userName}
                        </span>
                        <span className="text-[11px] text-muted-foreground font-mono">
                          {rev.userEmail || 'In-store patron'}
                        </span>
                      </div>
                      <div className="flex items-center gap-0.5">
                        {[1, 2, 3, 4, 5].map((s) => (
                          <Star
                            key={s}
                            className={`size-3.5 ${
                              s <= rating
                                ? 'fill-neutral-900 dark:fill-neutral-100 text-neutral-900 dark:text-neutral-100'
                                : 'text-neutral-300 dark:text-neutral-700'
                            }`}
                          />
                        ))}
                      </div>
                    </div>

                    {rev.comment && (
                      <p className="text-xs text-muted-foreground italic leading-relaxed line-clamp-3 bg-muted/30 p-2.5 rounded-lg">
                        &ldquo;{rev.comment}&rdquo;
                      </p>
                    )}
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-border/60 text-xs">
                    <span className="text-[10px] text-muted-foreground font-mono">
                      {formatDate(rev.createdAt)}
                    </span>
                    <div className="flex items-center gap-1.5">
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => handleEditClick(rev)}
                        className="h-7 px-2 text-xs text-muted-foreground hover:text-foreground gap-1 cursor-pointer"
                      >
                        <Pencil className="size-3" />
                        <span>Edit</span>
                      </Button>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => setDeletingReview(rev)}
                        className="h-7 px-2 text-xs text-rose-500 hover:text-rose-600 hover:bg-rose-500/10 gap-1 cursor-pointer"
                      >
                        <Trash2 className="size-3" />
                        <span>Delete</span>
                      </Button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <EditReviewModal
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          setEditingReview(null);
        }}
        onSave={handleEditSave}
        review={editingReview}
        loading={editLoading}
      />

      <AddReviewModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSave={handleAddSave}
        loading={addLoading}
      />

      <ConfirmDeleteModal
        isOpen={Boolean(deletingReview)}
        onClose={() => setDeletingReview(null)}
        onConfirm={handleDeleteConfirm}
        title={deletingReview ? `Appraisal by ${deletingReview.userName} for ${deletingReview.masterpieceTitle}` : ''}
        itemType="appraisal"
        loading={deleteLoading}
      />
    </div>
  );
}
