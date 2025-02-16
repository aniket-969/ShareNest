import { useState } from "react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { cn } from "@/lib/utils";
import { ScrollArea } from "@/components/ui/scroll-area";

export function MultiSelect({ value = [], onChange, options }) {
  const [open, setOpen] = useState(false);

  const toggleSelection = (option) => {
    const newSelection = value.includes(option)
      ? value.filter((d) => d !== option)
      : [...value, option];
    onChange(newSelection);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline" className="w-full text-sm font-normal">
          {value.length
            ? value.length === options.length
              ? "All Days"
              : value.map((option) => option.slice(0, 3)).join(", ")
            : "Select Repetition Days"}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-56 p-2">
        {options.map((option) => (
          <div key={option} className="flex items-center gap-2 py-1">
            <Checkbox
              checked={value.includes(option)}
              onCheckedChange={() => toggleSelection(option)}
            />
            <span className="text-sm">{option}</span>
          </div>
        ))}
      </PopoverContent>
    </Popover>
  );
}
