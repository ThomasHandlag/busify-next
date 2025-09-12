import * as React from "react";
import { Check, ChevronsUpDown, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Badge } from "@/components/ui/badge";
import { BusOperator } from "@/lib/data/bus_operator";
import { cn } from "@/lib/utils";

interface OperatorMultiSelectProps {
  operators: BusOperator[];
  value: string[] | undefined;
  onChange: (value: string[]) => void;
}

export function OperatorMultiSelect({
  operators,
  value = [],
  onChange,
}: OperatorMultiSelectProps) {
  const [open, setOpen] = React.useState(false);

  const selectedOperators = operators.filter((operator) =>
    value?.includes(operator.id.toString())
  );

  const handleSelect = (operatorId: string) => {
    const currentValue = [...(value || [])];

    if (currentValue.includes(operatorId)) {
      onChange(currentValue.filter((id) => id !== operatorId));
    } else {
      onChange([...currentValue, operatorId]);
    }
  };

  const handleRemove = (operatorId: string) => {
    onChange((value || []).filter((id) => id !== operatorId));
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          aria-label="Select operators"
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={cn(
            "justify-between bg-green-50 w-full",
            !value?.length && "text-muted-foreground"
          )}
        >
          {selectedOperators.length > 0
            ? `${selectedOperators.length} operator${
                selectedOperators.length > 1 ? "s" : ""
              } selected`
            : "Select operators"}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full p-0">
        <Command>
          <CommandInput placeholder="Search operator..." />
          <CommandEmpty>No operator found.</CommandEmpty>
          <CommandGroup>
            {operators.map((operator) => (
              <CommandItem
                key={operator.id}
                value={operator.name}
                onSelect={() => handleSelect(operator.id.toString())}
              >
                <div className="flex items-center w-full">
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      value?.includes(operator.id.toString())
                        ? "opacity-100"
                        : "opacity-0"
                    )}
                  />
                  {operator.name}
                </div>
              </CommandItem>
            ))}
          </CommandGroup>
        </Command>
      </PopoverContent>
      {selectedOperators.length > 0 && (
        <div className="flex flex-wrap gap-1 mt-2">
          {selectedOperators.map((operator) => (
            <Badge key={operator.id} variant="secondary" className="mr-1 mb-1">
              {operator.name}
              <button
                type="button"
                className="ml-1 ring-offset-background rounded-full outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                onClick={() => handleRemove(operator.id.toString())}
              >
                <X className="h-3 w-3" />
                <span className="sr-only">Remove {operator.name}</span>
              </button>
            </Badge>
          ))}
        </div>
      )}
    </Popover>
  );
}
