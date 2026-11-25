import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useAuth } from '../context/AuthContext';
import { loadFavorites, toggleFavorite } from '../features/favorites/favoritesSlice';
import { selectFavoriteIds, selectFavoriteSet } from '../features/products/productsSelectors';

export function useFavorites() {
  const dispatch = useDispatch();
  const { user } = useAuth();
  const uid = user?.uid ?? null;
  const loadedUid = useSelector((state) => state.favorites.uid);
  const ids = useSelector(selectFavoriteIds);
  const favoriteSet = useSelector(selectFavoriteSet);

  useEffect(() => {
    if (loadedUid !== uid) dispatch(loadFavorites(uid));
  }, [dispatch, uid, loadedUid]);

  return {
    ids,
    count: ids.length,
    isFavorite: (id) => favoriteSet.has(id),
    toggle: (id) => {
      if (uid) dispatch(toggleFavorite(id));
    },
  };
}
