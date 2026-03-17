import { useEffect, useRef } from "react";
import { Spinner, ErrorState } from "../../../../ui";
import { usePostsFeed } from "../../hooks/usePostsFeed";
import PostCard from "../PostCard/PostCard";
import styles from "./Feed.module.css";

export function Feed() {
  const { posts, hasMore, isLoading, isLoadingMore, isError, error, loadMore, retry } =
    usePostsFeed();

  const sentinelRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const sentinel = sentinelRef.current;
    if (!sentinel || typeof IntersectionObserver === "undefined") return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !isLoadingMore) {
          loadMore();
        }
      },
      { rootMargin: "200px" }
    );

    observer.observe(sentinel);
    return () => observer.disconnect();
  }, [loadMore, hasMore, isLoadingMore]);

  return (
    <div className={styles.wrapper}>
      {isLoading && <Spinner label="Loading posts…" />}
      {isError && <ErrorState message={error} onRetry={retry} />}

      {posts.length > 0 && (
        <>
          <div className={styles.grid}>
            {posts.map((post, i) => (
              <PostCard key={post.id} post={post} index={i} />
            ))}
          </div>
          <div ref={sentinelRef} className={styles.sentinel} />
          {isLoadingMore && <Spinner label="Loading more…" />}
          {!hasMore && !isLoading && (
            <div className={styles.end}>You're all caught up</div>
          )}
        </>
      )}
    </div>
  );
}
