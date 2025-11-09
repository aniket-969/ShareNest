import { useEffect, useState, useRef, useCallback } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import ChatMessage from "@/components/Chat/ChatMessage";
import ChatInput from "@/components/Chat/ChatInput";
import { getSocket } from "@/socket";
import { useQueryClient } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import { getDateLabel } from "@/utils/helper";
import { useDebouncedCallback } from "@/hooks/use-debounce";
import { useChat } from "@/hooks/useChat";

const ChatLayout = ({ Imessages, currentUser }) => {

  const viewportRef = useRef(null);
  const socket = getSocket();
  const [prevMessagesLength, setPrevMessagesLength] = useState(0);
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  const queryClient = useQueryClient();
  const { roomId } = useParams();
  const [messages,setMessages] = useState(Imessages)

  // console.log(messages);

  const { messageQuery } = useChat();

  useEffect(() => {
    if (!roomId) return;

    const handleNewMessage = (newMessage) => {
      console.log(newMessage);
      setMessages(prev=>[...prev,newMessage])
      queryClient.setQueryData(["chat", roomId], (oldData) => {
        console.log("old data", oldData);
        if (!oldData) return;

        const updatedPages = [...oldData.pages];
        const lastPageIndex = updatedPages.length - 1;

        updatedPages[lastPageIndex] = {
          ...updatedPages[lastPageIndex],
          messages: [newMessage, ...updatedPages[lastPageIndex].messages], // 👈 prepend
        };

        return { ...oldData, pages: updatedPages };
      });
      
    };
    console.log("About to receive message");
    socket.on("messageReceived", handleNewMessage);
        
    return () => {
      socket.off("messageReceived", handleNewMessage);
    };
  }, [roomId, queryClient, socket]);

  const scrollToBottom = useCallback(() => {
    if (viewportRef.current) {
      viewportRef.current.scrollTo({
        top: viewportRef.current.scrollHeight,
        behavior: "auto",
      });
    }
  }, []);

  useEffect(() => {
    if (isInitialLoad && messages.length > 0) {
      scrollToBottom();
      setIsInitialLoad(false);
      setPrevMessagesLength(messages.length);
      return;
    }

    if (messages.length > prevMessagesLength) {
      // If new messages were added at the end (real-time message)
      if (messages.length - prevMessagesLength <= 2) {
        // Assuming at most 1-2 new messages at a time
        scrollToBottom();
      }
      setPrevMessagesLength(messages.length);
    }
  }, [messages, scrollToBottom, isInitialLoad, prevMessagesLength]);

  const handleScroll = async (event) => {
    const { scrollTop, scrollHeight } = event.target;

    if (scrollTop === 0 && hasNextPage && !isFetchingNextPage) {
      const firstVisibleMessage =
        viewportRef.current.querySelector("[data-message-id]");
      const firstVisibleMessageId =
        firstVisibleMessage?.getAttribute("data-message-id");

      const prevScrollHeight = scrollHeight;

      await fetchNextPage();

      requestAnimationFrame(() => {
        if (viewportRef.current) {
          const newScrollHeight = viewportRef.current.scrollHeight;

          const heightDifference = newScrollHeight - prevScrollHeight;

          if (firstVisibleMessageId) {
            const sameMessageElement = viewportRef.current.querySelector(
              `[data-message-id="${firstVisibleMessageId}"]`
            );

            if (sameMessageElement) {
              sameMessageElement.scrollIntoView({
                block: "start",
                behavior: "auto",
              });
            } else {
              viewportRef.current.scrollTop = heightDifference;
            }
          } else {
            viewportRef.current.scrollTop = heightDifference;
          }

          setPrevMessagesLength(messages.length);
        }
      });
    }
  };

  const debouncedHandleScroll = useDebouncedCallback(handleScroll, 200);

  return (
    <div className="flex flex-col w-[25rem] h-full">
      <ScrollArea
        ref={viewportRef}
        className="flex flex-col px-4 py-2 h-[450px] overflow-y-auto "
        onScroll={debouncedHandleScroll}
      >
        {messages.length > 0 ? (
          messages.map((msg, index) => {
            const prevMsg = index > 0 ? messages[index - 1] : null;
            const showAvatar =
              !prevMsg || prevMsg.sender._id !== msg.sender._id;

            const currentDateLabel = getDateLabel(msg.createdAt);
            const prevDateLabel = prevMsg
              ? getDateLabel(prevMsg.createdAt)
              : null;

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
          <p className="text-center ">No messages to show</p>
        )}
      </ScrollArea>

      {/* Chat Input */}
      <ChatInput setMessages={setMessages}/>
    </div>
  );
};

export default ChatLayout;
