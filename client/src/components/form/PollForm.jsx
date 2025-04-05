import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { pollSchema } from "@/schema/PollSchema";
import {
  Form,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "react-toastify";
import { usePoll } from "@/hooks/usePoll";
import { useParams } from "react-router-dom";
import { Plus } from "lucide-react";

export const PollForm = () => {
  const { roomId } = useParams();
  const { createPollMutation } = usePoll();

  const form = useForm({
    resolver: zodResolver(pollSchema),
    defaultValues: {
      title: "",
      voteEndTime: "",
      options: [""], 
    },
  });

  const { watch, setValue, handleSubmit } = form;
  const options = watch("options");

  const onSubmit = async (values) => {
    const data = {
      ...values,
      options: values.options.filter((opt) => opt.trim() !== ""), // Remove empty options
    };
    
    try {
      const response = await createPollMutation.mutateAsync({
        data,
        roomId,
      });
      console.log(response)
    } catch (error) {
      console.error("Error during registration:", error);
    }
  };

  const addOption = () => {
    if (options.length < 6) {
      setValue("options", [...options, ""]);
    } else {
      toast.error("You can only add up to 6 options.");
    }
  };

  const removeOption = (index) => {
    const newOptions = options.filter((_, i) => i !== index);
    setValue("options", newOptions);
  };

  return (
    <Form {...form}>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {/* Title Field */}
        <FormItem>
          <FormLabel>Title</FormLabel>
          <FormControl>
            <Input {...form.register("title")} placeholder="Add Poll Title" />
          </FormControl>
          <FormMessage />
        </FormItem>

        {/* Vote End Time Field */}
        <FormItem>
          <FormLabel>Vote End Time</FormLabel>
          <FormControl>
            <Input type="datetime-local" {...form.register("voteEndTime")} />
          </FormControl>
          <FormMessage />
        </FormItem>

        {/* Options Field */}
        <FormItem>
          <FormLabel>Options</FormLabel>
          {options.map((option, index) => (
            <div key={index} className="flex items-center gap-2 mb-2">
              <FormControl className="flex-1">
                <Input
                  placeholder={`Option ${index + 1}`}
                  value={option}
                  onChange={(e) => {
                    const newOptions = [...options];
                    newOptions[index] = e.target.value;
                    setValue("options", newOptions);
                  }}
                />
              </FormControl>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => removeOption(index)}
                disabled={options.length <= 1}
              >
                Remove
              </Button>
            </div>
          ))}
          <Button
            type="button"
            variant="outline"
            onClick={addOption}
            className="flex items-center"
          >
            <Plus className="mr-2 h-4 w-4" /> Add Option
          </Button>
          <p className="text-sm text-gray-500 mt-2">
            You can add up to 6 options.
          </p>
        </FormItem>

        {/* Submit Button */}
        <Button type="submit">Create Poll</Button>
      </form>
    </Form>
  );
};
