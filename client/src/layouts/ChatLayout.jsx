import ChatMessage from "@/components/Chat/ChatMessage";
import ChatInput from "@/components/Chat/ChatInput";
import { getSocket } from "@/socket";
import { useEffect, useState, useRef, useCallback } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";

// ChatLayout.jsx
const ChatLayout = ({
  messages,
  currentUser,
  fetchNextPage,
  hasNextPage,
  isFetchingNextPage,
}) => {
  const [chatMessages, setChatMessages] = useState(messages);
  const socket = getSocket();
  const scrollAreaRef = useRef(null);
  const shouldScrollToBottom = useRef(true);
  const prevScrollHeightRef = useRef(0);
  const isInitialLoad = useRef(true);
  const isLoadingMore = useRef(false);

  // Function to scroll to bottom - memoized with useCallback
  const scrollToBottom = useCallback(() => {
    if (scrollAreaRef.current && shouldScrollToBottom.current) {
      const scrollContainer = scrollAreaRef.current.querySelector(
        "[data-radix-scroll-area-viewport]"
      );
      if (scrollContainer) {
        scrollContainer.scrollTop = scrollContainer.scrollHeight;
      }
    }
  }, []);

  // Initial scroll when component mounts
  useEffect(() => {
    scrollToBottom();
    isInitialLoad.current = false;
  }, [scrollToBottom]);

  // Scroll to bottom only for new messages from user or socket
  useEffect(() => {
    if (!isInitialLoad.current && !isLoadingMore.current) {
      scrollToBottom();
    }
  }, [chatMessages.length, scrollToBottom]);

  // Update local state when messages prop changes (from parent)
  useEffect(() => {
    // Only update if not the initial render to prevent double scrolling
    if (!isInitialLoad.current) {
      setChatMessages(messages);
    }
  }, [messages]);

  // Send message handler
  const handleSendMessage = useCallback(
    (content) => {
      // Ensure we scroll to bottom for new messages
      shouldScrollToBottom.current = true;

      // Optimistically update UI
      const newMessage = {
        _id: Date.now().toString(), // Temporary ID
        content,
        sender: { _id: currentUser, username: "You" },
        isTemporary: true,
      };
      setChatMessages((prev) => [...prev, newMessage]);
    },
    [currentUser]
  );

  // Listen for new incoming messages via socket
  useEffect(() => {
    const handleNewMessage = (newMessage) => {
      shouldScrollToBottom.current = true;
      setChatMessages((prevMessages) => [...prevMessages, newMessage]);
    };

    socket.on("messageReceived", handleNewMessage);
    return () => socket.off("messageReceived", handleNewMessage);
  }, [socket]);

  // Handle infinite scroll when scrolled to top
  const handleScroll = useCallback(
    async (event) => {
      const scrollContainer = scrollAreaRef.current?.querySelector(
        "[data-radix-scroll-area-viewport]"
      );

      if (!scrollContainer) return;

      // If scrolled to the bottom, we should auto-scroll for new messages
      const isAtBottom =
        scrollContainer.scrollHeight -
          scrollContainer.scrollTop -
          scrollContainer.clientHeight <
        20;
      shouldScrollToBottom.current = isAtBottom;

      // If scrolled to the top and we have more pages to load
      if (
        scrollContainer.scrollTop === 0 &&
        hasNextPage &&
        !isFetchingNextPage
      ) {
        try {
          // Set loading state
          isLoadingMore.current = true;

          // Save current scroll height with small offset to account for possible rounding errors
          // The -1 works because it creates a small buffer that prevents jumping
          prevScrollHeightRef.current = scrollContainer.scrollHeight - 1;

          // Fetch the next page - this will add older messages to the beginning
          await fetchNextPage();
        } catch (error) {
          console.error("Error fetching more messages:", error);
        }
      }
    },
    [fetchNextPage, hasNextPage, isFetchingNextPage]
  );

  // This effect handles scroll position restoration after loading previous messages
  useEffect(() => {
    // Only run this effect when we finish fetching new messages
    if (isFetchingNextPage) {
      return;
    }

    // Reset loading state
    isLoadingMore.current = false;

    // If we have a saved scroll height, restore position
    if (prevScrollHeightRef.current > 0 && scrollAreaRef.current) {
      // Use requestAnimationFrame to ensure DOM has updated
      requestAnimationFrame(() => {
        const scrollContainer = scrollAreaRef.current?.querySelector(
          "[data-radix-scroll-area-viewport]"
        );

        if (scrollContainer) {
          // Calculate how much the height has changed
          const newScrollHeight = scrollContainer.scrollHeight;
          const scrollHeightDifference =
            newScrollHeight - prevScrollHeightRef.current;

          // Maintain the scroll position by offsetting by the height of new content
          if (scrollHeightDifference > 0) {
            scrollContainer.scrollTop = scrollHeightDifference;
          }

          // Reset saved height
          prevScrollHeightRef.current = 0;
        }
      });
    }
  }, [isFetchingNextPage]);

  return (
    <>
      <ScrollArea
        ref={scrollAreaRef}
        onScroll={handleScroll}
        className="flex flex-col gap-5 p-2 h-[450px]"
      >
        {isFetchingNextPage && (
          <div className="py-2 text-center text-sm text-gray-500">
            Loading more messages...
          </div>
        )}
        {chatMessages.map((msg) => (
          <ChatMessage
            key={msg._id}
            message={msg}
            isCurrentUser={msg.sender._id === currentUser}
          />
        ))}
      </ScrollArea>
      <ChatInput
        onSendMessage={handleSendMessage}
        setMessages={setChatMessages}
      />
    </>
  );
};

export default ChatLayout;
