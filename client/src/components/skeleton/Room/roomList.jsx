import { Skeleton } from "@/components/ui/skeleton";

const RoomListSkeleton = () => {
  return (
    <div className="flex flex-col gap-5 items-center ">
      <h1 className="text-xl font-semibold">Rooms</h1>
      <div className="flex flex-col gap-5 h-[15rem] pt-2 sm:pr-2 ">
        <Skeleton className="w-[180px] h-[40px]" />
        <Skeleton className="w-[180px] h-[40px]" />
        <Skeleton className="w-[180px] h-[40px]" />
        <Skeleton className="w-[180px] h-[40px]" />
      
      </div>
    </div>
  );
};

export default RoomListSkeleton;
