import { useAuth } from "@/hooks/useAuth";
import React from "react";
import { Spinner } from "./ui/spinner";
import ProfileSkeleton from "./skeleton/Room/profile";

const ProfileCard = () => {
  const { sessionQuery } = useAuth();
  const { data, isLoading, isError } = sessionQuery;
//   console.log(data);
  if (isLoading) {
    return <ProfileSkeleton />;
  }
  if(isError){
    return <>
    Something went wrong . Please refresh</>
  }
  return (
    <div className="flex flex-col items-center gap-3 ">
      <div className="w-[5rem] ">
        <img className=" rounded-[2.4rem] w-[80px] h-[80px]" src={data.avatar} alt={data.username} />
      </div>
      <div className="flex gap-5">
        <h2 >{data.fullName}</h2>
        <p >{data.username}</p>
      </div>
    </div>
  );
};

export default ProfileCard;
