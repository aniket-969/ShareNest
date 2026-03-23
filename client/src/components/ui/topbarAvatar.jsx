import { useAuth } from "@/hooks/useAuth";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Pencil } from "lucide-react";
import { Button } from "@/components/ui/button";

const TopbarProfileAvatar = ({ onEdit,data }) => {
 

  return (
    <div className="relative">
      <Avatar className="w-8 h-8">
        <AvatarImage src={data?.avatar} />
        <AvatarFallback>
          <img src="/altAvatar1.jpg" />
        </AvatarFallback>
      </Avatar>
 <Button
        size="icon"
        variant="ghost"
        className="w-4 h-4 absolute -bottom-1 -right-1 text-muted"
        onClick={onEdit}
      >
        <Pencil />
      </Button>
      
    </div>
  );
};

export default TopbarProfileAvatar;
