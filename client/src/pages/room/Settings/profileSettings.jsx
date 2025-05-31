
import  { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import ProfileSkeleton from "@/components/skeleton/Room/profile";
import ProfileSettingsView from "@/components/Settings/ProfileSettingsView";
import EditProfileModal from "@/components/Settings/EditProfileModal";

const ProfileSettings = () => {
  const { sessionQuery } = useAuth();
  const { data: user, isLoading, isError, refetch } = sessionQuery;
  const [isEditing, setIsEditing] = useState(false);

  if (isLoading) return <ProfileSkeleton />;
  if (isError) return <>Something went wrong</>;

  return (
    <>
      <ProfileSettingsView onEdit={() => setIsEditing(true)} />
      <EditProfileModal
        open={isEditing}
        onClose={() => setIsEditing(false)}
        user={user}
        onSave={() => refetch()}
      />
    </>
  );
};
export default ProfileSettings;
