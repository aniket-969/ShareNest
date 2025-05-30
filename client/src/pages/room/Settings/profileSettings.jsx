
import  { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { Spinner } from "@/components/ui/spinner";
import ProfileSkeleton from "./skeleton/Room/profile";
import ProfileSettingsView from "@/components/Settings/ProfileSettingsView";
import ProfileSettingsForm from "./ProfileSettingsForm";

const ProfileSettings = () => {
  const { sessionQuery } = useAuth();
  const { data: user, isLoading, isError, refetch } = sessionQuery;
  const [isEditing, setIsEditing] = useState(false);

  if (isLoading) return <ProfileSkeleton />;
  if (isError)   return <>Something went wrong. Please refresh</>;

  return isEditing ? (
    <ProfileSettingsForm
      initialData={user}
      onCancel={() => setIsEditing(false)}
      onSave={() => {
        refetch();
        setIsEditing(false);
      }}
    />
  ) : (
    <ProfileSettingsView onEdit={() => setIsEditing(true)} />
  );
};

export default ProfileSettings;
