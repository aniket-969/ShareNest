import { useState } from "react";
import { Send } from "lucide-react"; // Importing Send icon
import { Textarea } from "@/components/ui/textarea"; // ShadCN Textarea
import { Button } from "@/components/ui/button";
import { useChat } from "@/hooks/useChat";
import { useParams } from "react-router-dom";

const ChatInput = ({ onSendMessage }) => {
  const [content, setContent] = useState("");
  const { sendMessageMutation } = useChat();
  const { roomId } = useParams();

  const handleSendMessage = async () => {
    if (!content.trim()) return; // Prevent empty messages
    onSendMessage(content);
    await sendMessageMutation.mutateAsync({ data: { content }, roomId });
    setContent("");
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault(); // Prevent new line
      handleSendMessage();
    }
  };

  return (
    <div className="flex items-center p-2 border-t">
      <Textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Type a message..."
        className="flex-1 resize-none overflow-hidden rounded-md px-4 py-2 border focus:outline-none focus:ring-2 "
        rows={1} // Keeps it single-line initially
      />
      {content.trim() && (
        <Button
          onClick={handleSendMessage}
          className="ml-2 p-2 rounded-full bg-primary text-white hover:bg-primary-dark"
        >
          <Send className="w-5 h-5" />
        </Button>
      )}
    </div>
  );
};

export default ChatInput;
