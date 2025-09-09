import { ScrollArea } from "@/components/ui/scroll-area";
import { Users } from "lucide-react";
import { Badge } from "../ui/badge";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

const RoomMembers = ({ tenants, showMembers, toggleMembers, admin }) => {
  return (
    <div className="p-4 border-b">
      {/* Header row */}
      <div
        className="flex items-center text-sm cursor-pointer space-x-2"
        onClick={toggleMembers}
      >
        <Users className="w-5 h-5" />
        <span className="flex-1 font-medium">Members</span>
        <span className="text-xs bg-secondary px-2 text-black font-semibold py-1 rounded-full">
          {tenants?.length || 0}
        </span>
      </div>

      {/* Members list */}
      {showMembers && (
        <div className="mt-3">
          <ScrollArea className="h-[104px]">
            <div className="space-y-2 pr-3">
              {tenants.map((member) => (
                <div
                  key={member._id}
                  className="flex items-center p-2 bg-secondary/20 rounded-lg"
                >
                  <Avatar className="w-8 h-8 mr-3 border">
                    <AvatarImage src={member.avatar} alt={member.fullName} />
                    <AvatarFallback>
                      {/* You can use initials or an alt image here */}
                      {(
                        <img
                          src="/altAvatar1.jpg"
                          alt="fallback avatar"
                          
                        />
                      ) || member.fullName?.charAt(0)}
                    </AvatarFallback>
                  </Avatar>

                  <span className="text-sm font-medium flex items-center gap-8">
                    {member.fullName}
                    {member._id === admin._id && (
                      <Badge className="text-[0.65rem] bg-secondary/20 px-1.5 rounded-sm hover:bg-secondary/20">
                        Admin
                      </Badge>
                    )}
                  </span>
                </div>
              ))}
            </div>
          </ScrollArea>
        </div>
      )}
    </div>
  );
};

export default RoomMembers;
