import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { toast } from "react-toastify";
import FormWrapper from "@/components/ui/formWrapper";
import ParticipantSelector from "@/components/ParticipantsSelector"; 
import { useRoom } from "@/hooks/useRoom";

const AdminTransfer = ({ roomId, participants }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState(null);
  const { adminTransferMutation } = useRoom(roomId);

  const openModal = () => {
    setSelectedUserId(null);
    setIsOpen(true);
  };
  const closeModal = () => {
    setIsOpen(false);
  };

  const handleSave = () => {
    if (!selectedUserId) {
      toast.error("Please select a member to transfer admin to.");
      return;
    }
    adminTransferMutation.mutate(
      { newAdminId: selectedUserId },
      {
        onSuccess: () => {
          closeModal();
        },
      }
    );
  };

  return (
    <>
      <Button
        variant="outline"
        onClick={openModal}
        className="flex items-center gap-2"
      >
        Change Admin
      </Button>

      {isOpen && (
        <FormWrapper onClose={closeModal}>
          <div className="max-w-md mx-auto p-6 bg-[#1c1f26] rounded-2xl text-white shadow-md space-y-4">
            <h3 className="text-lg font-semibold">Transfer Admin Rights</h3>
            <p className="text-sm text-muted-foreground">
              Select one member below who will become the new admin.
            </p>

            <ParticipantSelector
              participants={participants}
              single={true}
              onChange={(id) => setSelectedUserId(id)}
            />

            <div className="flex justify-end gap-2">
              <Button
                variant="outline"
                onClick={closeModal}
                disabled={adminTransferMutation.isLoading}
              >
                Cancel
              </Button>
              <Button
                onClick={handleSave}
                disabled={
                  !selectedUserId || adminTransferMutation.isLoading
                }
              >
                {adminTransferMutation.isLoading ? (
                  <Spinner size="sm" />
                ) : (
                  "Save"
                )}
              </Button>
            </div>
          </div>
        </FormWrapper>
      )}
    </>
  );
};

export default AdminTransfer;
