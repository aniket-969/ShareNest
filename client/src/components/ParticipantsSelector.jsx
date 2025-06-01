// ParticipantSelector.jsx
import { useState } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";

const ParticipantSelector = ({ participants, onChange, single = false }) => {
 
  const [selected, setSelected] = useState(single ? null : []);
  const [selectionOrder, setSelectionOrder] = useState({});

  const getSortedParticipants = () => {
    // for single mode, wrap `selected` in an array so sorting logic still works
    const selectedIds = single
      ? selected
        ? [selected]
        : []
      : selected;

    // first, pull out whichever ones are “selected”
    const selectedParticipants = participants.filter((u) =>
      selectedIds.includes(u._id)
    );

    // sort those by the timestamp in `selectionOrder` (multi‐only)
    selectedParticipants.sort((a, b) => {
      return (selectionOrder[a._id] || 0) - (selectionOrder[b._id] || 0);
    });

    // then list all unselected after
    const unselectedParticipants = participants.filter(
      (u) => !selectedIds.includes(u._id)
    );

    return [...selectedParticipants, ...unselectedParticipants];
  };

  const handleClick = (user) => {
    if (single) {
      // In single‐select mode, only that one user
      if (selected === user._id) {
        // clicking the already‐selected user will unselect them
        setSelected(null);
        onChange(null);
      } else {
        setSelected(user._id);
        onChange(user._id);
      }
      return;
    }

    // Multi‐select logic (unchanged)
    const isSelected = selected.includes(user._id);
    let updated;

    if (isSelected) {
      updated = selected.filter((id) => id !== user._id);
      setSelectionOrder((prev) => {
        const next = { ...prev };
        delete next[user._id];
        return next;
      });
    } else {
      updated = [...selected, user._id];
      setSelectionOrder((prev) => ({
        ...prev,
        [user._id]: Date.now(),
      }));
    }

    setSelected(updated);
    onChange(updated);
  };

  return (
    <ScrollArea>
      <div className="grid gap-2 h-[11.6rem] py-2">
        {getSortedParticipants().map((user) => {
          const isSelected = single
            ? selected === user._id
            : selected.includes(user._id);

          return (
            <div
              key={user._id}
              onClick={() => handleClick(user)}
              className={`flex items-center space-x-2 cursor-pointer px-2 py-1 rounded-lg ${
                isSelected ? "bg-card text-card-foreground" : ""
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
                    isSelected ? "bg-card text-card-foreground" : "text-gray-500"
                  }`}
                >
                  {user.fullName}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </ScrollArea>
  );
};

export default ParticipantSelector;
