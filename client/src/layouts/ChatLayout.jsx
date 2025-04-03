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

  const handleSendMessage = useCallback(
    (content) => {
      const newMessage = {
        _id: Date.now().toString(), // Temporary ID
        content,
        sender: { _id: currentUser, username: "You" },
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

  return (
    <>
      <div className="flex flex-col w-full h-full">
        <ScrollArea className="flex flex-col gap-4 px-4 py-2 h-[450px] overflow-y-auto">
          {isFetchingNextPage && (
            <div className="py-2 text-center text-sm text-gray-500">
              Loading messages...
            </div>
          )}

          <div className="flex flex-col space-y-2">
            {messages.map((msg, index) => {
              const prevMsg = index > 0 ? messages[index - 1] : null;
              const showAvatar =
                !prevMsg || prevMsg.sender._id !== msg.sender._id;

              return (
                <ChatMessage
                  key={msg._id}
                  message={msg}
                  isCurrentUser={msg.sender._id === currentUser}
                  showAvatar={showAvatar}
                />
              );
            })}
          </div>
        </ScrollArea>

        {/* Chat Input */}
        <ChatInput onSendMessage={handleSendMessage} />
      </div>
    </>
  );
};

export default ChatLayout;
