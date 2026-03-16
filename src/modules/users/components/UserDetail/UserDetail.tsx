import { observer } from "mobx-react-lite";
import { Avatar, Button, Chip, Divider } from "@mui/material";
import { Link, useNavigate } from "@tanstack/react-router";
import EmailOutlinedIcon from "@mui/icons-material/EmailOutlined";
import PhoneOutlinedIcon from "@mui/icons-material/PhoneOutlined";
import LocationOnOutlinedIcon from "@mui/icons-material/LocationOnOutlined";
import SchoolOutlinedIcon from "@mui/icons-material/SchoolOutlined";
import BusinessOutlinedIcon from "@mui/icons-material/BusinessOutlined";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import { Spinner, ErrorState, TagList } from "../../../../ui";
import { useUserDetail } from "../../hooks/useUserDetail";
import { likesStore } from "../../../likes";
import { authStore } from "../../../auth";
import styles from "./UserDetail.module.css";

type UserDetailProps = { userId: number };

function InfoRow({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className={styles["info-row"]}>
      <span className={styles["info-icon"]}>{icon}</span>
      <div>
        <p className={styles["info-label"]}>{label}</p>
        <p className={styles["info-value"]}>{value}</p>
      </div>
    </div>
  );
}

export default observer(function UserDetail({ userId }: UserDetailProps) {
  const navigate = useNavigate();
  const { data: user, isLoading, isError, error, refetch } = useUserDetail(userId);
  const likedPosts = likesStore.likedPostsList;

  if (isLoading) return <Spinner label="Loading profile…" />;
  if (isError) return <ErrorState message={error?.message ?? "Failed to load user"} onRetry={refetch} />;
  if (!user) return null;

  const initials = `${user.firstName[0]}${user.lastName[0]}`.toUpperCase();
  const isOwnProfile = authStore.isAuthenticated && authStore.user?.id === userId;

  return (
    <div className={styles.wrapper}>
      <div className={styles.container}>

        <div className={styles["profile-card"]}>
          <Avatar
            src={user.image}
            sx={{ width: 80, height: 80, fontSize: 28, fontWeight: 700, bgcolor: "primary.main" }}
          >
            {initials}
          </Avatar>
          <div className={styles.info}>
            <h1 className={styles.name}>{user.firstName} {user.lastName}</h1>
            <p className={styles.username}>@{user.username}</p>
            <div className={styles.meta}>
              <span className={styles["meta-item"]}>{user.age} y.o.</span>
              <span className={styles["meta-item"]}>{user.gender}</span>
            </div>
            <Chip
              label={user.role}
              size="small"
              sx={{ borderRadius: 1, fontSize: 12, height: 24 }}
            />
            {!isOwnProfile && authStore.isAuthenticated && (
              <Button
                variant="contained"
                size="small"
                sx={{ mt: 1.5, ml: 1 }}
                onClick={() => navigate({ to: "/chat/$chatId", params: { chatId: String(userId) } })}
              >
                Message
              </Button>
            )}
          </div>
        </div>

        <div className={styles["section-card"]}>
          <div className={styles["info-grid"]}>
            <div>
              <h2 className={styles["section-title"]}>Contact</h2>
              <InfoRow icon={<EmailOutlinedIcon sx={{ fontSize: 16 }} />} label="Email" value={user.email} />
              <InfoRow icon={<PhoneOutlinedIcon sx={{ fontSize: 16 }} />} label="Phone" value={user.phone} />
              <InfoRow
                icon={<LocationOnOutlinedIcon sx={{ fontSize: 16, margin: 0 }} />}
                label="Address"
                value={`${user.address.city}, ${user.address.state}`}
              />
            </div>
            <div>
              <h2 className={styles["section-title"]}>Work & Education</h2>
              <InfoRow
                icon={<BusinessOutlinedIcon sx={{ fontSize: 16 }} />}
                label={user.company.title}
                value={`${user.company.name} · ${user.company.department}`}
              />
              <InfoRow
                icon={<SchoolOutlinedIcon sx={{ fontSize: 16 }} />}
                label="University"
                value={user.university}
              />
            </div>
          </div>
        </div>

        <div className={styles["section-card"]}>
          <h2 className={styles["section-title"]}>
            Liked posts ({likedPosts.length})
          </h2>
          {likedPosts.length === 0 ? (
            <p className={styles.empty}>No liked posts yet</p>
          ) : (
            <div className={styles["liked-list"]}>
              {likedPosts.map((post) => (
                <Link
                  key={post.id}
                  to="/posts/$postId"
                  params={{ postId: String(post.id) }}
                  className={styles["liked-item"]}
                >
                  <span className={styles["liked-title"]}>{post.title}</span>
                  <TagList tags={post.tags.slice(0, 2)} />
                  <ArrowForwardIcon sx={{ fontSize: 16, color: "text.disabled", flexShrink: 0 }} />
                </Link>
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  );
});
