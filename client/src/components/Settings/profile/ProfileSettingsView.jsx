import ProfileCard from "@/components/profileCard";
import { Button } from "@/components/ui/button";
import { Pencil } from "lucide-react";

const ProfileSettingsView = ({ onEdit }) => (
  <div className="flex justify-center items-center py-4 ">
    <ProfileCard />
    <Button
      className="m-2 hover:bg-muted rounded"
      size="icon"
      variant="ghost"
      onClick={onEdit}
    >
      <Pencil />
    </Button>
  </div>
);

export default ProfileSettingsView;
