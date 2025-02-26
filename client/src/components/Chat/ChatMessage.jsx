import { Avatar, AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";

const ChatMessage = ({ message, isCurrentUser }) => {
  return (
    <>
      {/* Avatar */}
      {isCurrentUser ? (
        <p className="flex justify-end">{message.content}</p>
      ) : (
        <div className="flex justify-start gap-3">
          <div className="w-[2rem]">
            <Avatar>
              <AvatarImage src={message.sender.avatar} />
              <AvatarFallback>CN</AvatarFallback>
            </Avatar>
          </div>

          {/* full name */}
          <div className="">
            <p className="text-sm text-foreground ">
              {message.sender.fullName}
            </p>

            {/* content */}
            <p>{message.content}</p>
          </div>
        </div>
      )}
    </>
  );
};

export default ChatMessage;
