import { useState } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";

const ParticipantSelector = ({ participants, onChange }) => {
  const [selected, setSelected] = useState([]);
  const [selectionOrder, setSelectionOrder] = useState({});

  const getSortedParticipants = () => {
    const selectedParticipants = participants.filter((user) =>
      selected.includes(user._id)
    );

    selectedParticipants.sort((a, b) => {
      return selectionOrder[a._id] - selectionOrder[b._id];
    });

    const unselectedParticipants = participants.filter(
      (user) => !selected.includes(user._id)
    );

    return [...selectedParticipants, ...unselectedParticipants];
  };

  const toggleSelection = (participant) => {
    const isSelected = selected.includes(participant._id);
    let updatedSelected;

    if (isSelected) {
      updatedSelected = selected.filter((id) => id !== participant._id);
      setSelectionOrder((prev) => {
        const newOrder = { ...prev };
        delete newOrder[participant._id];
        return newOrder;
      });
    } else {
      updatedSelected = [...selected, participant._id];
      setSelectionOrder((prev) => {
        return { ...prev, [participant._id]: Date.now() };
      });
    }

    setSelected(updatedSelected);
    onChange(updatedSelected);
  };

  return (
    <ScrollArea>
      <div className="grid gap-2 h-[11.6rem] py-2">
        {getSortedParticipants().map((user) => (
          <div
            key={user._id}
            onClick={() => toggleSelection(user)}
            className={`flex items-center space-x-2 cursor-pointer px-2 py-1 rounded-lg ${
              selected.includes(user._id) ? "bg-card text-card-foreground" : ""
            }`}
          >
            <img
              src={user.avatar}
              alt={`${user.fullName} avatar`}
              className="w-8 h-8 rounded-full"
            /> 
            <div>
              <p className="font-semibold">{user.username}</p>
              <p
                className={`text-sm ${
                  selected.includes(user._id)
                    ? "bg-card text-card-foreground"
                    : "text-gray-500"
                }`}
              >
                {user.fullName}
              </p>
            </div>
          </div>
        ))}
      </div>
    </ScrollArea>
  );
};

export default ParticipantSelector;
