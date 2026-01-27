import { useState, useEffect } from "react";
import RoomDetailsIndex from "@/components/RoomDetails";
import MobileRoomDetails from "@/components/RoomDetails/mobileRoomDetails";

export default function RoomDetails() {
  const [isSmall, setIsSmall] = useState(
    () => window.innerWidth <= 929
  );

  useEffect(() => {
    const mql = window.matchMedia("(max-width: 929px)");
    const handler = (e) => setIsSmall(e.matches);
    mql.addEventListener("change", handler);
    return () => mql.removeEventListener("change", handler);
  }, []);

  return isSmall
    ? <MobileRoomDetails />
    : <RoomDetailsIndex />;
}
