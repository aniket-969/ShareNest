import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const ChatMessage = ({ message, isCurrentUser, showAvatar, ...props }) => {
  const formattedTime = new Date(message.createdAt).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });
  // console.log(message)
  return isCurrentUser ? (
    // User's message box
    <div
      className="flex flex-col items-end mb-3 px-2 "
      data-message-id={message._id}
      {...props}
    >
      {showAvatar && (
        <p className="text-sm text-muted-foreground mb-1 mr-1">You</p>
      )}
      <div className="relative bg-secondary text-secondary-foreground rounded-2xl rounded-br-sm px-4 py-[0.3rem] max-w-[80%] sm:max-w-[70%] ">
        <p className="break-words text-[0.9rem] tracking-wide ">
          {message.content}
        </p>
        <p className="text-[0.6rem]  opacity-70 text-right">{formattedTime}</p>
      </div>
    </div>
  ) : (
    // Other's message box
    <div
      className="flex flex-col mb-2 px-3 "
      data-message-id={message._id}
      {...props}
    >
      <div className="flex gap-2 ">
        {/* avatar */}
        {showAvatar ? (
          <Avatar className="h-7 w-7">
            <AvatarImage src={message.sender?.avatar} />
            <AvatarFallback>
              {message.sender?.fullName?.charAt(0) || "U"}
            </AvatarFallback>
          </Avatar>
        ):(<p className="h-7 w-7"></p>)}

        {/* name and message box */}
        <div className="space-y-1 max-w-[80%] sm:max-w-[70%]">
          {showAvatar && (
            <p className="text-[0.85rem] ">{message.sender?.fullName}</p>
          )}
          <div className="relative  bg-primary text-primary-foreground rounded-2xl rounded-bl-sm px-4 py-[0.3rem] ">
            <p className="break-words text-[0.9rem] tracking-wide ">
              {message?.content}
            </p>
            <p className="text-[0.6rem] opacity-70 text-right ">
              {formattedTime}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatMessage;
