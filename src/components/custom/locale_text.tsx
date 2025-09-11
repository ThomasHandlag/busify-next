"use client";
import { useTranslations } from "next-intl";

const LocaleText = ({ string, name }: { string: string; name: string }) => {
  const t = useTranslations(name);
  return <>{t(string)}</>;
};

export default LocaleText;
