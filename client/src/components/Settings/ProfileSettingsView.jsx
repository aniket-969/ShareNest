
import ProfileCard from "../profileCard";
import { Pencil } from "lucide-react";

const ProfileSettingsView = ({ onEdit }) => (
  <div className="relative ">
    <ProfileCard />
    <button
      className="absolute top-2 right-2 p-1 hover:bg-muted rounded"
      onClick={onEdit}
    >
      <Pencil size={16} />
    </button>
  </div>
);

export default ProfileSettingsView;
