"use client";

import { User, Ticket } from "lucide-react";
import { Button } from "../ui/button";
import SearchFilter from "./search_filter";
import { useTripFilter } from "@/lib/contexts/TripFilterContext";
import { usePathname } from "next/navigation";
import Link from "next/link";

const BottomBar = () => {
  const { handleApplyFilters } = useTripFilter();
  const pathname = usePathname();
  const showFilter = pathname.valueOf() === "/trips";

  return (
    <div className="flex items-center justify-center bottom-2 w-full fixed z-20">
      <div className="shadow-lg rounded-3xl flex gap-2 items-center justify-center p-2 border bg-background">
        {showFilter && <SearchFilter onApplyFilters={handleApplyFilters} />}
        <Link href={"/trips/auth/profile"}>
          <Button variant="ghost">
            <User className="w-5 h-5 mr-2" />
            Profile
          </Button>
        </Link>
        <Link href={"/trips/auth/my-tickets"}>
          <Button variant="ghost">
            <Ticket className="w-5 h-5 mr-2" />
            Tickets
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default BottomBar;
