import { useAuth } from "@/hooks/useAuth";
import { Spinner } from "./ui/spinner";
import ProfileSkeleton from "./skeleton/Room/profile";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const ProfileCard = () => {
  const { sessionQuery } = useAuth();
  const { data, isLoading, isError } = sessionQuery;
  // console.log(data);
  if (isLoading) {
    return <ProfileSkeleton />;
  }
  if (isError) {
    return <>Something went wrong . Please refresh</>;
  }
  return (
    <div className="flex flex-col items-center gap-4 ">
      <div className="">
        <Avatar className="sm:w-[80px] sm:h-[80px] w-[50px] h-[50px] ">
          <AvatarImage src={data?.avatar} alt={data?.fullName} />
          <AvatarFallback>
            <img src="/altAvatar1.jpg" alt="fallback avatar" />
          </AvatarFallback>
        </Avatar>
      </div>
      <div className="flex gap-10 sm:gap-20 items-center justify-center font-medium tracking-wide ">
        <p className="max-w-[120px] truncate text-center">{data?.fullName}</p>
       
      </div>
    </div>
  );
};

export default ProfileCard;
