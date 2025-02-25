import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils"; 

const MultiSelect = ({ options, value, onChange, placeholder = "Select options" }) => {
  const [open, setOpen] = useState(false);

  const handleSelect = (option, checked) => {
    if (checked) {
      onChange([...value, option]);
    } else {
      onChange(value.filter((item) => item !== option));
    }
  };

  const handleSelectAll = () => onChange([...options]);
  const handleClearAll = () => onChange([]);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={cn(
            "w-full justify-between text-sm font-normal",
            !value.length && "text-muted-foreground"
          )}
        >
          {value.length > 0
            ? `${value.length} option(s) selected`
            : placeholder}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full p-2">
        <div className="flex justify-between mb-2">
          <Button size="sm" variant="outline" onClick={handleClearAll}>
            Clear All
          </Button>
          <Button size="sm" variant="outline" onClick={handleSelectAll}>
            Select All
          </Button>
        </div>
        <div className="grid gap-2">
          {options.map((option) => (
            <div key={option} className="flex items-center gap-2">
              <Checkbox
                id={option}
                checked={value.includes(option)}
                onCheckedChange={(checked) =>
                  handleSelect(option, checked)
                }
              />
              <label
                htmlFor={option}
                className="text-sm font-medium leading-none"
              >
                {option}
              </label>
            </div>
          ))}
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default MultiSelect;
