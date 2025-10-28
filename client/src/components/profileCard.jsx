import { useAuth } from "@/hooks/useAuth";
import React from "react";
import { Spinner } from "./ui/spinner";
import ProfileSkeleton from "./skeleton/Room/profile";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";

const ProfileCard = () => {
  const { sessionQuery } = useAuth();
  const { data, isLoading, isError } = sessionQuery;
  console.log(data);
  if (isLoading) {
    return <ProfileSkeleton />;
  }
  if (isError) {
    return <>Something went wrong . Please refresh</>;
  }
  return (
    <div className="flex flex-col items-center gap-4">
      <div className="">
        <Avatar className="w-[80px] h-[80px] rounded-[2.4rem]">
          <AvatarImage src={data.avatarr} alt={data.fullName} />
          <AvatarFallback>
            <img src="/altAvatar1.jpg" alt="fallback avatar" />
          </AvatarFallback>
        </Avatar>
      </div>
      <div className="flex gap-10 sm:gap-20 items-center justify-center">
        <p className="max-w-[120px] truncate text-center">{data?.fullName}</p>
        <p className="max-w-[100px] truncate text-center">@{data?.username}</p>
      </div>
    </div>
  );
};

export default ProfileCard;
