import LocaleText from "@/components/custom/locale_text";
import Link from "next/link";

const Forbidden = () => {
    return (
        <div className="">
            <h1 className="text-4xl font-bold mb-4">403 - Forbidden</h1>
            <p className="text-lg mb-8">
                <LocaleText string="forbiddenDesc" name="Error" />
            </p>
            <Link aria-label="Go back to Home" href="/" className="text-blue-500 hover:underline">
                <LocaleText string="goBackHome" name="Error" />
            </Link>
        </div>
    )
}

export default Forbidden;
