import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { toast } from "react-toastify";
import FormWrapper from "@/components/ui/formWrapper";
import ParticipantSelector from "@/components/Tasks/ParticipantsSelector";
import { useRoom } from "@/hooks/useRoom";

const KickUserModal = ({ roomId, participants }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState(null);
  const { kickUserMutation } = useRoom(roomId);
  const openModal = () => {
    setSelectedUserId(null);
    setIsOpen(true);
  };
  const closeModal = () => {
    setIsOpen(false);
  };

  const handleKick = () => {
    if (!selectedUserId) {
      toast.error("Please select a member to kick.");
      return;
    }

    kickUserMutation.mutate(
      { targetUserId: selectedUserId },
      {
        onSuccess: () => {
          closeModal();
        },
      }
    );
  };

  return (
    <>
      <Button onClick={openModal}>Kick User</Button>

      {isOpen && (
        <FormWrapper onClose={closeModal}>
          <div className="max-w-md mx-auto p-6 bg-[#1c1f26] rounded-2xl text-white shadow-md space-y-4">
            <h3 className="text-lg font-semibold">Kick a Member</h3>
            <p className="text-sm text-muted-foreground">
              Select one member below to remove from the room.
            </p>

            <ParticipantSelector
              participants={participants.filter(
                (u) => u._id !== roomId // optionally filter out admin or yourself
              )}
              single={true}
              onChange={(id) => setSelectedUserId(id)}
            />

            <div className="flex justify-end gap-2">
              <Button
                variant="outline"
                onClick={closeModal}
                disabled={kickUserMutation.isLoading}
              >
                Cancel
              </Button>
              <Button
                onClick={handleKick}
                disabled={!selectedUserId || kickUserMutation.isLoading}
              >
                {kickUserMutation.isLoading ? <Spinner size="sm" /> : "Kick"}
              </Button>
            </div>
          </div>
        </FormWrapper>
      )}
    </>
  );
};

export default KickUserModal;
