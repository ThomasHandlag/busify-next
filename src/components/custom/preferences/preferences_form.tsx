"use client";

import { Form, FormField, FormItem, FormLabel } from "@/components/ui/form";
import {
  Select,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectLabel,
} from "@/components/ui/select";
import {
  Language,
  Theme,
  usePreferences,
} from "@/lib/contexts/PreferenceContext";
import { useTheme } from "next-themes";
import { useForm } from "react-hook-form";

type PreferencesFormValues = {
  language: Language;
  theme: Theme;
};

const PreferencesForm = () => {
  const pref = usePreferences();
  const themes = useTheme();

  const form = useForm<PreferencesFormValues>({
    defaultValues: {
      language: pref.language || "en",
      theme: pref.theme || "light",
    },
  });

  return (
    <Form {...form}>
      <div className="flex flex-col lg:flex-row gap-2">
        <FormField
          name="language"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Language</FormLabel>
              <Select
                {...field}
                onValueChange={(value: Language) => {
                  form.setValue("language", value);
                  if (pref.setLanguage) {
                    pref.setLanguage(value);
                  }
                }}
              >
                <SelectTrigger className="w-[150px]">
                  <SelectValue placeholder="Select a language" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Language</SelectLabel>
                    <SelectItem value="en">English</SelectItem>
                    <SelectItem value="vi">Vietnamese</SelectItem>
                    <SelectItem value="ko">Korean</SelectItem>
                    <SelectItem value="jp">Japanese</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </FormItem>
          )}
        />
        <FormField
          name="theme"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Theme</FormLabel>
              <Select
                {...field}
                onValueChange={(value: Theme) => {
                  themes.setTheme(value);
                  form.setValue("theme", value);
                  if (pref.setTheme) {
                    pref.setTheme(value);
                  }
                }}
              >
                <SelectTrigger className="w-[150px]">
                  <SelectValue placeholder="Select a theme" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Theme</SelectLabel>
                    <SelectItem value="light">Light</SelectItem>
                    <SelectItem value="dark">Dark</SelectItem>
                    <SelectItem value="system">System</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </FormItem>
          )}
        />
      </div>
    </Form>
  );
};

export default PreferencesForm;
