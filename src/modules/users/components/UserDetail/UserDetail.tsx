import { observer } from "mobx-react-lite";
import {
  Avatar,
  Box,
  Chip,
  Container,
  Divider,
  Grid,
  Stack,
  Typography,
} from "@mui/material";
import { Link } from "@tanstack/react-router";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import EmailOutlinedIcon from "@mui/icons-material/EmailOutlined";
import PhoneOutlinedIcon from "@mui/icons-material/PhoneOutlined";
import LocationOnOutlinedIcon from "@mui/icons-material/LocationOnOutlined";
import SchoolOutlinedIcon from "@mui/icons-material/SchoolOutlined";
import BusinessOutlinedIcon from "@mui/icons-material/BusinessOutlined";
import { Spinner, ErrorState, TagList } from "../../../../ui";
import { useUserDetail } from "../../hooks/useUserDetail";
import { likesStore } from "../../../likes";
import styles from "./UserDetail.module.css";

type UserDetailProps = {
  userId: number;
};

function InfoRow({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <Stack direction="row" alignItems="flex-start" gap={1.5} className={styles.infoRow}>
      <Box className={styles.infoIcon}>{icon}</Box>
      <Box>
        <Typography className={styles.infoLabel}>{label}</Typography>
        <Typography className={styles.infoValue}>{value}</Typography>
      </Box>
    </Stack>
  );
}

export default observer(function UserDetail({ userId }: UserDetailProps) {
  const { data: user, isLoading, isError, error, refetch } = useUserDetail(userId);
  const likedPosts = likesStore.likedPostsList;

  if (isLoading) return <Spinner label="Loading profile…" />;
  if (isError) return <ErrorState message={error?.message ?? "Failed to load user"} onRetry={refetch} />;
  if (!user) return null;

  const initials = `${user.firstName[0]}${user.lastName[0]}`.toUpperCase();

  return (
    <Box className={styles.wrapper}>
      <Container maxWidth="lg" className={styles.container}>

        <Box className={styles.hero}>
          <Avatar
            src={user.image}
            className={styles.avatar}
          >
            {initials}
          </Avatar>

          <Box>
            <Stack direction="row" alignItems="center" gap={1.5} flexWrap="wrap">
              <Typography className={styles.name}>
                {user.firstName} {user.lastName}
              </Typography>
              <Chip
                label={user.role}
                size="small"
                className={styles.roleBadge}
              />
            </Stack>
            <Typography className={styles.username}>@{user.username}</Typography>
            <Stack direction="row" gap={2} mt={1} flexWrap="wrap">
              <Typography className={styles.meta}>{user.age} y.o.</Typography>
              <Typography className={styles.meta}>{user.gender}</Typography>
            </Stack>
          </Box>
        </Box>

        <Divider className={styles.divider} />

        <Grid container spacing={4} className={styles.infoGrid}>
          <Grid size={{ xs: 12, md: 6 }}>
            <Typography className={styles.sectionTitle}>Contact</Typography>
            <Stack gap={2} mt={2}>
              <InfoRow
                icon={<EmailOutlinedIcon />}
                label="Email"
                value={user.email}
              />
              <InfoRow
                icon={<PhoneOutlinedIcon />}
                label="Phone"
                value={user.phone}
              />
              <InfoRow
                icon={<LocationOnOutlinedIcon />}
                label="Address"
                value={`${user.address.address}, ${user.address.city}, ${user.address.state}`}
              />
            </Stack>
          </Grid>

          <Grid size={{ xs: 12, md: 6 }}>
            <Typography className={styles.sectionTitle}>Work & Education</Typography>
            <Stack gap={2} mt={2}>
              <InfoRow
                icon={<BusinessOutlinedIcon />}
                label={user.company.title}
                value={`${user.company.name} · ${user.company.department}`}
              />
              <InfoRow
                icon={<SchoolOutlinedIcon />}
                label="University"
                value={user.university}
              />
            </Stack>
          </Grid>
        </Grid>

        <Divider className={styles.divider} />

        <Typography className={styles.sectionTitle}>Physical</Typography>
        <Stack direction="row" gap={2} mt={2} flexWrap="wrap">
          {[
            { label: "Height", value: `${user.height} cm` },
            { label: "Weight", value: `${user.weight} kg` },
            { label: "Eye color", value: user.eyeColor },
            { label: "Hair", value: `${user.hair.color} · ${user.hair.type}` },
          ].map(({ label, value }) => (
            <Box key={label} className={styles.statCard}>
              <Typography className={styles.statLabel}>{label}</Typography>
              <Typography className={styles.statValue}>{value}</Typography>
            </Box>
          ))}
        </Stack>

        <Divider className={styles.divider} />

        <Typography className={styles.sectionTitle}>
          Liked posts
          <span className={styles.likedCount}>{likedPosts.length}</span>
        </Typography>

        {likedPosts.length === 0 ? (
          <Typography className={styles.emptyLikes}>
            No liked posts yet. Heart a post in the feed!
          </Typography>
        ) : (
          <Stack gap={0} className={styles.likedList}>
            {likedPosts.map((post) => (
              <Link
                key={post.id}
                to="/posts/$postId"
                params={{ postId: String(post.id) }}
                className={styles.likedItem}
              >
                <Box flex={1} minWidth={0}>
                  <Typography className={styles.likedTitle} noWrap>
                    {post.title}
                  </Typography>
                  <Stack direction="row" gap={1} mt={0.5} flexWrap="wrap">
                    <TagList tags={post.tags.slice(0, 3)} />
                  </Stack>
                </Box>
                <ArrowForwardIcon className={styles.likedArrow} />
              </Link>
            ))}
          </Stack>
        )}

      </Container>
    </Box>
  );
});
