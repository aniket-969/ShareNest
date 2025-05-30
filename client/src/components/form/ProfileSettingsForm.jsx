
import { useMemo, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Spinner } from "@/components/ui/spinner";
import { toast } from "react-toastify";
import { AvatarSelector } from "../AvatarSelector";


const ProfileSettingsForm = ({ initialData, onCancel, onSave }) => {
  const [formData, setFormData] = useState({
    fullName: initialData.fullName,
    username: initialData.username,
    avatar: initialData.avatar,
  });
  const { updateUserMutation } = useAuth();

  const isUnchanged = useMemo(() => {
    return (
      formData.fullName === initialData.fullName &&
      formData.username === initialData.username &&
      formData.avatar === initialData.avatar
    );
  }, [formData, initialData]);

  const handleSave = () => {
    if (isUnchanged) {
      onCancel();
      return;
    }

    updateUserMutation.mutate(formData, {
      onSuccess: () => {
        toast.success("Profile updated");
        onSave();
      },
      onError: () => {
        toast.error("Failed to update profile");
      },
    });
  };

  return (
    <div className="max-w-xl mx-auto flex flex-col gap-6 p-4 rounded-2xl text-white shadow-md">
      {/* Avatar */}
      <div className="flex flex-col items-center gap-2">
        <img
          src={formData.avatar}
          alt="avatar"
          className="w-20 h-20 rounded-full object-cover"
        />
        <AvatarSelector
          onSelect={(url) =>
            setFormData((f) => ({ ...f, avatar: url }))
          }
        />
      </div>

      {/* Name & Username */}
      <div className="flex gap-4">
        <div className="flex-1">
          <Label htmlFor="fullName" className="text-sm text-white">
            Full Name
          </Label>
          <Input
            id="fullName"
            value={formData.fullName}
            onChange={(e) =>
              setFormData((f) => ({
                ...f,
                fullName: e.target.value,
              }))
            }
            className="bg-[#121418] text-white"
          />
        </div>
        <div className="flex-1">
          <Label htmlFor="username" className="text-sm text-white">
            Username
          </Label>
          <Input
            id="username"
            value={formData.username}
            onChange={(e) =>
              setFormData((f) => ({
                ...f,
                username: e.target.value,
              }))
            }
            className="bg-[#121418] text-white"
          />
        </div>
      </div>

      {/* Actions */}
      <div className="flex justify-end gap-2">
        <Button variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button
          onClick={handleSave}
          disabled={isUnchanged || updateUserMutation.isLoading}
        >
          {updateUserMutation.isLoading ? (
            <Spinner size="sm" />
          ) : (
            "Save"
          )}
        </Button>
      </div>
    </div>
  );
};

export default ProfileSettingsForm;

