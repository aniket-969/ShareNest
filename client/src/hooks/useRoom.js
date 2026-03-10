import {
  addUserRequest,
  createRoom,
  getRoomData,
  adminResponse,
  updateRoom,
  deleteRoom,
  leaveRoom,
  adminTransfer,
  getRoomPricing,
  getRoomPaymentDetails,
  initiateRoomPayment,
  getRoomPaymentStatus,
} from "@/api/queries/room";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { kickUser } from "@/api/queries/room";

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
      toast.error(error?.response?.data?.message || "Unable to left room");
    },
  });

  const adminTransferMutation = useMutation({
    mutationFn: ({ targetUserId }) => adminTransfer(roomId, targetUserId),
    onSuccess: () => {
      navigate(`/room/${roomId}`);
      toast.success("Admin changed successfully");
    },
    onError: (error) => {
      console.error("Failed to change admin", error);
      toast.error(error?.response?.data?.message || "Failed to change admin");
    },
  });

  const kickUserMutation = useMutation({
    mutationFn: ({ targetUserId }) => kickUser(roomId, targetUserId),
    onSuccess: () => {
      toast.success("User kicked out successfully");
    },
    onError: (error) => {
      console.error("Failed to kick user", error);
      toast.error(error?.response?.data?.message || "Failed to kick out user");
    },
  });

  return {
    roomQuery,
    adminResponseMutation,
    updateRoomMutation,
    deleteRoomMutation,
    leaveRoomMutation,
    adminTransferMutation,
    kickUserMutation,
  };
};

export const useRoomPayment = (roomId) => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const roomPaymentDetails = useQuery({
    queryKey: ["room", roomId, "paymentDetails"],
    queryFn: () => getRoomPaymentDetails(roomId),
    enabled: !!roomId,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    staleTime: 5 * 60 * 1000,
    cacheTime: 10 * 60 * 1000,
    retry: 3,
  });

  const initiateRoomPaymentMutation = useMutation({
    mutationFn: initiateRoomPayment,
    onSuccess: (response) => {
      const { key, subscriptionId } = response.data;

      const options = {
        key,
        subscription_id: subscriptionId,
        name: "ShareNest",
        description: "Room Subscription",

        handler: function (response) {
          console.log("Payment success:", response);
           navigate(`/room/${roomId}/activating`);
        },

        modal: {
          ondismiss: function () {
            console.log("Checkout closed");
          },
        },

        theme: {
          color: "#fe2858",
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    },
    onError: (error) => {
      console.error("Room Payment failed:", error);
      toast(error?.response?.data?.message);
    },
  });

  return {
    roomPaymentDetails,
    initiateRoomPaymentMutation,
  };
};

export const useRoomMutation = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const roomPricingQuery = useQuery({
    queryKey: ["room", "pricing"],
    queryFn: getRoomPricing,
    enabled: false,
    staleTime: 5 * 60 * 1000,
    retry: 3,
  });

  const createRoomMutation = useMutation({
    mutationFn: createRoom,
    onSuccess: (response) => {
      queryClient.invalidateQueries(["auth", "session"]);

      const data = response.data;

      // FREE PLAN
      if (!data?.paymentRequired) {
        navigate(`/room/${data._id}`);
        return;
      }

      // PAID PLAN
      navigate(`/room/${data.roomId}/payment`);
    },
    onError: (error) => {
      console.error("Room creation failed:", error);
      toast(error?.response?.data?.message);
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

  return {
    createRoomMutation,
    requestJoinRoomMutation,
    roomPricingQuery,
  };
};

export const useRoomActivation = (roomId) => {
  return useQuery({
    queryKey: ["room", roomId, "status"],
    queryFn: () => getRoomPaymentStatus(roomId),
    enabled: !!roomId,
    refetchInterval: (data) => {
      if (!data) return 2000;

      if (data.status === "pending") {
        return 2000; // polling
      }

      return false; 
    },
    refetchOnWindowFocus: false,
  });
};