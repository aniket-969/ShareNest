import ProfileSkeleton from "../skeleton/Room/profile";
import QrCodeSkeleton from "../skeleton/Room/qrCode";
import RoomListSkeleton from "../skeleton/Room/roomList";

const RoomLoader = () => {
  return (
    <div className="flex flex-col gap-10 items-center pt-7 sm:pt-12">
      <ProfileSkeleton />
      <div className="flex flex-col-reverse justify-around items-center w-full gap-20 sm:gap-10 sm:flex-row sm:mt-7 ">
        <QrCodeSkeleton />
        <RoomListSkeleton />
      </div>
    </div>
  );
};

export default RoomLoader;
