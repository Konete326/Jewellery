import React, { useState, useEffect, useCallback } from 'react';
import { Plus, MapPin, AlertCircle, RefreshCw, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { usersApi } from '@/api/users.api';
import { toast } from 'sonner';
import { AddressCard } from './AddressCard';
import { AddressFormModal } from './AddressFormModal';
import { DeleteAddressModal } from './DeleteAddressModal';

const MAX_ADDRESSES = 10;

export function SavedAddressesSection() {
  const [addresses, setAddresses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [addressToEdit, setAddressToEdit] = useState(null);
  const [addressToDelete, setAddressToDelete] = useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [settingDefaultId, setSettingDefaultId] = useState(null);

  const fetchAddresses = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await usersApi.getAddresses();
      const list = Array.isArray(res?.data) ? res.data : Array.isArray(res) ? res : [];
      setAddresses(list);
    } catch (err) {
      setError(err?.message || 'Could not load your saved addresses. Please try again.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAddresses();
  }, [fetchAddresses]);

  const handleOpenAdd = () => {
    if (addresses.length >= MAX_ADDRESSES) {
      toast.warning(`Maximum of ${MAX_ADDRESSES} addresses allowed.`, {
        description: 'Please delete or edit an existing address.'
      });
      return;
    }
    setAddressToEdit(null);
    setIsFormOpen(true);
  };

  const handleOpenEdit = (addr) => {
    setAddressToEdit(addr);
    setIsFormOpen(true);
  };

  const handleOpenDelete = (addr) => {
    setAddressToDelete(addr);
    setIsDeleteModalOpen(true);
  };

  const handleFormSubmit = async (payload) => {
    setIsSubmitting(true);
    try {
      if (addressToEdit) {
        const id = addressToEdit._id || addressToEdit.id;
        await usersApi.updateAddress(id, payload);
        toast.success('Address updated successfully');
      } else {
        await usersApi.addAddress(payload);
        toast.success('New address added successfully');
      }
      setIsFormOpen(false);
      setAddressToEdit(null);
      await fetchAddresses();
    } catch (err) {
      toast.error(err?.message || 'Failed to save address. Please check your inputs.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!addressToDelete) return;
    setIsDeleting(true);
    try {
      const id = addressToDelete._id || addressToDelete.id;
      await usersApi.deleteAddress(id);
      toast.success('Address deleted successfully');
      setIsDeleteModalOpen(false);
      setAddressToDelete(null);
      await fetchAddresses();
    } catch (err) {
      toast.error(err?.message || 'Failed to delete address.');
    } finally {
      setIsDeleting(false);
    }
  };

  const handleSetDefault = async (addr) => {
    const id = addr._id || addr.id;
    setSettingDefaultId(id);
    try {
      await usersApi.setDefaultAddress(id);
      toast.success(`${addr.label || 'Address'} set as default address`);
      await fetchAddresses();
    } catch (err) {
      toast.error(err?.message || 'Could not set default address.');
    } finally {
      setSettingDefaultId(null);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-border/80">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="font-serif text-lg sm:text-xl font-light text-foreground tracking-tight">
              Saved Addresses
            </h3>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded-full border border-border/80 bg-muted/40 text-muted-foreground">
              {addresses.length} / {MAX_ADDRESSES}
            </span>
          </div>
          <p className="text-xs text-muted-foreground font-light mt-0.5">
            Manage your saved shipping and contact addresses for faster checkout.
          </p>
        </div>

        <Button
          type="button"
          onClick={handleOpenAdd}
          disabled={loading || addresses.length >= MAX_ADDRESSES}
          size="sm"
          className="h-9 px-4 rounded-xl bg-foreground text-background hover:bg-foreground/90 text-xs font-mono tracking-wider uppercase font-medium flex items-center gap-1.5 cursor-pointer shadow-2xs shrink-0 disabled:opacity-50"
        >
          <Plus className="size-3.5" />
          <span>Add Address</span>
        </Button>
      </div>

      {addresses.length >= MAX_ADDRESSES && (
        <div className="p-3 rounded-xl border border-amber-500/30 bg-amber-500/10 text-amber-800 dark:text-amber-300 text-xs font-mono flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <AlertCircle className="size-4 text-amber-600 dark:text-amber-400 shrink-0" />
            <span>Maximum address limit (10) reached. Delete an unused address to add a new one.</span>
          </div>
        </div>
      )}

      {loading ? (
        <div className="py-16 text-center flex flex-col items-center justify-center space-y-3">
          <Loader2 className="size-6 animate-spin text-muted-foreground" />
          <p className="text-xs font-mono text-muted-foreground">
            Loading saved addresses...
          </p>
        </div>
      ) : error ? (
        <div className="py-12 px-4 rounded-2xl border border-destructive/30 bg-destructive/5 text-center space-y-3 max-w-md mx-auto">
          <AlertCircle className="size-6 text-destructive mx-auto" />
          <p className="text-xs text-destructive font-medium">{error}</p>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={fetchAddresses}
            className="text-xs h-8 px-3 rounded-lg cursor-pointer"
          >
            <RefreshCw className="size-3 mr-1.5" />
            <span>Retry Connection</span>
          </Button>
        </div>
      ) : addresses.length === 0 ? (
        <div className="py-16 px-4 text-center rounded-2xl border border-dashed border-border/80 bg-muted/10 max-w-lg mx-auto space-y-3">
          <div className="size-12 rounded-full border border-border/80 bg-background flex items-center justify-center mx-auto text-muted-foreground">
            <MapPin className="size-5" />
          </div>
          <h4 className="font-serif text-base font-medium text-foreground">
            No Saved Addresses
          </h4>
          <p className="text-xs text-muted-foreground font-light max-w-sm mx-auto leading-relaxed">
            You haven't saved any addresses yet. Add your address to save time during checkout.
          </p>
          <Button
            type="button"
            onClick={handleOpenAdd}
            size="sm"
            className="h-9 px-4 rounded-xl bg-foreground text-background hover:bg-foreground/90 text-xs font-mono tracking-wider uppercase font-medium cursor-pointer"
          >
            <Plus className="size-3.5 mr-1" />
            <span>Add First Address</span>
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {addresses.map((addr) => (
            <AddressCard
              key={addr._id || addr.id || addr.addressLine}
              address={addr}
              onEdit={handleOpenEdit}
              onDelete={handleOpenDelete}
              onSetDefault={handleSetDefault}
              isSettingDefault={settingDefaultId === (addr._id || addr.id)}
            />
          ))}
        </div>
      )}

      <AddressFormModal
        isOpen={isFormOpen}
        onClose={() => {
          setIsFormOpen(false);
          setAddressToEdit(null);
        }}
        onSubmit={handleFormSubmit}
        address={addressToEdit}
        isSubmitting={isSubmitting}
      />

      <DeleteAddressModal
        isOpen={isDeleteModalOpen}
        onClose={() => {
          setIsDeleteModalOpen(false);
          setAddressToDelete(null);
        }}
        onConfirm={handleDeleteConfirm}
        address={addressToDelete}
        isDeleting={isDeleting}
      />
    </div>
  );
}

