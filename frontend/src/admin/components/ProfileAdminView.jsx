import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { LumaSpin } from '@/components/ui/luma-spin';
import { ProfileIdentityBentoCard } from './ProfileIdentityBentoCard';
import { ProfileContactBentoCard } from './ProfileContactBentoCard';
import { ProfileLocationBentoCard } from './ProfileLocationBentoCard';
import { ProfileSecurityBentoCard } from './ProfileSecurityBentoCard';
import { storeProfileApi, getCachedStoreProfile } from '@/api/storeProfileApi';
import { toast } from 'sonner';
import { Save, RefreshCw, CheckCircle2 } from 'lucide-react';

export function ProfileAdminView() {
  const [formData, setFormData] = useState(() => {
    const cached = getCachedStoreProfile();
    return (
      cached || {
        name: 'Khalil & Sons Jewellers',
        tagline: 'Master Goldsmithing & Bridal Jewellery Heirlooms',
        email: 'khalilandsonsjewellers@gmail.com',
        phone: '+92 333 3213613',
        landline: '+92 21 35670868',
        whatsapp: '+92 333 3213613',
        address:
          'Shop #2, Murshid Sunaar Tower, Dr. Daud Pota Road, Saddar, Karachi, 74400, Pakistan',
        openingHours:
          'Mon–Sat: 2:00 PM – 9:00 PM (Fri: 3:30 PM – 9:30 PM) | Sun: Closed',
        founder: 'Mr. Khalil Ahmed',
        establishedYear: '1992',
        assayStandard:
          'Certified 22K (916.6) & 24K (999.0) Hallmark Guaranteed'
      }
    );
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);

  useEffect(() => {
    let isMounted = true;
    storeProfileApi
      .getProfile()
      .then((res) => {
        if (isMounted && res?.data) {
          setFormData(res.data);
        }
      })
      .catch(() => {})
      .finally(() => {
        if (isMounted) setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setHasChanges(true);
  };

  const handleSave = async (e) => {
    if (e) e.preventDefault();

    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())) {
      toast.error('Invalid email address', {
        description: 'Please provide a valid official email address.'
      });
      return;
    }

    setSaving(true);
    try {
      const res = await storeProfileApi.updateProfile(formData);
      if (res?.data) {
        setFormData(res.data);
      }
      setHasChanges(false);
      toast.success('Atelier Profile Synchronized', {
        description:
          'Contact channels, emails, and boutique details updated live across all storefront pages.'
      });
    } catch (err) {
      toast.error('Failed to update profile', {
        description: err.message || 'Could not save profile settings.'
      });
    } finally {
      setSaving(false);
    }
  };

  if (loading && !formData.name) {
    return (
      <div className="py-24 flex items-center justify-center">
        <LumaSpin size={32} />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-card/60 backdrop-blur-md p-5 sm:p-6 rounded-xl border border-border/80 shadow-xs">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Badge variant="outline" className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
              Boutique Settings
            </Badge>
            {hasChanges && (
              <span className="text-[10px] font-mono text-amber-600 dark:text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded-full border border-amber-500/20">
                Unsaved Changes
              </span>
            )}
          </div>
          <h2 className="text-xl sm:text-2xl font-semibold tracking-tight text-foreground font-serif">
            Atelier Profile & Channels
          </h2>
          <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
            Configure boutique identity, contact routing, and hallmark credentials in a unified bento grid.
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => {
              storeProfileApi.getProfile().then((res) => {
                if (res?.data) setFormData(res.data);
                setHasChanges(false);
                toast.success('Profile reloaded');
              });
            }}
            disabled={saving}
            className="cursor-pointer text-xs h-9 px-3 gap-1.5"
          >
            <RefreshCw className="size-3.5" />
            <span>Reload</span>
          </Button>

          <Button
            type="button"
            size="sm"
            onClick={handleSave}
            disabled={saving}
            className="cursor-pointer text-xs h-9 px-4 gap-1.5 bg-foreground text-background hover:bg-neutral-800 shadow-xs"
          >
            {saving ? (
              <>
                <LumaSpin size={14} />
                <span>Saving...</span>
              </>
            ) : (
              <>
                <Save className="size-3.5" />
                <span>Save Profile</span>
              </>
            )}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-8">
        <ProfileIdentityBentoCard
          formData={formData}
          onChange={handleChange}
          className="lg:col-span-5"
        />

        <ProfileContactBentoCard
          formData={formData}
          onChange={handleChange}
          className="lg:col-span-3"
        />

        <ProfileLocationBentoCard
          formData={formData}
          onChange={handleChange}
          className="lg:col-span-4"
        />

        <ProfileSecurityBentoCard
          formData={formData}
          onChange={handleChange}
          className="lg:col-span-4"
        />
      </div>
    </div>
  );
}
