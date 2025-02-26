import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { useAuth } from "@/hooks/useAuth";
import { useChat } from "@/hooks/useChat";
import ChatLayout from "@/layouts/ChatLayout";
import { useParams } from "react-router-dom";
const Chat = () => {
  const { roomId } = useParams();
  const { messageQuery } = useChat();
  const { sessionQuery } = useAuth();

  const {
    data: messageData,
    isLoading: isMessageLoading,
    isError: isMessageError,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = messageQuery(roomId);

  const {
    data: userData,
    isLoading: isUserLoading,
    isError: isUserError,
  } = sessionQuery;

  if (isMessageLoading || isUserLoading) return <Spinner />;
  if (isMessageError || isUserError)
    return <>Something went wrong. Please refresh.</>;
  // Flatten the messages array from all pages
 
  const allMessages = messageData.pages.flatMap((page) => page.messages).reverse();
  console.log(allMessages)
  return (
    <div className="flex flex-col items-center ">
      <ChatLayout
        messages={allMessages}
        currentUser={userData._id}
        fetchNextPage={fetchNextPage}
        hasNextPage={hasNextPage}
        isFetchingNextPage={isFetchingNextPage}
      />
    </div>
  );
};

export default Chat;
