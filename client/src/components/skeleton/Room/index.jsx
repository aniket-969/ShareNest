import ProfileSkeleton from "./profile";
import QrCodeSkeleton from "./qrCode";
import RoomListSkeleton from "./roomList";

const RoomLoader = () => {
  return (
    <div className="flex items-center pt-12 md:pt-24  mt-12">
      <div className="flex flex-col md:flex-row items-center justify-evenly w-full md:gap-4 gap-12 ">
        {/* room list and profile container */}
        <div className="md:space-y-20 ">
          {/* profile and edit btn */}
          <div className="md:block hidden ml-10 ">
            <ProfileSkeleton />
          </div>
          {/* room list */}
          <RoomListSkeleton />
        </div>
        <QrCodeSkeleton />
      </div>
    </div>
  );
};

export default RoomLoader;
