import { useForm } from "react-hook-form";
import { addUserRequestSchema } from "@/schema/roomSchema.js";
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
      role: "",
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

        <FormField
          control={form.control}
          name="role"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Join as</FormLabel>
              <FormControl>
                <RadioGroup
                  onValueChange={field.onChange}
                  value={field.value}
                  className="flex gap-4"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="tenant" id="tenant" />
                    <label htmlFor="tenant" className="text-sm">
                      Tenant
                    </label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="landlord" id="landlord" />
                    <label htmlFor="landlord" className="text-sm">
                      Landlord
                    </label>
                  </div>
                </RadioGroup>
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
