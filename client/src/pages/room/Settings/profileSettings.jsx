
import  { Suspense, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { Spinner } from "@/components/ui/spinner";
import ProfileSkeleton from "@/components/skeleton/Room/profile";
import ProfileSettingsView from "@/components/Settings/ProfileSettingsView";
import ProfileSettingsForm from "@/components/form/ProfileSettingsForm";
import FormWrapper from "@/components/ui/formWrapper";

const ProfileSettings = () => {const { sessionQuery } = useAuth();
  const { data: user, isLoading, isError, refetch } = sessionQuery;
  const [isEditing, setIsEditing] = useState(false);

  if (isLoading) return <ProfileSkeleton />;
  if (isError)   return <>Something went wrong. Please refresh</>;

  return (
    <>
      {!isEditing && (
        <ProfileSettingsView onEdit={() => setIsEditing(true)} />
      )}

      {isEditing && (
        <Suspense fallback={<Spinner />}>
          <FormWrapper onClose={() => setIsEditing(false)}>
            <ProfileSettingsForm
              initialData={user}
              onCancel={() => setIsEditing(false)}
              onSave={() => {
                refetch();
                setIsEditing(false);
              }}
            />
          </FormWrapper>
        </Suspense>
      )}
    </>
  );
};

export default ProfileSettings;
