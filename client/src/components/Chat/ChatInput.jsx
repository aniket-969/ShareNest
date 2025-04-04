import { useState, useRef, useEffect } from "react";
import { SendHorizontal, Paperclip, Smile } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useChat } from "@/hooks/useChat";
import { useParams } from "react-router-dom";

const ChatInput = ({ onSendMessage }) => {
  const [content, setContent] = useState("");
  const { sendMessageMutation } = useChat();
  const { roomId } = useParams();
  const textareaRef = useRef(null);

  // Auto-resize textarea based on content
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      const scrollHeight = textareaRef.current.scrollHeight;
      textareaRef.current.style.height = scrollHeight > 120 ? "120px" : `${scrollHeight}px`;
    }
  }, [content]);

  const handleSendMessage = async () => {
    if (!content.trim()) return;
    
    try {
      // Call the onSendMessage prop to notify parent component
      if (onSendMessage) {
        onSendMessage(content);
      }
      
      // Send message to server
      await sendMessageMutation.mutateAsync({ 
        data: { content }, 
        roomId 
      });
      
      // Clear input after successful send
      setContent("");
      
      // Reset textarea height
      if (textareaRef.current) {
        textareaRef.current.style.height = "auto";
      }
    } catch (error) {
      console.error("Failed to send message:", error);
      // Could add toast notification here
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="flex items-end p-3 border-t gap-2 bg-background">
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="icon" className="rounded-full text-muted-foreground" type="button">
          <Smile className="h-5 w-5" />
        </Button>
        <Button variant="ghost" size="icon" className="rounded-full text-muted-foreground" type="button">
          <Paperclip className="h-5 w-5" />
        </Button>
      </div>
      
      <Textarea
        ref={textareaRef}
        value={content}
        onChange={(e) => setContent(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Type a message..."
        className="flex-grow overflow-hidden rounded-full px-4 py-2 border resize-none max-h-[120px] focus:outline-none focus:ring-1 focus:ring-primary"
        rows={1}
      />
      
      <Button 
        onClick={handleSendMessage}
        className={`rounded-full p-2 h-10 w-10 ${content.trim() ? 'bg-primary hover:bg-primary/90' : 'bg-muted hover:bg-muted/90'}`}
        disabled={!content.trim()}
      >
        <SendHorizontal className="h-5 w-5" />
      </Button>
    </div>
  );
};

export default ChatInput;