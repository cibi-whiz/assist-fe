import { useState, useCallback } from 'react'

interface FilterCategory {
  key: string
  label: string
  isActive?: boolean
  section?: string
}


interface UseFilterDrawerReturn {
  isOpen: boolean
  openDrawer: () => void
  closeDrawer: () => void
  toggleDrawer: () => void
  selectedCategories: FilterCategory[]
  filterLogic: 'any' | 'all'
  searchTerm: string
  expandedSections: string[]
  setSelectedCategories: (categories: FilterCategory[]) => void
  setFilterLogic: (logic: 'any' | 'all') => void
  setSearchTerm: (term: string) => void
  handleCategorySelect: (category: FilterCategory) => void
  toggleSection: (sectionKey: string) => void
  expandAllSections: () => void
  collapseAllSections: () => void
  resetFilters: () => void
}

export const useFilterDrawer = (): UseFilterDrawerReturn => {
  const [isOpen, setIsOpen] = useState(false)
  const [selectedCategories, setSelectedCategories] = useState<FilterCategory[]>([])
  const [filterLogic, setFilterLogic] = useState<'any' | 'all'>('all')
  const [searchTerm, setSearchTerm] = useState('')
  const [expandedSections, setExpandedSections] = useState<string[]>(['basic'])

  const openDrawer = useCallback(() => {
    setIsOpen(true)
  }, [])

  const closeDrawer = useCallback(() => {
    setIsOpen(false)
  }, [])

  const toggleDrawer = useCallback(() => {
    setIsOpen(prev => !prev)
  }, [])

  const handleCategorySelect = useCallback((category: FilterCategory) => {
    setSelectedCategories(prev => {
      const exists = prev.find(cat => cat.key === category.key)
      if (exists) {
        return prev.filter(cat => cat.key !== category.key)
      } else {
        return [...prev, { ...category, isActive: true }]
      }
    })
  }, [])

  const toggleSection = useCallback((sectionKey: string) => {
    setExpandedSections(prev => {
      if (prev.includes(sectionKey)) {
        return prev.filter(key => key !== sectionKey)
      } else {
        return [...prev, sectionKey]
      }
    })
  }, [])

  const expandAllSections = useCallback(() => {
    setExpandedSections(['basic', 'dates', 'status', 'advanced'])
  }, [])

  const collapseAllSections = useCallback(() => {
    setExpandedSections([])
  }, [])

  const resetFilters = useCallback(() => {
    setSelectedCategories([])
    setFilterLogic('all')
    setSearchTerm('')
    setExpandedSections(['basic'])
  }, [])

  return {
    isOpen,
    openDrawer,
    closeDrawer,
    toggleDrawer,
    selectedCategories,
    filterLogic,
    searchTerm,
    expandedSections,
    setSelectedCategories,
    setFilterLogic,
    setSearchTerm,
    handleCategorySelect,
    toggleSection,
    expandAllSections,
    collapseAllSections,
    resetFilters
  }
}
