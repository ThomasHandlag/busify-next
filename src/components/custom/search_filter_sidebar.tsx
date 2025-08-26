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
};

const SearchFilterSidebar = ({
  onApplyFilters,
  isLoading = false,
}: SearchFilterSidebarProps) => {
  const [routes, setRoutes] = useState<BusifyRouteDetail[]>([]);
  const [busModels, setBusModels] = useState<string[]>([]);

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
    });
  };

  return (
    <div className="space-y-6">
      <Form {...form}>
        <form onSubmit={handleApplyFilters} className="space-y-6">
          {/* Route Selection */}
          <div>
            <h3 className="font-semibold text-gray-900 mb-3">Route</h3>
            <FormField
              control={form.control}
              name="routeId"
              render={({ field }) => (
                <FormItem>
                  <Select
                    value={field.value || ""}
                    onValueChange={field.onChange}
                  >
                    <SelectTrigger className="bg-gray-50">
                      <SelectValue placeholder="Select Route" />
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
          </div>

          <Separator />

          {/* Date & Time */}
          <div>
            <h3 className="font-semibold text-gray-900 mb-3">Date & Time</h3>
            <div className="space-y-4">
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
            </div>
            <div className="space-y-4">
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
            </div>
          </div>

          <Separator />

          {/* Bus Operators */}
          <div>
            <h3 className="font-semibold text-gray-900 mb-3">Bus Operators</h3>
            <FormField
              control={form.control}
              name="operatorName"
              render={({ field }) => (
                <FormItem>
                  <Input
                    placeholder="Enter operator name"
                    value={field.value || ""}
                    onChange={field.onChange}
                  />
                </FormItem>
              )}
            />
          </div>

          <Separator />

          {/* Bus Models */}
          <div>
            <h3 className="font-semibold text-gray-900 mb-3">Bus Type</h3>
            <FormField
              control={form.control}
              name="busModels"
              render={({ field }) => (
                <FormItem>
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
          </div>

          <Separator />

          {/* Amenities */}
          <div>
            <h3 className="font-semibold text-gray-900 mb-3">Amenities</h3>
            <FormField
              control={form.control}
              name="amenities"
              render={({ field }) => (
                <FormItem>
                  <div className="space-y-3">
                    {amenities.map((amenity) => (
                      <div
                        key={amenity}
                        className="flex items-center space-x-3"
                      >
                        <Checkbox
                          id={`amenity-${amenity}`}
                          checked={field.value?.includes(amenity)}
                          onCheckedChange={(checked) => {
                            const currentValue = field.value || [];
                            if (checked) {
                              field.onChange([...currentValue, amenity]);
                            } else {
                              field.onChange(
                                currentValue.filter(
                                  (a: string) => a !== amenity
                                )
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
          </div>

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
