import React, { useEffect, useState } from "react"
import { FaChevronLeft, FaChevronRight } from "react-icons/fa"
import { TFunction } from "i18next"

interface PaginationData {
  total: number
  page: number
  from: number
  current_page: number
  last_page: number
  per_page: number
}

interface PaginationProps {
  pagination: PaginationData
  handlePerPageChange: (perPage: number) => void
  handlePageChange: (page: number) => void
  getPageNumbers: () => (string | number)[]
  sortedData: any[]
  t: TFunction
}

const Pagination: React.FC<PaginationProps> = ({
  pagination,
  handlePerPageChange,
  handlePageChange,
  getPageNumbers,
  sortedData,
  t,
}) => {
  const [isMobile, setIsMobile] = useState(false)

  // Detect screen size
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 640) // sm breakpoint
    handleResize()
    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [])

  const maxVisible = isMobile ? 2 : 4
  const allPages = getPageNumbers().filter((p) => p !== "...") as number[]

  let limitedPages: (number | string)[] = []

  if (allPages.length <= maxVisible) {
    limitedPages = allPages
  } else {
    const current = pagination.current_page
    const half = Math.floor(maxVisible / 2)

    let start = Math.max(1, current - half)
    let end = Math.min(pagination.last_page, start + maxVisible - 1)

    // Adjust start if we’re at the end
    start = Math.max(1, end - maxVisible + 1)

    limitedPages = allPages.slice(start - 1, end)
    if (start > 1) limitedPages.unshift("...")
    if (end < pagination.last_page) limitedPages.push("...")
    if (!limitedPages.includes(1)) limitedPages.unshift(1)
    if (!limitedPages.includes(pagination.last_page)) limitedPages.push(pagination.last_page)
  }

  return (
    <div className="bg-white dark:bg-gray-900 rounded-lg shadow-sm border border-gray-200 dark:border-gray-800 p-2">
      <div className="flex lg:flex-row sm:flex-row justify-between gap-3 sm:gap-0">
        {/* Items per page and info */}
        <div className="flex items-center justify-between gap-2 sm:gap-4">
          <div className="flex items-center space-x-2 text-xs sm:text-sm text-gray-700 dark:text-gray-300">
            <span>
              {t("pagination.showing", { ns: "common" })} {t("pagination.entries", { ns: "common" })}
            </span>
          </div>

          <div className="text-slate-600 dark:text-gray-400 text-xs font-medium sm:text-sm">
            {pagination.from + 1}-
            {Math.min(pagination.from + sortedData.length, pagination.total)} of {pagination.total}
          </div>
        </div>

        {/* Pagination Controls */}
        <div className="flex items-center justify-center sm:justify-end">
          <div className="flex items-center space-x-1 overflow-x-auto scrollbar-hide max-w-full">
            {/* Previous Button */}
            <button
              onClick={() => handlePageChange(Math.max(1, pagination.current_page - 1))}
              disabled={pagination.current_page === 1}
              className="px-2 py-1 text-xs sm:text-sm border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-1"
            >
              <FaChevronLeft className="w-3 h-3" />
              <span className="hidden sm:inline">{t("pagination.previous", { ns: "common" })}</span>
            </button>

            {/* Page Numbers */}
            <div className="flex items-center space-x-1">
              {limitedPages.map((page, index) => (
                <button
                  key={index}
                  onClick={() => typeof page === "number" && handlePageChange(page)}
                  disabled={page === "..."}
                  className={`px-2 py-1 text-xs sm:text-sm rounded border ${
                    page === pagination.current_page
                      ? "bg-blue-600 text-white border-blue-600"
                      : page === "..."
                      ? "text-gray-400 cursor-default border-transparent"
                      : "border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
                  }`}
                >
                  {page}
                </button>
              ))}
            </div>

            {/* Next Button */}
            <button
              onClick={() => handlePageChange(Math.min(pagination.last_page, pagination.current_page + 1))}
              disabled={pagination.current_page === pagination.last_page}
              className="px-2 py-1 text-xs sm:text-sm border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-1"
            >
              <span className="hidden sm:inline">{t("pagination.next", { ns: "common" })}</span>
              <FaChevronRight className="w-3 h-3" />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Pagination
