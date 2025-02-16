import { useParams } from "react-router-dom";
import AwardCard from "@/components/ui/awardCard";
import { useAward } from "@/hooks/useAwards";
import { Spinner } from "@/components/ui/spinner";
import { AwardsForm } from "@/components/form/AwardsForm";
import { useEffect, useState } from "react";
import { getSocket } from "@/socket";
import FormWrapper from "@/components/ui/formWrapper";
import { useRoom } from "@/hooks/useRoom";

const Awards = () => {
  const { roomId } = useParams();

  const [awards, setAwards] = useState([]);

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

      <FormWrapper>
        <AwardsForm participants={participants} />
      </FormWrapper>
    </div>
  );
};

export default Awards;
