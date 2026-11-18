export function registerSW(onUpdate) {
  if (!('serviceWorker' in navigator) || import.meta.env?.DEV) return;
  window.addEventListener('load', async () => {
    const reg = await navigator.serviceWorker.register('/sw.js');
    if (reg.waiting && navigator.serviceWorker.controller) onUpdate(reg);
    reg.addEventListener('updatefound', () => {
      const w = reg.installing;
      w?.addEventListener('statechange', () => {
        if (w.state === 'installed' && navigator.serviceWorker.controller) onUpdate(reg);
      });
    });
    setInterval(() => reg.update(), 60 * 60 * 1000);
  });
  let reloading = false;
  navigator.serviceWorker.addEventListener('controllerchange', () => {
    if (reloading) return;
    reloading = true;
    window.location.reload();
  });
}
export const activateUpdate = (reg) => reg?.waiting?.postMessage({ type: 'SKIP_WAITING' });
