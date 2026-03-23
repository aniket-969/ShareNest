import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { toast } from "react-toastify";
import { useAuth } from "@/hooks/useAuth";
import { SidebarProvider, SidebarTrigger } from "../ui/sidebar";
import { AppSidebar } from "../RoomDetails/AppSidebar";
import LogOut from "../LogOut";
import ProfileSettingsView from "../Settings/profile/ProfileSettingsView";
import ProfileCard from "../profileCard";
import TopbarProfileAvatar from "../ui/topbarAvatar";
import EditProfileModal from "../Settings/profile/EditProfileModal";
import { useState } from "react";

export const RoomHeader = ({ user }) => {

  const navigate = useNavigate();
  const { logoutMutation, sessionQuery } = useAuth();

  const [isEditOpen, setIsEditOpen] = useState(false);

  const onClick = async () => {
    try {
      const response = await logoutMutation.mutateAsync();
      console.log(response);
      toast("User logout successful");
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="flex items-center justify-between sm:px-8 px-4 py-3 shadow-md ">
      {/* Leftmost Title: Dashboard */}
      <h3 className="font-semibold text-lg hidden md:block"> Dashboard</h3>
      <div className="block md:hidden">
         <TopbarProfileAvatar data={user} onEdit={() => setIsEditOpen(true)} />

      <EditProfileModal
        open={isEditOpen}
        onClose={() => setIsEditOpen(false)}
        user={user}
      />
      </div>
     
      {/* Navigation Links */}
      <div className="flex sm:space-x-4">
        <Link to="/room/create" className=" ">
          <Button variant="link" size="sm" className="text- ">
            {" "}
            Create/Join Room
          </Button>
        </Link>

        <LogOut variant="link" />
      </div>
    </div>
  );
};
