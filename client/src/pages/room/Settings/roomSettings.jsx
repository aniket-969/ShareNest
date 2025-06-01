import AdminTransfer from "@/components/Settings/room/AdminTransfer"
import LeaveRoom from "@/components/Settings/room/LeaveRoom"

const RoomSettings = ({roomData,roomId}) => {
 
  return (
    <div className="flex flex-col items-start gap-5">
      <LeaveRoom roomId={roomId}/>
      <AdminTransfer roomId={roomId} participants ={roomData?.tenants}/>
    </div>
  ) 
}

export default RoomSettings