import { useInfiniteQuery } from "@tanstack/react-query";
import { postsApi } from "../api/postsApi";

const PAGE_SIZE = 12;

export function usePostsFeed() {
  const query = useInfiniteQuery({
    queryKey: ["posts"],
    queryFn: ({ pageParam }) =>
      postsApi.fetchPage({ limit: PAGE_SIZE, skip: pageParam }),
    initialPageParam: 0,
    getNextPageParam: (lastPage) => {
      const loaded = lastPage.skip + lastPage.posts.length;
      return loaded < lastPage.total ? loaded : undefined;
    },
  });

  const posts = query.data?.pages.flatMap((page) => page.posts) ?? [];
  const total = query.data?.pages[0]?.total;
  const hasMore = query.hasNextPage;

  return {
    posts,
    total,
    hasMore,
    isLoading: query.isLoading,
    isLoadingMore: query.isFetchingNextPage,
    isError: query.isError,
    error: query.error?.message ?? "Unknown error",
    loadMore: query.fetchNextPage,
    retry: query.refetch,
  };
}
