import { CreateRoomForm } from "@/components/form/CreateRoomForm";
import { JoinRoomForm } from "@/components/form/JoinRoomForm";
import { useState } from "react";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

const CreateRoom = () => {

    const [isCreateRoom,setIsCreateRoom] = useState(true)

  return (
    <div className="flex items-center justify-center flex-col gap-4 max-h-screen mt-20 ">
    <h1 className="text-2xl font-bold">
      {isCreateRoom ? "Create Room" : "Join Room"}
    </h1>

    <div className="flex items-center gap-4">
      <Label htmlFor="room-toggle" className="text-sm">
        Join Room
      </Label>
      <Switch
        id="room-toggle"
        checked={isCreateRoom}
        onCheckedChange={setIsCreateRoom}
      />
      <Label htmlFor="room-toggle" className="text-sm">
        Create Room
      </Label>
    </div>

    <div className="w-full max-w-sm mt-4">
      {isCreateRoom ? <CreateRoomForm /> : <JoinRoomForm />}
    </div>
  </div>
  );
};

export default CreateRoom;
