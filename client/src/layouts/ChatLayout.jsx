import ChatMessage from "@/components/Chat/ChatMessage";
import ChatInput from "@/components/Chat/ChatInput";
import { getSocket } from "@/socket";
import { useEffect, useState, useRef } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";

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
  console.log(chatMessages);
  const handleSendMessage = (content) => {
    // Optimistically update UI
    const newMessage = {
      _id: Date.now().toString(), // Temporary ID
      content,
      sender: { _id: currentUser, username: "You" }, // Temporary user details
      isTemporary: true, 
    };
    setChatMessages((prev) => [...prev, newMessage]);
  };
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
    console.log("scrolling");
  };

  return (
    <>
      <ScrollArea
        ref={chatContainerRef}
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
      <ChatInput onSendMessage={handleSendMessage} setMessages={setChatMessages} />
    </>
  );
};

export default ChatLayout;
