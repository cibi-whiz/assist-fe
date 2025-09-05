import React from 'react'
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa'
import { TFunction } from 'i18next'

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
  sortedData: any[] // you can replace `any[]` with your actual type e.g. CartItem[]
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
  return (
<div className="bg-white dark:bg-gray-900 rounded-lg shadow-sm border border-gray-200 dark:border-gray-800 p-2">
  <div className="flex lg:flex-row sm:flex-row justify-between gap-3 sm:gap-0">
    {/* Items per page and info */}
    <div className="flex items-center justify-between gap-2 sm:gap-4">
      <div className="flex items-center space-x-2 text-xs sm:text-sm text-gray-700 dark:text-gray-300">
        <span>{t("pagination.showing", { ns: "common" })} {t("pagination.entries", { ns: "common" })}</span>
      </div>

      <div className="text-slate-600 dark:text-gray-400 text-xs font-medium sm:text-sm">
        {pagination.from + 1}-{Math.min(pagination.from + sortedData.length, pagination.total)} of {pagination.total}
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
          {getPageNumbers().map((page, index) => (
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
