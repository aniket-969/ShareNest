import { Skeleton } from "@/components/ui/skeleton";

const ProfileSkeleton = () => {
  return (
    <div className="flex flex-col items-center gap-3">
      <div className="w-[5rem]">
        <Skeleton className="rounded-[2.4rem] w-[80px] h-[80px]" />
      </div>
      <div className="flex gap-5">
        <Skeleton className="h-4 w-[145px]" />
        <Skeleton className="h-4 w-[65px]" />
      </div>
    </div>
  );
};

export default ProfileSkeleton;
