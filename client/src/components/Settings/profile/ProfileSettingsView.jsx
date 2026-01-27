
import ProfileCard from "@/components/profileCard";
import { Pencil } from "lucide-react";

const ProfileSettingsView = ({ onEdit }) => (
  <div className="flex justify-center items-center py-4">
    <ProfileCard />
    <button
      className=" p-1 hover:bg-muted rounded"
      onClick={onEdit}
    >
    
      <Pencil size={16} />
    </button>
  </div>
);

export default ProfileSettingsView;
