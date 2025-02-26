import ChatMessage from "@/components/Chat/ChatMessage";
import ChatInput from "@/components/Chat/ChatInput";
import { getSocket } from "@/socket";
import { useEffect, useState,useRef } from "react";
import { ScrollArea } from "@radix-ui/react-scroll-area";

const ChatLayout = ({
  messages,
  currentUser,
  fetchNextPage,
  hasNextPage,
  isFetchingNextPage,
}) => {
  const [chatMessages, setChatMessages] = useState(messages);
  const socket = getSocket();
  const chatContainerRef = useRef(null);

  // Update messages when new pages are fetched
  useEffect(() => {
    setChatMessages(messages);
  }, [messages]);

  // Listen for new incoming messages via socket
  useEffect(() => {
    const handleNewMessage = (newMessage) => {
      setChatMessages((prevMessages) => [...prevMessages, newMessage]);
    };
    socket.on("messageReceived", handleNewMessage);
    return () => socket.off("messageReceived", handleNewMessage);
  }, [socket]);

  // Handle infinite scroll when scrolled to top
  const handleScroll = async () => {
    if (
      chatContainerRef.current.scrollTop === 0 &&
      hasNextPage &&
      !isFetchingNextPage
    ) {
      const prevScrollHeight = chatContainerRef.current.scrollHeight;
      await fetchNextPage();
      // Adjust scroll position after loading more messages
      chatContainerRef.current.scrollTop =
        chatContainerRef.current.scrollHeight - prevScrollHeight;
    }
  };

  return (
    <ScrollArea>
      <div
        ref={chatContainerRef}
        onScroll={handleScroll}
        className="flex flex-col gap-5 p-2 h-[450px] overflow-y-auto"
      >
        {chatMessages.map((msg) => (
          <ChatMessage
            key={msg._id}
            message={msg}
            isCurrentUser={msg.sender._id === currentUser}
          />
        ))}
        {isFetchingNextPage && <div>Loading more messages...</div>}
      </div>
      <ChatInput
        onSendMessage={(content) =>
          setChatMessages((prev) => [...prev, content])
        }
      />
    </ScrollArea>
  );
};

export default ChatLayout;
