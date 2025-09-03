import React from 'react'
import { FaFilter } from 'react-icons/fa'
import { useTranslation } from 'react-i18next'
import SearchandClearButtons from './SearchandClearButtons'

interface FilterBoxProps {
  ns: string;
  children?: React.ReactNode;
  handleSearch: () => void;
  handleClear: () => void;
  isLoading: boolean;
}

const FilterBox = ({ ns, children, handleSearch, handleClear, isLoading }: FilterBoxProps) => {
    const { t } = useTranslation(ns)
  return (
    <div className="bg-white dark:bg-gray-900 p-3 sm:p-4 rounded-lg shadow-sm border border-gray-200 dark:border-gray-800">
        <div className="flex items-center space-x-2 mb-3">
            <FaFilter className="w-4 h-4 text-gray-500" />
            <h3 className="text-sm font-medium text-gray-700 dark:text-gray-200">{t('filters.title', { ns: ns })}</h3>
        </div>
        <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3'>
            {children}
        </div>
        <SearchandClearButtons handleSearch={handleSearch} handleClear={handleClear} isLoading={isLoading} ns="abandonedCart" />
    </div>
  )
}

export default FilterBox