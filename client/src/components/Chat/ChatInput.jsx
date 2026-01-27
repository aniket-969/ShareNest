import { useState } from "react";
import { SendHorizontal } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useChat } from "@/hooks/useChat";
import { useParams } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";
import { dedupeMessages } from "@/utils/helper.js";

const ChatInput = ({ roomId: propRoomId }) => {
  const [content, setContent] = useState("");
  const { sendMessageMutation } = useChat();
  const routeParams = useParams();
  const roomId = propRoomId ?? routeParams.roomId;
  const queryClient = useQueryClient();

  const handleSendMessage = async () => {
    if (!content.trim()) return;
    try {
      const sentMessage = await sendMessageMutation.mutateAsync({
        roomId,
        data: { content },
      });

      const key = ["chat", roomId];
      queryClient.setQueryData(key, (old) => {
        if (!old || !old.pages || old.pages.length === 0) {
          return {
            pages: [{ messages: [sentMessage], meta: { hasMore: false, nextBeforeId: null, limit: 50, returnedCount: 1 } }],
            pageParams: [null],
          };
        }
        const pages = old.pages.slice();
        const lastIdx = pages.length - 1;
        const last = { ...pages[lastIdx] };
        last.messages = dedupeMessages([...(last.messages ?? []), sentMessage]);
        pages[lastIdx] = last;
        return { ...old, pages };
      });

      setContent("");
    } catch (err) {
      console.error("Failed to send message", err);
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
