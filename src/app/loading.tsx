import { Loader2Icon } from "lucide-react";

const Loading = () => {
  return (
    <div className="flex items-center justify-center h-screen w-full">
      <Loader2Icon className="w-12 h-12 animate-spin text-green-500" />
    </div>
  );
};

export default Loading;
