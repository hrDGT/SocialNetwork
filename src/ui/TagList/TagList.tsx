import type { TagListProps } from "./types";
import styles from "./TagList.module.css";

export default function TagList({ tags }: TagListProps) {
  return (
    <ul className={styles.list}>
      {tags.map((tag) => (
        <li key={tag} className={styles.chip}>{tag}</li>
      ))}
    </ul>
  );
}
