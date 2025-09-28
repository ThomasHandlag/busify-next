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
import { useTranslations } from "next-intl";
import { useTheme } from "next-themes";
import { useForm } from "react-hook-form";

type PreferencesFormValues = {
  language: Language;
  theme: Theme;
};

const PreferencesForm = ({noLabel} : {noLabel?: boolean}) => {
  const pref = usePreferences();
  const themes = useTheme();

  const form = useForm<PreferencesFormValues>({
    defaultValues: {
      language: pref.language || "en",
      theme: themes.theme as Theme || "system",
    },
  });

  const t = useTranslations("Profile");

  return (
    <Form {...form}>
      <div className="flex flex-col lg:flex-row gap-2">
        <FormField
          name="language"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              {!noLabel && <FormLabel>{t("language")}</FormLabel>}
              <Select
                {...field}
                onValueChange={(value: Language) => {
                  form.setValue("language", value);
                  if (pref.setLanguage) {
                    pref.setLanguage(value);
                  }
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder={t("selectLanguage")} />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>{t("language")}</SelectLabel>
                    <SelectItem value="en">{t("english")}</SelectItem>
                    <SelectItem value="vi">{t("vietnamese")}</SelectItem>
                    <SelectItem value="ko">{t("korean")}</SelectItem>
                    <SelectItem value="jp">{t("japanese")}</SelectItem>
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
              {!noLabel && <FormLabel>{t("theme")}</FormLabel>}
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
                <SelectTrigger>
                  <SelectValue placeholder={t("selectTheme")} />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>{t("theme")}</SelectLabel>
                    <SelectItem value="light">{t("light")}</SelectItem>
                    <SelectItem value="dark">{t("dark")}</SelectItem>
                    <SelectItem value="system">{t("system")}</SelectItem>
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
