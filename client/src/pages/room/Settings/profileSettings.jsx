import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import ProfileSkeleton from "@/components/skeleton/Room/profile";
import ProfileSettingsView from "@/components/Settings/ProfileSettingsView";
import EditProfileModal from "@/components/Settings/EditProfileModal";
import ChangePasswordModal from "@/components/Settings/ChangePasswordModal";
import { Button } from '@/components/ui/button';
import  LogOut  from "@/components/LogOut";

const ProfileSettings = () => {
  const { sessionQuery } = useAuth();
  const { data: user, isLoading, isError, refetch } = sessionQuery;
  const [isEditing, setIsEditing] = useState(false);
const [isPwModalOpen, setIsPwModalOpen] = useState(false);

  if (isLoading) return <ProfileSkeleton />;
  if (isError) return <>Something went wrong</>;

  return (
    <div className="">
      {/* User Details */}
      <ProfileSettingsView onEdit={() => setIsEditing(true)} />
      <EditProfileModal
        open={isEditing}
        onClose={() => setIsEditing(false)}
        user={user}
        onSave={() => refetch()}
      />

<div className="flex items-center  gap-5 mt-5 py-2">
      {/* Change Password */}
   <ChangePasswordModal
        open={isPwModalOpen}
        onClose={() => setIsPwModalOpen(false)}
      />
      {/* Logout */}
      <LogOut/>
</div>
     
    </div>
  );
};
export default ProfileSettings;
