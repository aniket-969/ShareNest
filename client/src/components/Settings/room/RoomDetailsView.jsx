import { Pencil } from "lucide-react";

const RoomDetailsView = ({ room, isAdmin, onEdit }) => {
  return (
    <div className="flex gap-5 items-center justify-center w-full ">
 
    <div className=" border-b p-4 ">
{/* Room name */}
      <h2 className="text-xl font-bold line-clamp-1">
        {room.name?.toUpperCase() || "Room"}
      </h2>
      {/* Room description */}
      <p className="text-md text-muted-foreground line-clamp-3 max-w-full">
        {room.description || ""}
      </p>
      
    </div>
    {isAdmin && (
        <button
          onClick={onEdit}
          className=" top-2 right-2 p-1 hover:bg-muted rounded"
        >
          <Pencil size={16} />
        </button>
      )} </div>
  );
};

export default RoomDetailsView;
