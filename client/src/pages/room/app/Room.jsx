import RoomLoader from "@/components/Loader/Room";
import ProfileCard from "@/components/ProfileCard";
import QRCode from "@/components/QRCode";
import { RoomHeader } from "@/components/Room/roomHeader";
import RoomList from "@/components/Room/roomList";
import { Navigate, Outlet } from "react-router-dom";

const Room = () => {
  const session = localStorage.getItem("session");

  return session ? (
    <div className=" max-h-screen ">
      <RoomHeader />
      <div className="flex flex-col gap-10 items-center pt-7 sm:pt-12">
        <ProfileCard />
        <div className="flex flex-col-reverse justify-around items-center w-full gap-20 sm:gap-10 sm:flex-row sm:mt-7 ">
          <QRCode />
       
          <RoomList />
         
          
        </div>
      </div>
    </div>
  ) : (
    <Navigate to="/login" />
  );
};

export default Room;
