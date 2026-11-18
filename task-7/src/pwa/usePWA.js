import { useEffect, useState } from 'react';
import { registerSW, activateUpdate } from './registerSW';

export function useOnlineStatus() {
  const [online, setOnline] = useState(navigator.onLine);
  useEffect(() => {
    const on = () => setOnline(true), off = () => setOnline(false);
    window.addEventListener('online', on); window.addEventListener('offline', off);
    return () => { window.removeEventListener('online', on); window.removeEventListener('offline', off); };
  }, []);
  return online;
}

export function usePWA() {
  const [updateReg, setUpdateReg] = useState(null);
  const [installEvent, setInstallEvent] = useState(null);
  useEffect(() => {
    registerSW(setUpdateReg);
    const h = (e) => { e.preventDefault(); setInstallEvent(e); };
    window.addEventListener('beforeinstallprompt', h);
    window.addEventListener('appinstalled', () => setInstallEvent(null));
    return () => window.removeEventListener('beforeinstallprompt', h);
  }, []);
  return {
    updateAvailable: !!updateReg,
    applyUpdate: () => activateUpdate(updateReg),
    canInstall: !!installEvent,
    install: async () => { await installEvent.prompt(); setInstallEvent(null); },
  };
}
