import React from "react";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { toast } from "react-toastify";
import { useRoom } from "@/hooks/useRoom";

const LeaveRoom = ({ roomId }) => {
  const { leaveRoomMutation } = useRoom(roomId);
  const handleLeave = () => {
    leaveRoomMutation.mutate();
  };

  return (
    <Button
      onClick={handleLeave}
      disabled={leaveRoomMutation.isLoading}
      className="flex items-center gap-2"
    >
      Leave Room
    </Button>
  );
};

export default LeaveRoom;
