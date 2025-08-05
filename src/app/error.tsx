"use client";

const ErrorPage = () => {
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100 w-full">
      <h1 className="text-4xl font-bold text-red-600">Error</h1>
      <p className="mt-4 text-lg text-gray-700">
        An unexpected error has occurred.
      </p>
      <p className="mt-2 text-sm text-gray-500">Please try again later.</p>
    </div>
  );
};

export default ErrorPage;
