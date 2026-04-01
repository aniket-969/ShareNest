import { useState } from "react";
import RoomDetailsView from "@/components/Settings/room/RoomDetailsView";
import EditRoomDetailsModal from "@/components/Settings/room/EditRoomModal";
import LeaveRoom from "@/components/Settings/room/LeaveRoom";
import AdminTransfer from "@/components/Settings/room/AdminTransfer";
import KickUserModal from "@/components/Settings/room/KickUserModal";

const RoomSettings = ({
  room,
  isAdmin,
  roomId,
  updateRoomMutation,
  onRoomUpdate,
}) => {
  const [isEditing, setIsEditing] = useState(false);

  return (
    <div className="flex flex-col items-start sm:gap-12 gap-8">
      <RoomDetailsView
        room={room}
        isAdmin={isAdmin}
        onEdit={() => setIsEditing(true)}
      />

      <EditRoomDetailsModal
        open={isEditing}
        room={room}
        updateRoomMutation={updateRoomMutation}
        onClose={() => setIsEditing(false)}
        onSuccess={onRoomUpdate}
      />
<div className="gap-3 flex sm:flex-row flex-col">
   <LeaveRoom roomId={roomId} />

      {isAdmin && <AdminTransfer roomId={roomId} participants={room.tenants} />}

      {isAdmin && <KickUserModal roomId={roomId} participants={room.tenants} />}


</div>
     
    </div>
  );
};

export default RoomSettings;
