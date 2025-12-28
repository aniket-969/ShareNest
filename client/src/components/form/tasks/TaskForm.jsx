import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { createNormalTaskSchema } from "@/schema/taskSchema";

import {
  Form,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
  FormField,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import DatePicker from "@/components/ui/datePicker";
import ParticipantSelector from "@/components/Tasks/ParticipantsSelector";

import { useParams } from "react-router-dom";
import { useTask } from "@/hooks/useTask";
import { toast } from "react-toastify";

const TaskForm = ({ participants }) => {
  const { roomId } = useParams();
  const { createTaskMutation } = useTask(roomId);

  const form = useForm({
    resolver: zodResolver(createNormalTaskSchema),
    defaultValues: {
      title: "",
      description: "",
      assignmentMode: "single",
      participants: [],
      startDate: undefined,
    },
  });

  const onSubmit = async (values) => {
    try {
      const payload = {
        ...values,
        recurrence: {
          enabled: false,
        },
      };
console.log(payload)
return
      await createTaskMutation.mutateAsync(payload);

      toast.success("Task created successfully");
      form.reset();
    } catch (err) {
      toast.error(err.message || "Failed to create task");
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 px-2">
        {/* Title */}
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Title</FormLabel>
              <FormControl>
                <Input placeholder="Task title" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Description */}
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Task description"
                  className="resize-none"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Participants */}
        <FormField
          control={form.control}
          name="participants"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Participants</FormLabel>
              <FormControl>
                <ParticipantSelector
                  participants={participants}
                  onChange={field.onChange}
                  selectionTransform={(p) => p._id}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Task Date */}
        <FormField
          control={form.control}
          name="startDate"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Date</FormLabel>
              <FormControl>
                <DatePicker field={field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-end gap-3">
          <Button type="button" variant="outline" onClick={() => form.reset()}>
            Cancel
          </Button>
          <Button type="submit" disabled={createTaskMutation.isLoading}>
            {createTaskMutation.isLoading ? "Creating..." : "Create Task"}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default TaskForm;
