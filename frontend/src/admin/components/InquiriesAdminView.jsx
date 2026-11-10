import React, { useState, useEffect } from 'react';
import { Mail, Reply, Trash2, Search, RefreshCw, CheckCircle2, Phone, Calendar, Clock, MapPin } from 'lucide-react';
import { fetchInquiries, updateInquiryStatus, deleteInquiry } from '@/api/inquiryApi';
import { createWhatsAppInquiryUrl, formatPhoneDisplay } from '@/utils/phone';
import { ReplyInquiryModal } from './ReplyInquiryModal';
import { ConfirmDeleteModal } from './ConfirmDeleteModal';
import { Button } from '@/components/ui/button';
import { LumaSpin } from '@/components/ui/luma-spin';
import { toast } from 'sonner';

const STATUS_OPTIONS = [
  'Pending',
  'Confirmed',
  'Replied',
  'Rescheduled',
  'Completed',
  'Cancelled',
  'Closed'
];

export function InquiriesAdminView() {
  const [inquiries, setInquiries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [filterStatus, setFilterStatus] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [replyingInquiry, setReplyingInquiry] = useState(null);
  const [deletingInquiry, setDeletingInquiry] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const loadData = async () => {
    setLoading(true);
    try {
      const res = await fetchInquiries();
      if (res?.data?.items) {
        setInquiries(res.data.items);
      } else if (Array.isArray(res?.data)) {
        setInquiries(res.data);
      }
    } catch (err) {
      toast.error('Unable to retrieve client inquiries');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleStatusChange = async (id, newStatus) => {
    try {
      await updateInquiryStatus(id, newStatus);
      toast.success(`Inquiry marked as ${newStatus}`);
      loadData();
    } catch (err) {
      toast.error(err.message || 'Failed to update status');
    }
  };

  const handleDelete = async () => {
    if (!deletingInquiry?._id) return;
    setDeleteLoading(true);
    try {
      await deleteInquiry(deletingInquiry._id);
      toast.success('Inquiry record deleted');
      setDeletingInquiry(null);
      loadData();
    } catch (err) {
      toast.error(err.message || 'Failed to delete record');
    } finally {
      setDeleteLoading(false);
    }
  };

  const filtered = inquiries.filter((inq) => {
    const isApt = inq.requestType === 'Appointment' || Boolean(inq.appointmentDate);
    const matchesCategory =
      categoryFilter === 'All' ||
      (categoryFilter === 'Appointments' && isApt) ||
      (categoryFilter === 'General Inquiries' && !isApt);

    const matchesStatus = filterStatus === 'All' || inq.status === filterStatus;
    const q = searchQuery.toLowerCase();
    const matchesSearch =
      !searchQuery ||
      inq.customerName?.toLowerCase().includes(q) ||
      inq.email?.toLowerCase().includes(q) ||
      inq.subject?.toLowerCase().includes(q) ||
      inq.pieceTitle?.toLowerCase().includes(q) ||
      inq.appointmentDate?.toLowerCase().includes(q) ||
      inq.message?.toLowerCase().includes(q);

    return matchesCategory && matchesStatus && matchesSearch;
  });

  const appointmentsCount = inquiries.filter((i) => i.requestType === 'Appointment' || Boolean(i.appointmentDate)).length;
  const pendingCount = inquiries.filter((i) => i.status === 'Pending').length;
  const repliedCount = inquiries.filter((i) => i.status === 'Replied' || i.status === 'Completed').length;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-linear-to-r from-amber-500/10 via-amber-500/5 to-transparent p-5 rounded-xl border border-amber-500/20">
        <div>
          <h2 className="text-xl sm:text-2xl font-semibold tracking-tight text-foreground font-serif">
            Atelier Inquiries &amp; Appointments
          </h2>
          <p className="text-xs sm:text-sm text-muted-foreground mt-1">
            Review incoming requests, showroom appointments, and dispatch direct email replies.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            onClick={loadData}
            variant="outline"
            size="sm"
            className="text-xs gap-1.5 cursor-pointer"
          >
            <RefreshCw className={`size-3.5 ${loading ? 'animate-spin' : ''}`} />
            <span>Sync</span>
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 rounded-xl border border-border bg-card shadow-xs">
          <span className="text-[11px] uppercase tracking-wider font-mono text-muted-foreground">Total Requests</span>
          <p className="text-2xl font-serif font-semibold text-foreground mt-1">{inquiries.length}</p>
        </div>
        <div className="p-4 rounded-xl border border-amber-500/25 bg-amber-500/5 shadow-xs">
          <span className="text-[11px] uppercase tracking-wider font-mono text-amber-700 dark:text-amber-400">Appointments</span>
          <p className="text-2xl font-serif font-semibold text-amber-700 dark:text-amber-400 mt-1">{appointmentsCount}</p>
        </div>
        <div className="p-4 rounded-xl border border-rose-500/25 bg-rose-500/5 shadow-xs">
          <span className="text-[11px] uppercase tracking-wider font-mono text-rose-700 dark:text-rose-400">Awaiting Response</span>
          <p className="text-2xl font-serif font-semibold text-rose-700 dark:text-rose-400 mt-1">{pendingCount}</p>
        </div>
        <div className="p-4 rounded-xl border border-border/80 bg-card shadow-xs">
          <span className="text-[11px] uppercase tracking-wider font-mono text-muted-foreground">Replied / Completed</span>
          <p className="text-2xl font-serif font-semibold text-foreground mt-1">{repliedCount}</p>
        </div>
      </div>

      <div className="rounded-2xl border border-border bg-card p-5 shadow-xs space-y-4">
        <div className="flex flex-col gap-3">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
            <div className="flex flex-wrap items-center gap-1.5">
              {['All', 'Appointments', 'General Inquiries'].map((cat) => (
                <button
                  key={cat}
                  onClick={() => setCategoryFilter(cat)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
                    categoryFilter === cat
                      ? 'bg-foreground text-background shadow-xs'
                      : 'bg-muted/50 text-muted-foreground hover:bg-muted hover:text-foreground'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            <div className="relative w-full sm:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-3.5 text-muted-foreground" />
              <input
                type="text"
                placeholder="Filter by name, piece, date..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-muted/40 border border-input rounded-lg pl-8 pr-3 py-1.5 text-xs text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500/50"
              />
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-1.5 pt-1 border-t border-border/40">
            <span className="text-[11px] font-mono text-muted-foreground mr-1 uppercase">Status:</span>
            {['All', ...STATUS_OPTIONS].map((tab) => (
              <button
                key={tab}
                onClick={() => setFilterStatus(tab)}
                className={`px-2.5 py-1 rounded-md text-[11px] font-mono transition-colors cursor-pointer ${
                  filterStatus === tab
                    ? 'bg-amber-500/15 text-amber-800 dark:text-amber-300 border border-amber-500/30'
                    : 'text-muted-foreground hover:bg-muted/60 hover:text-foreground'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        {loading ? (
          <div className="py-16 flex items-center justify-center">
            <LumaSpin variant="amber" size={28} />
          </div>
        ) : filtered.length === 0 ? (
          <div className="py-16 flex flex-col items-center justify-center text-center px-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-amber-500/30 bg-amber-500/5 text-amber-700 dark:text-amber-400 font-mono text-[10px] uppercase tracking-widest mb-3">
              <span>AU · 916.6</span>
              <span className="text-muted-foreground/40">•</span>
              <span>ATELIER REGISTRY</span>
            </div>
            <h4 className="text-sm font-medium text-foreground">No matching records found</h4>
            <p className="text-xs text-muted-foreground mt-1 max-w-sm">
              Showroom appointments and inquiries will populate here automatically.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {filtered.map((item) => {
              const isApt = item.requestType === 'Appointment' || Boolean(item.appointmentDate);
              return (
                <div
                  key={item._id}
                  className="p-4 rounded-xl border border-border/70 bg-muted/20 hover:bg-muted/40 transition-colors flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4"
                >
                  <div className="space-y-2 flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-medium text-sm text-foreground">{item.customerName}</span>
                      <a
                        href={`mailto:${item.email}`}
                        className="text-xs text-muted-foreground hover:text-amber-700 dark:hover:text-amber-400 flex items-center gap-1"
                      >
                        <Mail className="size-3" /> {item.email}
                      </a>
                      {item.phone && (
                        <a
                          href={createWhatsAppInquiryUrl(
                            item.phone,
                            item.customerName,
                            item.pieceTitle || item.subject || item.jewelryType,
                            item.status
                          )}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-1 text-[11px] font-mono px-2 py-0.5 rounded-md bg-muted/40 text-foreground border border-border/80 hover:bg-muted transition-colors"
                          title="Open direct WhatsApp conversation"
                        >
                          <Phone className="size-3 text-muted-foreground" />
                          <span>{formatPhoneDisplay(item.phone)}</span>
                        </a>
                      )}
                      {isApt && (
                        <span className="text-[10px] uppercase font-mono tracking-wider px-2 py-0.5 rounded-full border border-amber-500/30 bg-amber-500/10 text-amber-800 dark:text-amber-300">
                          Showroom Appointment
                        </span>
                      )}
                      <span
                        className={`text-[10px] uppercase font-mono tracking-wider px-2 py-0.5 rounded-full border ${
                          item.status === 'Confirmed'
                            ? 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-500/25'
                            : item.status === 'Replied' || item.status === 'Completed'
                              ? 'bg-muted/60 text-foreground border-border/80'
                              : item.status === 'Pending'
                                ? 'bg-amber-500/10 text-amber-700 dark:text-amber-400 border-amber-500/25'
                                : 'bg-muted text-muted-foreground border-border'
                        }`}
                      >
                        {item.status}
                      </span>
                    </div>

                    {isApt && (
                      <div className="flex flex-wrap items-center gap-3 text-xs font-mono text-amber-800 dark:text-amber-300 bg-amber-500/5 border border-amber-500/20 px-3 py-1.5 rounded-lg w-fit">
                        <span className="flex items-center gap-1">
                          <Calendar className="size-3" />
                          {item.appointmentDate}
                        </span>
                        {item.appointmentSlot && (
                          <span className="flex items-center gap-1">
                            <Clock className="size-3" />
                            {item.appointmentSlot}
                          </span>
                        )}
                        <span className="flex items-center gap-1">
                          <MapPin className="size-3" />
                          {item.consultationMode || 'In-Store Showroom'}
                        </span>
                      </div>
                    )}

                    <div className="flex flex-wrap items-center gap-2">
                      <p className="text-xs font-medium text-foreground/90 font-serif">
                        {item.pieceTitle ? `Piece: ${item.pieceTitle}` : item.subject || item.jewelryType || 'Atelier Request'}
                      </p>
                      {item.estimatedBudget && (
                        <span className="text-[11px] text-muted-foreground font-mono">
                          • Budget: {item.estimatedBudget}
                        </span>
                      )}
                    </div>

                    <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
                      "{item.message}"
                    </p>

                    {item.replies && item.replies.length > 0 && (
                      <div className="pt-1 flex items-center gap-2 text-[11px] text-amber-800 dark:text-amber-300">
                        <CheckCircle2 className="size-3" />
                        <span>{item.replies.length} {item.replies.length === 1 ? 'reply' : 'replies'} dispatched</span>
                      </div>
                    )}
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <Button
                      onClick={() => setReplyingInquiry(item)}
                      size="sm"
                      className="h-8 px-3 text-xs gap-1.5 bg-foreground text-background hover:bg-foreground/90 cursor-pointer"
                    >
                      <Reply className="size-3 text-amber-500" />
                      <span>Reply</span>
                    </Button>

                    <select
                      value={item.status || 'Pending'}
                      onChange={(e) => handleStatusChange(item._id, e.target.value)}
                      className="text-xs px-2.5 py-1.5 rounded-lg border border-input bg-background text-foreground shadow-xs cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500/50"
                    >
                      {STATUS_OPTIONS.map((st) => (
                        <option key={st} value={st}>{st}</option>
                      ))}
                    </select>

                    <button
                      onClick={() => setDeletingInquiry(item)}
                      className="p-2 text-muted-foreground hover:text-rose-500 hover:bg-rose-500/10 rounded-lg transition-colors cursor-pointer"
                      title="Delete inquiry"
                    >
                      <Trash2 className="size-3.5" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <ReplyInquiryModal
        isOpen={Boolean(replyingInquiry)}
        onClose={() => setReplyingInquiry(null)}
        inquiry={replyingInquiry}
        onReplied={loadData}
      />

      <ConfirmDeleteModal
        isOpen={Boolean(deletingInquiry)}
        onClose={() => setDeletingInquiry(null)}
        onConfirm={handleDelete}
        title={deletingInquiry ? `${deletingInquiry.customerName} (${deletingInquiry.email})` : ''}
        itemType="client inquiry"
        loading={deleteLoading}
      />
    </div>
  );
}
