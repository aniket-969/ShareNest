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
    <div className="flex flex-col items-start gap-5">
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

      <LeaveRoom roomId={roomId} />

      {isAdmin && <AdminTransfer roomId={roomId} participants={room.tenants} />}

      {isAdmin && <KickUserModal roomId={roomId} participants={room.tenants} />}


    </div>
  );
};

export default RoomSettings;
