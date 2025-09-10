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
    <Pagination className="justify-center mt-4">
      <PaginationContent>
        <PaginationItem className="cursor-pointer">
          <PaginationPrevious
            onClick={() => {
              if (filter.page > 0) {
                filter.handlePageChange(filter.page - 1);
              }
            }}
          />
        </PaginationItem>
        {filter.pager?.totalPages &&
          Array.from({ length: filter.pager.totalPages }, (_, i) => i).map(
            (page) => (
              <PaginationItem key={page} className="cursor-pointer">
                <PaginationLink
                  isActive={filter.page === page}
                  onClick={() => filter.handlePageChange(page)}
                >
                  {page + 1}
                </PaginationLink>
              </PaginationItem>
            )
          )}
        <PaginationItem className="cursor-pointer">
          <PaginationNext
            onClick={() => {
              if (filter.pager && filter.page < filter.pager.totalPages - 1) {
                filter.handlePageChange(filter.page + 1);
              }
            }}
          />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
};

export default Pager;
