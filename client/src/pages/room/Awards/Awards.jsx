import { useParams } from "react-router-dom";
import { useState, Suspense, lazy } from "react";
import { useRoom } from "@/hooks/useRoom";
import { Spinner } from "@/components/ui/spinner";
import { Button } from "@/components/ui/button";
import AwardCard from "@/components/ui/awardCard"; 
import { useAward } from "@/hooks/useAwards";
import AwardsSkeleton from "@/components/skeleton/Award/award";
 
const AwardsForm = lazy(() => import("@/components/form/AwardsForm"));
const FormWrapper = lazy(() => import("@/components/ui/formWrapper"));

const fakeAwards = [
  {
    id: "1",
    title: "Task Master",
    description: "Completed the most tasks this month.",
    criteria: "Completed 15+ tasks",
    image:
      "https://img.freepik.com/free-vector/trophy-award-laurel-wreath-composition-with-realistic-image-golden-cup-decorated-with-garland-with-reflection_1284-32301.jpg?semt=ais_hybrid&w=740",
    participants: ["Aniket", "Mira", "Chetan"],
  },
  {
    id: "2",
    title: "Team Player",
    description: "Most accepted task requests.",
    criteria: "Accepted 10+ requests",
    image:
      "https://www.shutterstock.com/image-vector/realistic-golden-star-trophy-award-600nw-2433339699.jpg",
    participants: ["Mira"],
  },
  {
    id: "3",
    title: "Outstanding Effort",
    description: "Went above and beyond.",
    criteria: "Recognized by peers",
    image: "https://source.unsplash.com/random/300x300?success",
    participants: ["Chetan"],
  },
  {
    id: "4",
    title: "Dog Lover",
    description: "Most friendly with pets.",
    criteria: "Cared for 3+ dogs",
    image: "https://source.unsplash.com/random/300x300?dog",
    participants: ["Mira"],
  },
];

const Awards = () => {
  const { roomId } = useParams();
  const { roomQuery } = useRoom(roomId);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [manageMode, setManageMode] = useState(false);
  const [selectedAwards, setSelectedAwards] = useState([]);
  const { awardsQuery } = useAward();
  const { data, isLoading, isError } = awardsQuery(roomId);

  if (isLoading) return <AwardsSkeleton />;
  if (isError) return <>Something went wrong. Please refresh.</>;

  console.log(data);
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
    <div className="px-6 flex flex-col w-full items-center gap-6 bb">
      {/* Header */}
      <div className="w-full flex flex-col sm:flex-row justify-between items-center gap-4">
        <h1 className="text-2xl font-bold text-foreground">Awards</h1>

        <div className="flex gap-4">
          <Button
            variant="outline"
            className="border-primary text-primary hover:bg-primary/10"
            onClick={toggleManageMode}
          >
            {manageMode ? "Cancel" : "Manage Awards"}
          </Button>

          {!manageMode && (
            <Button className="" onClick={() => setIsFormOpen(true)}>
              Create Custom Award
            </Button>
          )}
        </div>
      </div>

      {/* Form (slides down) */}
      {isFormOpen && (
        <Suspense fallback={<Spinner />}>
          <FormWrapper onClose={() => setIsFormOpen(false)}>
            <AwardsForm participants={participants} />
          </FormWrapper>
        </Suspense>
      )}

      {/* Awards Grid */}
      <div className="w-full max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mt-4">
        {data.map((award) => (
          <AwardCard key={award._id} award={award} />
        ))}
      </div>

      {/* Delete Selected */}
      {manageMode && selectedAwards.length > 0 && (
        <Button
          className="mt-6 bg-destructive text-background hover:bg-destructive/80"
          onClick={() => {
            // Later: call delete API here
            console.log("Deleting", selectedAwards);
            setSelectedAwards([]);
            setManageMode(false);
          }}
        >
          Delete Selected ({selectedAwards.length})
        </Button>
      )}
    </div>
  );
};

export default Awards;
