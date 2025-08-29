import { Button } from "../ui/button";
import { Label } from "../ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Checkbox } from "../ui/checkbox";

import { useEffect, useState } from "react";
import { Calendar28 } from "./date_picker";
import { TripFilterQuery } from "@/lib/data/trip";
import { useForm } from "react-hook-form";
import { Form, FormField, FormItem, FormLabel } from "../ui/form";
import { Input } from "../ui/input";
import { Separator } from "../ui/separator";
import { Loader2 } from "lucide-react";
import { getAllBusModelsClient } from "@/lib/data/bus";
import { getAllLocationsClient } from "@/lib/data/location";
import { toast } from "sonner";

export type SearchFilterSidebarProps = {
  onApplyFilters: (filters: TripFilterQuery | undefined) => void;
  isLoading?: boolean;
};

type FormValues = {
  startLocation: undefined | number;
  endLocation: undefined | number;
  departureDate: Date | undefined;
  untilTime: Date | undefined;
  busModels: undefined | string[];
  amenities: undefined | string[];
  operatorName: undefined | string;
  availableSeats: number;
};

export type FilterLocationType = {
  locationId: number;
  locationName: string;
};

const SearchFilterSidebar = ({
  onApplyFilters,
  isLoading = false,
}: SearchFilterSidebarProps) => {
  const [busModels, setBusModels] = useState<string[] | undefined>([]);
  const [locations, setLocations] = useState<FilterLocationType[] | undefined>(
    []
  );

  const amenities: string[] = [
    "Wifi",
    "Máy lạnh",
    "Nước uống",
    "Đồ ăn nhẹ",
    "Ổ cắm sạc",
  ];

  const form = useForm<FormValues>({
    defaultValues: {
      startLocation: undefined,
      endLocation: undefined,
      departureDate: undefined,
      untilTime: undefined,
      busModels: [],
      amenities: [],
      operatorName: "",
      availableSeats: 1,
    },
  });

  const messageCallback = (message: string) => {
    toast.info(message);
  };

  useEffect(() => {
    const fetchData = async () => {
      const [fetchedBusModels, fetchedLocations] = await Promise.all([
        getAllBusModelsClient({
          callback: messageCallback,
          localeMessage: "Failed to fetch bus models",
        }),
        getAllLocationsClient({
          callback: messageCallback,
          localeMessage: "Failed to fetch locations",
        }),
      ]);

      setBusModels(fetchedBusModels);
      setLocations(fetchedLocations);
    };

    fetchData();
  }, []);

  const handleApplyFilters = (e: React.FormEvent) => {
    e.preventDefault();
    const formData = form.getValues();
    onApplyFilters({
      startLocation: formData.startLocation,
      endLocation: formData.endLocation,
      departureDate: formData.departureDate,
      untilTime: formData.untilTime,
      busModels: formData.busModels,
      amenities: formData.amenities,
      operatorName: formData.operatorName,
      timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      availableSeats: 1,
    });
  };

  return (
    <div className="space-y-6">
      <Form {...form}>
        <form onSubmit={handleApplyFilters} className="space-y-6">
          <FormField
            control={form.control}
            name="startLocation"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Start Location</FormLabel>
                <Select
                  value={field.value?.toString() || ""}
                  onValueChange={field.onChange}
                >
                  <SelectTrigger className="bg-gray-50">
                    <SelectValue placeholder="Select Location" />
                  </SelectTrigger>
                  <SelectContent>
                    {locations?.map((route: FilterLocationType) => (
                      <SelectItem
                        key={route.locationId}
                        value={route.locationId.toString()}
                      >
                        {route.locationName}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="endLocation"
            render={({ field }) => (
              <FormItem>
                <FormLabel>End Location</FormLabel>
                <Select
                  value={field.value?.toString() || ""}
                  onValueChange={field.onChange}
                >
                  <SelectTrigger className="bg-gray-50">
                    <SelectValue placeholder="Select Location" />
                  </SelectTrigger>
                  <SelectContent>
                    {locations?.map((route: FilterLocationType) => (
                      <SelectItem
                        key={route.locationId}
                        value={route.locationId.toString()}
                      >
                        {route.locationName}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FormItem>
            )}
          />

          <Separator />

          <FormField
            control={form.control}
            name="departureDate"
            render={({ field }) => (
              <FormItem>
                <FormLabel>From Date</FormLabel>
                <Calendar28
                  field={field}
                  picker={{
                    placeholder: "YYYY-MM-DD",
                    initialDate: new Date(),
                  }}
                />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="untilTime"
            render={({ field }) => (
              <FormItem>
                <FormLabel>To Date</FormLabel>
                <Calendar28
                  field={field}
                  picker={{
                    placeholder: "YYYY-MM-DD",
                    initialDate: new Date(),
                  }}
                />
              </FormItem>
            )}
          />

          <Separator />

          <FormField
            control={form.control}
            name="operatorName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Operator Name</FormLabel>
                <Input
                  placeholder="Enter operator name"
                  value={field.value || ""}
                  onChange={field.onChange}
                />
              </FormItem>
            )}
          />

          <Separator />

          <FormField
            control={form.control}
            name="busModels"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Bus Models</FormLabel>
                <div className="space-y-3">
                  {busModels?.map((model) => (
                    <div key={model} className="flex items-center space-x-3">
                      <Checkbox
                        id={`model-${model}`}
                        checked={field.value?.includes(model)}
                        onCheckedChange={(checked) => {
                          const currentValue = field.value || [];
                          if (checked) {
                            field.onChange([...currentValue, model]);
                          } else {
                            field.onChange(
                              currentValue.filter((m: string) => m !== model)
                            );
                          }
                        }}
                      />
                      <Label
                        htmlFor={`model-${model}`}
                        className="text-sm font-normal cursor-pointer"
                      >
                        {model}
                      </Label>
                    </div>
                  ))}
                </div>
              </FormItem>
            )}
          />

          <Separator />

          <FormField
            control={form.control}
            name="amenities"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Amenities</FormLabel>
                <div className="space-y-3">
                  {amenities.map((amenity) => (
                    <div key={amenity} className="flex items-center space-x-3">
                      <Checkbox
                        id={`amenity-${amenity}`}
                        checked={field.value?.includes(amenity)}
                        onCheckedChange={(checked) => {
                          const currentValue = field.value || [];
                          if (checked) {
                            field.onChange([...currentValue, amenity]);
                          } else {
                            field.onChange(
                              currentValue.filter((a: string) => a !== amenity)
                            );
                          }
                        }}
                      />
                      <Label
                        htmlFor={`amenity-${amenity}`}
                        className="text-sm font-normal cursor-pointer"
                      >
                        {amenity}
                      </Label>
                    </div>
                  ))}
                </div>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="availableSeats"
            render={({ field }) => (
              <FormItem>
                <Label htmlFor="availableSeats">Available Seats</Label>
                <Input
                  type="number"
                  value={field.value}
                  onChange={field.onChange}
                />
              </FormItem>
            )}
          />

          <Separator />

          {/* Action Buttons */}
          <div className="pt-4 space-y-3">
            <Button
              className="w-full bg-green-600 hover:bg-green-700"
              type="button"
              disabled={isLoading}
              onClick={() => {
                const formData = form.getValues();
                onApplyFilters({
                  ...formData,
                  timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
                });
              }}
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Searching...
                </>
              ) : (
                "Apply Filters"
              )}
            </Button>
            <Button
              variant="outline"
              className="w-full"
              type="button"
              disabled={isLoading}
              onClick={() => {
                form.reset({
                  startLocation: undefined,
                  endLocation: undefined,
                  departureDate: undefined,
                  untilTime: undefined,
                  operatorName: undefined,
                  busModels: [],
                  amenities: [],
                });
                onApplyFilters(undefined);
              }}
            >
              Clear All
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default SearchFilterSidebar;
