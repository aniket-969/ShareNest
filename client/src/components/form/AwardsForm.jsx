import { useForm } from "react-hook-form";
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
import { useAward } from "@/hooks/useAwards";
import { createCustomAwardSchema } from "@/schema/awardsSchema";
import ParticipantSelector from "../ParticipantsSelector";

export const AwardsForm = ({ participants }) => {
  const { roomId } = useParams();
  const { createAwardMutation } = useAward();
  const onSubmit = async (values) => {
    console.log(values);
    
    try {
      const response = await createAwardMutation.mutateAsync({
        data: values,
        roomId,
      });
      toast(" Custom Award created successfully ");
    } catch (error) {
      console.error("Error during registration:", error);
    }
  };

  const form = useForm({
    resolver: zodResolver(createCustomAwardSchema),
    defaultValues: {
      title: "",
      description: "",
      image: "",
      criteria: "",
      assignedTo: [],
    },
  });

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
          name="image"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Add awards image link</FormLabel>
              <FormControl>
                <Input placeholder="add ImageUrl" {...field} />
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />

        {/* criteria*/}
        <FormField
          control={form.control}
          name="criteria"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Criteria</FormLabel>
              <FormControl>
                <Input placeholder="add criteria " {...field} />
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />

        {/* Participants Selector */}
        <FormField
          control={form.control}
          name="assignedTo"
          render={({ field }) => (
            <FormItem>
              <FormLabel> Choose Participants</FormLabel>
              <ParticipantSelector
                participants={participants}
                onChange={field.onChange}
                selectionTransform={(participant) => participant._id}
              />

              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit">Submit</Button>
      </form>
    </Form>
  );
};
