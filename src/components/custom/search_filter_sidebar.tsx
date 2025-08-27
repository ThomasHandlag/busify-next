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
import { BusifyRouteDetail, getAllRoutesClient } from "@/lib/data/route_api";
import { TripFilterQuery } from "@/lib/data/trip";
import { useForm } from "react-hook-form";
import { Form, FormField, FormItem, FormLabel } from "../ui/form";
import { Input } from "../ui/input";
import { Separator } from "../ui/separator";
import { Loader2 } from "lucide-react";
import { getAllBusModelsClient } from "@/lib/data/bus";
import { Location } from "@/lib/data/location";

type SearchFilterSidebarProps = {
  onApplyFilters: (filters: TripFilterQuery | null) => void;
  isLoading?: boolean;
};

type FormValues = {
  routeId: null | string;
  departureDate: Date | undefined;
  untilTime: Date | undefined;
  busModels: undefined | string[];
  amenities: undefined | string[];
  operatorName: undefined | string;
  availableSeats: number;
};

const SearchFilterSidebar = ({
  onApplyFilters,
  isLoading = false,
}: SearchFilterSidebarProps) => {
  const [routes, setRoutes] = useState<BusifyRouteDetail[]>([]);
  const [busModels, setBusModels] = useState<string[]>([]);
  const [locations, setLocations] = useState<Location[]>([]);

  const amenities: string[] = [
    "Wifi",
    "Máy lạnh",
    "Nước uống",
    "Đồ ăn nhẹ",
    "Ổ cắm sạc",
  ];

  const form = useForm<FormValues>({
    defaultValues: {
      routeId: null,
      departureDate: undefined,
      untilTime: undefined,
      busModels: [],
      amenities: [],
      operatorName: "",
      availableSeats: 1,
    },
  });

  useEffect(() => {
    const fetchData = async () => {
      const [fetchedRoutes, fetchedBusModels] = await Promise.all([
        getAllRoutesClient(),
        getAllBusModelsClient(),
      ]);

      setRoutes(fetchedRoutes);
      setBusModels(fetchedBusModels);
    };

    fetchData();
  }, []);

  const handleApplyFilters = (e: React.FormEvent) => {
    e.preventDefault();
    const formData = form.getValues();
    onApplyFilters({
      routeId: formData.routeId,
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
            name="routeId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Start Location</FormLabel>
                <Select
                  value={field.value || ""}
                  onValueChange={field.onChange}
                >
                  <SelectTrigger className="bg-gray-50">
                    <SelectValue placeholder="Select Location" />
                  </SelectTrigger>
                  <SelectContent>
                    {routes?.map((route: BusifyRouteDetail) => (
                      <SelectItem key={route.id} value={route.id.toString()}>
                        {route.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="routeId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>End Location</FormLabel>
                <Select
                  value={field.value || ""}
                  onValueChange={field.onChange}
                >
                  <SelectTrigger className="bg-gray-50">
                    <SelectValue placeholder="Select Location" />
                  </SelectTrigger>
                  <SelectContent>
                    {routes?.map((route: BusifyRouteDetail) => (
                      <SelectItem key={route.id} value={route.id.toString()}>
                        {route.name}
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
                  {busModels.map((model) => (
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
                  routeId: undefined,
                  departureDate: undefined,
                  untilTime: undefined,
                  operatorName: undefined,
                  busModels: [],
                  amenities: [],
                });
                onApplyFilters(null);
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
