import { useState } from "react";
import { SendHorizontal } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useChat } from "@/hooks/useChat";
import { useParams } from "react-router-dom";

const ChatInput = ({ onSendMessage }) => {
  const [content, setContent] = useState("");
  const { sendMessageMutation } = useChat();
  const { roomId } = useParams();

  const handleSendMessage = async () => {
    if (!content.trim()) return;
    onSendMessage(content);
    await sendMessageMutation.mutateAsync({ data: { content }, roomId });
    setContent("");
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
        className=" overflow-hidden rounded-md px-4 py-2 border focus:outline-none focus:ring-2 "
        rows={1}
      />
      {content.trim() && (
        <Button onClick={handleSendMessage} >
          <SendHorizontal />
        </Button>
      )}
    </div>
  );
};

export default ChatInput;
