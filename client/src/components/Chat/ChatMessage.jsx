import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const ChatMessage = ({ message, isCurrentUser, showAvatar }) => {
  return isCurrentUser ? (
    <div className="flex flex-col items-end ">
      {showAvatar && <p className="text-sm text-muted-foreground mb-1">You</p>}
      <div className=" bg-primary text-primary-foreground rounded-xl px-3 py-1 max-w-[75%] sm:max-w-[65%] ">
        <p className="break-words leading-normal">{message.content}</p>
      </div>
    </div>
  ) : (
    <div className="flex flex-col">
      {showAvatar && (
        <div className="flex items-center gap-2 mb-1 ">
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
      <div className="max-w-[75%] sm:max-w-[65%] bg-secondary text-secondary-foreground rounded-xl pl-3 py-1 shadow-sm">
        <p className="break-words">{message.content}</p>
      </div>
    </div>
  );
};

export default ChatMessage;
