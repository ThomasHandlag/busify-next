"use client";

import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { useTripFilter } from "@/lib/contexts/TripFilterContext";

const Pager = () => {
  const filter = useTripFilter();
  return (
    <Pagination>
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious
            onClick={() => filter.handlePageChange(filter.page - 1)}
          />
        </PaginationItem>

        {filter.page > 1 &&
          Array.from({ length: filter.page }, (_, i) => i).map((page) => (
            <PaginationItem key={page}>
              <PaginationLink onClick={() => filter.handlePageChange(page)} />
            </PaginationItem>
          ))}
        <PaginationItem>
          <PaginationNext
            onClick={() => filter.handlePageChange(filter.page + 1)}
          />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
};

export default Pager;
