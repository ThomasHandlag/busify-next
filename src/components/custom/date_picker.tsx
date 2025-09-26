"use client";

import * as React from "react";
import { CalendarIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
interface DatePickerProps {
  onDateChange?: (date: Date | undefined) => void;
  onDateSelect?: (date: Date | undefined) => void;
  onCalendarOpen?: () => void;
  onCalendarClose?: () => void;
  label?: string;
  placeholder?: string;
  initialDate?: Date;
}

function formatDate(date: Date | undefined) {
  if (!date) {
    return "";
  }

  return date.toLocaleDateString("en-US", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
}

function isValidDate(date: Date | undefined) {
  if (!date) {
    return false;
  }
  return !isNaN(date.getTime());
}

const Calendar28 = ({
  picker,
}: {
  picker?: DatePickerProps;
}) => {
  const [open, setOpen] = React.useState(false);
  const [month, setMonth] = React.useState<Date | undefined>(
    picker?.initialDate
  );

  React.useEffect(() => {
    if (picker?.initialDate) {
      setMonth(picker.initialDate);
    }
  }, [picker?.initialDate]);

  // Handle opening/closing calendar with events
  const handleOpenChange = (isOpen: boolean) => {
    setOpen(isOpen);
    if (isOpen) {
      picker?.onCalendarOpen?.();
    } else {
      picker?.onCalendarClose?.();
    }
  };

  // Handle input change with validation and events
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;
    const parsedDate = new Date(inputValue);
    if (isValidDate(parsedDate)) {
      setMonth(parsedDate);
      picker?.onDateChange?.(parsedDate);
    }
  };

  return (
    <div className="flex flex-col gap-3 w-full min-w-[150px]">
      <Label htmlFor="date" className="px-1">
        {picker?.label}
      </Label>
      <div className="relative flex gap-2">
        <Input
          id="date"
          value={formatDate(picker?.initialDate)}
          placeholder={picker?.placeholder}
          className="bg-background"
          onChange={handleInputChange}
          onKeyDown={(e) => {
            if (e.key === "ArrowDown") {
              e.preventDefault();
              handleOpenChange(true);
            }
            if (e.key === "Escape") {
              e.preventDefault();
              handleOpenChange(false);
            }
          }}
          onFocus={() => {
            // Optional: Open calendar on focus
            // handleOpenChange(true);
          }}
        />
        <Popover open={open} onOpenChange={handleOpenChange}>
          <PopoverTrigger asChild>
            <Button
              aria-label="Open date picker"
              id="date-picker"
              variant="ghost"
              className="absolute top-1/2 right-2 size-6 -translate-y-1/2"
            >
              <CalendarIcon className="size-3.5" />
              <span className="sr-only">Select date</span>
            </Button>
          </PopoverTrigger>
          <PopoverContent
            className="w-auto overflow-hidden p-0"
            align="end"
            alignOffset={-8}
            sideOffset={10}
          >
            <Calendar
              mode="single"
              selected={picker?.initialDate}
              captionLayout="dropdown"
              month={month}
              onMonthChange={setMonth}
              onSelect={(date) => {
                setOpen(false);
                picker?.onDateChange?.(date);
              }}
            />
          </PopoverContent>
        </Popover>
      </div>
    </div>
  );
};
export { Calendar28 };
