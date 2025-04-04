import { deleteMessage, fetchMessages, sendMessage } from "@/api/queries/chat";
import {
  useInfiniteQuery,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
 
export const useChat = () => {
  const queryClient = useQueryClient();
   const messageQuery = (roomId) =>
    useInfiniteQuery({
      queryKey: ["chat", roomId],
      queryFn: ({ pageParam = 1 }) => fetchMessages(roomId, pageParam),
      getNextPageParam: (lastPage, allPages) => {
        const { currentPage, totalPages } = lastPage;
        return currentPage < totalPages ? currentPage + 1 : undefined;
      },
      refetchOnWindowFocus: false,
      staleTime: 30 * 60 * 1000,
      cacheTime: 60 * 60 * 1000,
      enabled: !!roomId,
    });

  const sendMessageMutation = useMutation({
    mutationFn: ({ data, roomId }) => sendMessage(data, roomId),
    onSuccess: () => {
      //   queryClient.invalidateQueries(["chat"]);
    },
  });

  const deleteMessageMutation = useMutation({
    mutationFn: ({ roomId, messageId }) => deleteMessage(roomId, messageId),
    onSuccess: () => {
      queryClient.invalidateQueries(["chat"]);
    },
  });

  return { messageQuery, sendMessageMutation, deleteMessageMutation };
};
