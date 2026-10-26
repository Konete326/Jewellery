import React, { useState, useEffect } from 'react';
import { X, Star, Plus, Loader2, Gem } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { galleryApi } from '@/api/galleryApi';

export function AddReviewModal({ isOpen, onClose, onSave, loading = false }) {
  const [pieces, setPieces] = useState([]);
  const [selectedPieceId, setSelectedPieceId] = useState('');
  const [userName, setUserName] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [loadingPieces, setLoadingPieces] = useState(false);

  useEffect(() => {
    if (isOpen) {
      const loadPieces = async () => {
        setLoadingPieces(true);
        try {
          const res = await galleryApi.getAll();
          const items = res?.data || (Array.isArray(res) ? res : []);
          setPieces(items);
          if (items.length > 0 && !selectedPieceId) {
            setSelectedPieceId(items[0]._id);
          }
        } catch {
          setPieces([]);
        } finally {
          setLoadingPieces(false);
        }
      };
      loadPieces();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!selectedPieceId) return;

    const selectedPiece = pieces.find((p) => p._id === selectedPieceId);

    onSave({
      pieceId: selectedPieceId,
      userName: userName.trim(),
      userEmail: userEmail.trim(),
      rating,
      comment: comment.trim(),
      title: selectedPiece?.title || 'Masterpiece',
      imageUrl: selectedPiece?.imageUrl || ''
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <button
        type="button"
        aria-label="Close modal overlay"
        onClick={onClose}
        className="absolute inset-0 bg-black/60 backdrop-blur-xs cursor-default w-full h-full border-0 p-0 focus-visible:outline-none"
        tabIndex={-1}
      />
      <div className="relative w-full max-w-lg rounded-2xl border border-border bg-card p-6 shadow-2xl animate-in fade-in zoom-in-95 duration-150 max-h-[90vh] overflow-y-auto">
        <button
          type="button"
          aria-label="Close"
          onClick={onClose}
          disabled={loading}
          className="absolute top-4 right-4 text-muted-foreground hover:text-foreground cursor-pointer focus-visible:ring-2 focus-visible:ring-amber-500/50 focus-visible:outline-none rounded-md"
        >
          <X className="size-4" />
        </button>

        <div className="flex items-center gap-3 mb-5">
          <div className="size-10 rounded-xl bg-amber-500/10 text-amber-600 flex items-center justify-center shrink-0">
            <Gem className="size-5" />
          </div>
          <div>
            <h3 className="font-serif text-lg font-semibold text-foreground">Record Patron Appraisal</h3>
            <p className="text-xs text-muted-foreground">Add verified customer evaluation for an atelier piece</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-xs font-medium text-foreground block mb-1.5">Select Gallery Masterpiece</label>
            {loadingPieces ? (
              <div className="text-xs text-muted-foreground py-2">Loading atelier archive...</div>
            ) : (
              <select
                required
                value={selectedPieceId}
                onChange={(e) => setSelectedPieceId(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-border bg-background text-xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500"
              >
                {pieces.map((p) => (
                  <option key={p._id} value={p._id}>
                    {p.title} ({p.category || 'Jewellery'})
                  </option>
                ))}
              </select>
            )}
          </div>

          <div>
            <label className="text-xs font-medium text-foreground block mb-1.5">Rating Score</label>
            <div className="flex items-center gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  className="p-1 rounded hover:bg-muted cursor-pointer transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500"
                >
                  <Star
                    className={`size-6 ${
                      star <= rating ? 'fill-amber-500 text-amber-500' : 'text-neutral-300 dark:text-neutral-700'
                    }`}
                  />
                </button>
              ))}
              <span className="text-xs font-mono text-muted-foreground ml-2">{rating} of 5 Stars</span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-medium text-foreground block mb-1.5">Patron Name</label>
              <input
                type="text"
                required
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
                placeholder="e.g. Mrs. Farzana Tariq"
                className="w-full px-3 py-2 rounded-lg border border-border bg-background text-xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500"
              />
            </div>
            <div>
              <label className="text-xs font-medium text-foreground block mb-1.5">Patron Email</label>
              <input
                type="email"
                required
                value={userEmail}
                onChange={(e) => setUserEmail(e.target.value)}
                placeholder="client@example.com"
                className="w-full px-3 py-2 rounded-lg border border-border bg-background text-xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-medium text-foreground block mb-1.5">Appraisal & Feedback</label>
            <textarea
              rows={4}
              required
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Record the feedback shared by the client..."
              className="w-full px-3 py-2 rounded-lg border border-border bg-background text-xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 resize-none"
            />
          </div>

          <div className="flex items-center justify-end gap-2 pt-3 border-t border-border">
            <Button type="button" variant="outline" size="sm" onClick={onClose} disabled={loading}>
              Cancel
            </Button>
            <Button
              type="submit"
              size="sm"
              disabled={loading || !selectedPieceId}
              className="bg-amber-600 hover:bg-amber-700 text-white gap-1.5"
            >
              {loading ? (
                <>
                  <Loader2 className="size-3.5 animate-spin" />
                  <span>Saving...</span>
                </>
              ) : (
                <>
                  <Plus className="size-3.5" />
                  <span>Save Appraisal</span>
                </>
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
