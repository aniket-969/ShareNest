import LeaveRoom from "@/components/Settings/room/LeaveRoom"

const RoomSettings = ({roomData,roomId}) => {
 
  console.log(roomData)
  return (
    <div>
      <LeaveRoom roomId={roomId}/>
    </div>
  ) 
}

export default RoomSettings