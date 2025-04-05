import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { getSocket } from "@/socket";
import { lazy, Suspense, useEffect, useState } from "react";

const MaintenanceForm = lazy(() => import("@/components/form/MaintenanceForm"));
const FormWrapper = lazy(() => import("@/components/ui/formWrapper"));

const Maintenance = ({ maintenance }) => {
  console.log(maintenance);
  const [maintenances, setMaintenances] = useState(maintenance);
  const [isFormOpen, setIsFormOpen] = useState(false);
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

  return (
    <div className="flex flex-col gap-6 w-full items-center ">
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
    </div>
  );
};

export default Maintenance;
