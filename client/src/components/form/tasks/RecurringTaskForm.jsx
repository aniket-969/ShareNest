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
  const [recurrenceType, setRecurrenceType] = useState("daily");

  const onSubmit = async (values) => {
    const formattedData = {
      ...values,
      recurring: {
        ...values.recurring,
        patterns: [
          {
            frequency: customRecurrence
              ? "custom"
              : values.recurring.patterns[0].frequency,
            interval: customRecurrence
              ? parseInt(values.recurring.patterns[0].interval)
              : 1,
            days: values.recurring.patterns[0].days.map((day) => {
              // Convert day names to numbers (Sunday = 0, Monday = 1, etc.)
              return [
                "Sunday",
                "Monday",
                "Tuesday",
                "Wednesday",
                "Thursday",
                "Friday",
                "Saturday",
              ].indexOf(day);
            }),
          },
        ],
      },
    };
    console.log(formattedData);
    return;

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
      assignmentMode: "rotation",
      participants: [],
      recurring: {
        enabled: true,
        type: "fixed",
        patterns: 
          [{
            frequency: "daily",
            interval: "1",
            days: [],}
          ],
        
        startDate: undefined,
        dueDate: undefined,
      },
    },
  });
  console.log("Form Errors:", form.formState.errors);

  const daysOfWeek = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  const monthsOfYear = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
console.log(form.watch("recurring.patterns"))
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

        {/* Recurrence Pattern Toggle */}
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

        {/* Frequency Selector */}
        {!customRecurrence ? (
          <>
            <FormField
              control={form.control}
              name="recurring.patterns.frequency"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Repetition Pattern</FormLabel>
                  <FormControl>
                    <Select
                      onValueChange={(value) => {
                        field.onChange(value);
                        setRecurrenceType(value);
                      }}
                      defaultValue={field.value}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select pattern" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="daily">Daily</SelectItem>
                        <SelectItem value="weekly">Weekly</SelectItem>
                        <SelectItem value="monthly">Monthly</SelectItem>
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Interval Field for Predefined Frequencies */}
            <FormField
              control={form.control}
              name="recurring.patterns[0].interval"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    {recurrenceType === "daily"
                      ? "Repeat every (days)"
                      : recurrenceType === "weekly"
                        ? "Repeat every (weeks)"
                        : "Repeat every (months)"}
                  </FormLabel>
                  <FormControl>
                    <Input placeholder="Enter interval" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </>
        ) : (
          <FormField
            control={form.control}
            name="recurring.patterns[0].interval"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Custom Recurrence Interval (Days)</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    placeholder="Enter interval in days"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        )}

        {/* Conditional Fields Based on Frequency */}
        {recurrenceType === "weekly" && (
          <FormField
            control={form.control}
            name="recurring.patterns.days"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Select Days of the Week</FormLabel>
                <FormControl>
                  <MultiSelect
                    options={daysOfWeek}
                    value={field.value}
                    onChange={field.onChange}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        )}

        {recurrenceType === "monthly" && (
          <FormField
            control={form.control}
            name="recurring.patterns.days"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Select Days of the Month</FormLabel>
                <FormControl>
                  <MultiSelect
                    options={Array.from({ length: 31 }, (_, i) =>
                      (i + 1).toString()
                    )}
                    value={field.value}
                    onChange={field.onChange}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        )}

        {/* Participants Selector */}
        <FormField
          control={form.control}
          name="participants"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Choose Participants</FormLabel>
              <ParticipantSelector
                participants={participants}
                onChange={field.onChange}
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

        {/* Action Buttons */}
        <div className="flex gap-3 justify-end">
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
