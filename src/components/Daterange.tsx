import { useState, useEffect, useRef } from 'react'
import moment from 'moment'
import { FaCalendarAlt } from 'react-icons/fa'

const predefinedRanges: any = {
  today: () => {
    const today = moment().format('YYYY-MM-DD')
    return { start: today, end: today }
  },
  yesterday: () => {
    const yesterday = moment().subtract(1, 'day').format('YYYY-MM-DD')
    return { start: yesterday, end: yesterday }
  },
  last7days: () => {
    const end = moment().format('YYYY-MM-DD')
    const start = moment().subtract(6, 'days').format('YYYY-MM-DD')
    return { start, end }
  },
  last30days: () => {
    const end = moment().format('YYYY-MM-DD')
    const start = moment().subtract(29, 'days').format('YYYY-MM-DD')
    return { start, end }
  },
  thismonth: () => {
    const end = moment().format('YYYY-MM-DD')
    const start = moment().startOf('month').format('YYYY-MM-DD')
    return { start, end }
  },
  lastmonth: () => {
    const start = moment().subtract(1, 'month').startOf('month').format('YYYY-MM-DD')
    const end = moment().subtract(1, 'month').endOf('month').format('YYYY-MM-DD')
    return { start, end }
  },
  last3months: () => {
    const end = moment().format('YYYY-MM-DD')
    const start = moment().subtract(2, 'months').startOf('month').format('YYYY-MM-DD')
    return { start, end }
  },
  thisyear: () => {
    const end = moment().format('YYYY-MM-DD')
    const start = moment().startOf('year').format('YYYY-MM-DD')
    return { start, end }
  },
  lastyear: () => {
    const start = moment().subtract(1, 'year').startOf('year').format('YYYY-MM-DD')
    const end = moment().subtract(1, 'year').endOf('year').format('YYYY-MM-DD')
    return { start, end }
  },
  alltime: () => {
    const start = moment().subtract(65, 'year').startOf('year').format('YYYY-MM-DD')
    const end = moment().format('YYYY-MM-DD')
    return { start, end }
  },
}

