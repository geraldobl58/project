import { useCallback, useMemo, memo } from "react";
import { useSearchParams } from "react-router-dom";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

interface UsersPaginationProps {
  currentPage: number;
  totalPages: number;
}

const UsersPaginationComponent = ({
  currentPage,
  totalPages,
}: UsersPaginationProps) => {
  const [, setSearchParams] = useSearchParams();

  const isFirstPage = useMemo(() => currentPage === 1, [currentPage]);
  const isLastPage = useMemo(
    () => currentPage === totalPages,
    [currentPage, totalPages]
  );

  const handlePageChange = useCallback(
    (page: number) => {
      const params = new URLSearchParams();
      params.set("page", String(page));
      setSearchParams(params, { replace: true });
    },
    [setSearchParams]
  );

  const pages = useMemo(() => {
    const maxPagesToShow = 5;

    // Determina o range de páginas usando reduce
    const { startPage, endPage } = [
      currentPage,
      totalPages,
      maxPagesToShow,
    ].reduce(
      (_acc, _value, _index, arr) => {
        const [current, total, maxPages] = arr;

        if (total <= maxPages) {
          return { startPage: 1, endPage: total };
        }

        if (current <= 3) {
          return { startPage: 1, endPage: maxPages };
        }

        if (current > total - 3) {
          return { startPage: total - maxPages + 1, endPage: total };
        }

        return { startPage: current - 2, endPage: current + 2 };
      },
      { startPage: 1, endPage: 1 }
    );

    // Gera array de páginas usando reduce
    return Array.from(
      { length: endPage - startPage + 1 },
      (_, index) => index
    ).reduce((pageNumbers: number[], index) => {
      pageNumbers.push(startPage + index);
      return pageNumbers;
    }, []);
  }, [currentPage, totalPages]);

  return (
    <Pagination>
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious
            href="#"
            onClick={(e) => {
              e.preventDefault();
              if (!isFirstPage) handlePageChange(currentPage - 1);
            }}
            className={isFirstPage ? "pointer-events-none opacity-50" : ""}
          />
        </PaginationItem>

        {pages[0] > 1 && (
          <>
            <PaginationItem>
              <PaginationLink
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  handlePageChange(1);
                }}
              >
                1
              </PaginationLink>
            </PaginationItem>
            {pages[0] > 2 && <PaginationEllipsis />}
          </>
        )}

        {pages.map((page) => (
          <PaginationItem key={page}>
            <PaginationLink
              href="#"
              onClick={(e) => {
                e.preventDefault();
                handlePageChange(page);
              }}
              isActive={currentPage === page}
            >
              {page}
            </PaginationLink>
          </PaginationItem>
        ))}

        {pages[pages.length - 1] < totalPages && (
          <>
            {pages[pages.length - 1] < totalPages - 1 && <PaginationEllipsis />}
            <PaginationItem>
              <PaginationLink
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  handlePageChange(totalPages);
                }}
              >
                {totalPages}
              </PaginationLink>
            </PaginationItem>
          </>
        )}

        <PaginationItem>
          <PaginationNext
            href="#"
            onClick={(e) => {
              e.preventDefault();
              if (!isLastPage) handlePageChange(currentPage + 1);
            }}
            className={isLastPage ? "pointer-events-none opacity-50" : ""}
          />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
};

export const UsersPagination = memo(UsersPaginationComponent);
