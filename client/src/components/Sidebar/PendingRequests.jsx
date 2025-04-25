import { UserPlus, Zap, UserX } from "lucide-react";
import { ScrollArea } from "../ui/scroll-area";
import { useRoom } from "@/hooks/useRoom";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";

const PendingRequests = ({ pendingRequests, showRequests, toggleRequests }) => {
  const { roomId } = useParams();
  const { adminResponseMutation } = useRoom(roomId);

  const handleAccept = async (id) => {
    try {
      console.log(id);
      const response = await adminResponseMutation.mutateAsync({
        data: { action: "approved", requestId: id },
      });
      console.log(response);
    } catch (error) {
      console.log(error);
      toast.error("Failed to approve request");
    }
  };
  const handleReject = (id) => {
    console.log(id);
  };
  return (
    <div className="p-4 border-b">
      <div
        className="flex items-center text-sm cursor-pointer space-x-2"
        onClick={toggleRequests}
      >
        <Zap className="w-5 h-5 text-yellow-300" />
        <span className="flex-1  font-medium ">Join Requests</span>
        <span className="text-xs bg-secondary text-black font-semibold px-[0.6rem] py-1 rounded-full ">
          {pendingRequests?.length || 0}
        </span>
      </div>
      {showRequests && (
        <div className="mt-3">
          <ScrollArea className="h-[104px]">
            <div className="space-y-2 pr-3">
              {pendingRequests?.map((request) => (
                <div
                  key={request._id}
                  className="flex items-center p-2 bg-secondary/20 rounded-lg"
                >
                  <img
                    src={request.userId.avatar}
                    alt={request.userId.fullName}
                    className="w-8 h-8 rounded-full mr-3 border"
                  />
                  <span className="text-sm font-medium">
                    {request.userId.fullName}
                  </span>
                  <div className="ml-auto flex space-x-2">
                    <UserPlus
                      className="cursor-pointer hover:scale-110 transition-transform text-green-500"
                      onClick={() => handleAccept(request._id)}
                    />
                    <UserX
                      className="cursor-pointer hover:scale-110 transition-transform text-red-500"
                      onClick={() => handleReject(request._id)}
                    />
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
        </div>
      )}
    </div>
  );
};

export default PendingRequests;
