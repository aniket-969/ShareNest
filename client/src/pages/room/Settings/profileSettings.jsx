import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import ProfileSkeleton from "@/components/skeleton/Room/profile";
import ProfileSettingsView from "@/components/Settings/ProfileSettingsView";
import EditProfileModal from "@/components/Settings/EditProfileModal";
import ChangePasswordModal from "@/components/Settings/ChangePasswordModal";
import { Button } from '@/components/ui/button';

const ProfileSettings = () => {
  const { sessionQuery } = useAuth();
  const { data: user, isLoading, isError, refetch } = sessionQuery;
  const [isEditing, setIsEditing] = useState(false);
const [isPwModalOpen, setIsPwModalOpen] = useState(false);

  if (isLoading) return <ProfileSkeleton />;
  if (isError) return <>Something went wrong</>;

  return (
    <>
      {/* User Details */}
      <ProfileSettingsView onEdit={() => setIsEditing(true)} />
      <EditProfileModal
        open={isEditing}
        onClose={() => setIsEditing(false)}
        user={user}
        onSave={() => refetch()}
      />

      {/* Change Password */}

      <ChangePasswordModal
        open={isPwModalOpen}
        onClose={() => setIsPwModalOpen(false)}
      />
    </>
  );
};
export default ProfileSettings;
