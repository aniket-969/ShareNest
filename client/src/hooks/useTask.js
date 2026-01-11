import {
  createRoomTask,
  deleteRoomTask,
  createSwitchRequest,
  createSwitchResponse
} from "@/api/queries/task";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";

export const useTask = (roomId) => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const createTaskMutation = useMutation({
    mutationFn: (newTaskData) => createRoomTask(roomId, newTaskData),
    onSuccess: () => {
      queryClient.invalidateQueries(["room", roomId]);
    },
  });

  const deleteTaskMutation = useMutation({
    mutationFn: (taskId) => deleteRoomTask(roomId, taskId),
    onSuccess: () => {
      console.log("Task deleted successfully");
      queryClient.invalidateQueries(["auth", "session"]);
    },
  });
  const createSwitchRequestMutation = useMutation({
    mutationFn: ({ taskId, data }) => createSwitchRequest(roomId, taskId, data),

    onSuccess: () => {
      queryClient.invalidateQueries(["room", roomId]);
    },

    onError: (err) => {
      console.error("Failed to create swap request", err);
    },
  });
  const createSwitchResponseMutation = useMutation({
    mutationFn: ({ taskId, data }) =>
      createSwitchResponse(roomId, taskId, data),

    onSuccess: () => {
      queryClient.invalidateQueries(["room", roomId]);
    },

    onError: (err) => {
      console.error("Failed to respond to swap request", err);
    },
  });
 
  return {
    createTaskMutation,
    deleteTaskMutation,
    createSwitchRequestMutation,
    createSwitchResponseMutation
  };
};
