import React, { useEffect, useRef } from 'react';
import { toast } from 'sonner';

export function PWAInstallPrompt() {
  const deferredPromptRef = useRef(null);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const alreadyInstalled =
      localStorage.getItem('khalil_pwa_installed') === 'true' ||
      window.matchMedia('(display-mode: standalone)').matches ||
      window.navigator.standalone === true;

    if (alreadyInstalled) {
      return;
    }

    const userAgent = window.navigator.userAgent.toLowerCase();
    const isIOS = /iphone|ipad|ipod/.test(userAgent) && !window.MSStream;

    const handleBeforeInstallPrompt = (e) => {
      e.preventDefault();
      deferredPromptRef.current = e;
    };

    const handleAppInstalled = () => {
      localStorage.setItem('khalil_pwa_installed', 'true');
      toast.dismiss('pwa-install-toast');
      toast.success('Khalil & Sons app installed to your device!');
    };

    const triggerInstall = async () => {
      if (isIOS) {
        toast.info("On iOS: Tap Safari's Share button and select 'Add to Home Screen'.", {
          duration: 6000
        });
        return;
      }

      const promptEvent = deferredPromptRef.current;
      if (!promptEvent) {
        toast.info("To install, tap your browser menu (⋮) and choose 'Install app'.", {
          duration: 5000
        });
        return;
      }

      try {
        await promptEvent.prompt();
        const choice = await promptEvent.userChoice;
        if (choice && choice.outcome === 'accepted') {
          localStorage.setItem('khalil_pwa_installed', 'true');
          deferredPromptRef.current = null;
          toast.dismiss('pwa-install-toast');
          toast.success('Thank you for installing Khalil & Sons!');
        }
      } catch {
        toast.error('Unable to complete installation at this time.');
      }
    };

    const showInstallToast = () => {
      toast('Install Khalil & Sons App', {
        id: 'pwa-install-toast',
        description: '1-tap access to 22K gold bridal vaults & offline appraisals.',
        icon: (
          <img
            src="/assets/logo.png"
            alt="Khalil & Sons"
            className="size-5 object-contain"
          />
        ),
        duration: 10000,
        action: {
          label: 'Install',
          onClick: () => {
            triggerInstall();
          }
        },
        cancel: {
          label: 'Not Now',
          onClick: () => {}
        }
      });
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);
    window.addEventListener('khalil_open_pwa_prompt', showInstallToast);

    const timer = setTimeout(() => {
      showInstallToast();
    }, 2500);

    return () => {
      clearTimeout(timer);
      toast.dismiss('pwa-install-toast');
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
      window.removeEventListener('khalil_open_pwa_prompt', showInstallToast);
    };
  }, []);

  return null;
}
