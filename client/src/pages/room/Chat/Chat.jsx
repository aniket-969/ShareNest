import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { useAuth } from "@/hooks/useAuth";
import { useChat } from "@/hooks/useChat";
import ChatLayout from "@/layouts/ChatLayout";
import { useParams } from "react-router-dom";

const Chat = () => {
  const { roomId } = useParams();
  const { messageQuery, sendMessageMutation } = useChat();
  const { sessionQuery } = useAuth();
  const {
    data: messageData,
    isLoading: isMessageLoading,
    isError: isMessageError,
  } = messageQuery(roomId);
  const {
    data: userData,
    isLoading: isUserLoading,
    isError: isUserError,
  } = sessionQuery;

  if (isMessageLoading || isUserLoading) {
    return <Spinner />;
  }
  if (isMessageError || isUserError) {
    return <>Something went wrong . Please refresh</>;
  }
  console.log(userData._id);
  return (
    <div className="flex flex-col w-full items-center  ">
      <ChatLayout initialMessages={messageData} currentUser={userData._id} />
    </div>
  );
};

export default Chat;
