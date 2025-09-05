import React, { useState } from 'react'
import { Collapse, Badge, Input } from 'antd'
import { FaChevronRight, FaGlobe } from 'react-icons/fa'
import { useTranslation } from 'react-i18next'
import Daterange from './Daterange'
import Autocomplete from './Autocomplete'

interface FilterCategory {
  key: string
  label: string
  isActive?: boolean
  section?: string
  component?: React.ReactNode
}

interface FilterCategoryItem extends FilterCategory {
  component?: React.ReactNode
}

interface FilterSection {
  key: string
  label: string
  isExpanded?: boolean
  categories: FilterCategory[]
}

interface FilterAccordionProps {
  sections?: FilterSection[]
  categories?: FilterCategoryItem[]
  expandedSections: string[]
  onSectionToggle: (sectionKey: string) => void
  onCategorySelect?: (category: FilterCategory) => void
  ns: string
  searchTerm?: string
}

const FilterAccordion: React.FC<FilterAccordionProps> = ({
  sections,
  expandedSections,
  onSectionToggle,
  ns,
  searchTerm = ''
}) => {
  const { t } = useTranslation(ns)

  // Local state for category activation
  const [categoriesState, setCategoriesState] = useState<FilterSection[]>(sections || [])

  const handleCategoryToggle = (sectionKey: string, categoryKey: string) => {
    setCategoriesState((prev) =>
      prev.map((section) =>
        section.key === sectionKey
          ? {
              ...section,
              categories: section.categories.map((cat) =>
                cat.key === categoryKey ? { ...cat, isActive: !cat.isActive } : cat
              )
            }
          : section
      )
    )
  }

  return (
    <Collapse
      accordion={false}
      activeKey={expandedSections}
      onChange={(keys) => {
        if (Array.isArray(keys)) {
          keys.forEach((k) => onSectionToggle(k as string))
        } else {
          onSectionToggle(keys as string)
        }
      }}
      expandIconPosition="end"
      expandIcon={({ isActive }) => (
        <FaChevronRight
          className={`transition-transform duration-200 ${isActive ? 'rotate-90' : ''}`}
        />
      )}
      className="filter-accordion border-none bg-transparent"
    >
      {categoriesState.map((section) => {
        const hasActiveCategories = section.categories.some((cat) => cat.isActive)

        return (
          <Collapse.Panel
            key={section.key}
            header={
              <div className="flex items-center space-x-3">
                <div
                  className={`w-2 h-2 rounded-full ${
                    hasActiveCategories
                      ? 'bg-blue-500'
                      : 'bg-gray-300 dark:bg-gray-600'
                  }`}
                />
                <span
                  className={`text-sm font-medium ${
                    hasActiveCategories
                      ? 'text-blue-600 dark:text-blue-400'
                      : 'text-gray-700 dark:text-gray-300'
                  }`}
                >
                  {t(`filters.sections.${section.key}`, { ns: 'common' })}
                </span>
                {hasActiveCategories && (
                  <Badge
                    count={section.categories.filter((cat) => cat.isActive).length}
                    style={{
                      backgroundColor: '#e6f4ff',
                      color: '#1677ff',
                      fontSize: '10px',
                      borderRadius: '12px'
                    }}
                  />
                )}
              </div>
            }
          >
            <div className="space-y-2 p-2">
              {section.categories.map((category) => (
                <div
                  key={category.key}
                  className={`flex flex-col space-y-2 p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 ${
                    category.isActive ? 'bg-blue-50 dark:bg-blue-900/20' : 'cursor-pointer'
                  }`}
                  onClick={() => handleCategoryToggle(section.key, category.key)}
                >
                  <div className="flex items-center justify-between">
                    <span
                      className={`text-sm ${
                        category.isActive
                          ? 'text-blue-600 dark:text-blue-400 font-medium'
                          : 'text-gray-600 dark:text-gray-400'
                      }`}
                    >
                      {category.label}
                    </span>
                    {category.isActive && (
                      <div className="w-2 h-2 bg-blue-500 rounded-full" />
                    )}
                  </div>

                  {/* Render component if active */}
                  {category.isActive && category.component && (
                    <div className="mt-2">{category.component}</div>
                  )}
                </div>
              ))}
            </div>
          </Collapse.Panel>
        )
      })}
    </Collapse>
  )
}

export default FilterAccordion

// Example usage with sections prop
export const exampleSections: FilterSection[] = [
  {
    key: 'user_filters',
    label: 'User Filters',
    categories: [
      {
        key: 'created_by',
        label: 'Created By',
        isActive: false,
        component: <Daterange />
      },
      {
        key: 'lastLogin',
        label: 'Last Login',
        isActive: false,
        component: <Daterange />
      },
      {
        key: 'email',
        label: 'Email',
        isActive: false,
        component: (
          <Input
            placeholder="sender@company.com"
            size="large"
          />
        )
      },
      {
        key: 'country',
        label: 'Country',
        isActive: false,
        component: (
          <Autocomplete
            label="Country"
            Icon={<FaGlobe />}
            options={[]}
            value={null}
            onChange={() => {}}
            placeholder="Country"
          />
        )
      }
    ]
  }
]
