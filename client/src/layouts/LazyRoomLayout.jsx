import React from "react";
import { RoomLayout } from "./RoomLayout";

const LazyRoomLayout = () => (
    <React.Suspense fallback={<div>Loading layout...</div>}>
      <RoomLayout />
    </React.Suspense>
  );
  