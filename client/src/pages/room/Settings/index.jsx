
import RoomSettings from "./roomSettings";
import ProfileSettings from "./profileSettings";
import { Separator } from "@/components/ui/separator";
import { Card, CardContent } from "@/components/ui/card";
import { useRoom } from "@/hooks/useRoom";
import { useParams } from 'react-router-dom';
import { useAuth } from "@/hooks/useAuth";

const Settings = () => {
   const {roomId} = useParams()
  const {roomQuery} = useRoom(roomId)
  const { sessionQuery } = useAuth();
    const { data: user, isLoading:userLoading, isError:userError } = sessionQuery;
  const {data:roomData,isLoading,isError,refetch} = roomQuery
  if(isLoading || userLoading)return <>Spinner</>
  if(isError || userError)return <>Something went wrong</>

  return (
    <div className="max-w-6xl mx-auto space-y-8 px-4 py-6 ">
     <Card className="bg-[#121418] text-white shadow-md rounded-2xl">
        <CardContent className="py-6">
          <h2 className="text-xl font-semibold mb-4 text-white">Profile Settings</h2>
          <ProfileSettings refetch={refetch} user={user}/>
        </CardContent>
      </Card>
      <Separator className="my-4 bg-muted/40" />
  <Card className="bg-[#121418] text-white shadow-md rounded-2xl ">
        <CardContent className="py-6">
          <h2 className="text-xl font-semibold mb-4 text-white">Room Settings</h2>
          <RoomSettings roomId={roomId} roomData={roomData}/>
        </CardContent>
      </Card>

     
    </div>
  );
};

export default Settings;
