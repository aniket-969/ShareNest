import ChatMessage from "@/components/Chat/ChatMessage";
import ChatInput from "@/components/Chat/ChatInput";
import { getSocket } from "@/socket";
import { useEffect, useState } from "react";
import { ScrollArea } from "@radix-ui/react-scroll-area";

const ChatLayout = ({ initialMessages, currentUser }) => {
  const [messages, setMessages] = useState(initialMessages);
  console.log(messages);
  const socket = getSocket();
  const handleSendMessage = (content) => {
    // Optimistically update UI
    const newMessage = {
      _id: Date.now().toString(), // Temporary ID
      content,
      sender: { _id: currentUser, username: "You" }, // Temporary user details
      isTemporary: true, // Mark this as temporary
    };
    setMessages((prev) => [...prev, newMessage]);
  };
  useEffect(() => {
    // Listen for new messages
    const handleNewMessage = (newMessage) => {
      console.log(newMessage);
      setMessages((prevMessages) => [...prevMessages, newMessage]);
    };

    socket.on("messageReceived", handleNewMessage);

    return () => {
      socket.off("messageReceived", handleNewMessage);
    };
  }, [socket]);

  return (
    <ScrollArea>
      <div className="flex flex-col gap-5 p-2 by h-[450px]">
        <div className="px-4 flex flex-col gap-2 b py-2 ">
          {messages.map((msg) => (
            <ChatMessage
              key={msg._id}
              message={msg}
              isCurrentUser={msg.sender._id === currentUser}
            />
          ))}
        </div>
        <ChatInput
          onSendMessage={handleSendMessage}
          setMessages={setMessages}
        />
      </div>
    </ScrollArea>
  );
};

export default ChatLayout;
