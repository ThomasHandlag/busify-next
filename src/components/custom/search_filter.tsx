import { Search, Filter, Loader2 } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "../ui/sheet";
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
import { getAllBusOperators, BusOperator } from "@/lib/data/bus_operator";
import { TripFilterQuery } from "@/lib/data/trip";
import { useForm } from "react-hook-form";
import { Form, FormField, FormItem, FormLabel } from "../ui/form";
import { Input } from "../ui/input";

import { OperatorMultiSelect } from "./bus_operator/operator_multi_select";

type SearchFilterProps = {
  onApplyFilters: (filters: TripFilterQuery | null) => void;
  isLoading?: boolean;
};

const SearchFilter = ({
  onApplyFilters,
  isLoading = false,
}: SearchFilterProps) => {
  const [windowWidth, setWindowWidth] = useState(768);
  const [mounted, setMounted] = useState(false);

  const [operators, setOperators] = useState<BusOperator[]>([]);
  const [routes, setRoutes] = useState<BusifyRouteDetail[]>([]);
  const busModels: string[] = ["limousine", "Giường nằm", "Ghế ngồi"];

  const amenities: string[] = [
    "Wifi",
    "Máy lạnh",
    "Nước uống",
    "Đồ ăn nhẹ",
    "Ổ cắm sạc",
  ];

  const form = useForm<TripFilterQuery>({
    defaultValues: {
      routeId: undefined,
      departureDate: undefined,
      untilTime: undefined,
      availableSeats: undefined,
      busOperatorIds: [],
      busModel: [],
      amenities: [],
    },
  });

  useEffect(() => {
    setMounted(true);
    const handleResize = () => setWindowWidth(window.innerWidth);
    if (typeof window !== "undefined") {
      setWindowWidth(window.innerWidth);
      window.addEventListener("resize", handleResize);
    }

    return () => {
      if (typeof window !== "undefined") {
        window.removeEventListener("resize", handleResize);
      }
    };
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      const [fetchedOperators, fetchedRoutes] = await Promise.all([
        getAllBusOperators(),
        getAllRoutesClient(),
      ]);

      setOperators(fetchedOperators);
      setRoutes(fetchedRoutes);
    };

    fetchData();
  }, []);

  const onSubmit = (data: TripFilterQuery) => {
    onApplyFilters(data);
  };

  const handleApplyFilters = () => {
    const formData = form.getValues();
    onApplyFilters(formData);
  };

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="ghost">
          <Filter className="w-5 h-5 mr-2" />
          Filter
        </Button>
      </SheetTrigger>
      <SheetContent
        // Only compute side after mount to avoid server/client mismatch
        side={mounted ? (windowWidth < 640 ? "bottom" : "right") : "right"}
        className="overflow-y-auto p-4 h-full rounded"
      >
        <SheetHeader>
          <SheetTitle className="flex items-center">
            <Search className="w-5 h-5 mr-2" />
            Search & Filter
          </SheetTitle>
          <SheetDescription>
            Find the perfect bus trip by filtering routes, operators, and
            preferences.
          </SheetDescription>
        </SheetHeader>
        <div className="h-[80vh] overflow-y-scroll">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="routeId"
                render={({ field }) => (
                  <FormItem className="mb-4">
                    <FormLabel>Route</FormLabel>
                    <Select
                      value={field.value || ""}
                      onValueChange={field.onChange}
                    >
                      <SelectTrigger className="bg-green-50">
                        <SelectValue placeholder="Select Route" />
                      </SelectTrigger>
                      <SelectContent>
                        {routes?.map((route: BusifyRouteDetail) => (
                          <SelectItem
                            key={route.id}
                            value={route.id.toString()}
                          >
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
                name="busOperatorIds"
                render={({ field }) => (
                  <FormItem className="mb-4">
                    <FormLabel>Bus Operator</FormLabel>
                    <OperatorMultiSelect
                      operators={operators}
                      value={field.value}
                      onChange={field.onChange}
                    />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="busModel"
                render={({ field }) => (
                  <FormItem className="mb-4">
                    <FormLabel>Bus Model</FormLabel>
                    <div className="space-y-2">
                      {busModels.map((model) => (
                        <div
                          key={model}
                          className="flex items-center space-x-2"
                        >
                          <Checkbox
                            id={`model-${model}`}
                            checked={field.value?.includes(model)}
                            onCheckedChange={(checked) => {
                              const currentValue = field.value || [];
                              if (checked) {
                                field.onChange([...currentValue, model]);
                              } else {
                                field.onChange(
                                  currentValue.filter(
                                    (m: string) => m !== model
                                  )
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
              <FormField
                control={form.control}
                name="amenities"
                render={({ field }) => (
                  <FormItem className="mb-4">
                    <FormLabel>Amenities</FormLabel>
                    <div className="space-y-2">
                      {amenities.map((amenity) => (
                        <div
                          key={amenity}
                          className="flex items-center space-x-2"
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
              <FormField
                control={form.control}
                name="departureDate"
                render={({ field }) => (
                  <FormItem className="mb-4">
                    <FormLabel>Departure Date</FormLabel>
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
                  <FormItem className="mb-4">
                    <FormLabel>Until Time</FormLabel>
                    <Input
                      type="time"
                      {...field}
                      value={field.value || ""}
                      className="bg-background"
                      placeholder="HH:MM"
                    />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="availableSeats"
                render={({ field }) => (
                  <FormItem className="mb-4">
                    <FormLabel>Available Seats</FormLabel>
                    <Input
                      type="number"
                      {...field}
                      value={field.value || ""}
                      className="bg-background"
                      placeholder="Number of seats"
                    />
                  </FormItem>
                )}
              />
            </form>
          </Form>
        </div>
        <SheetFooter className="gap-2">
          <Button
            variant="outline"
            className="flex-1"
            type="button"
            onClick={() => {
              form.reset({
                routeId: undefined,
                departureDate: undefined,
                untilTime: undefined,
                availableSeats: undefined,
                busOperatorIds: [],
                busModel: [],
                amenities: [],
              });
              onApplyFilters(null);
            }}
          >
            Clear All
          </Button>
          <Button
            className="flex-1 bg-green-600 hover:bg-green-700"
            type="button"
            disabled={isLoading}
            onClick={handleApplyFilters}
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
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
};

export default SearchFilter;
