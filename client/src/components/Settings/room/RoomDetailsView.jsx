import { Pencil } from "lucide-react";

const RoomDetailsView = ({ room, isAdmin, onEdit }) => {
  return (
    <div className="relative border-b p-4 text-left">
      <h2 className="text-xl font-bold line-clamp-1">
        {room?.name?.toUpperCase() || "Room"}
      </h2>
      <p className="text-md text-muted-foreground line-clamp-3 max-w-full">
        {room?.description || ""}
      </p>
      {isAdmin && (
        <button
          onClick={onEdit}
          className="absolute top-2 right-2 p-1 hover:bg-muted rounded"
        >
          <Pencil size={16} />
        </button>
      )}
    </div>
  );
};

export default RoomDetailsView;
