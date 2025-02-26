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

  // Initial scroll and when messages change
  useEffect(() => {
    scrollToBottom();
  }, [chatMessages]);

  useEffect(() => {
    scrollToBottom();
  }, []);

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
  const handleScroll = (event) => {
    // Get the scroll container
    const scrollContainer = scrollAreaRef.current?.querySelector(
      "[data-radix-scroll-area-viewport]"
    );
console.log("Scrolling", scrollContainer);
    if (!scrollContainer) return;

    

    // Detect if user has scrolled up - disable auto-scroll if they're not at bottom
    const isAtBottom =
      scrollContainer.scrollHeight - scrollContainer.scrollTop <=
      scrollContainer.clientHeight + 10;

    shouldScrollToBottom.current = isAtBottom;

    // Load more messages when scrolled to top
    if (scrollContainer.scrollTop === 0 && hasNextPage && !isFetchingNextPage) {
      const prevScrollHeight = scrollContainer.scrollHeight;

      fetchNextPage().then(() => {
        // After loading, adjust scroll position
        setTimeout(() => {
          if (scrollContainer) {
            scrollContainer.scrollTop =
              scrollContainer.scrollHeight - prevScrollHeight;
          }
        }, 100);
      });
    }
  };

  return (
    <>
      <ScrollArea
        ref={scrollAreaRef}
        onScroll={handleScroll}
        className="flex flex-col gap-5 p-2 h-[450px] "
      >
        {chatMessages.map((msg) => (
          <ChatMessage
            key={msg._id}
            message={msg}
            isCurrentUser={msg.sender._id === currentUser}
          />
        ))}
        {isFetchingNextPage && <div>Loading more messages...</div>}
      </ScrollArea>
      <ChatInput
        onSendMessage={handleSendMessage}
        setMessages={setChatMessages}
      />
    </>
  );
};

export default ChatLayout;
