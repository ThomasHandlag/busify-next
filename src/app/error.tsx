"use client";

import { DotLottieReact } from "@lottiefiles/dotlottie-react";

const ErrorPage = () => {
  return (
    <div className="flex flex-col items-center justify-center h-screen w-full">
      <DotLottieReact src="/error.lottie" loop autoplay />
    </div>
  );
};

export default ErrorPage;
