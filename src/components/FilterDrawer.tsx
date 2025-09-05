import React, { useState, useEffect } from 'react'
import { Drawer, Button, Radio } from 'antd'
import { FaChevronRight } from 'react-icons/fa'
import { useTranslation } from 'react-i18next'

interface FilterCategory {
  key: string
  label: string
  isActive?: boolean
}

interface FilterDrawerProps {
  ns: string
  children?: React.ReactNode
  handleSearch: () => void
  handleClear: () => void
  isLoading: boolean
  isOpen: boolean
  onClose: () => void
  title?: string
  categories?: FilterCategory[]
  onCategorySelect?: (category: FilterCategory) => void
  filterLogic?: 'any' | 'all'
  onFilterLogicChange?: (logic: 'any' | 'all') => void
}

const FilterDrawer: React.FC<FilterDrawerProps> = ({
  ns,
  children,
  handleSearch,
  handleClear,
  isLoading,
  isOpen,
  onClose,
  title,
  categories = [],
  onCategorySelect,
  filterLogic = 'all',
  onFilterLogicChange,
}) => {
  const { t } = useTranslation(ns)
  const [drawerWidth, setDrawerWidth] = useState(400)

  // Resize listener for drawer width
  useEffect(() => {
    const updateWidth = () => {
      setDrawerWidth(window.innerWidth < 768 ? window.innerWidth : 400)
    }
    updateWidth()
    window.addEventListener('resize', updateWidth)
    return () => window.removeEventListener('resize', updateWidth)
  }, [])

  const handleSearchAndClose = () => {
    handleSearch()
    onClose()
  }

  const handleClearAndClose = () => {
    handleClear()
    onClose()
  }

  const handleReset = () => {
    handleClear()
  }

  return (
    <Drawer
      title={
        <div className="flex items-center justify-between w-full">
          <h3 className="text-lg font-semibold m-0 text-gray-900 dark:text-white">
            {title || t('filters.title', { ns: 'common' })}
          </h3>
          <Button type="link" size="small" onClick={handleReset}>
            {t('filters.reset', { ns: 'common' })}
          </Button>
        </div>
      }
      placement="right"
      width={drawerWidth}
      onClose={onClose}
      open={isOpen}
      className="filter-drawer"
      styles={{
        body: { padding: '16px' },
      }}
    >
      <div className="space-y-6 h-full flex flex-col">
        {/* Filter Content */}
        <div className="flex-1 overflow-y-auto space-y-1">
          {children || (
            categories.map((category) => (
              <div
                key={category.key}
                onClick={() => onCategorySelect?.(category)}
                className={`flex items-center justify-between p-2 cursor-pointer rounded-lg transition-colors hover:bg-gray-50 dark:hover:bg-gray-800 ${
                  category.isActive ? 'bg-blue-50 dark:bg-blue-900/20' : ''
                }`}
              >
                <span
                  className={`text-sm font-medium ${
                    category.isActive
                      ? 'text-blue-600 dark:text-blue-400'
                      : 'text-gray-700 dark:text-gray-300'
                  }`}
                >
                  {category.label}
                </span>
                <FaChevronRight className="text-gray-400 text-xs" />
              </div>
            ))
          )}
        </div>

        {/* Radio Button Options */}
        <div className="space-y-3 pt-4 border-t border-gray-200 dark:border-gray-700">
          <Radio.Group
            value={filterLogic}
            onChange={(e) => onFilterLogicChange?.(e.target.value)}
            className="w-full"
          >
            <div className="space-y-2">
              <Radio value="any" className="w-full">
                <span className="text-sm text-gray-700 dark:text-gray-300">
                  {t('filters.anyOfThese', { ns: 'common' })}
                </span>
              </Radio>
              <Radio value="all" className="w-full">
                <span className="text-sm text-gray-700 dark:text-gray-300">
                  {t('filters.allOfThese', { ns: 'common' })}
                </span>
              </Radio>
            </div>
          </Radio.Group>
        </div>

        {/* Action Buttons */}
        <div className="space-y-3 pt-4">
          <Button
            type="primary"
            onClick={handleSearchAndClose}
            loading={isLoading}
            className="w-full h-12 text-base font-medium"
            size="large"
          >
            {t('filters.search', { ns: 'common' })}
          </Button>
          <Button
            onClick={handleClearAndClose}
            className="w-full h-12 text-base font-medium border-gray-300 text-gray-700 hover:border-gray-400"
            size="large"
          >
            {t('filters.clear', { ns: 'common' })}
          </Button>
        </div>
      </div>
    </Drawer>
  )
}

export default FilterDrawer
