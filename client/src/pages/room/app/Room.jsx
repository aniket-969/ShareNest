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

  const {
    data: user,
    isLoading,
    isError,
    refetch,
  } = sessionQuery;
const { roomsQuery } = useRooms()
const {
    data: rooms,
    isLoading:roomLoading,
    isError:roomError,
  } = roomsQuery;

  const pendingRooms = rooms?.filter(room => room.status === "pending");
console.log(rooms)
const [isEditing, setIsEditing] = useState(false);

if( roomLoading){
  return <RoomLoader/>
}

if(roomError){
  return <>Something went wrong, Please refresh</>
}
  
  // console.log("in room");
//  if (!user) return <Navigate to="/login" replace />;

  return (
    <div className="">
      <RoomHeader user={user} refetch={refetch}/>
      <div className="flex flex-col md:gap-10 gap-6 items-center pt-16 ">
        {/* Profile with edit btn */}
        <div className="md:block hidden ">
           <ProfileSettingsView onEdit={() => setIsEditing(true)} />
        <EditProfileModal
          open={isEditing}
          onClose={() => setIsEditing(false)}
          user={user}
          onSave={() => refetch()}
        />
        </div>
     {/* bottom qr code and room list */}
        <div className="flex flex-col-reverse justify-evenly items-center w-full gap-16 md:gap-32 md:flex-row md:mt-7 ">
          <QRCode />
          <RoomList />
        </div>
        <PendingRoomList rooms={pendingRooms}/>
      </div>
    </div>
  );
};

export default Room;
