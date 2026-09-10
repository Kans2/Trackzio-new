import { useState, useEffect, useCallback, useRef } from 'react';

/**
 * Infinite scroll hook.
 * Triggers loadMore when the user scrolls near the bottom.
 */
const useInfiniteScroll = (loadMore, { threshold = 300, hasMore = true } = {}) => {
  const [isFetching, setIsFetching] = useState(false);
  const loadMoreRef = useRef(loadMore);
  
  // Keep loadMore ref fresh
  useEffect(() => {
    loadMoreRef.current = loadMore;
  }, [loadMore]);

  const handleScroll = useCallback(() => {
    if (isFetching || !hasMore) return;

    const scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
    const scrollHeight = document.documentElement.scrollHeight;
    const clientHeight = document.documentElement.clientHeight;

    if (scrollHeight - scrollTop - clientHeight < threshold) {
      setIsFetching(true);
    }
  }, [isFetching, hasMore, threshold]);

  useEffect(() => {
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [handleScroll]);

  useEffect(() => {
    if (!isFetching) return;

    const doFetch = async () => {
      try {
        await loadMoreRef.current();
      } finally {
        setIsFetching(false);
      }
    };

    doFetch();
  }, [isFetching]);

  return { isFetching };
};

export default useInfiniteScroll;
