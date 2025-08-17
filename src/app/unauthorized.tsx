import Link from "next/link";

const Unauthorized = () => {
    return (
        <div className="">
            <h1 className="text-4xl font-bold mb-4">401 - Unauthorized</h1>
            <p className="text-lg mb-8">
                You do not have permission to access this page.
            </p>
            <Link aria-label="Go back to Home" href="/" className="text-blue-500 hover:underline">
                Go back to Home
            </Link>
        </div>
    )
}

export default Unauthorized;