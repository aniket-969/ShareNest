import { useAuth } from "@/hooks/useAuth";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Pencil } from "lucide-react";
import { Button } from "@/components/ui/button";

const TopbarProfileAvatar = ({ onEdit,data }) => {
 

  return (
    <div className="relative ">
      <Avatar className="w-8 h-8">
        <AvatarImage src={data?.avatar} />
        <AvatarFallback>
          <img src="/altAvatar1.jpg" />
        </AvatarFallback>
      </Avatar>
 <Button
  variant="ghost"
  className="w-6 h-6 p-1 absolute -bottom-1 -right-2 text-muted hover:bg-muted hover:text-white"
  onClick={onEdit}
>
  <Pencil className="w-3 h-3" />
</Button>
      
    </div>
  );
};

export default TopbarProfileAvatar;
