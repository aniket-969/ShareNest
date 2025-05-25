import { useParams } from "react-router-dom";
import { useState, Suspense, lazy } from "react";
import { useRoom } from "@/hooks/useRoom";
import { Spinner } from "@/components/ui/spinner";
import { Button } from "@/components/ui/button";
import AwardCard from "@/components/ui/awardCard";
// import { useAward } from "@/hooks/useAwards";
import AwardsSkeleton from "@/components/skeleton/Award/award";

const AwardsForm = lazy(() => import("@/components/form/AwardsForm"));
const FormWrapper = lazy(() => import("@/components/ui/formWrapper"));

const Awards = () => {
  const { roomId } = useParams();
  const { roomQuery } = useRoom(roomId);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [manageMode, setManageMode] = useState(false);
  const [selectedAwards, setSelectedAwards] = useState([]);
  // const { awardsQuery } = useAward();
  // const { data, isLoading, isError } = awardsQuery(roomId);
  
console.log(roomQuery.data)
  if ( roomQuery.isLoading) return <AwardsSkeleton />;
  if (roomQuery.isError) return <>Something went wrong. Please refresh.</>;
  const participants = [
    ...(roomQuery.data.tenants || []),
    ...(roomQuery.data.landlord ? [roomQuery.data.landlord] : []),
  ];
  const {awards} = roomQuery.data
  console.log(awards);
  const toggleManageMode = () => {
    setManageMode((prev) => !prev);
    setSelectedAwards([]); // Reset selection
  };

  const handleSelectAward = (id) => {
    setSelectedAwards((prev) =>
      prev.includes(id)
        ? prev.filter((awardId) => awardId !== id)
        : [...prev, id]
    );
  };

  return (
    <div className="w-full max-w-6xl mx-auto px-6 flex flex-col items-center gap-6">
      {/* Header */}
      <div className="w-full flex flex-col sm:flex-row justify-between items-center px-5">
        <h1 className="text-2xl font-bold text-foreground">Awards</h1>

        {/* Buttons */}
        <div className="flex gap-4 mt-4 sm:mt-0">
          <Button
            variant="outline"
            className="border-primary text-primary "
            onClick={toggleManageMode}
          >
            {manageMode ? "Cancel" : "Manage Awards"}
          </Button>

          {!manageMode && (
            <Button onClick={() => setIsFormOpen(true)}>
              Create Custom Award
            </Button>
          )}
        </div>
      </div>

      {/* Award Creation Form */}
      {isFormOpen && (
        <Suspense fallback={<Spinner />}>
          <FormWrapper onClose={() => setIsFormOpen(false)}>
            <AwardsForm participants={participants} />
          </FormWrapper>
        </Suspense>
      )}

      {/* Award Grid */}
      <div className="w-full grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 m-4">
        {awards.map((award) => (
          <AwardCard
            key={award._id}
            award={award}
            manageMode={manageMode}
            selectedAwards={selectedAwards}
            setSelectedAwards={setSelectedAwards}
          />
        ))}
      </div>

      {/* Delete Button */}
      {manageMode && selectedAwards.length > 0 && (
        <Button
          className="mt-6 bg-destructive text-background hover:bg-destructive/80"
          onClick={() => {
            console.log("Deleting", selectedAwards);
            setSelectedAwards([]);
            setManageMode(false);
            // Later: Trigger actual delete API
          }}
        >
          Delete Selected ({selectedAwards.length})
        </Button>
      )}
    </div>
  );
};

export default Awards;
