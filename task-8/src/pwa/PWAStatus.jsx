import { useOnlineStatus, usePWA } from './usePWA';

export default function PWAStatus() {
  const online = useOnlineStatus();
  const { updateAvailable, applyUpdate, canInstall, install } = usePWA();
  return (
    <>
      <div className={`net-indicator ${online ? 'is-online' : 'is-offline'}`} role="status" aria-live="polite">
        <span className="dot" /> {online ? 'Online' : 'Offline'}
      </div>
      {!online && <div className="offline-banner">You are offline — showing saved data where available.</div>}
      {canInstall && <button className="btn install-btn" onClick={install}>Install app</button>}
      {updateAvailable && (
        <div className="update-toast" role="alert">
          <span>A new version is available.</span>
          <button className="btn" onClick={applyUpdate}>Update</button>
        </div>
      )}
    </>
  );
}
