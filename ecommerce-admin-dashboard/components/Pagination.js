'use client';

import { ChevronLeftIcon, ChevronRightIcon } from 'lucide-react';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';

export default function Pagination({ currentPage: initialPage, totalPages }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const currentPage = Number(initialPage);

  const handlePageChange = (newPage) => {
    const params = new URLSearchParams(searchParams);
    params.set('page', newPage);
    router.push(`${pathname}?${params.toString()}`, { scroll: false });
  };

  const generatePageNumbers = () => {
    const pages = [];

    if (totalPages <= 7) {
      // Show all if pages are few
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      pages.push(1); // always show first

      const showLeftEllipsis = currentPage > 3;
      const showRightEllipsis = currentPage < totalPages - 2;

      if (showLeftEllipsis && currentPage > 4) {
        pages.push('left-ellipsis');
      }

      const start = Math.max(2, currentPage - 1);
      const end = Math.min(totalPages - 1, currentPage + 1);

      for (let i = start; i <= end; i++) {
        pages.push(i);
      }

      if (showRightEllipsis && currentPage < totalPages - 3) {
        pages.push('right-ellipsis');
      }

      pages.push(totalPages); // always show last
    }

    return pages;
  };

  if(totalPages > 1) {
  return (
    <div className="flex items-center justify-between px-4 py-3 sm:px-6 border-t border-border">
      {/* Mobile controls */}
      <div className="flex w-full justify-between sm:hidden">
        <Button
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
          variant="outline"
          size="sm"
        >
          Previous
        </Button>
        <Button
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          variant="outline"
          size="sm"
        >
          Next
        </Button>
      </div>

      {/* Desktop controls */}
      <div className="hidden w-full sm:flex sm:items-center sm:justify-between">
        <p className="text-sm text-muted-foreground">
          Showing page <span className="font-medium">{currentPage}</span> of{' '}
          <span className="font-medium">{totalPages}</span>
        </p>

        <div className="flex items-center gap-2 overflow-x-auto max-w-full">
          <Button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            size="icon"
            variant="outline"
          >
            <ChevronLeftIcon className="h-4 w-4" />
          </Button>

          {generatePageNumbers().map((page, idx) =>
            typeof page === 'number' ? (
              <Button
                key={page}
                onClick={() => handlePageChange(page)}
                variant={page === currentPage ? 'default' : 'outline'}
                size="icon"
                className="w-9 h-9"
              >
                {page}
              </Button>
            ) : (
              <span
                key={page + idx}
                className="w-9 h-9 flex items-center justify-center text-sm text-muted-foreground"
              >
                &hellip;
              </span>
            )
          )}

          <Button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            size="icon"
            variant="outline"
          >
            <ChevronRightIcon className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
}
