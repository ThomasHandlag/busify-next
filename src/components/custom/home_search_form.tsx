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
import { FilterX } from "lucide-react";

type HomeSearchFormValues = {
  departureDate?: Date | undefined;
  startLocation?: string | undefined;
  endLocation?: string | undefined;
  availableSeats?: number;
};

const schema = z
  .object({
    departureDate: z.date().optional(),
    startLocation: z.string().optional(),
    endLocation: z.string().optional(),
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
      startLocation: filter.query?.startLocation?.toString(),
      endLocation: filter.query?.endLocation?.toString(),
      availableSeats: filter.query?.availableSeats || 1,
    },
    resolver: zodResolver(schema),
  });

  const onSubmit: SubmitHandler<HomeSearchFormValues> = (data) => {
    filter.handleApplyFilters({
      departureDate: data.departureDate,
      startLocation: Number(data.startLocation),
      endLocation: Number(data.endLocation),
      availableSeats: data.availableSeats ?? 1,
      timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    });
    console.log("Form Data:", data);
    navigate.push("/trips");
  };

  return (
    <Form {...form}>
      <form
        className="grid grid-cols-2 justify-between gap-2"
        onSubmit={form.handleSubmit(onSubmit)}
      >
        <FormField
          control={form.control}
          name="startLocation"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Departure Location</FormLabel>
              <Select onValueChange={field.onChange} {...field}>
                <FormControl>
                  <SelectTrigger>
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
              <Select value={field.value} onValueChange={field.onChange}>
                <FormControl>
                  <SelectTrigger>
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
                field={field}
                picker={{
                  placeholder: "Select a date",
                  label: "Departure Date",
                  initialDate: new Date(),
                }}
              />
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
        <Button
          className="h-10 w-full bg-green-600 hover:bg-green-700 text-white px-6 rounded-md font-medium text-sm"
          disabled={filter.isLoading}
          onClick={() => form.handleSubmit(onSubmit)()}
        >
          TÌM CHUYẾN
        </Button>
        <Button variant={"outline"} onClick={() => form.reset()}>
          <FilterX />
        </Button>
      </form>
    </Form>
  );
};

export default HomeSearchForm;
