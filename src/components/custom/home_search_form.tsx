"use client";

import { SubmitHandler, useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { useTripFilter } from "@/lib/contexts/TripFilterContext";
import { useRouter } from "next/navigation";
import {
  Select,
  SelectContent,
  SelectTrigger,
  SelectValue,
  SelectItem,
  SelectGroup,
  SelectLabel,
} from "../ui/select";
import { Button } from "../ui/button";
import { Calendar28 } from "./date_picker";
import { FilterLocationType } from "./search_filter_sidebar";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "../ui/input";
import { Separator } from "@radix-ui/react-select";

type HomeSearchFormValues = {
  departureDate?: Date | undefined;
  untilTime?: Date | undefined;
  startLocation?: number | undefined;
  endLocation?: number | undefined;
  availableSeats?: number;
};

const schema = z
  .object({
    departureDate: z.date().optional(),
    startLocation: z.number().min(1).optional(),
    endLocation: z.number().min(1).optional(),
    availableSeats: z
      .number()
      .min(0, { message: "Invalid number of seats" })
      .optional(),
  })
  .refine((schema) => {
    return !(
      (schema.startLocation === undefined &&
        schema.endLocation === undefined) ||
      (schema.endLocation !== undefined && schema.startLocation !== undefined)
    );
  }, "Start and end location must be different");

const HomeSearchForm = ({ locations }: { locations: FilterLocationType[] }) => {
  const filter = useTripFilter();
  const navigate = useRouter();

  const form = useForm<HomeSearchFormValues>({
    defaultValues: {
      departureDate: filter.query?.departureDate,
      untilTime: filter.query?.untilTime,
      startLocation: filter.query?.startLocation,
      endLocation: filter.query?.endLocation,
      availableSeats: filter.query?.availableSeats || 1,
    },
    resolver: zodResolver(schema),
  });

  const onSubmit: SubmitHandler<HomeSearchFormValues> = async (data) => {
    filter.handleApplyFilters({
      departureDate: data.departureDate,
      startLocation: data.startLocation,
      endLocation: data.endLocation,
      availableSeats: data.availableSeats ?? 1,
      timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    });
    console.log("Form Data:", data);
    navigate.push("/trips");
  };

  return (
    <Form {...form}>
      <form
        className="grid grid-cols-2 justify-center items-center gap-2 "
        onSubmit={form.handleSubmit(onSubmit)}
      >
        <FormField
          control={form.control}
          name="startLocation"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Departure Location</FormLabel>
              <Select
                onValueChange={(e) => field.onChange(Number(e))}
                value={field.value?.toString()}
              >
                <FormControl>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select a location" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Start Location</SelectLabel>
                    {locations.map((loc) => (
                      <SelectItem
                        key={loc.locationId}
                        value={loc.locationId.toString()}
                      >
                        {loc.locationName}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="endLocation"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Arrival Location</FormLabel>
              <Select
                value={field.value?.toString()}
                onValueChange={(e) => field.onChange(Number(e))}
              >
                <FormControl>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select a location" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>End Location</SelectLabel>
                    {locations.map((loc) => (
                      <SelectItem
                        key={loc.locationId}
                        value={loc.locationId.toString()}
                      >
                        {loc.locationName}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          name="departureDate"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <Calendar28
                picker={{
                  placeholder: "Select a date",
                  label: "From Date",
                  initialDate: field.value,
                  onDateChange: (date) => field.onChange(date),
                }}
              />
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          name="untilTime"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <Calendar28
                picker={{
                  placeholder: "Select a date",
                  label: "Until Date",
                  initialDate: field.value,
                  onDateChange: (date) => field.onChange(date),
                }}
              />
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="availableSeats"
          render={({ field }) => (
            <FormItem>
              <FormLabel htmlFor="availableSeats">Available Seats</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  max={40}
                  min={0}
                  value={field.value}
                  onChange={field.onChange}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Separator />
        <div className="grid grid-cols-3 w-full gap-2">
          <Button
            type="submit"
            className="h-10 col-span-2 bg-green-600 hover:bg-green-700 text-white px-6 rounded-md font-medium text-sm"
            disabled={filter.isLoading}
            onClick={() => form.handleSubmit(onSubmit)()}
          >
            TÌM CHUYẾN
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default HomeSearchForm;
