import { useEffect, useState, useRef, useCallback } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import ChatMessage from "@/components/Chat/ChatMessage";
import ChatInput from "@/components/Chat/ChatInput";
import { getSocket } from "@/socket";
import { useQueryClient } from "@tanstack/react-query";

const ChatLayout = ({
  messages,
  currentUser,
  fetchNextPage,
  hasNextPage,
  isFetchingNextPage,
}) => {
  const viewportRef = useRef(null);
  const socket = getSocket();
  const [prevMessagesLength, setPrevMessagesLength] = useState(0);
  const [isInitialLoad, setIsInitialLoad] = useState(true);
const queryClient = useQueryClient()

// Socket to update messages
useEffect(() => {
  if (!roomId) return;

  const handleNewMessage = (newMessage) => {
    queryClient.setQueryData(["messages", roomId], (oldData) => {
      if (!oldData) return;

      const updatedPages = [...oldData.pages];
      const lastPageIndex = updatedPages.length - 1;

      updatedPages[lastPageIndex] = {
        ...updatedPages[lastPageIndex],
        messages: [...updatedPages[lastPageIndex].messages, newMessage],
      };

      return { ...oldData, pages: updatedPages };
    });
  };

  socket.on("messageReceived", handleNewMessage);

  return () => {
    socket.off("messageReceived", handleNewMessage);
  };
}, [roomId, queryClient, socket]);

  /** Scroll to bottom function */
  const scrollToBottom = useCallback(() => {
    if (viewportRef.current) {
      viewportRef.current.scrollTo({
        top: viewportRef.current.scrollHeight,
        behavior: "auto",
      });
    }
  }, []);

  /** Handle initial load and new messages */
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


  /** Handle infinite scroll (Load older messages) */
  const handleScroll = async (event) => {
    const { scrollTop, scrollHeight } = event.target;

    if (scrollTop === 0 && hasNextPage && !isFetchingNextPage) {
      // Store the current first visible message for reference
      const firstVisibleMessage =
        viewportRef.current.querySelector("[data-message-id]");
      const firstVisibleMessageId =
        firstVisibleMessage?.getAttribute("data-message-id");

      // Save current height to calculate difference later
      const prevScrollHeight = scrollHeight;

      // Fetch next page
      await fetchNextPage();

      // After the DOM updates with new messages
      requestAnimationFrame(() => {
        if (viewportRef.current) {
          // Calculate new content height
          const newScrollHeight = viewportRef.current.scrollHeight;
          // Calculate height difference (height of newly loaded messages)
          const heightDifference = newScrollHeight - prevScrollHeight;

          if (firstVisibleMessageId) {
            // Find the same message element after DOM update
            const sameMessageElement = viewportRef.current.querySelector(
              `[data-message-id="${firstVisibleMessageId}"]`
            );

            if (sameMessageElement) {
              // Scroll to the same message, maintaining user's position
              sameMessageElement.scrollIntoView({
                block: "start",
                behavior: "auto",
              });
            } else {
              // Fallback: set scroll position by calculation
              viewportRef.current.scrollTop = heightDifference;
            }
          } else {
            // Fallback: set scroll position by calculation
            viewportRef.current.scrollTop = heightDifference;
          }

          setPrevMessagesLength(messages.length);
        }
      });
    }
  };

  return (
    <div className="flex flex-col w-full h-full">
      <ScrollArea
        ref={viewportRef}
        className="flex flex-col px-4 py-2 h-[450px] overflow-y-auto"
        onScroll={handleScroll}
      >
        {messages.map((msg, index) => {
          const prevMsg = index > 0 ? messages[index - 1] : null;
          const showAvatar = !prevMsg || prevMsg.sender._id !== msg.sender._id;

          return (
            <ChatMessage
              key={msg._id}
              message={msg}
              isCurrentUser={msg.sender._id === currentUser}
              showAvatar={showAvatar}
              data-message-id={msg._id} // Add this attribute for scroll position reference
            />
          );
        })}
      </ScrollArea>

      {/* Chat Input */}
      <ChatInput />
    </div>
  );
};

export default ChatLayout;
