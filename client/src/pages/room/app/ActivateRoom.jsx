import { useRoomActivation } from "@/hooks/useRoom";
import React from "react";
import { useParams } from 'react-router-dom';

const ActivateRoom = () => {
  const { roomId } = useParams();
  const navigate = useNavigate();

  const { data } = useRoomActivation(roomId);

  useEffect(() => {
    if (!data) return;

    if (data.status === "active") {
      navigate(`/room/${roomId}`);
    }

    if (data.status === "expired" || data.status === "failed") {
      navigate("/rooms");
    }
  }, [data]);
  return <div>Room activating...</div>;
};

export default ActivateRoom;
