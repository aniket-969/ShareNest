import AdminTransfer from "@/components/Settings/room/AdminTransfer"
import LeaveRoom from "@/components/Settings/room/LeaveRoom"

const RoomSettings = ({roomData,roomId}) => {
 
  return (
    <div className="flex flex-col items-start gap-5">
     <div className="mx-auto p-4 border-b">
          <h2 className="text-xl font-bold line-clamp-1">
            {roomData?.name?.toUpperCase() || "Loading..."}
          </h2>
          <p className="text-md text-muted-foreground line-clamp-3 max-w-full">
            {roomData?.description || ""}
          </p>
        </div>
      <LeaveRoom roomId={roomId}/>
      <AdminTransfer roomId={roomId} participants ={roomData?.tenants}/>
    </div>
  ) 
}

export default RoomSettings