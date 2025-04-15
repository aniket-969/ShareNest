import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { usePoll } from "@/hooks/usePoll";
import { useParams } from "react-router-dom";

const PollVoteForm = ({ poll }) => {
  const form = useForm();
  const { castVoteMutation } = usePoll();

  const onSubmit = async (values) => {
    const payload = {
      pollId: poll._id,
      optionId: values.optionId,
    };

    try {
      await castVoteMutation.mutateAsync(payload);
    } catch (error) {
      console.error("Error during vote:", error);
    }
  };

  return (
    <div className="bg-muted rounded-lg p-4 shadow">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="optionId"
            render={({ field }) => (
              <FormItem className="space-y-3">
                <FormLabel className="text-lg font-semibold text-foreground">
                  {poll.title}
                </FormLabel>
                <FormControl>
                  <RadioGroup
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    className="flex flex-col gap-2"
                  >
                    {poll.options.map((option) => (
                      <FormItem
                        key={option._id}
                        className="flex items-center space-x-3"
                      >
                        <FormControl>
                          <RadioGroupItem value={option._id} />
                        </FormControl>
                        <FormLabel className="text-base font-normal">
                          {option.optionText}
                        </FormLabel>
                      </FormItem>
                    ))}
                  </RadioGroup>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit" className="w-full">
            Vote
          </Button>
        </form>
      </Form>
    </div>
  );
};

export default PollVoteForm;
