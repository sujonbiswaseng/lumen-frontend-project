'use client'
import React from 'react';
import {
  Pagination,
  PaginationContent,
  PaginationItem,
} from "@/components/ui/pagination";
import { useRouter, useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { TPagination } from '@/types/event.types';

const PaginationPage = ({ pagination }: { pagination: TPagination }) => {
  const { page = 1, totalpage = 1,limit=9 } = pagination;

  const searchParams = useSearchParams();
  const router = useRouter();

  // ********* Ensures stable URLSearchParams usage for deterministic server/client renders
  const navigateToPage = React.useCallback((targetPage: number) => {
    if (targetPage < 1 || targetPage > totalpage) return;
    // Build a new URLSearchParams from the current params
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", targetPage.toString());
    router.push(`?${params.toString()}`);
  }, [searchParams, router, totalpage]);

  const pageWindow = 4;

  const getPageNumbers = React.useCallback(() => {
    const windowIndex = Math.floor((Number(page) - 1) / pageWindow);
    const start = windowIndex * pageWindow + 1;
    const end = Math.min(start + pageWindow - 1, totalpage);
    return Array.from({ length: end - start + 1 }, (_, i) => start + i);
  }, [page, totalpage, pageWindow]);

  // Always renders a div->nav>ul structure (never switching to div or any dynamic nodes)
  return (
    <div className="flex justify-center items-center my-8">
      <Pagination>
        {/* PaginationContent renders as <ul> */}
        <PaginationContent className="flex flex-row items-center gap-2 flex-wrap px-2 py-3 bg-white rounded-lg border shadow-sm">
          {/* Previous Button */}
          <PaginationItem>
            <Button
              variant="outline"
              size="sm"
              disabled={Number(page) === 1}
              onClick={() => navigateToPage(Number(page) - 1)}
              className={`min-w-[40px] font-semibold rounded transition 
                ${Number(page) === 1
                  ? 'border-gray-200 text-gray-400 bg-gray-50 cursor-not-allowed'
                  : 'border-blue-500 text-blue-600 hover:bg-blue-50'}`}
              aria-label="Previous page"
            >
              Prev
            </Button>
          </PaginationItem>
          {/* Page Number Buttons */}
          {getPageNumbers().map((currentpage) => (
            <PaginationItem key={currentpage}>
              <Button
                variant={Number(currentpage) === Number(page) ? "default" : "outline"}
                size="sm"
                onClick={() => navigateToPage(currentpage)}
                className={[
                  'min-w-[36px] px-3 py-1 mx-1 font-semibold rounded border text-sm transition',
                  Number(currentpage) === Number(page)
                    ? 'bg-blue-600 text-white border-blue-600 shadow-md'
                    : 'bg-white text-blue-700 border-blue-300 hover:bg-blue-50'
                ].join(' ')}
                aria-current={Number(currentpage) === Number(page) ? "page" : undefined}
              >
                {currentpage}
              </Button>
            </PaginationItem>
          ))}
          {/* Next Button */}
          <PaginationItem>
            <Button
              variant="outline"
              size="sm"
              disabled={Number(page) === Number(totalpage)}
              onClick={() => navigateToPage(Number(page) + 1)}
              className={`min-w-[40px] font-semibold rounded transition 
                ${Number(page) === Number(totalpage)
                  ? 'border-gray-200 text-gray-400 bg-gray-50 cursor-not-allowed'
                  : 'border-blue-500 text-blue-600 hover:bg-blue-50'}`}
              aria-label="Next page"
            >
              Next
            </Button>
          </PaginationItem>
          {/* Page info is outside of PaginationItem to avoid extra <li> elements and maintain structure */}
          <span className="ml-8 text-sm text-gray-500 font-semibold whitespace-nowrap">
            Page <span className="text-blue-800">{page}</span> of <span className="text-blue-800">{totalpage}</span>
          </span>
        </PaginationContent>
      </Pagination>
    </div>
  );
};

export default PaginationPage;