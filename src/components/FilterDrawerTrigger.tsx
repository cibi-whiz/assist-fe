import { Button } from 'antd'
import { FaFilter } from 'react-icons/fa'
import { useTranslation } from 'react-i18next'

interface FilterDrawerTriggerProps {
  onClick: () => void
  ns: string
  count?: number
  variant?: 'primary' | 'default' | 'outline' | 'mobile'
  size?: 'small' | 'middle' | 'large'
  className?: string
}

const FilterDrawerTrigger = ({ 
  onClick, 
  ns, 
  count, 
  variant = 'default',
  size = 'middle',
  className = ''
}: FilterDrawerTriggerProps) => {
  const { t } = useTranslation(ns)

  const getButtonProps = () => {
    switch (variant) {
      case 'primary':
        return {
          type: 'primary' as const,
          className: `p-2 sm:p-3 border-0 shadow-lg hover:shadow-xl transition-all duration-300 ${className}`
        }
      case 'outline':
        return {
          type: 'default' as const,
          className: `border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:border-gray-400 dark:hover:border-gray-500 ${className}`
        }
      case 'mobile':
        return {
          type: 'default' as const,
          className: `w-full h-12 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:border-blue-500 dark:hover:border-blue-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-200 ${className}`
        }
      default:
        return {
          type: 'default' as const,
          className: `bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:border-gray-300 dark:hover:border-gray-600 ${className}`
        }
    }
  }

  const buttonProps = getButtonProps()

  if (variant === 'mobile') {
    return (
      <Button
        {...buttonProps}
        icon={<FaFilter className="mr-2" />}
        onClick={onClick}
        size={size}
      >
        {t('common.filter', { ns: 'common' })}
        {count && count > 0 && (
          <span className="ml-2 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 text-xs px-2 py-1 rounded-full">
            {count}
          </span>
        )}
      </Button>
    )
  }

  return (
    <div className='flex justify-end'>
      <Button
        {...buttonProps}
        icon={<FaFilter />}
        onClick={onClick}
        size={size}
      >
        {count && count > 0 && (
          <span className="ml-2 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 text-xs px-2 py-1 rounded-full">
            {count}
          </span>
        )}
      </Button>
    </div>
  )
}

export default FilterDrawerTrigger
