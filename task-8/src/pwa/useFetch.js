import { useEffect, useState } from 'react';
import { fetchJson } from './api';

export function useFetch(url) {
  const [state, setState] = useState({ data: null, loading: true, error: null, fromCache: false });
  useEffect(() => {
    let alive = true;
    setState((s) => ({ ...s, loading: true, error: null }));
    fetchJson(url)
      .then(({ data, fromCache }) => alive && setState({ data, loading: false, error: null, fromCache }))
      .catch((e) => alive && setState({ data: null, loading: false, error: e.message, fromCache: false }));
    return () => { alive = false; };
  }, [url]);
  return state;
}

