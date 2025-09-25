"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useTripFilter } from "@/lib/contexts/TripFilterContext";
import { useTranslations } from "next-intl";
import { ArrowUpDown } from "lucide-react";

const sortSchema = z.object({
  sortBy: z.enum(["departureTime", "price"]),
  sortDirection: z.enum(["ASC", "DESC"]),
});

type SortFormValues = z.infer<typeof sortSchema>;

export default function TripSortControls() {
  const { query, handleApplyFilters } = useTripFilter();
  const t = useTranslations("Filter");

  const form = useForm<SortFormValues>({
    resolver: zodResolver(sortSchema),
    defaultValues: {
      sortBy: query?.sortBy ?? "departureTime",
      sortDirection: query?.sortDirection ?? "ASC",
    },
  });

  const onSubmit = (values: SortFormValues) => {
    const updatedQuery = {
      ...query,
      sortBy: values.sortBy,
      sortDirection: values.sortDirection,
      timeZone:
        query?.timeZone || Intl.DateTimeFormat().resolvedOptions().timeZone,
    };
    handleApplyFilters(updatedQuery);
  };

  return (
    <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4 p-3 sm:p-4 bg-gradient-to-r from-primary/5 to-primary/10 dark:from-primary/10 dark:to-primary/20 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200">
      <div className="flex items-center gap-2">
        <ArrowUpDown className="w-4 h-4 text-primary flex-shrink-0" />
        <span className="text-xs sm:text-sm font-medium text-primary">
          {t("sortBy")}
        </span>
      </div>

      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex flex-col sm:flex-row gap-3 sm:gap-3 w-full sm:w-auto"
        >
          <FormField
            control={form.control}
            name="sortBy"
            render={({ field }) => (
              <FormItem className="w-full sm:w-40">
                <Select
                  onValueChange={(value) => {
                    field.onChange(value);
                    form.handleSubmit(onSubmit)();
                  }}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger className="w-full bg-white dark:bg-gray-800 border-primary/20 hover:border-primary/40 focus:border-primary focus:ring-primary/20">
                      <SelectValue placeholder={t("sortBy")} />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="departureTime">
                      {t("departureTime")}
                    </SelectItem>
                    <SelectItem value="price">{t("price")}</SelectItem>
                  </SelectContent>
                </Select>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="sortDirection"
            render={({ field }) => (
              <FormItem className="w-full sm:w-32">
                <Select
                  onValueChange={(value) => {
                    field.onChange(value);
                    form.handleSubmit(onSubmit)();
                  }}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger className="w-full bg-white dark:bg-gray-800 border-primary/20 hover:border-primary/40 focus:border-primary focus:ring-primary/20">
                      <SelectValue placeholder={t("sortDirection")} />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="ASC">{t("ascending")}</SelectItem>
                    <SelectItem value="DESC">{t("descending")}</SelectItem>
                  </SelectContent>
                </Select>
              </FormItem>
            )}
          />
        </form>
      </Form>
    </div>
  );
}
