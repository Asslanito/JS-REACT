import { useCallback, useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { favoritesStorage } from '../services/storageService';

// Bonus feature: per-user favorites (separate list for each Firebase UID).
export function useFavorites() {
  const { user } = useAuth();
  const uid = user?.uid;
  const [ids, setIds] = useState([]);

  useEffect(() => {
    setIds(uid ? favoritesStorage.get(uid) : []);
  }, [uid]);

  const toggle = useCallback(
    (id) => {
      if (!uid) return;
      setIds((prev) => {
        const next = prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id];
        favoritesStorage.set(uid, next);
        return next;
      });
    },
    [uid]
  );

  return { ids, isFavorite: (id) => ids.includes(id), toggle };
}
