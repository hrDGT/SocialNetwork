import { UserDetail } from "../../modules/users";

type UserPageProps = {
  userId: number;
};

export default function UserPage({ userId }: UserPageProps) {
  return <UserDetail userId={userId} />;
}
