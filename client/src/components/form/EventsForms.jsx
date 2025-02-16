import { useForm } from "react-hook-form";
import { createCalendarEventSchema } from "@/schema/eventSchema";
import { zodResolver } from "./../../../node_modules/@hookform/resolvers/zod/src/zod";
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
import { Button } from "../ui/button";
import { toast } from "react-toastify";
import { useParams } from "react-router-dom";
import { useEvent } from "@/hooks/useEvent";
import DatePicker from "../ui/datePicker";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";

export const EventsForm = () => {
  const { roomId } = useParams();

  const { createEventMutation } = useEvent();
  const onSubmit = async (values) => {
    // console.log(values, roomId);
    // return;
    try {
      const response = await createEventMutation.mutateAsync({
        data: values,
        roomId,
      });
      console.log(response);
      toast(" Events added");
    } catch (error) {
      console.error("Error during registration:", error);
    }
  };

  const form = useForm({
    resolver: zodResolver(createCalendarEventSchema),
    defaultValues: {
      title: "",
      description: "",
      recurrencePattern: "",
      startDate: undefined,
      endDate: undefined,
      recurring: false,
    },
  });
  console.log("Form Errors:", form.formState.errors);
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-2">
        {/* title */}
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Title</FormLabel>
              <FormControl>
                <Input placeholder="add title" {...field} />
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />

        {/* description */}
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Input placeholder="description" {...field} />
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />

        {/* recurrence pattern */}
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
                    <SelectItem value="monthly">Monthly</SelectItem>
                    <SelectItem value="yearly">Yearly</SelectItem>
                  </SelectContent>
                </Select>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* start date */}

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

        {/* end date */}

        <FormField
          control={form.control}
          name="endDate"
          render={({ field }) => (
            <FormItem>
              <FormLabel>End Date</FormLabel>
              <FormControl>
                <DatePicker name="endDate" field={field} />
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
