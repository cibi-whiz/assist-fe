import React from 'react'
import { Input as AntdInput } from 'antd'

const Input = ({ label, value, onChange, placeholder, Icon }: { label: string, value: string, onChange: (e: any) => void, placeholder?: string, Icon?: React.ReactNode }) => {
  return (
    <div className="w-full">
      <label className="flex items-center block text-sm font-medium text-gray-700 dark:text-gray-100 mb-2">
        {label}
      </label>
      <AntdInput 
        type="text" 
        value={value} 
        onChange={onChange} 
        placeholder={placeholder} 
        className="w-full px-3 py-2.5 text-sm border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200" 
      />
    </div>
  )
}

export default Input