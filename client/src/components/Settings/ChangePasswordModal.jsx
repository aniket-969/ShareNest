import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAuth } from "@/hooks/useAuth";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { toast } from "react-toastify";
import FormWrapper from "@/components/ui/formWrapper";
import { changePasswordSchema } from "@/schema/authSchema";

const ChangePasswordModal = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { changePasswordMutation } = useAuth();

  const {
    register,
    handleSubmit,
    formState: { errors, isDirty, isSubmitting },
    reset,
  } = useForm({
    resolver: zodResolver(changePasswordSchema),
    defaultValues: {
      oldPassword: "",
      newPassword: "",
      confirmNewPassword: "",
    },
    mode: "onTouched",
  });

  const openModal = () => {
    reset();
    setIsOpen(true);
  };

  const closeModal = () => {
    setIsOpen(false);
  };

  const onSubmit = (values) => {
    // We only send oldPassword + newPassword to the backend
    changePasswordMutation.mutate(
      {
        oldPassword: values.oldPassword,
        newPassword: values.newPassword,
      },
      {
        onSuccess: () => {
          toast.success("Password changed successfully");
          closeModal();
        },
        onError: (err) => {
          toast.error(err?.response?.data?.message || "Failed to change password");
        },
      }
    );
  };

  return (
    <>
      <Button onClick={openModal}>Change Password</Button>

      {isOpen && (
        <FormWrapper onClose={closeModal}>
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="flex flex-col gap-6 max-w-md mx-auto p-6 bg-[#1c1f26] rounded-2xl text-white shadow-md"
          >
            {/* Old Password */}
            <div>
              <Label htmlFor="oldPassword" className="text-sm text-white">
                Current Password
              </Label>
              <Input
                id="oldPassword"
                type="password"
                {...register("oldPassword")}
                className="bg-[#121418] text-white"
              />
              {errors.oldPassword && (
                <p className="mt-1 text-sm text-destructive">
                  {errors.oldPassword.message}
                </p>
              )}
            </div>

            {/* New Password */}
            <div>
              <Label htmlFor="newPassword" className="text-sm text-white">
                New Password
              </Label>
              <Input
                id="newPassword"
                type="password"
                {...register("newPassword")}
                className="bg-[#121418] text-white"
              />
              {errors.newPassword && (
                <p className="mt-1 text-sm text-destructive">
                  {errors.newPassword.message}
                </p>
              )}
            </div>

            {/* Confirm New Password */}
            <div>
              <Label htmlFor="confirmNewPassword" className="text-sm text-white">
                Confirm New Password
              </Label>
              <Input
                id="confirmNewPassword"
                type="password"
                {...register("confirmNewPassword")}
                className="bg-[#121418] text-white"
              />
              {errors.confirmNewPassword && (
                <p className="mt-1 text-sm text-destructive">
                  {errors.confirmNewPassword.message}
                </p>
              )}
            </div>

            {/* Actions */}
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={closeModal} disabled={isSubmitting}>
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={!isDirty || isSubmitting || changePasswordMutation.isLoading}
              >
                {(isSubmitting || changePasswordMutation.isLoading) ? (
                  <Spinner size="sm" />
                ) : (
                  "Change Password"
                )}
              </Button>
            </div>
          </form>
        </FormWrapper>
      )}
    </>
  );
};

export default ChangePasswordModal;
