import { useForm } from "react-hook-form";
import { addUserRequestSchema } from "@/schema/roomSchema.js";
import { zodResolver } from '@hookform/resolvers/zod';

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
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useRoomMutation } from "@/hooks/useRoom";

export const JoinRoomForm = () => {
  const { requestJoinRoomMutation } = useRoomMutation();

  const onSubmit = async (values) => {
    console.log(values);
    try {
      const response = await requestJoinRoomMutation.mutateAsync(values);
      console.log(response);
    } catch (error) {
      console.log(error);
    }
  };

  const form = useForm({
    resolver: zodResolver(addUserRequestSchema),
    defaultValues: {
      groupCode: "",
    },
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-2">
        <FormField
          control={form.control}
          name="groupCode"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Room Code</FormLabel>
              <FormControl>
                <Input placeholder="Enter room code " {...field} />
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" className="">Submit</Button>
      </form>
    </Form>
  );
};
