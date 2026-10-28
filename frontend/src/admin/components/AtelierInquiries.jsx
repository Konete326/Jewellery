import React, { useState } from 'react'
import { MessageSquare, Calendar, Mail, Trash2, CheckCheckIcon, Reply, Phone } from 'lucide-react'
import { updateInquiryStatus, deleteInquiry } from '@/api/inquiryApi'
import { createWhatsAppInquiryUrl, formatPhoneDisplay } from '@/utils/phone'
import { ConfirmDeleteModal } from './ConfirmDeleteModal'
import { ReplyInquiryModal } from './ReplyInquiryModal'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'
import { Alert, AlertTitle } from '@/components/ui/alert'

export function AtelierInquiries({ inquiries = [], loading = false, onRefresh = () => {} }) {
  const [replyingInquiry, setReplyingInquiry] = useState(null)
  const [deletingInquiry, setDeletingInquiry] = useState(null)
  const [deleteLoading, setDeleteLoading] = useState(false)

  const formatDate = (dateStr) => {
    if (!dateStr) return '-'
    return new Date(dateStr).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric'
    })
  }

  const handleStatusChange = async (id, newStatus) => {
    try {
      await updateInquiryStatus(id, newStatus)
      toast.success(`Inquiry status updated to ${newStatus}`)
      onRefresh()
    } catch (err) {
      toast.error(err.message || 'Failed to update status')
    }
  }

  const handleDelete = async () => {
    if (!deletingInquiry?._id) return
    setDeleteLoading(true)
    try {
      await deleteInquiry(deletingInquiry._id)
      toast.success('Inquiry removed from registry')
      setDeletingInquiry(null)
      onRefresh()
    } catch (err) {
      toast.error(err.message || 'Failed to delete inquiry')
    } finally {
      setDeleteLoading(false)
    }
  }

  return (
    <div className="rounded-xl border border-border bg-card p-5 shadow-xs">
      <div className="flex items-center justify-between pb-4 border-b border-border">
        <div>
          <h3 className="font-semibold text-foreground text-base tracking-tight font-serif">Bespoke Commissions</h3>
          <p className="text-xs text-muted-foreground mt-0.5">Custom jewelry inquiries and private appointments</p>
        </div>
        <span className="text-xs font-medium px-2.5 py-1 rounded-full bg-purple-500/10 text-purple-700 dark:text-purple-300 border border-purple-300/30">
          {inquiries.length} Active {inquiries.length === 1 ? 'Request' : 'Requests'}
        </span>
      </div>

      {loading ? (
        <div className="py-10 text-center text-xs text-muted-foreground">Checking inquiries...</div>
      ) : inquiries.length === 0 ? (
        <div className="py-10 flex flex-col items-center justify-center text-center px-4">
          <div className="p-3 rounded-full bg-muted/50 border border-border/60 mb-3 text-muted-foreground">
            <MessageSquare className="size-5" />
          </div>
          <h4 className="text-sm font-medium text-foreground">No bespoke inquiries</h4>
          <p className="text-xs text-muted-foreground mt-1 max-w-sm">
            Requests submitted through the Bespoke commission form will automatically arrive here.
          </p>
        </div>
      ) : (
        <div className="mt-4 space-y-3">
          {inquiries.map((inq) => (
            <div
              key={inq._id || inq.email}
              className="p-3.5 rounded-lg border border-border/50 bg-muted/20 hover:bg-muted/40 transition-colors flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3"
            >
              <div className="space-y-1">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="font-medium text-sm text-foreground">{inq.customerName}</span>
                  <span className="text-xs text-muted-foreground flex items-center gap-1">
                    <Mail className="size-3" /> {inq.email}
                  </span>
                  {inq.phone && (
                    <a
                      href={createWhatsAppInquiryUrl(
                        inq.phone,
                        inq.customerName,
                        inq.subject || inq.jewelryType,
                        inq.status
                      )}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1 text-[11px] font-mono px-2 py-0.5 rounded-md bg-muted/40 text-foreground border border-border/80 hover:bg-muted transition-colors"
                      title="Open WhatsApp Consultation"
                    >
                      <Phone className="size-3 text-muted-foreground" />
                      <span>{formatPhoneDisplay(inq.phone)}</span>
                    </a>
                  )}
                </div>
                <p className="text-xs text-muted-foreground">{inq.jewelryType} • {inq.preferredMetal}</p>
                <div className="flex items-center gap-3 text-xs text-muted-foreground pt-1">
                  <span className="font-semibold text-foreground">{inq.estimatedBudget}</span>
                  <span>•</span>
                  <span className="flex items-center gap-1">
                    <Calendar className="size-3" /> {formatDate(inq.createdAt)}
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setReplyingInquiry(inq)}
                  className="h-7 px-2.5 text-xs gap-1 cursor-pointer"
                >
                  <Reply className="size-3 text-amber-600" />
                  <span>Reply</span>
                </Button>
                <select
                  value={inq.status || 'Pending'}
                  onChange={(e) => handleStatusChange(inq._id, e.target.value)}
                  className="text-xs px-2.5 py-1 rounded-md border border-input bg-background text-foreground shadow-xs cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500/50"
                >
                  <option value="Pending">Pending</option>
                  <option value="Replied">Replied</option>
                  <option value="Contacted">Contacted</option>
                  <option value="In Design">In Design</option>
                  <option value="Closed">Closed</option>
                </select>
                <button
                  onClick={() => setDeletingInquiry(inq)}
                  className="p-1.5 text-muted-foreground hover:text-rose-500 hover:bg-rose-500/10 rounded-md transition-colors cursor-pointer"
                  title="Delete inquiry"
                >
                  <Trash2 className="size-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <ReplyInquiryModal
        isOpen={Boolean(replyingInquiry)}
        onClose={() => setReplyingInquiry(null)}
        inquiry={replyingInquiry}
        onReplied={onRefresh}
      />

      <ConfirmDeleteModal
        isOpen={Boolean(deletingInquiry)}
        onClose={() => setDeletingInquiry(null)}
        onConfirm={handleDelete}
        title={deletingInquiry ? `${deletingInquiry.customerName} (${deletingInquiry.jewelryType})` : ''}
        itemType="commission request"
        loading={deleteLoading}
      />
    </div>
  )
}