const Daterange = (props: any) => {
  const [selectedRange, setSelectedRange] = useState('last7days')
  const [customStart, setCustomStart] = useState('')
  const [customEnd, setCustomEnd] = useState('')
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')
  const [showDropdown, setShowDropdown] = useState(false)
  const [showCustomInputs, setShowCustomInputs] = useState(false)
  const [focusedIndex, setFocusedIndex] = useState(-1)
  const dropdownRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  // Get today's date in YYYY-MM-DD format for max date constraint
  const getTodayString = () => {
    return moment().format('YYYY-MM-DD')
  }

  // Click outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowDropdown(false)
        setShowCustomInputs(false)
        setFocusedIndex(-1)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (!showDropdown) return

      switch (event.key) {
        case 'ArrowDown':
          event.preventDefault()
          setFocusedIndex(prev => Math.min(prev + 1, 10)) // 10 options total
          break
        case 'ArrowUp':
          event.preventDefault()
          setFocusedIndex(prev => Math.max(prev - 1, -1))
          break
        case 'Enter':
          event.preventDefault()
          if (focusedIndex >= 0) {
            handleOptionSelect(focusedIndex)
          }
          break
        case 'Escape':
          event.preventDefault()
          setShowDropdown(false)
          setShowCustomInputs(false)
          setFocusedIndex(-1)
          break
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => {
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [showDropdown, focusedIndex])

  useEffect(() => {
    if (selectedRange !== 'customrange') {
      const { start, end } = predefinedRanges[selectedRange]()
      setStartDate(start)
      setEndDate(end)
      props.onChange({ label: selectedRange, startDate: start, endDate: end })
    } else {
      setStartDate(customStart)
      setEndDate(customEnd)
      props.onChange({ label: 'customrange', startDate: customStart, endDate: customEnd })
    }
  }, [selectedRange, customStart, customEnd])

  const formatDate = (dateString: string) => {
    if (!dateString) return ''
    return moment(dateString).format('DD-MMM-YYYY')
  }

  const getDisplayText = () => {
    if (selectedRange === 'alltime') {
      return 'All Time'
    }
    if (startDate && endDate) {
      return `${formatDate(startDate)} to ${formatDate(endDate)}`
    }
    return 'Select Date Range'
  }

  const handleCustomDateChange = (type: 'start' | 'end', value: string) => {
    if (type === 'start') {
      setCustomStart(value)
      setStartDate(value)
    } else {
      setCustomEnd(value)
      setEndDate(value)
    }
    setSelectedRange('customrange')
    props.onChange({ 
      label: 'customrange', 
      startDate: type === 'start' ? value : customStart, 
      endDate: type === 'end' ? value : customEnd 
    })
  }

  const handleOptionSelect = (index: number) => {
    const options = [
      'today', 'yesterday', 'last7days', 'last30days', 'thismonth', 
      'lastmonth', 'last3months', 'thisyear', 'lastyear', 'alltime'
    ]
    
    if (index === 10) { // Custom Range
      setShowCustomInputs(!showCustomInputs)
      return
    }
    
    const selectedOption = options[index]
    setSelectedRange(selectedOption)
    setShowDropdown(false)
    setShowCustomInputs(false)
    setFocusedIndex(-1)
  }

  const toggleDropdown = () => {
    setShowDropdown(!showDropdown)
    if (!showDropdown) {
      setFocusedIndex(-1)
    }
  }

  return (
    <div className="relative" ref={dropdownRef}>
      <label className="flex block text-sm font-medium text-gray-700 dark:text-gray-100">
        <FaCalendarAlt className="w-4 h-4 text-500 dark:text-gray-100" />
        {props.label}
      </label>
      
      {/* Main Input Field */}
      <div className="relative">
        <input
          ref={inputRef}
          type="text"
          value={getDisplayText()}
          readOnly
          onClick={toggleDropdown}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault()
              toggleDropdown()
            }
          }}
          className="w-full px-2 py-2 text-[13px] border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 font-medium cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
          placeholder="Select Date Range"
          aria-haspopup="listbox"
          aria-expanded={showDropdown}
        />
        <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
          <svg 
            className={`w-4 h-4 text-gray-400 transition-transform duration-200 ${showDropdown ? 'rotate-180' : ''}`} 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </div>

      {/* Dropdown Menu */}
      {showDropdown && (
        <div className="absolute z-10 w-full mt-1 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md shadow-lg max-h-60 overflow-y-auto">
          <div className="py-1">
            {[
              { key: 'today', label: 'Today' },
              { key: 'yesterday', label: 'Yesterday' },
              { key: 'last7days', label: 'Last 7 Days' },
              { key: 'last30days', label: 'Last 30 Days' },
              { key: 'thismonth', label: 'This Month' },
              { key: 'lastmonth', label: 'Last Month' },
              { key: 'last3months', label: 'Last 3 Months' },
              { key: 'thisyear', label: 'This Year' },
              { key: 'lastyear', label: 'Last Year' },
              { key: 'alltime', label: 'All Time' }
            ].map((option, index) => (
              <button
                key={option.key}
                onClick={() => handleOptionSelect(index)}
                className={`w-full px-3 py-2 text-left text-sm transition-colors duration-150 ${
                  focusedIndex === index 
                    ? 'bg-blue-100 dark:bg-blue-900 text-blue-900 dark:text-white-100' 
                    : 'hover:bg-gray-100 dark:hover:bg-gray-700'
                } ${selectedRange === option.key ? 'bg-blue-50 dark:bg-blue-800' : ''}`}
              >
                
              <span className='text-sm font-medium text-gray-900 dark:text-gray-200'> {option.label}</span>
              </button>
            ))}
            <div className="border-t border-gray-200 dark:border-gray-600">
              <button
                onClick={() => handleOptionSelect(10)}
                className={`w-full px-3 py-2 text-left text-sm transition-colors duration-150 ${
                  focusedIndex === 10 
                    ? 'bg-blue-100 dark:bg-blue-900 text-blue-900 dark:text-gray-100' 
                    : 'hover:bg-gray-100 dark:hover:bg-gray-700'
                }`}
              >

               <span className='text-sm font-medium text-gray-900 dark:text-gray-200'> Custom Range</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Custom Date Inputs */}
      {showCustomInputs && (
        <div className="absolute z-20 w-full mt-1 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md shadow-lg p-4">
          <div className="flex gap-3">
            <div className="flex-1">
              <label className="block text-xs font-medium text-gray-700 dark:text-gray-200 mb-2">
                Start Date
              </label>
              <input
                type="date"
                value={customStart}
                onChange={(e) => handleCustomDateChange('start', e.target.value)}
                className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                max={customEnd || getTodayString()}
              />
            </div>
            <div className="flex-1">
              <label className="block text-xs font-medium text-gray-700 dark:text-gray-200 mb-2">
                End Date
              </label>
              <input
                type="date"
                value={customEnd}
                onChange={(e) => handleCustomDateChange('end', e.target.value)}
                className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                min={customStart || undefined}
                max={getTodayString()}
              />
            </div>
          </div>
          <div className="mt-3 flex justify-end">
            <button
              onClick={() => {
                setShowCustomInputs(false)
                setShowDropdown(false)
              }}
              className="px-3 py-1.5 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors duration-150"
            >
              Apply
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default Daterange
