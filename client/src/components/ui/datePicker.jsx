import React from "react";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Controller } from "react-hook-form";

const DatePicker = ({ name, field ,disableBefore}) => {
  return (
    <div className="flex flex-col">
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className="w-[240px] justify-start text-left font-normal"
          >
            <CalendarIcon className="mr-2" />
            {field.value ? format(field.value, "PPP") : "Pick a date"}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            mode="single"
            selected={field.value instanceof Date ? field.value : undefined}
            onSelect={(date) => field.onChange(date)}
            initialFocus
            disabled={(date) =>
              disableBefore ? date < disableBefore : false
            }
          />
        </PopoverContent>
      </Popover>
    </div>
  );
};

export default DatePicker;
