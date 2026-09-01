'use client';

import { useEffect, useState } from 'react';
import { X, Download, Smartphone } from 'lucide-react';

type InstallPromptState = 'idle' | 'available' | 'dismissed' | 'installed';

function isIOS() {
  if (typeof window === 'undefined') return false;
  return /iPad|iPhone|iPod/.test(navigator.userAgent) && !(window as any).MSStream;
}

function isStandalone() {
  if (typeof window === 'undefined') return false;
  return (window.matchMedia('(display-mode: standalone)').matches) || (window as any).navigator.standalone === true;
}

export function PWAInstallPrompt() {
  const [state, setState] = useState<InstallPromptState>('idle');
  const [isIOSDevice, setIsIOSDevice] = useState(false);

  useEffect(() => {
    if (isStandalone()) {
      setState('installed');
      return;
    }

    const dismissed = localStorage.getItem('heightt-pwa-dismissed');
    if (dismissed) {
      setState('dismissed');
      return;
    }

    const deferredPrompt = (window as any).deferredPWAInstallPrompt;
    if (deferredPrompt) {
      setState('available');
      return;
    }

    if (isIOS()) {
      setIsIOSDevice(true);
      // Show iOS prompt after a small delay on landing page
      const timer = setTimeout(() => {
        setState('available');
      }, 3000);
      return () => clearTimeout(timer);
    }

    // Listen for beforeinstallprompt on non-iOS devices
    const handler = (e: Event) => {
      e.preventDefault();
      (window as any).deferredPWAInstallPrompt = e;
      setState('available');
    };

    window.addEventListener('beforeinstallprompt', handler as EventListener);
    return () => window.removeEventListener('beforeinstallprompt', handler as EventListener);
  }, []);

  const handleInstall = async () => {
    const deferredPrompt = (window as any).deferredPWAInstallPrompt;
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === 'accepted') {
        setState('installed');
      }
      (window as any).deferredPWAInstallPrompt = null;
    }
  };

  const handleDismiss = () => {
    localStorage.setItem('heightt-pwa-dismissed', 'true');
    setState('dismissed');
  };

  if (state !== 'available') return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
      <div className="w-full max-w-sm rounded-2xl bg-white shadow-2xl border border-border p-6 flex flex-col gap-4 relative">
        <button
          onClick={handleDismiss}
          className="absolute top-3 right-3 text-muted-foreground hover:text-foreground transition-colors"
          aria-label="Dismiss"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="mx-auto w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center">
          {isIOSDevice ? (
            <Smartphone className="w-7 h-7 text-primary" />
          ) : (
            <Download className="w-7 h-7 text-primary" />
          )}
        </div>

        <div className="text-center">
          <h3 className="font-display text-lg font-bold text-foreground">
            {isIOSDevice ? 'Add Heightt to Home Screen' : 'Install Heightt App'}
          </h3>
          <p className="mt-1 text-sm text-muted-foreground leading-relaxed">
            {isIOSDevice
              ? 'Install Heightt on your device for quick access and a native app experience.'
              : 'Install Heightt on your device for quick access and a native app experience.'}
          </p>
        </div>

        {isIOSDevice ? (
          <div className="rounded-xl bg-muted/60 p-4 text-xs text-muted-foreground leading-relaxed">
            <p className="font-semibold text-foreground mb-1">How to install:</p>
            <ol className="list-decimal list-inside space-y-1">
              <li>Tap the <span className="font-semibold">Share</span> button in Safari</li>
              <li>Scroll down and tap <span className="font-semibold">Add to Home Screen</span></li>
              <li>Tap <span className="font-semibold">Add</span> in the top right</li>
            </ol>
          </div>
        ) : (
          <button
            onClick={handleInstall}
            className="w-full mt-1 inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-4 py-3 text-sm font-bold text-primary-foreground shadow-[0_10px_30px_rgba(26,92,255,0.3)] hover:shadow-[0_14px_36px_rgba(26,92,255,0.4)] hover:scale-[1.02] transition-all duration-300"
          >
            <Download className="w-4 h-4" />
            Download Now
          </button>
        )}

        <button
          onClick={handleDismiss}
          className="text-xs font-semibold text-muted-foreground hover:text-foreground transition-colors text-center"
        >
          Not now
        </button>
      </div>
    </div>
  );
}
