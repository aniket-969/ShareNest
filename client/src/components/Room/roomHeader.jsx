import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { toast } from "react-toastify";
import { useAuth } from "@/hooks/useAuth";
import { SidebarProvider,SidebarTrigger } from "../ui/sidebar";
import { AppSidebar } from "../AppSidebar";

export const RoomHeader = () => {
  const navigate = useNavigate();
  const { logoutMutation } = useAuth();
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
    <div className="flex items-center justify-between p-3 shadow-md bg-white">
      {/* Leftmost Title: Dashboard */}
      <p className="text- font-semibold text-lg text-primary"> Dashboard</p>

      {/* Navigation Links */}
      <div className="flex space-x-4">
        <Link to="/room/create" className=" ">
          <Button variant="link" size="sm" className="text-primary ">
            {" "}
            Create/Join Room
          </Button>
        </Link>

        <Link>
          <Button
            onClick={() => onClick()}
            className="text-primary "
            variant="link"
            size="sm"
          >
            Logout
          </Button>
        </Link>
      </div>
    </div>
  );
};
