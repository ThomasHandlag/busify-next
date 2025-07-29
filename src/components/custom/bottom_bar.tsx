"use client";

import { History, User } from "lucide-react";
import { Button } from "../ui/button";
import SearchFilter from "./search_filter";

const BottomBar = () => {
  return (
    <div className="flex items-center justify-center bottom-2 w-full fixed z-20">
      <div className="shadow-lg rounded-3xl flex gap-2 items-center justify-center p-2 border bg-background">
        <SearchFilter onApplyFilters={() => {}} />
        <Button variant="ghost">
          <User className="w-5 h-5 mr-2" />
          Profile
        </Button>
        <Button variant="ghost">
          <History className="w-5 h-5 mr-2" />
          History
        </Button>
      </div>
    </div>
  );
};

export default BottomBar;
