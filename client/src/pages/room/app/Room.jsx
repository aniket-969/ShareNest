import ProfileCard from "@/components/ProfileCard";
import QRCode from "@/components/QRCode";
import PendingRoomList from "@/components/Room/pendingRoom";
import { RoomHeader } from "@/components/Room/roomHeader";
import RoomList from "@/components/Room/roomList";
import EditProfileModal from "@/components/Settings/profile/EditProfileModal";
import ProfileSettingsView from "@/components/Settings/profile/ProfileSettingsView";
import RoomLoader from "@/components/skeleton/Room";
import { useAuth, useRooms } from "@/hooks/useAuth";
import { useState } from "react";
import { Navigate, Outlet } from "react-router-dom";

const Room = () => {
  const { sessionQuery } = useAuth();

  const { data: user, isLoading, isError, refetch } = sessionQuery;
  const { roomsQuery } = useRooms();
  const {
    data: rooms,
    isLoading: roomLoading,
    isError: roomError,
  } = roomsQuery;

  const pendingRooms = rooms?.filter((room) => room.status === "pending");
  console.log(rooms);
  const [isEditing, setIsEditing] = useState(false);

  if (roomLoading) {
    return <RoomLoader />;
  }

  if (roomError) {
    return <>Something went wrong, Please refresh</>;
  }

  // console.log("in room");

  return (
    <div className="">
      <RoomHeader user={user} refetch={refetch} />
      <div className="flex items-center pt-12 md:pt-16 ">
        <div className="flex flex-col md:flex-row items-center justify-evenly w-full md:gap-0 gap-12 ">
          {/* room list and profile container */}
          <div className="md:space-y-20">
            {/* profile and edit btn */}
            <div className="md:block hidden ml-10 ">
              <ProfileSettingsView onEdit={() => setIsEditing(true)} />
              <EditProfileModal
                open={isEditing}
                onClose={() => setIsEditing(false)}
                user={user}
                onSave={() => refetch()}
              />
            </div>
            {/* room list */}
            <RoomList />
          </div>
          <QRCode />
        </div>

        <PendingRoomList rooms={pendingRooms} />
      </div>
    </div>
  );
};

export default Room;
