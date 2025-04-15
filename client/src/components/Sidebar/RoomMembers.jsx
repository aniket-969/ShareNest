import { ScrollArea } from "@/components/ui/scroll-area";
import { Users } from "lucide-react";

const RoomMembers = ({ tenants, showMembers, toggleMembers }) => {
  return (
    <div className="p-4 border-b">
      <div
        className="flex items-center text-sm cursor-pointer space-x-2"
        onClick={toggleMembers}
      >
        <Users className="w-5 h-5" />
        <span className="flex-1 font-medium ">Members</span>
        <span className="text-xs bg-secondary px-2 text-black font-semibold py-1 rounded-full">
          {tenants?.length || 0}
        </span>
      </div>
      {showMembers && (
        <div className="mt-3">
          <ScrollArea className="h-[104px]">
            <div className="space-y-2 pr-3">
              {tenants.map((member) => (
                <div
                  key={member._id}
                  className="flex items-center p-2 bg-secondary/20 rounded-lg"
                >
                  <img
                    src={member.avatar}
                    alt={member.fullName}
                    className="w-8 h-8 rounded-full mr-3 border"
                  />
                  <span className="text-sm font-medium ">
                    {member.fullName}
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
