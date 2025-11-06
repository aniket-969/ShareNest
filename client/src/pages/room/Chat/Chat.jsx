import ChatSkeleton from "@/components/skeleton/Chat/chatSkeleton";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { useAuth } from "@/hooks/useAuth";
import { useChat } from "@/hooks/useChat";
import ChatLayout from "@/layouts/ChatLayout";
import { useParams } from "react-router-dom";

const Chat = ({ messages }) => {
  const { roomId } = useParams();
 
  const { sessionQuery } = useAuth();

  const {
    data: userData,
  } = sessionQuery;
console.log(messages)

  return (
    <div className="flex flex-col items-center h-[480px] bs:h-[370px] w-full max-w-[25rem] rounded-lg shadow-md  bg-[#1c1f26 bg-card borde border-[#2a2a2a] pt-4 bs:px-2 ">
     <ChatLayout 
        messages={messages}
        currentUser={userData._id}
      />
    </div>
  );
};

export default Chat;
