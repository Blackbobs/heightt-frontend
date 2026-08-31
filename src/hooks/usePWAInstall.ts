'use client';

import { useState, useEffect, useCallback } from 'react';

type InstallState = {
  canInstall: boolean;
  isIOS: boolean;
  isStandalone: boolean;
  triggerInstall: () => void;
};

function isIOS() {
  if (typeof window === 'undefined') return false;
  return /iPad|iPhone|iPod/.test(navigator.userAgent) && !(window as any).MSStream;
}

function isStandalone() {
  if (typeof window === 'undefined') return false;
  return (
    window.matchMedia('(display-mode: standalone)').matches ||
    (window as any).navigator.standalone === true
  );
}

export function usePWAInstall(): InstallState {
  const [canInstall, setCanInstall] = useState(false);
  const [iosDevice, setIsIOS] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);

  useEffect(() => {
    if (isStandalone()) {
      setCanInstall(false);
      return;
    }

    const ios = isIOS();
    setIsIOS(ios);

    const existing = (window as any).deferredPWAInstallPrompt;
    if (existing) {
      setDeferredPrompt(existing);
      setCanInstall(true);
      return;
    }

    const handler = (e: Event) => {
      e.preventDefault();
      const evt = e as any;
      (window as any).deferredPWAInstallPrompt = evt;
      setDeferredPrompt(evt);
      setCanInstall(true);
    };

    window.addEventListener('beforeinstallprompt', handler as EventListener);
    return () => window.removeEventListener('beforeinstallprompt', handler as EventListener);
  }, []);

  const triggerInstall = useCallback(() => {
    if (iosDevice) {
      alert(
        'To install Heightt on your iOS device:\n\n' +
          '1. Tap the Share button in Safari\n' +
          '2. Scroll down and tap "Add to Home Screen"\n' +
          '3. Tap "Add" in the top right'
      );
      return;
    }

    if (deferredPrompt) {
      deferredPrompt.prompt();
      deferredPrompt.userChoice.then((result: any) => {
        if (result.outcome === 'accepted') {
          setCanInstall(false);
        }
        (window as any).deferredPWAInstallPrompt = null;
        setDeferredPrompt(null);
      });
    }
  }, [iosDevice, deferredPrompt]);

  return {
    canInstall,
    isIOS: iosDevice,
    isStandalone: isStandalone(),
    triggerInstall,
  };
}
