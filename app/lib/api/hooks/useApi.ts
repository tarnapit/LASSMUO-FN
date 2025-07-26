import { useState, useEffect, useCallback } from 'react';
import { ApiError, NetworkError } from '../config';

// Generic hook for API calls
export function useApi<T>() {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const execute = useCallback(async (apiCall: () => Promise<T>) => {
    try {
      setLoading(true);
      setError(null);
      const result = await apiCall();
      setData(result);
      return result;
    } catch (err) {
      const errorMessage = err instanceof ApiError || err instanceof NetworkError 
        ? err.message 
        : 'An unexpected error occurred';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const reset = useCallback(() => {
    setData(null);
    setError(null);
    setLoading(false);
  }, []);

  return {
    data,
    loading,
    error,
    execute,
    reset,
  };
}

// Hook for async operations with manual trigger
export function useAsyncOperation<T, P extends any[] = []>() {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const execute = useCallback(async (operation: (...args: P) => Promise<T>, ...args: P) => {
    try {
      setLoading(true);
      setError(null);
      const result = await operation(...args);
      setData(result);
      return result;
    } catch (err) {
      const errorMessage = err instanceof ApiError || err instanceof NetworkError 
        ? err.message 
        : 'An unexpected error occurred';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const reset = useCallback(() => {
    setData(null);
    setError(null);
    setLoading(false);
  }, []);

  return {
    data,
    loading,
    error,
    execute,
    reset,
  };
}

// Hook for data fetching with automatic loading
export function useFetch<T>(
  fetcher: () => Promise<T>,
  dependencies: React.DependencyList = []
) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refetch = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const result = await fetcher();
      setData(result);
      return result;
    } catch (err) {
      const errorMessage = err instanceof ApiError || err instanceof NetworkError 
        ? err.message 
        : 'An unexpected error occurred';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [fetcher]);

  useEffect(() => {
    refetch();
  }, dependencies);

  return {
    data,
    loading,
    error,
    refetch,
  };
}

// Hook for mutation operations (create, update, delete)
export function useMutation<T, P extends any[] = []>() {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const mutate = useCallback(async (operation: (...args: P) => Promise<T>, ...args: P) => {
    try {
      setLoading(true);
      setError(null);
      setSuccess(false);
      const result = await operation(...args);
      setData(result);
      setSuccess(true);
      return result;
    } catch (err) {
      const errorMessage = err instanceof ApiError || err instanceof NetworkError 
        ? err.message 
        : 'An unexpected error occurred';
      setError(errorMessage);
      setSuccess(false);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const reset = useCallback(() => {
    setData(null);
    setError(null);
    setLoading(false);
    setSuccess(false);
  }, []);

  return {
    data,
    loading,
    error,
    success,
    mutate,
    reset,
  };
}

// Hook for pagination
export function usePagination<T>(
  fetcher: (page: number, limit: number) => Promise<{ data: T[]; total: number; totalPages: number }>,
  initialLimit: number = 10
) {
  const [data, setData] = useState<T[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(initialLimit);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  const fetchPage = useCallback(async (pageNum: number, pageLimit: number) => {
    try {
      setLoading(true);
      setError(null);
      const result = await fetcher(pageNum, pageLimit);
      setData(result.data);
      setTotal(result.total);
      setTotalPages(result.totalPages);
    } catch (err) {
      const errorMessage = err instanceof ApiError || err instanceof NetworkError 
        ? err.message 
        : 'An unexpected error occurred';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [fetcher]);

  const goToPage = useCallback((pageNum: number) => {
    setPage(pageNum);
    fetchPage(pageNum, limit);
  }, [fetchPage, limit]);

  const nextPage = useCallback(() => {
    if (page < totalPages) {
      goToPage(page + 1);
    }
  }, [page, totalPages, goToPage]);

  const prevPage = useCallback(() => {
    if (page > 1) {
      goToPage(page - 1);
    }
  }, [page, goToPage]);

  const changeLimit = useCallback((newLimit: number) => {
    setLimit(newLimit);
    setPage(1);
    fetchPage(1, newLimit);
  }, [fetchPage]);

  useEffect(() => {
    fetchPage(page, limit);
  }, []);

  return {
    data,
    loading,
    error,
    page,
    limit,
    total,
    totalPages,
    goToPage,
    nextPage,
    prevPage,
    changeLimit,
    refetch: () => fetchPage(page, limit),
  };
}
