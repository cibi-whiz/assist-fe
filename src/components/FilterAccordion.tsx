import React from 'react'
import { Collapse, Badge } from 'antd'
import { FaChevronRight  } from 'react-icons/fa'

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

const FilterAccordion: React.FC<FilterAccordionProps> = () => {
  return (
    <Collapse
      accordion={false}
      activeKey={[]}
      size="small"
      onChange={(keys) => {
      }}
      expandIconPosition="end"
      expandIcon={({ isActive }) => (
        <FaChevronRight
          className={`transition-transform duration-200 ${isActive ? 'rotate-90' : ''}`}
        />
      )}
      className="filter-accordion border-none bg-transparent"
    >
    </Collapse>
  )
}

export default FilterAccordion


