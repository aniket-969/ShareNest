import {
  createRoomTask,
  deleteRoomTask,
  updateRoomTask,
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

  return {
    createTaskMutation,
    deleteTaskMutation,
  };
};
