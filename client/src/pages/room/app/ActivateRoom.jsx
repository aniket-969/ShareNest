import { useRoomActivation } from "@/hooks/useRoom";
import {useEffect} from "react";
import { useParams,useNavigate } from 'react-router-dom';
import { Loader2 } from "lucide-react";
import { Card } from "@/components/ui/card";

const ActivateRoom = () => {
  const { roomId } = useParams();
  const navigate = useNavigate();

  const { data } = useRoomActivation(roomId);

  useEffect(() => {
    if (!data) return;
console.log("checking status",data)
    if (data.status === "active") {
      navigate(`/room/${roomId}`);
    }

    if (data.status === "expired" || data.status === "failed") {
      navigate("/rooms");
    }
  }, [data]);

  return (
    <div className="flex items-center justify-center min-h-[100vh] px-4">
      <Card className="w-full max-w-md p-8 text-center flex flex-col items-center gap-4 border-none">

        <Loader2 className="h-10 w-10 animate-spin text-primary" />

        <h2 className="text-xl font-semibold">
          Setting up your room
        </h2>

        <p className="text-sm text-muted-foreground">
          We’re confirming your payment and activating your room.  
          This usually takes just a few seconds.
        </p>

        <p className="text-xs text-muted-foreground">
          You can safely stay on this page while we finish the setup.
        </p>

      </Card>
    </div>
  );
};

export default ActivateRoom;
