import { useAuth } from "@/hooks/useAuth";
import React from "react";
import { Spinner } from "./ui/spinner";

const ProfileCard = () => {
  const { sessionQuery } = useAuth();
  const { data, isLoading, isError } = sessionQuery;
//   console.log(data);
  if (isLoading) {
    return <Spinner />;
  }
  if(isError){
    return <>
    Something went wrong . Please refresh</>
  }
  return (
    <div className="flex flex-col items-center gap-3 ">
      <div className="w-[5rem] ">
        <img className="by rounded-[2.4rem]" src={data.avatar} alt="" />
      </div>
      <div className="flex gap-5">
        <h2 className="br">{data.fullName}</h2>
        <p className="bb">{data.username}</p>
      </div>
    </div>
  );
};

export default ProfileCard;
