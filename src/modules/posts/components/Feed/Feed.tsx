import { Box, Container } from "@mui/material";
import { Spinner, ErrorState } from "../../../../ui";
import { usePostsFeed } from "../../hooks/usePostsFeed";
import { useInfiniteScroll } from "../../hooks/useInfiniteScroll";
import PostCard from "../PostCard/PostCard";
import styles from "./Feed.module.css";

export function Feed() {
  const { posts, hasMore, isLoading, isLoadingMore, isError, error, loadMore, retry } =
    usePostsFeed();

  const sentinelRef = useInfiniteScroll({
    onLoadMore: loadMore,
    hasMore,
    isLoading: isLoadingMore,
  });

  return (
    <Box className={styles.wrapper}>
      <Container maxWidth="xl" className={styles.body}>
        {isLoading && <Spinner label="Fetching posts…" />}

        {isError && (
          <ErrorState message={error} onRetry={retry} />
        )}

        {posts.length > 0 && (
          <>
            <Box className={styles.grid}>
              {posts.map((post, i) => (
                <Box key={post.id} className={styles.cell}>
                  <PostCard post={post} index={i} />
                </Box>
              ))}
            </Box>

            <Box ref={sentinelRef} className={styles.sentinel} />

            {isLoadingMore && <Spinner label="Loading more…" />}

            {!hasMore && !isLoading && (
              <Box className={styles.end}>— end of feed —</Box>
            )}
          </>
        )}
      </Container>
    </Box>
  );
}
