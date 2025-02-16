import { useForm } from "react-hook-form";
import { createRoomTaskSchema } from "@/schema/taskSchema";
import { zodResolver } from "@hookform/resolvers/zod/src/zod";
import {
  Form,
  FormItem,
  FormLabel,
  FormControl,
  FormDescription,
  FormMessage,
  FormField,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "../../ui/button";
import { toast } from "react-toastify";
import { useParams } from "react-router-dom";
import { useTask } from "@/hooks/useTask";
import { useState } from "react";
import ParticipantSelector from "../../ParticipantsSelector";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue, 
} from "../../ui/select";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { MultiSelect } from "@/components/ui/multiSelect";
import DatePicker from "@/components/ui/datePicker";

export const RecurringTaskForm = ({ participants }) => {
  const { roomId } = useParams();
  const { createTaskMutation } = useTask(roomId);
  const [customRecurrence, setCustomRecurrence] = useState(false);

  const onSubmit = async (values) => {
    
    console.log(values);
    // return;

    try {
      const response = await createTaskMutation.mutateAsync(values);
      toast("Task added successfully!");
      console.log(response);
    } catch (error) {
      console.error("Error creating task:", error);
    }
  };

  const form = useForm({
    resolver: zodResolver(createRoomTaskSchema),
    defaultValues: {
      title: "",
      description: "",
      dueDate: undefined,
      startDate: undefined,
      participants: [],
      priority: "low",
      recurring: true,
      recurrencePattern: "",
      recurrenceDays: [],
      customRecurrence: undefined,
      assignmentMode: "rotation",
    },
  });

  console.log("Form Errors:", form.formState.errors);

  const days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        {/* Title */}
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Title</FormLabel>
              <FormControl>
                <Input placeholder="Add title" {...field} />
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
                <Input placeholder="Add description" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Priority */}
        <FormField
          control={form.control}
          name="priority"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Priority</FormLabel>
              <FormControl>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select priority" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Low</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                  </SelectContent>
                </Select>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Recurrence Pattern */}
        <div className="flex items-center gap-4">
          <Label htmlFor="custom-toggle" className="text-sm">
            Predefined
          </Label>
          <Switch
            id="custom-toggle"
            checked={customRecurrence}
            onCheckedChange={setCustomRecurrence}
          />
          <Label htmlFor="custom-toggle" className="text-sm">
            Custom
          </Label>
        </div>

        {!customRecurrence ? (
          <FormField
            control={form.control}
            name="recurrencePattern"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Repetition Pattern</FormLabel>
                <FormControl>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select pattern" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="weekly">Weekly</SelectItem>
                      <SelectItem value="daily">Daily</SelectItem>
                      <SelectItem value="monthly">Monthly</SelectItem>
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        ) : (
          <FormField
            control={form.control}
            name="customRecurrence"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Custom Recurrence</FormLabel>
                <FormControl>
                  <Input
                    placeholder="e.g. if repeats every 3 days mention 3"
                    {...field}
                    type="number"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        )}

        {/* Recurrence Days */}
        <FormField
          control={form.control}
          name="recurrenceDays"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Days task happens</FormLabel>
              <FormControl>
                <MultiSelect
                  options={days}
                  value={field.value}
                  onChange={field.onChange}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Participants Selector */}
        <FormField
          control={form.control}
          name="participants"
          render={({ field }) => (
            <FormItem>
              <FormLabel> Choose Participants</FormLabel>
              <ParticipantSelector
                participants={participants}
                onChange={field.onChange} // Directly bind field.onChange
                selectionTransform={(participant) => participant._id}
              />

              <FormMessage />
            </FormItem>
          )}
        />

        {/* Start Date */}
        <FormField
          control={form.control}
          name="startDate"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Start Date</FormLabel>
              <FormControl>
                <DatePicker name="startDate" field={field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* End Date */}

        <FormField
          control={form.control}
          name="dueDate"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Due Date</FormLabel>
              <FormControl>
                <DatePicker name="dueDate" field={field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit">Submit</Button>
      </form>
    </Form>
  );
};
