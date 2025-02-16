import React, { useMemo } from "react";
import {
  createBrowserRouter,
  createRoutesFromElements,
  RouterProvider,
  Route,
  Routes,
} from "react-router-dom";
import Layout from "@/layouts/Layout.jsx";
import AuthLayout from "@/layouts/AuthLayout.jsx";
import { useQueryClient } from "@tanstack/react-query";
import { NotFound } from "../NotFound.jsx";
import RoomDetails from "../room/app/RoomDetails.jsx";
import { RoomLayout } from "@/layouts/RoomLayout.jsx";
import CreateRoom from "../room/app/CreateRoom.jsx";
import Room from "../room/app/Room.jsx";
import Awards from "../room/Awards/Awards.jsx";
import { SocketProvider } from "@/socket.jsx";
import Chat from "../room/Chat/Chat.jsx";
import { RoomSocketProvider } from "@/context/RoomSocket.jsx";
import { RouteMonitor } from "@/utils/RouteMonitor.js";
import Tasks from "../room/Task/Tasks.jsx";
import RoomExpense from "../room/Expense/RoomExpense.jsx";
import Maintenance from "../room/Maintenance/Maintenance.jsx";
import RoomEvents from "../room/Event/RoomEvents.jsx";

const LandingPage = React.lazy(() => import("../LandingPage.jsx"));
const Login = React.lazy(() => import("../auth/Login.jsx"));
const Register = React.lazy(() => import("../auth/Register.jsx"));
const RoomRoutes = () => {
  return (
    <SocketProvider>
      <RoomSocketProvider>
        <RouteMonitor />
        <Routes>
          <Route path="" element={<Room />} />
          <Route path="create" element={<CreateRoom />} />
          <Route path=":roomId/*" element={<RoomLayout />}>
            <Route index element={<RoomDetails />} />
            <Route path="awards" element={<Awards />} />
            <Route path="chat" element={<Chat />} />
            <Route path="tasks" element={<Tasks />} />
            <Route path="expense" element={<RoomExpense />} />
            <Route path="maintenance" element={<Maintenance />} />
            <Route path="events" element={<RoomEvents />} />
          </Route>
        </Routes>
      </RoomSocketProvider>
    </SocketProvider>
  );
};

export const AppRouter = () => {
  const queryClient = useQueryClient();

  // useMemo to avoid recreating the router on every render
  const router = useMemo(
    () =>
      createBrowserRouter(
        createRoutesFromElements(
          <>
            <Route path="/" element={<Layout />}>
              {/* Public routes */}
              <Route index element={<LandingPage />} />
              <Route element={<AuthLayout />}>
                <Route path="login" element={<Login />} />
                <Route path="register" element={<Register />} />
              </Route>

              {/* Conditional routes for rooms */}

              <Route path="room/*" element={<RoomRoutes />} />

              <Route path="*" element={<NotFound />} />
            </Route>
          </>
        )
      ),
    [queryClient]
  );

  return <RouterProvider router={router} />;
};
