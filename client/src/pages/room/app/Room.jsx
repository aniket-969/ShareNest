import ProfileCard from "@/components/ProfileCard";
import QRCode from "@/components/QRCode";
import { RoomHeader } from "@/components/Room/roomHeader";
import RoomList from "@/components/Room/roomList";
import EditProfileModal from "@/components/Settings/profile/EditProfileModal";
import ProfileSettingsView from "@/components/Settings/profile/ProfileSettingsView";
import RoomLoader from "@/components/skeleton/Room";
import { useAuth } from "@/hooks/useAuth";
import { useState } from "react";
import { Navigate, Outlet } from "react-router-dom";

const Room = () => {
 
  const { sessionQuery } = useAuth();

  const {
    data: user,
    isLoading,
    isError,
    refetch,
  } = sessionQuery;

const [isEditing, setIsEditing] = useState(false);

if(isLoading){
  return <RoomLoader/>
}

if(isError){
  return <>Something went wrong, Please refresh</>
}
  
  console.log("in room");
 if (!user) return <Navigate to="/login" replace />;

  return (
    <div className="max-h-screen">
      <RoomHeader />
      <div className="flex flex-col gap-10 items-center pt-7 sm:pt-12">
        <ProfileSettingsView onEdit={() => setIsEditing(true)} />
        <EditProfileModal
          open={isEditing}
          onClose={() => setIsEditing(false)}
          user={user}
          onSave={() => refetch()}
        />
        <div className="flex flex-col-reverse justify-around items-center w-full gap-20 sm:gap-10 sm:flex-row sm:mt-7">
          <QRCode />
          <RoomList />
        </div>
      </div>
    </div>
  );
};

export default Room;
