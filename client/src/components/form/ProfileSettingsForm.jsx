import { useMemo, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Spinner } from "@/components/ui/spinner";
import { toast } from "react-toastify";
import { AvatarSelector } from "../AvatarSelector";
import { useForm } from "react-hook-form";
import { updateUserSchema } from "@/schema/authSchema";
import { zodResolver } from '@hookform/resolvers/zod';

const ProfileSettingsForm = ({ initialData, onCancel, onSave }) => {
  const { updateUserMutation } = useAuth();

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isDirty, isSubmitting },
  } = useForm({
    resolver: zodResolver(updateUserSchema),
    defaultValues: {
      fullName: initialData.fullName,
      username: initialData.username,
      avatar: initialData.avatar,
    },
    mode: "onTouched",
  });

  const avatarUrl = watch("avatar");

  const onSubmit = (values) => {
    const { fullName, username, avatar } = values;
    const payload = {};
    if (fullName !== initialData.fullName) payload.fullName = fullName;
    if (username !== initialData.username) payload.username = username;
    if (avatar !== initialData.avatar) payload.avatar = avatar;

    if (Object.keys(payload).length === 0) {
      onCancel();
      return;
    }

    updateUserMutation.mutate(payload, {
      onSuccess: () => {
        toast.success("Profile updated");
        onSave();
      },
      onError: (err) => {
        toast.error(err?.response?.data?.message || "Failed to update profile");
      },
    });
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="max-w-xl mx-auto flex flex-col gap-6 p-4 rounded-2xl  shadow-md"
    >
      <div className="flex flex-col items-center gap-2">
        <img
          src={avatarUrl}
          alt="avatar"
          className="w-20 h-20 rounded-full object-cover"
        />
        <AvatarSelector onSelect={(url) => setValue("avatar", url, { shouldTouch: true })} />
        {errors.avatar && <p className="text-sm text-destructive">{errors.avatar.message}</p>}
      </div>

      <div className="flex gap-4">
        <div className="flex-1">
          <Label htmlFor="fullName" className="text-sm text-white">Full Name</Label>
          <Input id="fullName" {...register("fullName")} className="bg-[#121418] text-white" />
          {errors.fullName && <p className="text-sm text-destructive">{errors.fullName.message}</p>}
        </div>
        <div className="flex-1">
          <Label htmlFor="username" className="text-sm text-white">Username</Label>
          <Input id="username" {...register("username")} className="bg-[#121418] text-white" />
          {errors.username && <p className="text-sm text-destructive">{errors.username.message}</p>}
        </div>
      </div>

      <div className="flex justify-end gap-2">
        <Button variant="outline" onClick={onCancel}>Cancel</Button>
        <Button type="submit" disabled={!isDirty || isSubmitting || updateUserMutation.isLoading}>
          {(isSubmitting || updateUserMutation.isLoading) ? <Spinner size="sm" /> : "Save"}
        </Button>
      </div>
    </form>
  );
};

export default ProfileSettingsForm;


