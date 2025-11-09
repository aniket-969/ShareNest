import { useState } from "react";
import { SendHorizontal } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useChat } from "@/hooks/useChat";
import { useParams } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";
 
const ChatInput = ({setMessages}) => {
  const [content, setContent] = useState("");
  const { sendMessageMutation } = useChat();
  const { roomId } = useParams();
  const queryClient = useQueryClient();

  const handleSendMessage = async () => {
    if (!content.trim()) return;

    try {
      const sentMessage = await sendMessageMutation.mutateAsync({
        roomId,
        data: { content },
      });

      setMessages(prev=>[...prev,sentMessage])
      queryClient.setQueryData(["chat", roomId], (oldData) => {
        if (!oldData) return;

        const updatedPages = [...oldData.pages];
        updatedPages[0] = {
          ...updatedPages[0],
          messages: [sentMessage, ...updatedPages[0].messages],
        };

        return { ...oldData, pages: updatedPages };
      });

      setContent("");
    } catch (error) {
      console.error("Failed to send message", error);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="flex items-center p-2 border-t gap-2">
      <Textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Type a message..."
        className="bg-[#2f2b2b8d] overflow-hidden rounded-2xl px-4 py-2 m-2 outline-none border-none focus:outline-none focus:ring-none focus:border-none"
        rows={1}
      />
      {content.trim() && (
        <Button onClick={handleSendMessage} className="rounded-full">
          <SendHorizontal />
        </Button>
      )}
    </div>
  );
};

export default ChatInput;
