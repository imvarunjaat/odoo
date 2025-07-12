import { useMemo } from "react"

interface UsePaginationProps {
  currentPage: number
  totalPages: number
  paginationItemsToDisplay: number
}

interface UsePaginationReturn {
  pages: number[]
  showLeftEllipsis: boolean
  showRightEllipsis: boolean
}

export function usePagination({
  currentPage,
  totalPages,
  paginationItemsToDisplay,
}: UsePaginationProps): UsePaginationReturn {
  return useMemo(() => {
    if (totalPages <= paginationItemsToDisplay) {
      return {
        pages: Array.from({ length: totalPages }, (_, i) => i + 1),
        showLeftEllipsis: false,
        showRightEllipsis: false,
      }
    }

    const halfRange = Math.floor(paginationItemsToDisplay / 2)
    let start = Math.max(1, currentPage - halfRange)
    let end = Math.min(totalPages, currentPage + halfRange)

    // Adjust if we're near the beginning
    if (start === 1) {
      end = Math.min(totalPages, paginationItemsToDisplay)
    }

    // Adjust if we're near the end
    if (end === totalPages) {
      start = Math.max(1, totalPages - paginationItemsToDisplay + 1)
    }

    const pages = Array.from({ length: end - start + 1 }, (_, i) => start + i)

    const showLeftEllipsis = start > 1
    const showRightEllipsis = end < totalPages

    return {
      pages,
      showLeftEllipsis,
      showRightEllipsis,
    }
  }, [currentPage, totalPages, paginationItemsToDisplay])
}