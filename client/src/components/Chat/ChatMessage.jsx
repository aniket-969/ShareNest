import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const ChatMessage = ({ message, isCurrentUser, showAvatar }) => {
  // Determine if message is temporary (still sending)
  const isTemporary = message.isTemporary;

  if (isCurrentUser) {
    // Current user's messages - right aligned
    return (
      <div className="flex flex-col items-end mb-2">
        {showAvatar && (
          <p className="text-sm text-muted-foreground mb-1">You</p>
        )}
        <div className="max-w-[80%]">
          <div
            className={`rounded-lg py-2 px-4 bg-primary text-primary-foreground ${isTemporary ? "opacity-70" : ""}`}
          >
            <p className="break-words">{message.content}</p>
          </div>
        </div>
      </div>
    );
  } else {
    return (
      <div className="flex flex-col mb-2">
        {showAvatar && (
          <div className="flex items-center gap-2 mb-1">
            <Avatar className="h-8 w-8">
              <AvatarImage src={message.sender.avatar} />
              <AvatarFallback>
                {message.sender.fullName?.charAt(0) ||
                  message.sender.username?.charAt(0) ||
                  "U"}
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
        <div className="flex">
          <div className="max-w-[80%]">
            <div className="rounded-lg py-2 px-4 bg-secondary text-secondary-foreground">
              <p className="break-words">{message.content}</p>
            </div>
          </div>
        </div>
      </div>
    );
  }
};

export default ChatMessage;
