import { CreateRoomForm } from "@/components/form/room/CreateRoomForm";
import { JoinRoomForm } from "@/components/form/room/JoinRoomForm";
import { useEffect, useRef, useState } from "react";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import PricingSection from "@/components/Room/pricingSection";
import { useRoomMutation } from "@/hooks/useRoom";

const CreateRoom = () => {
  
  const [isCreateRoom, setIsCreateRoom] = useState(true);
  const [step, setStep] = useState("form");
  const pricingRef = useRef(null);
  const [roomDraft, setRoomDraft] = useState(null);

  const { roomPricingQuery } = useRoomMutation();

  useEffect(() => {
    if (
      step === "pricing" &&
      !roomPricingQuery.isLoading &&
      pricingRef.current
    ) {
      pricingRef.current.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  }, [step, roomPricingQuery.isLoading]);

  const handleDraftSubmit = async (values) => {
    setRoomDraft(values);
    setStep("pricing");
    roomPricingQuery.refetch();
  };
  const isLocked = step === "pricing";

  return (
    <div className="flex flex-col gap-5 mt-12 mb-32">
      <div className="flex items-center justify-center flex-col gap-4  ">
        <h1 className="text-2xl font-bold">
          {isCreateRoom ? "Create Room" : "Join Room"}
        </h1>

        <div className="flex items-center gap-4">
          <Label htmlFor="room-toggle" className="text-sm">
            Join Room
          </Label>
          <Switch
            id="room-toggle"
            disabled={step != "form"}
            checked={isCreateRoom}
            onCheckedChange={setIsCreateRoom}
          />
          <Label htmlFor="room-toggle" className="text-sm">
            Create Room
          </Label>
        </div>

        <div className="w-full max-w-sm mt-4">
          {isCreateRoom ? (
            <CreateRoomForm onSubmit={handleDraftSubmit} disabled={isLocked} />
          ) : (
            <JoinRoomForm />
          )}
        </div>
      </div>
      {step === "pricing" && (
        <PricingSection
          ref={pricingRef}
          pricing={roomPricingQuery.data}
          isLoading={roomPricingQuery.isLoading}
          onBack={() => setStep("form")}
        />
      )}
    </div>
  );
};

export default CreateRoom;
