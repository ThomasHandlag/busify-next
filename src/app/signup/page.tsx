import RegisterForm from "@/components/custom/register_form";
import React from "react";

const page = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center w-full px-4 py-8 bg-gray-50">
      <RegisterForm />
    </div>
  );
};

export default page;
