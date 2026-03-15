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
    <div className="flex flex-col items-center gap-2 ">
      
        <Avatar className="sm:w-[80px] sm:h-[80px] w-[50px] h-[50px] ">
          <AvatarImage src={`https://api.dicebear.com/9.x/adventurer/svg?seed=${data?._id}`} alt={data?.fullName} />
          <AvatarFallback>
            <img src="/altAvatar1.jpg" alt="fallback avatar" />
          </AvatarFallback>
        </Avatar>
      
        <p className="font-medium tracking-wide max-w-[120px] truncate text-center">{data?.fullName}</p>
       
    </div>
  );
};

export default ProfileCard;
