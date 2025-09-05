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
    <div className="bg-white dark:bg-gray-900 rounded-lg shadow-sm border border-gray-200 dark:border-gray-800">
        <div className="p-2 sm:p-4 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center space-x-2">
                <FaFilter className="w-4 h-4 text-gray-500" />
                <h3 className="text-base font-medium text-gray-700 dark:text-gray-200">{t('filters.title', { ns: ns })}</h3>
            </div>
        </div>
        <div className="p-4 sm:p-6">
            <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6'>
                {children}
            </div>
            <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
              <SearchandClearButtons handleSearch={handleSearch} handleClear={handleClear} isLoading={isLoading} ns="abandonedCart" />
            </div>
        </div>
    </div>
  )
}

export default FilterBox