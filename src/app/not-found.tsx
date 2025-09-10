import LocaleText from "@/components/custom/locale_text";
import Link from "next/link";

const NotFound = () => {
  return (
    <div className="flex flex-col items-center justify-center w-full h-screen">
      <h1 className="text-4xl font-bold mb-4">
        404 - <LocaleText string="pageNotFound" name="Error" />
      </h1>
      <p className="text-lg mb-8">
        <LocaleText string="noPermission" name="Error" />
      </p>
      <Link
        aria-label="Go back to Home"
        href="/"
        className="text-blue-500 hover:underline"
      >
        <LocaleText string="goBackHome" name="Error" />
      </Link>
    </div>
  );
};

export default NotFound;
