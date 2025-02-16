import React, { useState } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { PlusCircle, XCircle, Pencil } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { useFieldArray } from "react-hook-form";

const ExpenseParticipantSelector = ({
  participants,
  form,
  disabled = false,
}) => {
  const [selectedParticipant, setSelectedParticipant] = useState(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingChargeIndex, setEditingChargeIndex] = useState(null);
  const [selectionOrder, setSelectionOrder] = useState({});
  const [chargeAmount, setChargeAmount] = useState("");
  const [chargeReason, setChargeReason] = useState("");

  const { fields, append, remove, update } = useFieldArray({
    control: form.control,
    name: "participants",
  });

  const getParticipantsList = () => {
    const selectedParticipants = participants.filter((participant) =>
      fields.some((field) => field.userId === participant._id)
    );
    selectedParticipants.sort(
      (a, b) => selectionOrder[a._id] - selectionOrder[b._id]
    );

    const unselectedParticipants = participants.filter(
      (participant) => !fields.some((field) => field.userId === participant._id)
    );

    return [...selectedParticipants, ...unselectedParticipants];
  };

  const handleParticipantSelect = (participant) => {
    const isSelected = fields.some((field) => field.userId === participant._id);

    if (isSelected) {
      const index = fields.findIndex(
        (field) => field.userId === participant._id
      );
      remove(index);
      setSelectionOrder((prev) => {
        const newOrder = { ...prev };
        delete newOrder[participant._id];
        return newOrder;
      });
    } else {
      append({
        userId: participant._id,
        additionalCharges: [],
      });
      setSelectionOrder((prev) => ({
        ...prev,
        [participant._id]: Date.now(),
      }));
    }
  };

  const handleAddCharge = (participantId, e) => {
    e.preventDefault();
    e.stopPropagation();
    setSelectedParticipant(participantId);
    setEditingChargeIndex(null);
    setChargeAmount("");
    setChargeReason("");
    setIsDialogOpen(true);
  };

  const handleEditCharge = (participantId, chargeIndex, charge, e) => {
    e.preventDefault();
    e.stopPropagation();
    setSelectedParticipant(participantId);
    setEditingChargeIndex(chargeIndex);
    setChargeAmount(charge.amount.toString());
    setChargeReason(charge.reason);
    setIsDialogOpen(true);
  };

  const handleChargeConfirm = () => {
    const participantIndex = fields.findIndex(
      (p) => p.userId === selectedParticipant
    );
    if (participantIndex === -1) return;

    const currentParticipant = fields[participantIndex];
    let updatedCharges;

    if (editingChargeIndex !== null) {
      // Edit existing charge
      updatedCharges = [...(currentParticipant.additionalCharges || [])];
      updatedCharges[editingChargeIndex] = {
        amount: Number(chargeAmount),
        reason: chargeReason,
      };
    } else {
      // Add new charge
      updatedCharges = [
        ...(currentParticipant.additionalCharges || []),
        {
          amount: Number(chargeAmount),
          reason: chargeReason,
        },
      ];
    }

    update(participantIndex, {
      ...currentParticipant,
      additionalCharges: updatedCharges,
    });

    setIsDialogOpen(false);
    setEditingChargeIndex(null);
    setChargeAmount("");
    setChargeReason("");
  };

  const removeParticipant = (index, e) => {
    e.preventDefault();
    e.stopPropagation();
    const participant = fields[index];
    remove(index);
    setSelectionOrder((prev) => {
      const newOrder = { ...prev };
      delete newOrder[participant.userId];
      return newOrder;
    });
  };

  return (
    <div className="space-y-2">
      <ScrollArea className="h-[14rem] w-full rounded-md border p-2">
        {getParticipantsList().map((participant, index) => {
          const isSelected = fields.some(
            (field) => field.userId === participant._id
          );
          const fieldIndex = fields.findIndex(
            (field) => field.userId === participant._id
          );
          const field = isSelected ? fields[fieldIndex] : null;

          return (
            <div
              key={participant._id}
              onClick={() => handleParticipantSelect(participant)}
              className={`flex items-center justify-between space-x-2 p-2 rounded-lg cursor-pointer hover:bg-accent/50 mb-2 ${
                isSelected ? "bg-card text-card-foreground" : ""
              }`}
            >
              <div className="flex-1">
                <div className="flex items-center space-x-3">
                  <img
                    src={participant.avatar}
                    alt={`${participant.fullName} avatar`}
                    className="w-8 h-8 rounded-full"
                  />
                  <div>
                    <p className="font-semibold">{participant.username}</p>
                    <p
                      className={`text-sm ${isSelected ? "text-card-foreground" : "text-gray-500"}`}
                    >
                      {participant.fullName}
                    </p>
                  </div>
                </div>
                {field?.additionalCharges?.length > 0 && (
                  <div className="mt-2 ml-11 space-y-1">
                    {field.additionalCharges.map((charge, chargeIndex) => (
                      <div
                        key={chargeIndex}
                        className="flex items-center text-sm text-blue-500"
                      >
                        <span className="flex-1">
                          {charge.amount} - {charge.reason}
                        </span>
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="h-6 w-6"
                          onClick={(e) =>
                            handleEditCharge(
                              participant._id,
                              chargeIndex,
                              charge,
                              e
                            )
                          }
                          disabled={disabled}
                        >
                          <Pencil className="h-3 w-3" />
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              {isSelected && (
                <div className="flex items-center space-x-2">
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={(e) => handleAddCharge(participant._id, e)}
                    disabled={disabled}
                  >
                    <PlusCircle className="h-4 w-4" />
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={(e) => removeParticipant(fieldIndex, e)}
                    disabled={disabled}
                  >
                    <XCircle className="h-4 w-4" />
                  </Button>
                </div>
              )}
            </div>
          );
        })}
      </ScrollArea>

      {/* Additional Charges Dialog */}
      <Dialog
        open={isDialogOpen}
        onOpenChange={(open) => {
          if (!open) {
            setIsDialogOpen(false);
            setEditingChargeIndex(null);
            setChargeAmount("");
            setChargeReason("");
          }
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {editingChargeIndex !== null
                ? "Edit Additional Charge"
                : "Add Additional Charge"}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Input
                type="number"
                placeholder="Amount"
                value={chargeAmount}
                onChange={(e) => setChargeAmount(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Input
                type="text"
                placeholder="Reason"
                value={chargeReason}
                onChange={(e) => setChargeReason(e.target.value)}
              />
            </div>
            <div className="flex justify-end space-x-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setIsDialogOpen(false);
                  setEditingChargeIndex(null);
                  setChargeAmount("");
                  setChargeReason("");
                }}
              >
                Cancel
              </Button>
              <Button
                type="button"
                onClick={handleChargeConfirm}
                disabled={!chargeAmount || !chargeReason}
              >
                {editingChargeIndex !== null ? "Update" : "Add"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ExpenseParticipantSelector;
