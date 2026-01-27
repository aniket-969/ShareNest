import { useState } from "react";
import ProfileSettingsView from "@/components/Settings/profile/ProfileSettingsView";
import EditProfileModal from "@/components/Settings/profile/EditProfileModal";
import ChangePasswordModal from "@/components/Settings/profile/ChangePasswordModal";
import { Button } from "@/components/ui/button";
import LogOut from "@/components/LogOut";

const ProfileSettings = ({user,refetch}) => {
  
  const [isEditing, setIsEditing] = useState(false);
  const [isPwModalOpen, setIsPwModalOpen] = useState(false);

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
      {/* Other feature buttons */}
      <div className="flex items-center  gap-5 mt-5 py-2">
        {/* Change Password */}
        <ChangePasswordModal
          open={isPwModalOpen}
          onClose={() => setIsPwModalOpen(false)}
        />
        {/* Logout */}
        <LogOut />
      </div>
    </div>
  );
};
export default ProfileSettings;
