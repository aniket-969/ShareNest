import { Skeleton } from "@/components/ui/skeleton";

const AwardsSkeleton = () => {
  return (
    <div className="flex flex-col items-center gap-6 w-full p-6">
      {/* Header Skeleton */}
      <h2 className="font-bold text-3xl">Awards</h2>

      {/* Awards Grid Skeleton */}
      <div className="w-full max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mt-6">
        {[...Array(6)].map((_, idx) => (
          <div
            key={idx}
            className="flex flex-col h-80 border border-muted rounded-2xl shadow-md overflow-hidden"
          >
            {/* Image Placeholder */}
            <Skeleton className="h-[70%] w-full" />

            {/* Text Placeholder */}
            <div className="flex flex-col justify-center flex-1 p-3 text-center gap-2">
              <Skeleton className="h-5 w-3/4 mx-auto" />
              <div className="flex justify-center gap-2 mt-1">
                <Skeleton className="h-6 w-6 rounded-full" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AwardsSkeleton;
