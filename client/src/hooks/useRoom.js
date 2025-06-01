import {
  addUserRequest,
  createRoom,
  getRoomData,
  adminResponse,
  updateRoom,
  deleteRoom,
  leaveRoom,
  adminTransfer,
} from "@/api/queries/room";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

export const useRoom = (roomId) => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const roomQuery = useQuery({
    queryKey: ["room", roomId],
    queryFn: () => getRoomData(roomId),
    enabled: !!roomId,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    staleTime: 5 * 60 * 1000,
    cacheTime: 10 * 60 * 1000,
    retry: 3,
  });

  const updateRoomMutation = useMutation({
  
  mutationFn: (newValues) => updateRoom(roomId, newValues),
  onSuccess: (newRoomId) => {
    queryClient.invalidateQueries(["room", newRoomId]);
    toast.success("Room details updated");
  },
});


  const deleteRoomMutation = useMutation({
    queryFn: deleteRoom,
    onSuccess: () => {
      console.log("Room deleted successfully");
      queryClient.invalidateQueries(["auth", "session"]);
      navigate("/room");
    },
  });

  const adminResponseMutation = useMutation({
    mutationFn: ({ data }) => adminResponse(data, roomId),
    onSuccess: () => {
      queryClient.invalidateQueries(["room", roomId]);
    },
    onError: (error) => {
      console.error("Failed to send admin response", error);
    },
  });

  const leaveRoomMutation = useMutation({
    mutationFn: () => leaveRoom(roomId),
    onSuccess: () => {
      navigate("/room");
      toast.success("Left room successfully");
    }, 
    onError: (error) => {
      console.error("Failed to left room", error);
      toast.error(error?.response?.data?.message||"Unable to left room")
    },
  });

  const adminTransferMutation = useMutation({
    mutationFn: ({newAdminId}) => adminTransfer(roomId,newAdminId),
    onSuccess: () => {
      navigate(`/room/${roomId}`);
      toast.success("Admin changed successfully");
    },
    onError: (error) => {
      console.error("Failed to change admin", error);
      toast.error(error?.response?.data?.message||"Failed to change admin")
    },
  });

  return {
    roomQuery,
    adminResponseMutation,
    updateRoomMutation,
    deleteRoomMutation,
    leaveRoomMutation,
    adminTransferMutation
  };
};

export const useRoomMutation = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const createRoomMutation = useMutation({
    mutationFn: createRoom,
    onSuccess: (newRoomId) => {
      queryClient.invalidateQueries(["auth", "session"]);
      navigate(`/room`);
    },
    onError: (error) => {
      console.error("Room creation failed:", error);
    },
  });

  const requestJoinRoomMutation = useMutation({
    mutationFn: addUserRequest,
    onSuccess: () => {
      console.log("Join request sent successfully");
      navigate("/room");
    },
    onError: (error) => {
      console.error("Failed to send join request", error);
    },
  });

  return { createRoomMutation, requestJoinRoomMutation };
};
