import ProfileCard from "@/components/profileCard";
import { Button } from "@/components/ui/button";
import { Pencil } from "lucide-react";

const ProfileSettingsView = ({ onEdit }) => (
  <div className="flex justify-center items-center py-4 gap-1 ">
    <ProfileCard />
    <Button
      className=" hover:bg-muted rounded w-4 h-8 hover:text-white"
      
      variant="ghost"
      onClick={onEdit}
    >
      <Pencil className=""/>
    </Button>
  </div>
);

export default ProfileSettingsView;
