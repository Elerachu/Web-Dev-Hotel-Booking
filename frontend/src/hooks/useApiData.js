import { useCallback, useEffect, useRef, useState } from 'react';

// Loads data when a page opens (and again when `deps` change).
// Returns { data, loading, error, reload } so every page handles loading/error the same way.
export function useApiData(loader, deps = []) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const latestRequest = useRef(0);


  const load = useCallback(loader, deps);

  const reload = useCallback(async () => {
    const requestId = ++latestRequest.current;
    setLoading(true);
    setError(null);
    try {
      const result = await load();

      if (requestId === latestRequest.current) setData(result);
    } catch (err) {
      if (requestId === latestRequest.current) setError(err);
    } finally {
      if (requestId === latestRequest.current) setLoading(false);
    }
  }, [load]);

  useEffect(() => {
    reload();
  }, [reload]);

  return { data, loading, error, reload };
}
