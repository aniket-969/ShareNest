import ChatMessage from "@/components/Chat/ChatMessage";
import ChatInput from "@/components/Chat/ChatInput";
import { getSocket } from "@/socket";
import { useEffect, useState, useRef, useCallback } from "react";
import { ScrollArea } from "@/components/ui/scroll-area"; // Only ScrollArea is needed

const ChatLayout = ({ messages, currentUser }) => {
  const [chatMessages, setChatMessages] = useState(messages);
  const viewportRef = useRef(null);
  const socket = getSocket();

  /** Scroll to bottom function */
  const scrollToBottom = useCallback(() => {
    if (viewportRef.current) {
      viewportRef.current.scrollTo({
        top: viewportRef.current.scrollHeight,
        behavior: "smooth",
      });
    }
  }, []);

  /** Auto-scroll on first load */
  useEffect(() => {
    scrollToBottom();
  }, []); // Runs only once on mount

  /** Auto-scroll when new messages arrive */
  useEffect(() => {
    scrollToBottom();
  }, [chatMessages]);

  /** Handle sending messages */
  const handleSendMessage = (content) => {
    const newMessage = {
      _id: Date.now().toString(),
      content,
      sender: { _id: currentUser, username: "You" },
      createdAt: new Date().toISOString(),
    };
    setChatMessages((prev) => [...prev, newMessage]);
  };

  /** Handle new incoming messages via socket */
  useEffect(() => {
    const handleNewMessage = (newMessage) => {
      setChatMessages((prev) => [...prev, newMessage]);
    };

    socket.on("messageReceived", handleNewMessage);
    return () => socket.off("messageReceived", handleNewMessage);
  }, [socket]);

  return (
    <div className="flex flex-col w-full h-full">
      {/* ✅ Auto-scroll works because viewportRef is attached to ScrollArea */}
      <ScrollArea ref={viewportRef} className="flex flex-col px-4 py-2 h-[450px] overflow-y-auto">
        {chatMessages.map((msg, index) => {
          const prevMsg = index > 0 ? chatMessages[index - 1] : null;
          const showAvatar = !prevMsg || prevMsg.sender._id !== msg.sender._id;

          return (
            <ChatMessage key={msg._id} message={msg} isCurrentUser={msg.sender._id === currentUser} showAvatar={showAvatar} />
          );
        })}
      </ScrollArea>

      {/* Chat Input */}
      <ChatInput onSendMessage={handleSendMessage} />
    </div>
  );
};

export default ChatLayout;
