import MaintenanceCard from "@/components/Maintenance/maintenanceCard";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { useRoom } from "@/hooks/useRoom";
import { getSocket } from "@/socket";
import { lazy, Suspense, useEffect, useState } from "react";
import { useParams } from "react-router-dom";

const MaintenanceForm = lazy(() => import("@/components/form/MaintenanceForm"));
const FormWrapper = lazy(() => import("@/components/ui/formWrapper"));

const Maintenance = ({ maintenance }) => {
  const { roomId } = useParams();
  const [isFormOpen, setIsFormOpen] = useState(false);
   const { roomQuery } = useRoom(roomId);
    const { data, isLoading, isError } = roomQuery;
    // console.log(data)
  const socket = getSocket();
 
  useEffect(() => {
    const handleCreateMaintenance = (newMaintenance) => {
      console.log("create it");
      setMaintenances((prevMaintenance) => [
        ...prevMaintenance,
        newMaintenance,
      ]);
    };
    const handleUpdateMaintenance = (data) => {
      console.log(data);
    };
    socket.on("createMaintenance", handleCreateMaintenance);

    socket.on("updateMaintenance", handleUpdateMaintenance);

    return () => {
      socket.off("createMaintenance", handleCreateMaintenance);
    };
  }, [socket]);

  if(isLoading){
    return <Spinner/>
  }
  if(isError){
    return <>Something went wrong , please refresh</>
  }
  return (
    <div className="flex flex-col gap-6 w-full items-center">
      <h2 className="font-bold text-xl"> Maintenance </h2>
      <Button onClick={() => setIsFormOpen(true)}>
        Create Maintenance Request
      </Button>

      {isFormOpen && (
        <Suspense fallback={<Spinner />}>
          <FormWrapper onClose={() => setIsFormOpen(false)}>
            <MaintenanceForm />
          </FormWrapper>
        </Suspense>
      )}
<MaintenanceCard maintenance={data?.maintenanceRequests}/>

    </div>
  );
};

export default Maintenance;
