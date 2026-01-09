import { useState, useCallback, useEffect } from 'react';

/**
 * Generic hook để fetch dữ liệu
 */
export function useFetch<T>(
  fetchFn: () => Promise<{ data: T }>,
  immediate = true
) {
  const [data, setData] = useState<T | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const execute = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetchFn();
      setData(response.data);
    } catch (err: any) {
      setError(err?.message || 'An error occurred');
      console.error('Fetch error:', err);
    } finally {
      setIsLoading(false);
    }
  }, [fetchFn]);

  // Tự động gọi fetch khi component mount
  useEffect(() => {
    if (immediate) {
      execute();
    }
  }, [execute, immediate]);

  return { data, isLoading, error, refetch: execute };
}
