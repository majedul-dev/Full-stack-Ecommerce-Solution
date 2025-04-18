// // components/Pagination.js
// 'use client';

// import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline';
// import { useRouter, usePathname, useSearchParams } from 'next/navigation';

// export default function Pagination({ currentPage: initialPage, totalPages }) {
//   const router = useRouter();
//   const pathname = usePathname();
//   const searchParams = useSearchParams();
  
//   // Convert to number explicitly
//   const currentPage = Number(initialPage);

//   const handlePageChange = (newPage) => {
//     const params = new URLSearchParams(searchParams);
//     params.set('page', newPage);
//     router.push(`${pathname}?${params.toString()}`, { scroll: false });
//   };

//   const generatePageNumbers = () => {
//     const pages = [];
//     const maxVisiblePages = 5;
//     let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
//     let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

//     // Adjust start page if we're at the end
//     if (endPage - startPage < maxVisiblePages - 1) {
//       startPage = Math.max(1, endPage - maxVisiblePages + 1);
//     }

//     for (let i = startPage; i <= endPage; i++) {
//       pages.push(i);
//     }
//     return pages;
//   };

//   return (
//     <div className="flex items-center justify-between border-t border-gray-200 dark:border-gray-700 px-4 py-3 sm:px-6">
//       {/* Mobile Pagination */}
//       <div className="flex flex-1 justify-between sm:hidden">
//         <button
//           onClick={() => handlePageChange(currentPage - 1)}
//           disabled={currentPage == 1}
//           className={`rounded-md px-4 py-2 text-sm font-medium ${
//             currentPage == 1
//               ? 'bg-gray-100 text-gray-400 dark:bg-gray-700 dark:text-gray-500 cursor-not-allowed'
//               : 'bg-white text-gray-700 hover:bg-gray-50 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700'
//           }`}
//         >
//           Previous
//         </button>
//         <button
//           onClick={() => handlePageChange(currentPage + 1)}
//           disabled={currentPage == totalPages}
//           className={`rounded-md px-4 py-2 text-sm font-medium ml-3 ${
//             currentPage == totalPages
//               ? 'bg-gray-100 text-gray-400 dark:bg-gray-700 dark:text-gray-500 cursor-not-allowed'
//               : 'bg-white text-gray-700 hover:bg-gray-50 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700'
//           }`}
//         >
//           Next
//         </button>
//       </div>

//       {/* Desktop Pagination */}
//       <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
//         <div>
//           <p className="text-sm text-gray-700 dark:text-gray-300">
//             Showing page <span className="font-medium">{currentPage}</span> of{' '}
//             <span className="font-medium">{totalPages}</span>
//           </p>
//         </div>
//         <div>
//           <nav className="isolate inline-flex -space-x-px rounded-md shadow-sm">
//             {/* Previous Button */}
//             <button
//               onClick={() => handlePageChange(currentPage - 1)}
//               disabled={currentPage == 1}
//               className={`relative inline-flex items-center rounded-l-md px-2 py-2 focus:z-20 focus:outline-none focus:ring-1 focus:ring-blue-500 ${
//                 currentPage == 1
//                   ? 'bg-gray-100 text-gray-400 dark:bg-gray-700 dark:text-gray-500 cursor-not-allowed'
//                   : 'bg-white text-gray-400 hover:bg-gray-50 dark:bg-gray-800 dark:hover:bg-gray-700'
//               }`}
//             >
//               <span className="sr-only">Previous</span>
//               <ChevronLeftIcon className="h-5 w-5" aria-hidden="true" />
//             </button>

//             {/* Page Numbers */}
//             {generatePageNumbers().map((page) => (
//               <button
//                 key={page}
//                 onClick={() => handlePageChange(page)}
//                 className={`relative inline-flex items-center px-4 py-2 text-sm font-medium focus:z-20 focus:outline-none focus:ring-1 focus:ring-blue-500 ${
//                   page == currentPage
//                     ? 'z-10 bg-blue-600 text-white dark:bg-blue-500'
//                     : 'bg-white text-gray-700 hover:bg-gray-50 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700'
//                 }`}
//               >
//                 {page}
//               </button>
//             ))}

//             {/* Next Button */}
//             <button
//               onClick={() => handlePageChange(currentPage + 1)}
//               disabled={currentPage == totalPages}
//               className={`relative inline-flex items-center rounded-r-md px-2 py-2 focus:z-20 focus:outline-none focus:ring-1 focus:ring-blue-500 ${
//                 currentPage == totalPages
//                   ? 'bg-gray-100 text-gray-400 dark:bg-gray-700 dark:text-gray-500 cursor-not-allowed'
//                   : 'bg-white text-gray-400 hover:bg-gray-50 dark:bg-gray-800 dark:hover:bg-gray-700'
//               }`}
//             >
//               <span className="sr-only">Next</span>
//               <ChevronRightIcon className="h-5 w-5" aria-hidden="true" />
//             </button>
//           </nav>
//         </div>
//       </div>
//     </div>
//   );
// }

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
