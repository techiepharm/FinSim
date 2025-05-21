
import * as React from "react";
import { format } from "date-fns";
import { CalendarDays } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

interface DatePickerProps {
  date: Date | undefined;
  onDateChange: (date: Date | undefined) => void;
  label?: string;
  placeholder?: string;
  className?: string;
}

export function DatePicker({ date, onDateChange, label, placeholder = "Pick a date", className }: DatePickerProps) {
  return (
    <div className={cn("grid gap-2", className)}>
      {label && <label className="text-sm font-medium">{label}</label>}
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant={"outline"}
            className={cn(
              "w-full justify-start text-left font-normal",
              !date && "text-muted-foreground"
            )}
          >
            <CalendarDays className="mr-2 h-4 w-4" />
            {date ? format(date, "PPP") : <span>{placeholder}</span>}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0">
          <Calendar
            mode="single"
            selected={date}
            onSelect={onDateChange}
            initialFocus
          />
        </PopoverContent>
      </Popover>
    </div>
  );
}

export default DatePicker;
