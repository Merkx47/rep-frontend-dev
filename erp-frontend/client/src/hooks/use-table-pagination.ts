import { useState, useMemo } from "react";

interface UseTablePaginationOptions<T> {
  data: T[];
  initialPageSize?: number;
}

interface UseTablePaginationReturn<T> {
  paginatedData: T[];
  currentPage: number;
  pageSize: number;
  totalPages: number;
  totalItems: number;
  setCurrentPage: (page: number) => void;
  setPageSize: (size: number) => void;
  goToFirstPage: () => void;
  goToLastPage: () => void;
  goToNextPage: () => void;
  goToPreviousPage: () => void;
}

export function useTablePagination<T>({
  data,
  initialPageSize = 10,
}: UseTablePaginationOptions<T>): UseTablePaginationReturn<T> {
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(initialPageSize);

  const totalItems = data.length;
  const totalPages = Math.ceil(totalItems / pageSize);

  // Reset to page 1 when data changes significantly or page size changes
  const handlePageSizeChange = (newSize: number) => {
    setPageSize(newSize);
    setCurrentPage(1);
  };

  const handlePageChange = (page: number) => {
    const validPage = Math.max(1, Math.min(page, totalPages));
    setCurrentPage(validPage);
  };

  const paginatedData = useMemo(() => {
    const startIndex = (currentPage - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    return data.slice(startIndex, endIndex);
  }, [data, currentPage, pageSize]);

  // Reset to page 1 if current page exceeds total pages
  if (currentPage > totalPages && totalPages > 0) {
    setCurrentPage(1);
  }

  return {
    paginatedData,
    currentPage,
    pageSize,
    totalPages,
    totalItems,
    setCurrentPage: handlePageChange,
    setPageSize: handlePageSizeChange,
    goToFirstPage: () => handlePageChange(1),
    goToLastPage: () => handlePageChange(totalPages),
    goToNextPage: () => handlePageChange(currentPage + 1),
    goToPreviousPage: () => handlePageChange(currentPage - 1),
  };
}
