import React from 'react'
import { FaSearch, FaCopy } from 'react-icons/fa'
import moment from 'moment'
import { useToast } from './ToastContext';
// TypeScript interfaces for better type safety
interface Column {
  key: string
  label: string
  sortable?: boolean
  render?: (value: any, item: any) => React.ReactNode
  width?: string
}

interface Action {
  icon: React.ReactNode
  onClick: (item: any) => void
  title: string
  className?: string
}

interface Pagination {
  from: number
  to: number
  total: number
  currentPage: number
  lastPage: number
  perPage: number
}

interface TableProps {
  data: any[]
  isLoading?: boolean
  pagination?: Pagination
  columns: Column[]
  actions?: Action[]
  onSort?: (key: string) => void
  sortKey?: string
  sortDirection?: 'asc' | 'desc'
  emptyStateMessage?: string
  emptyStateSubMessage?: string
  loadingMessage?: string
  className?: string
  rowKey?: string | ((item: any) => string)
}

const Table: React.FC<TableProps> = ({
  data,
  isLoading = false,
  columns,
  actions = [],
  onSort,
  sortKey,
  sortDirection,
  emptyStateMessage = "No data found",
  emptyStateSubMessage = "Try adjusting your filters",
  loadingMessage = "Loading data...",
  className = "",
  rowKey = "id"
}) => {
  // Helper function to get row key
  const { showToast } = useToast();
  const getRowKey = (item: any, index: number): string => {
    if (typeof rowKey === 'function') {
      return rowKey(item)
    }
    return item[rowKey] || `row-${index}`
  }

  // Helper function to get sort icon
  const getSortIcon = (columnKey: string) => {
    if (!onSort || !columnKey || columnKey !== sortKey) {
      return null
    }
    
    return (
      <span className="ml-1">
        {sortDirection === 'asc' ? '↑' : '↓'}
      </span>
    )
  }

  // Helper function to render cell content
  const renderCell = (column: Column, item: any, index: number) => {
    if (column.render) {
      return column.render(item[column.key], item)
    }

    // Default renderers for common data types
    const value = item[column.key]
    
    if (column.key === 'email' && value) {
      return (
        <div className=" items-center gap-1">
          <div className="text-[12px] font-medium text-gray-500 dark:text-gray-400">{item.first_name} {item.last_name}</div>
          <div className=" mt-1 flex items-center gap-1 text-[12px] font-medium text-black dark:text-gray-400">{value}
          <FaCopy 
            className="w-3 h-3 cursor-pointer hover:text-blue-600 transition-colors" 
            onClick={() => {
              navigator.clipboard.writeText(value)
              showToast('Email copied to clipboard', 'success');
              // You can add a toast notification here if needed
            }}
            title="Copy email"
          />
          </div>
        </div>
      )
    }
    if (column.key === 'index') {
    
      return index + 1

    }


    if (column.key == 'created_at' || column.key == 'updated_at' && value) {
      return moment(value).format("DD-MMM-YYYY")
    }

    if (column.key === 'total_price' && value) {
      const currencySymbols: { [key: string]: string } = {
        INR: "₹",
        USD: "$",
        EUR: "€",
        GBP: "£"
      }
      return `${currencySymbols[item.currency_type] || "₹"} ${item.total_price || value}`
    }

    if (column.key === 'items_count' && column.label == 'Priority') {
      const getPriorityColor = (count: number) => {
        if (count >= 3) return "bg-red-100 text-red-800 border-red-200 dark:bg-red-900 dark:text-red-200 dark:border-red-700"
        if (count == 1) return "bg-yellow-100 text-yellow-800 border-yellow-200 dark:bg-yellow-900 dark:text-yellow-200 dark:border-yellow-700"
        return "bg-green-100 text-green-800 border-green-200 dark:bg-green-900 dark:text-green-200 dark:border-green-700"
      }
      
      const priorityText = value >= 3 ? "High" : value === 2 ? "Medium" : "Low"
      
      return (
        <span className={`inline-flex px-2 py-0.5 text-xs font-medium rounded-full border ${getPriorityColor(value)}`}>
          {priorityText}
        </span>
      )
    }
    if (column.key === 'items_count' && typeof value == 'number') {
        return value

      }
    

    return value || "-"
  }

  return (
    <div className={`bg-white dark:bg-gray-900 rounded-lg shadow-sm border border-gray-200 dark:border-gray-800 overflow-hidden ${className}`}>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 dark:bg-gray-800">
            {columns.map((column) => (
              <th 
                key={column.key}
                className={`p-4 align-top text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider align-top ${
                  column.sortable && onSort ? 'cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700' : ''
                }`}
                style={{ width: column.width }}
                onClick={() => column.sortable && onSort ? onSort(column.key) : undefined}
              >
                <div className="align-top flex items-center space-x-1">
                  <span>{column.label}</span>
                  {column.sortable && getSortIcon(column.key)}
                </div>
              </th>
            ))}
            {actions.length > 0 && (
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider w-20">
                Actions
              </th>
            )}
          </thead>
          <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
            {isLoading ? (
              <tr>
                <td colSpan={columns.length + (actions.length > 0 ? 1 : 0)} className="px-4 py-8 text-center text-sm text-gray-500 dark:text-gray-400">
                  <div className="flex items-center justify-center space-x-2">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                    <span>{loadingMessage}</span>
                  </div>
                </td>
              </tr>
            ) : data.length === 0 ? (
              <tr>
                <td colSpan={columns.length + (actions.length > 0 ? 1 : 0)} className="px-4 py-8 text-center text-sm text-gray-500 dark:text-gray-400">
                  <div className="flex flex-col items-center space-y-2">
                    <FaSearch className="w-8 h-8 text-gray-300" />
                    <span>{emptyStateMessage}</span>
                    <span className="text-xs text-gray-400">{emptyStateSubMessage}</span>
                  </div>
                </td>
              </tr>
            ) : (
              data.map((item, index) => (
                <tr
                  key={getRowKey(item, index)}
                  className="hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors duration-150"
                >
                  {columns.map((column) => (
                    <td 
                      key={column.key}
                      className="px-4 py-2 whitespace-nowrap text-xs text-gray-900 dark:text-gray-100"
                    >
                      {renderCell(column, item, index)}
                    </td>
                  ))}
                  {actions.length > 0 && (
                    <td className="align-center px-4 py-2 whitespace-nowrap text-xs font-medium">
                      <div className="flex space-x-1">
                        {actions.map((action, actionIndex) => (
                          <button
                            key={actionIndex}
                            onClick={() => action.onClick(item)}
                            className={`p-1 transition-colors duration-150 ${action.className || 'text-yellow-400 hover:text-yellow-900 dark:text-blue-400 dark:hover:text-blue-200'}`}
                            title={action.title}
                          >
                            {action.icon}
                          </button>
                        ))}
                      </div>
                    </td>
                  )}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default Table