import { useCallback, useEffect, useRef, useState } from 'react';

interface UseInfiniteScrollProps {
  fetchMore: () => Promise<boolean>;
  hasNextPage: boolean;
  enabled?: boolean;
  threshold?: number;
}

export const useInfiniteScroll = ({
  fetchMore,
  hasNextPage,
  enabled = true,
  threshold = 100,
}: UseInfiniteScrollProps) => {
  const [isFetchingMore, setIsFetchingMore] = useState(false);
  const targetRef = useRef<HTMLDivElement>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);

  const handleIntersection = useCallback(
    async (entries: IntersectionObserverEntry[]) => {
      const target = entries[0];

      if (target.isIntersecting && hasNextPage && enabled && !isFetchingMore) {
        setIsFetchingMore(true);
        try {
          await fetchMore();
        } catch (error) {
          console.error('Error fetching more data:', error);
        } finally {
          setIsFetchingMore(false);
        }
      }
    },
    [fetchMore, hasNextPage, enabled, isFetchingMore],
  );

  useEffect(() => {
    const currentTarget = targetRef.current;

    if (!currentTarget || !enabled) return;

    observerRef.current = new IntersectionObserver(handleIntersection, {
      rootMargin: `${threshold}px`,
      threshold: 0,
    });

    observerRef.current.observe(currentTarget);

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [handleIntersection, threshold, enabled]);

  return {
    targetRef,
    isFetchingMore,
  };
};
