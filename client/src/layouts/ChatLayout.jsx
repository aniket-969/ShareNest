import { useEffect, useRef, useCallback } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import ChatMessage from "@/components/Chat/ChatMessage";
import ChatInput from "@/components/Chat/ChatInput";
import { getSocket } from "@/socket";
import { useQueryClient } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import { getDateLabel } from "@/utils/helper";
import { useDebouncedCallback } from "@/hooks/use-debounce";
import { useChat } from "@/hooks/useChat";
import { dedupeMessages } from "@/utils/helper.js";

const ChatLayout = ({ Imessages = [], initialMeta = null, currentUser }) => {
  const viewportRef = useRef(null);
  const socket = getSocket();
  const queryClient = useQueryClient();
  const { roomId } = useParams();
  const { messageQuery } = useChat();

 
  useEffect(() => {
    if (!roomId) return;

    const key = ["chat", roomId];
    const existing = queryClient.getQueryData(key);

    if (!existing && Array.isArray(Imessages)) {
      const seeded = {
       
        pages: [
          {
            messages: Imessages,
            meta:
              initialMeta ??
              {
                hasMore: false,
                nextBeforeId: null,
                limit: Imessages.length,
                returnedCount: Imessages.length,
              },
          },
        ],
        pageParams: [initialMeta?.nextBeforeId ?? null],
      };
      queryClient.setQueryData(key, seeded);
    }
  }, [roomId, Imessages, initialMeta, queryClient]);

  const {
    data: messageData,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading: isMessagesLoading,
    isError: isMessagesError,
  } = messageQuery(roomId);

  const pages = messageData?.pages ?? [];
  const messages = pages.slice().reverse().flatMap((p) => p.messages ?? []);

  useEffect(() => {
    if (!roomId) return;
    const key = ["chat", roomId];

    const handleNewMessage = (newMessage) => {
      queryClient.setQueryData(key, (old) => {
      
        if (!old || !old.pages || old.pages.length === 0) {
          return {
            pages: [
              {
                messages: [newMessage],
                meta: {
                  hasMore: false,
                  nextBeforeId: null,
                  limit: 50,
                  returnedCount: 1,
                },
              },
            ],
            pageParams: [null],
          };
        }

        // Append to FIRST page (index 0) because that stores the latest messages
        const newPages = old.pages.slice();
        newPages[0] = {
          ...newPages[0],
          messages: dedupeMessages([...(newPages[0].messages ?? []), newMessage]),
        };

        return { ...old, pages: newPages };
      });
    };

    socket.on("messageReceived", handleNewMessage);
    return () => socket.off("messageReceived", handleNewMessage);
  }, [roomId, queryClient, socket]);

  const scrollToBottom = useCallback(() => {
    if (!viewportRef.current) return;
    viewportRef.current.scrollTo({
      top: viewportRef.current.scrollHeight,
      behavior: "auto",
    });
  }, []);

  // initial auto-scroll when messages first appear
  useEffect(() => {
    if (!messageData) return;
    const flat = (messageData.pages ?? []).flatMap((p) => p.messages ?? []);
    if (flat.length > 0) {
      scrollToBottom();
    }
  }, [messageData, scrollToBottom]);

  const handleScroll = async (event) => {
    const { scrollTop, scrollHeight } = event.target;
    if (scrollTop !== 0) return;
    if (!hasNextPage || isFetchingNextPage) return;

    const firstVisible = viewportRef.current.querySelector("[data-message-id]");
    const firstId = firstVisible?.getAttribute("data-message-id");
    const prevScrollHeight = scrollHeight;

    await fetchNextPage();

    requestAnimationFrame(() => {
      if (!viewportRef.current) return;
      if (!firstId) {
        viewportRef.current.scrollTop =
          viewportRef.current.scrollHeight - prevScrollHeight;
        return;
      }
      const sameEl = viewportRef.current.querySelector(
        `[data-message-id="${firstId}"]`
      );
      if (sameEl) {
        sameEl.scrollIntoView({ block: "start", behavior: "auto" });
      } else {
        viewportRef.current.scrollTop =
          viewportRef.current.scrollHeight - prevScrollHeight;
      }
    });
  };

  const debouncedHandleScroll = useDebouncedCallback(handleScroll, 150);

  if (isMessagesLoading) {
    return <div className="flex-1">Loading messages...</div>;
  }
  if (isMessagesError) {
    return <div className="flex-1">Failed to load messages.</div>;
  }

  return (
    <div className="flex flex-col w-[25rem] h-full">
      <ScrollArea
        ref={viewportRef}
        className="flex flex-col px-4 py-2 h-[450px] overflow-y-auto"
        onScroll={debouncedHandleScroll}
      >
        {messages.length > 0 ? (
          messages.map((msg, index) => {
            const prevMsg = index > 0 ? messages[index - 1] : null;
            const showAvatar =
              !prevMsg || (prevMsg.sender && prevMsg.sender._id !== msg.sender._id);

            const currentDateLabel = getDateLabel(msg.createdAt);
            const prevDateLabel = prevMsg ? getDateLabel(prevMsg.createdAt) : null;
            const showDateSeparator = currentDateLabel !== prevDateLabel;

            return (
              <div key={msg._id}>
                {showDateSeparator && (
                  <div className="text-center my-4 text-muted-foreground text-sm font-medium">
                    {currentDateLabel}
                  </div>
                )}
                <ChatMessage
                  message={msg}
                  isCurrentUser={msg.sender._id === currentUser}
                  showAvatar={showAvatar}
                  data-message-id={msg._id}
                />
              </div>
            );
          })
        ) : (
          <p className="text-center">No messages to show</p>
        )}
      </ScrollArea>

      <ChatInput roomId={roomId} />
    </div>
  );
};

export default ChatLayout;
