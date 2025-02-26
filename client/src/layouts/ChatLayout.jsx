import ChatMessage from "@/components/Chat/ChatMessage";
import ChatInput from "@/components/Chat/ChatInput";
import { getSocket } from "@/socket";
import { useEffect, useState, useRef } from "react";
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

  // Function to scroll to bottom
  const scrollToBottom = () => {
    if (scrollAreaRef.current && shouldScrollToBottom.current) {
      const scrollContainer = scrollAreaRef.current.querySelector(
        "[data-radix-scroll-area-viewport]"
      );
      if (scrollContainer) {
        scrollContainer.scrollTop = scrollContainer.scrollHeight;
      }
    }
  };

  // Initial scroll when component mounts
  useEffect(() => {
    scrollToBottom();
    isInitialLoad.current = false;
  }, []);

  // Scroll to bottom only for new messages from user or socket
  useEffect(() => {
    if (!isInitialLoad.current) {
      scrollToBottom();
    }
  }, [chatMessages.length]);

  // Update local state when messages prop changes (from parent)
  useEffect(() => {
    setChatMessages(messages);
  }, [messages]);

  // Send message handler
  const handleSendMessage = (content) => {
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
  };

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
  const handleScroll = async(event) => {
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
    if (scrollContainer.scrollTop === 0 && hasNextPage && !isFetchingNextPage) {
      // Save current scroll height before fetching more messages
      prevScrollHeightRef.current = scrollContainer.scrollHeight-1 ;

      // Fetch the next page - this will add older messages to the beginning
      await fetchNextPage();
    }
  };

  // This effect handles scroll position restoration after loading previous messages
  useEffect(() => {
    if (
      !isFetchingNextPage &&
      prevScrollHeightRef.current > 0 &&
      scrollAreaRef.current
    ) {
      const scrollContainer = scrollAreaRef.current.querySelector(
        "[data-radix-scroll-area-viewport]"
      );

      if (scrollContainer) {
        // Calculate how much the height has changed
        const newScrollHeight = scrollContainer.scrollHeight;
        const scrollHeightDifference =
          newScrollHeight - prevScrollHeightRef.current;

        // Maintain the scroll position by offsetting by the height of new content
        scrollContainer.scrollTop = scrollHeightDifference;

        // Reset saved height
        prevScrollHeightRef.current = 0;
      }
    }
  }, [isFetchingNextPage]);

  return (
    <>
      <ScrollArea
        ref={scrollAreaRef}
        onScroll={handleScroll}
        className="flex flex-col gap-5 p-2 h-[450px] "
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
