"use client";

import { useForm } from "react-hook-form";
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
import { Combobox } from "../ui/combobox";
import { Button } from "../ui/button";
import { Calendar28 } from "./date_picker";
import { FilterLocationType } from "./search_filter_sidebar";
import { useTranslations } from "next-intl";
import { Search } from "lucide-react";

type HomeSearchFormValues = {
  departureDate?: Date | undefined;
  untilTime?: Date | undefined;
  startLocation?: number | undefined;
  endLocation?: number | undefined;
  availableSeats?: number;
};

const HomeSearchForm = ({ locations }: { locations: FilterLocationType[] }) => {
  const t = useTranslations();
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
  });

  const onSubmit = async () => {
    const allValues = form.getValues();
    filter.handleApplyFilters({
      departureDate: allValues.departureDate,
      startLocation: allValues.startLocation,
      endLocation: allValues.endLocation,
      availableSeats: allValues.availableSeats ?? 1,
      timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    });
    console.log("Form Data:", allValues);
    navigate.push("/trips");
  };

  return (
    <Form {...form}>
      <form
        className="flex lg:flex-row flex-col justify-center items-center gap-2"
        onSubmit={form.handleSubmit(onSubmit)}
      >
        <FormField
          control={form.control}
          name="startLocation"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t("Home.from")}</FormLabel>
              <FormControl>
                <Combobox
                  options={locations.map((loc) => ({
                    value: loc.locationId.toString(),
                    label: loc.locationName,
                  }))}
                  value={field.value?.toString()}
                  onValueChange={(value) =>
                    field.onChange(value ? Number(value) : undefined)
                  }
                  placeholder={t("Home.from")}
                  searchPlaceholder={t("Home.searchLocations")}
                  emptyMessage={t("Home.noLocationsFound")}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="endLocation"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t("Home.to")}</FormLabel>
              <FormControl>
                <Combobox
                  options={locations.map((loc) => ({
                    value: loc.locationId.toString(),
                    label: loc.locationName,
                  }))}
                  value={field.value?.toString()}
                  onValueChange={(value) =>
                    field.onChange(value ? Number(value) : undefined)
                  }
                  placeholder={t("Home.to")}
                  searchPlaceholder={t("Home.searchLocations")}
                  emptyMessage={t("Home.noLocationsFound")}
                />
              </FormControl>
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
                  placeholder: t("Home.departDate"),
                  label: t("Home.departDate"),
                  initialDate: field.value,
                  onDateChange: (date) => field.onChange(date),
                }}
              />
              <FormMessage />
            </FormItem>
          )}
        />
        <FormItem className="mt-6">
          <Button
            aria-label="Search"
            type="submit"
            className="col-span-1 bg-green-600 hover:bg-green-700 text-white px-6 rounded-md font-medium text-sm"
            disabled={filter.isLoading}
          >
            <Search className="w-4 h-4 mr-2" />
          </Button>
        </FormItem>
      </form>
    </Form>
  );
};

export default HomeSearchForm;
