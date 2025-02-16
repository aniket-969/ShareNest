import { useForm } from "react-hook-form";
import { createMaintenanceSchema } from "@/schema/maintenanceSchema";
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
import { useMaintenance } from "./../../hooks/useMaintenance";
import { useParams } from "react-router-dom";

export const MaintenanceForm = () => {
  const { roomId } = useParams();
  const { createMaintenanceMutation } = useMaintenance(roomId);
  const onSubmit = async (values) => {
    console.log(values);
    // return;
    try {
      const response = await createMaintenanceMutation.mutateAsync(values);
      console.log(response);
      toast("Maintenance issue added");
    } catch (error) {
      console.error("Error during registration:", error);
    }
  };

  const form = useForm({
    resolver: zodResolver(createMaintenanceSchema),
    defaultValues: {
      title: "",
      description: "",
      maintenanceProvider: "",
      contactPhone: "",
      costEstimate: "",
    },
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-2">
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
        <FormField
          control={form.control}
          name="maintenanceProvider"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Maintenance Provider</FormLabel>
              <FormControl>
                <Input placeholder="add maintenance provider name" {...field} />
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="contactPhone"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Contact Number</FormLabel>
              <FormControl>
                <Input placeholder="add contacts " {...field} />
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="costEstimate"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Cost</FormLabel>
              <FormControl>
                <Input
                  placeholder="add probable cost"
                  type="number"
                  {...field}
                  onChange={(e) => {
                    const value = e.target.value;
                    field.onChange(value);
                  }}
                  value={field.value === "" ? "" : field.value}
                />
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
