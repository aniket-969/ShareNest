import { MaintenanceForm } from "@/components/form/MaintenanceForm";
import { Button } from "@/components/ui/button";
import FormWrapper from "@/components/ui/formWrapper";
import { getSocket } from "@/socket";
import { useEffect, useState } from "react";

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
      <Button onClick={() => setIsFormOpen(true)}>Create Maintenance Request</Button>

      {isFormOpen && (
        <FormWrapper onClose={() => setIsFormOpen(false)}>
          <MaintenanceForm />
        </FormWrapper>
      )}
    </div>
  );
};

export default Maintenance;
