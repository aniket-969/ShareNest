import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { createTaskSchemaWithRules } from "@/schema/taskSchema";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import MultiSelect from "@/components/ui/multiSelect";
import ParticipantSelector from "@/components/Tasks/ParticipantsSelector";
import DatePicker from "@/components/ui/datePicker";
import { useTask } from "@/hooks/useTask";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";

const WEEKDAYS = [
  { label: "Sunday", value: 0 },
  { label: "Monday", value: 1 },
  { label: "Tuesday", value: 2 },
  { label: "Wednesday", value: 3 },
  { label: "Thursday", value: 4 },
  { label: "Friday", value: 5 },
  { label: "Saturday", value: 6 },
];

const ORDINALS = ["first", "second", "third", "fourth", "last"];

const RecurringTaskForm = ({ participants }) => {
  const { roomId } = useParams();
  const { createTaskMutation } = useTask(roomId);

  const form = useForm({
    resolver: zodResolver(createTaskSchemaWithRules),
    defaultValues: {
      title: "",
      description: "",
      assignmentMode: "rotation",
      participants: [],
      recurrence: {
        enabled:true,
        frequency: "daily",
        interval: 1,
        startDate: undefined,
        selector: { type: "none" },
      },
    },
  });
 console.log("Form Errors:", form.formState.errors);
  const frequency = form.watch("recurrence.frequency");
  const selectorType = form.watch("recurrence.selector.type");

  const onSubmit = async (values) => {
    const payload = {
      ...values,
      recurrence: {
        ...values.recurrence,
        enabled: true,
      },
    };
console.log(payload)
return
    try {
      await createTaskMutation.mutateAsync(payload);
      toast.success("Task created");
      form.reset();
    } catch (err) {
      toast.error("Failed to create task");
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 px-2">
        {/* Title */}
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Title</FormLabel>
              <FormControl>
                <Input {...field} placeholder="Task title" />
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
                <Textarea {...field} placeholder="Task description" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Frequency */}
       <FormField
  control={form.control}
  name="recurrence.frequency"
  render={({ field }) => (
    <FormItem>
      <FormLabel>Frequency</FormLabel>
      <FormControl>
        <Select
          value={field.value}
          onValueChange={(value) => {
            field.onChange(value);

            // IMPORTANT: selector must match frequency
            if (value === "daily") {
              form.setValue("recurrence.selector", { type: "none" });
            }

            if (value === "weekly") {
              form.setValue("recurrence.selector", {
                type: "weekdays",
                days: [],
              });
            }

            if (value === "monthly") {
              form.setValue("recurrence.selector", {
                type: "monthDay",
              });
            }
          }}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select frequency" />
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


        {/* Interval */}
        <FormField
          control={form.control}
          name="recurrence.interval"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Repeat every</FormLabel>
              <FormControl>
                <Input type="number" min={1} {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Weekly selector */}
        {frequency === "weekly" && (
          <FormField
            control={form.control}
            name="recurrence.selector.days"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Days of week</FormLabel>
                <FormControl>
                  <MultiSelect
                    options={WEEKDAYS.map((d) => d.label)}
                    value={WEEKDAYS.filter((d) =>
                      field.value?.includes(d.value)
                    ).map((d) => d.label)}
                    onChange={(labels) =>
                      field.onChange(
                        labels.map(
                          (l) => WEEKDAYS.find((d) => d.label === l).value
                        )
                      )
                    }
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        )}

        {/* Monthly selector */}
        {frequency === "monthly" && (
          <>
            <FormField
              control={form.control}
              name="recurrence.selector.type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Monthly pattern</FormLabel>
                  <FormControl>
                    <Select {...field}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select pattern" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="monthDay">Day of month</SelectItem>
                        <SelectItem value="ordinalWeekday">
                          Ordinal weekday
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {selectorType === "monthDay" && (
              <FormField
                control={form.control}
                name="recurrence.selector.day"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Day</FormLabel>
                    <FormControl>
                      <Input type="number" min={1} max={31} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            {selectorType === "ordinalWeekday" && (
              <>
                <FormField
                  control={form.control}
                  name="recurrence.selector.ordinal"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Ordinal</FormLabel>
                      <FormControl>
                        <Select {...field}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {ORDINALS.map((o) => (
                              <SelectItem key={o} value={o}>
                                {o}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </FormControl>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="recurrence.selector.weekday"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Weekday</FormLabel>
                      <FormControl>
                        <Select
                          value={String(field.value)}
                          onValueChange={(v) => field.onChange(Number(v))}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {WEEKDAYS.map((d) => (
                              <SelectItem
                                key={d.value}
                                value={String(d.value)}
                              >
                                {d.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </FormControl>
                    </FormItem>
                  )}
                />
              </>
            )}
          </>
        )}

        {/* Participants */}
        <FormField
          control={form.control}
          name="participants"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Participants</FormLabel>
              <ParticipantSelector
                participants={participants}
                onChange={field.onChange}
                selectionTransform={(p) => p._id}
              />
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Start date */}
        <FormField
          control={form.control}
          name="recurrence.startDate"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Start date</FormLabel>
              <FormControl>
                <DatePicker field={field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-end gap-3">
          <Button type="submit" disabled={createTaskMutation.isLoading}>
            Create Task
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default RecurringTaskForm;
