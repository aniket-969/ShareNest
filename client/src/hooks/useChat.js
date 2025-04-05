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
      queryFn: ({ pageParam = null }) => fetchMessages(roomId, pageParam),
      getNextPageParam: (lastPage, allPages) => {
        // Get the oldest message's timestamp from the last batch
        const messages = lastPage.messages;
        if (messages.length === 0) return undefined; // No more messages

        return messages[messages.length - 1].createdAt; // Use last message's timestamp as cursor
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
