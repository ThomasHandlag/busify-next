"use client";

import LocaleText from "@/components/custom/locale_text";

const ErrorPage = () => {
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100 w-full">
      <h1 className="text-4xl font-bold text-red-600">Error</h1>
      <p className="mt-4 text-lg text-gray-700">
        <LocaleText string="unexpected" name="Error" />
      </p>
      <p className="mt-2 text-sm text-gray-500">
        <LocaleText string="tryAgain" name="Error" />
      </p>
    </div>
  );
};

export default ErrorPage;
