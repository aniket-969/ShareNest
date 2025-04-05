import {
  addUserRequest,
  createRoom,
  getRoomData,
  adminResponse,
  updateRoom,
  deleteRoom,
} from "@/api/queries/room";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";

export const useRoom = (roomId) => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const roomQuery = useQuery({
    queryKey: ["room", roomId],
    queryFn: ()=>getRoomData(roomId),
    enabled: !!roomId,
    refetchOnWindowFocus: false,
    staleTime: 5 * 60 * 1000,
    cacheTime: 10 * 60 * 1000,
    retry: 3,
  });

  const updateRoomMutation = useMutation({
    queryFn: updateRoom,
    onSuccess: (roomId) => {
      queryClient.invalidateQueries(["room", roomId]);
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
    queryFn: adminResponse,
    onSuccess: () => {
      queryClient.invalidateQueries(["room", roomId]);
    },
    onError: (error) => {
      console.error("Failed to send admin response", error);
    },
  });

  return {
    roomQuery,
    adminResponseMutation,
    updateRoomMutation,
    deleteRoomMutation,
  };
};
 
export const useRoomMutation =()=>{
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
    
      return { createRoomMutation ,requestJoinRoomMutation};
}