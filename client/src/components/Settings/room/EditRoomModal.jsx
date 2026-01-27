import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "react-toastify";
import FormWrapper from "@/components/ui/formWrapper";
import { updateRoomSchema } from "@/schema/roomSchema";

const EditRoomDetailsModal = ({
  open,
  room,
  onClose,
  onSuccess,
  updateRoomMutation,
}) => {
  const form = useForm({
    resolver: zodResolver(updateRoomSchema),
    defaultValues: {
      name: room.name || "",
      description: room.description || "",
    },
  });

  const handleSubmit = async (values) => {
    try {
      await updateRoomMutation.mutateAsync(values);
     
      onSuccess();
      onClose();
    } catch (err) {
      toast.error(err?.response?.data?.message || "Failed to update room");
    }
  };
  if (!open) return null;
  return (
    <FormWrapper onClose={onClose}>
      <form
        onSubmit={form.handleSubmit(handleSubmit)}
        className="space-y-4 max-w-md mx-auto"
      >
        <div>
          <Label>Room Name</Label>
          <Input
            {...form.register("name")}
            className="bg-[#121418] text-white"
          />
          {form.formState.errors.name && (
            <p className="mt-1 text-sm text-destructive">
              {form.formState.errors.name.message}
            </p>
          )}
        </div>

        <div>
          <Label>Description</Label>
          <Input
            {...form.register("description")}
            className="bg-[#121418] text-white"
          />
          {form.formState.errors.description && (
            <p className="mt-1 text-sm text-destructive">
              {form.formState.errors.description.message}
            </p>
          )}
        </div>

        <div className="flex justify-end gap-2">
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            disabled={updateRoomMutation.isLoading}
          >
            Cancel
          </Button>
          <Button type="submit" disabled={updateRoomMutation.isLoading}>
            {updateRoomMutation.isLoading ? "Saving..." : "Save"}
          </Button>
        </div>
      </form>
    </FormWrapper>
  );
};

export default EditRoomDetailsModal;
