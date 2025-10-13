import { useForm } from "react-hook-form";
import { createExpenseSchema } from "@/schema/expenseSchema";
import { zodResolver } from "@hookform/resolvers/zod";
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
import { toast } from "react-toastify";
import { useExpense } from "@/hooks/useExpense";
import { useParams } from "react-router-dom";
import ParticipantSelector from "../ParticipantsSelector";
import { Spinner } from "@/components/ui/spinner";
import DatePicker from "@/components/ui/datePicker";
import ExpenseParticipantSelector from "../Expense/ExpenseParticipantSelector";
import { currencyOptions } from "@/utils/helper";
 
const ExpenseForm = ({ participants,onClose }) => {
  const { roomId } = useParams();
  const { createExpenseMutation } = useExpense(roomId);

  const onSubmit = async (values) => {
    console.log(values, roomId);
    // return;
    try {
      const response = await createExpenseMutation.mutateAsync(values);
      console.log(response);
      toast("Splitted Expense ");
      form.reset()
      onClose()

    } catch (error) {
      console.error("Error during registration:", error);
    }
  };

  const form = useForm({
    resolver: zodResolver(createExpenseSchema),
    defaultValues: {
      title: "",
      totalAmount: 0,
      imageUrl: undefined,
      dueDate: undefined,
      paidBy: "",
      participants: [],
      currency: "INR",
    },
  });

  console.log(form.formState.errors);
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
        {/* Total amount */}
        <FormField
          control={form.control}
          name="totalAmount"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Total Amount</FormLabel>
              <FormControl>
                <Input
                  placeholder="add total amount"
                  {...field}
                  type="number"
                />
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />
        {/* Participants selector with additional charge*/}
        <FormField
          control={form.control}
          name="participants"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Select Participants</FormLabel>
              <FormControl>
                <ExpenseParticipantSelector
                  participants={participants}
                  form={form}
                  disabled={field.disabled}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        {/* image or bill link */}
        {/* <FormField
          control={form.control}
          name="imageUrl"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Bill image link</FormLabel>
              <FormControl>
                <Input
                  placeholder="add link of expense"
                  value={field.value || ""}
                  onChange={(e) => field.onChange(e.target.value || undefined)}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        /> */}
        {/* Due date */}
        <FormField
          control={form.control}
          name="dueDate"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Due Date</FormLabel>
              <FormControl>
                <DatePicker
                  name="dueDate"
                  field={field}
                  disableBefore={new Date(new Date().setHours(0, 0, 0, 0))}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="currency"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Currency</FormLabel>
              <FormControl>
                <select
                  {...field}
                  className="w-full rounded border px-3 py-2 bg-background text-foreground"
                >
                  {currencyOptions.map((c) => (
                    <option key={c.code} value={c.code}>
                      {c.label}
                    </option>
                  ))}
                </select>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" disabled={createExpenseMutation.isLoading}>
          Submit
        </Button>
      </form>
    </Form>
  );
};

export default ExpenseForm;
