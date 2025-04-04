import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const ChatMessage = ({ message, isCurrentUser, showAvatar, ...props }) => {
  return isCurrentUser ? (
    <div className="flex flex-col items-end mb-3" data-message-id={message._id} {...props}>
      {showAvatar && <p className="text-sm text-muted-foreground mb-1">You</p>}
      <div className="bg-primary text-primary-foreground rounded-xl px-3 py-2 max-w-[75%] sm:max-w-[65%]">
        <p className="break-words leading-normal">{message.content}</p>
        <p className="text-xs opacity-70 text-right mt-1">
          {new Date(message.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </p>
      </div>
    </div>
  ) : (
    <div className="flex flex-col mb-3" data-message-id={message._id} {...props}>
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
      <div className="max-w-[70%] sm:max-w-[60%] bg-secondary text-secondary-foreground rounded-xl px-3 py-2 shadow-sm">
        <p className="break-words">{message.content}</p>
        <p className="text-xs opacity-70 text-right mt-1">
          {new Date(message.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </p>
      </div>
    </div>
  );
};

export default ChatMessage;