import { useParams } from "react-router-dom";
import AwardCard from "@/components/ui/awardCard";
import { useAward } from "@/hooks/useAwards";
import { Spinner } from "@/components/ui/spinner";
import { Suspense, useEffect, useState,lazy } from "react";
import { getSocket } from "@/socket";
import { useRoom } from "@/hooks/useRoom";
import { Button } from "@/components/ui/button";

const AwardsForm = lazy(()=>import("@/components/form/AwardsForm"))
const FormWrapper = lazy(() => import("@/components/ui/formWrapper"));

const Awards = () => {
  const { roomId } = useParams();

  const [awards, setAwards] = useState([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const { roomQuery } = useRoom(roomId);

  if (roomQuery.isLoading) {
    return <Spinner />;
  }
  if (roomQuery.isError) {
    return <>Something went wrong . Please refresh</>;
  }

  const participants = [
    ...(roomQuery.data.tenants || []),
    ...(roomQuery.data.landlord ? [roomQuery.data.landlord] : []),
  ];

  return (
    <div className=" p-6 flex flex-col bb gap-4">
      {/* Award heading */}
      <h1 className="text-2xl font-bold mb-6">Awards</h1>
      <Button onClick={() => setIsFormOpen(true)}>Create Custom Award</Button>

      {isFormOpen &&(
        <Suspense fallback={<Spinner/>}><FormWrapper onClose={() => setIsFormOpen(false)}>
          {" "}
          <AwardsForm participants={participants} />
        </FormWrapper></Suspense> 
      )}
    </div>
  );
};

export default Awards;
