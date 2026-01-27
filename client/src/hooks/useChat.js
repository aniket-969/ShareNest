import {  fetchMessages, sendMessage } from "@/api/queries/chat";
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
    queryFn: async ({ pageParam = null }) => {
      
      return fetchMessages(roomId, pageParam); 
    },
    getNextPageParam: (lastPage) => {
      
      const meta = lastPage?.meta ?? lastPage?.chatMessagesMeta ?? null;
      if (!meta) return undefined;
      if (!meta.hasMore) return undefined;
      return meta.nextBeforeId || undefined;
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

  // const deleteMessageMutation = useMutation({
  //   mutationFn: ({ roomId, messageId }) => deleteMessage(roomId, messageId),
  //   onSuccess: () => {
  //     queryClient.invalidateQueries(["chat"]);
  //   },
  // });

  return { messageQuery, sendMessageMutation};
};
