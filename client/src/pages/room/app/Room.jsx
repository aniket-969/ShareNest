import ProfileCard from "@/components/ProfileCard";
import QRCode from "@/components/QRCode";
import { RoomHeader } from "@/components/Room/roomHeader";
import RoomList from "@/components/Room/roomList";
import EditProfileModal from "@/components/Settings/profile/EditProfileModal";
import ProfileSettingsView from "@/components/Settings/profile/ProfileSettingsView";
import { useAuth } from "@/hooks/useAuth";
import { useState } from "react";
import { Navigate, Outlet } from "react-router-dom";

const Room = () => {
  const session = localStorage.getItem("session");
  const { sessionQuery } = useAuth();

  const {
    data: user,
    isLoading,
    isError,
    refetch,
  } = sessionQuery;

  const [isEditing, setIsEditing] = useState(false);

  console.log("in room");
  return session ? (
    <div className=" max-h-screen ">
      <RoomHeader />
      <div className="flex flex-col gap-10 items-center pt-7 sm:pt-12">
        {/* profile settings */}
        <ProfileSettingsView onEdit={() => setIsEditing(true)} />
        {/* edit modal */}
        <EditProfileModal
          open={isEditing}
          onClose={() => setIsEditing(false)}
          user={user}
          onSave={() => refetch()}
        />
        <div className="flex flex-col-reverse justify-around items-center w-full gap-20 sm:gap-10 sm:flex-row sm:mt-7 ">
          <QRCode />

          <RoomList />
        </div>
      </div>
    </div>
  ) : (
    <Navigate to="/login" />
  );
};

export default Room;
