import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const ChatMessage = ({ message, isCurrentUser, showAvatar, ...props }) => {
  const formattedTime = new Date(message.createdAt).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });

  return isCurrentUser ? (
    <div
      className="flex flex-col items-end mb-3 px-3"
      data-message-id={message._id}
      {...props}
    >
      {showAvatar && <p className="text-sm text-muted-foreground mb-1">You</p>}
      <div className="relative bg-primary text-primary-foreground rounded-2xl rounded-br-md px-4 py-2 max-w-[80%] sm:max-w-[60%]">
        <p className="break-words leading-normal">{message.content}</p>
        <p className="text-xs opacity-70 text-right mt-1">{formattedTime}</p>
      </div>
    </div>
  ) : (
    <div
      className="flex flex-col items-start mb-3 px-3"
      data-message-id={message._id}
      {...props}
    >
      {showAvatar && (
        <div className="flex items-center gap-2 mb-1">
          <Avatar className="h-8 w-8">
            <AvatarImage src={message.sender.avatar} />
            <AvatarFallback>
              {message.sender.fullName?.charAt(0) || "U"}
            </AvatarFallback>
          </Avatar>
          <div>
            <p className="text-sm font-medium">{message.sender.fullName}</p>
            <p className="text-xs text-muted-foreground">
              @{message.sender.username}
            </p>
          </div>
        </div>
      )}
      <div className="relative bg-secondary text-secondary-foreground rounded-2xl rounded-bl-md px-4 py-2 max-w-[80%] sm:max-w-[60%]">
        <p className="break-words">{message.content}</p>
        <p className="text-xs opacity-70 text-right mt-1">{formattedTime}</p>
      </div>
    </div>
  );
};

export default ChatMessage;
