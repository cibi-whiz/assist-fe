import React, { useState } from 'react'
import { FaEnvelope, FaEye, FaEdit, FaTrash } from 'react-icons/fa'
import Table from './Table'

// Example data structure
interface User {
  id: number
  name: string
  email: string
  role: string
  status: 'active' | 'inactive'
  createdAt: string
}

// Example usage of the enhanced Table component
const TableExample: React.FC = () => {
  const [sortKey, setSortKey] = useState<string>('')
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc')

  // Sample data
  const users: User[] = [
    {
      id: 1,
      name: 'John Doe',
      email: 'john@example.com',
      role: 'Admin',
      status: 'active',
      createdAt: '2024-01-15'
    },
    {
      id: 2,
      name: 'Jane Smith',
      email: 'jane@example.com',
      role: 'User',
      status: 'active',
      createdAt: '2024-01-10'
    },
    {
      id: 3,
      name: 'Bob Johnson',
      email: 'bob@example.com',
      role: 'Moderator',
      status: 'inactive',
      createdAt: '2024-01-05'
    }
  ]

  // Column definitions
  const columns = [
    {
      key: 'id',
      label: 'ID',
      sortable: true,
      width: '80px'
    },
    {
      key: 'name',
      label: 'Name',
      sortable: true
    },
    {
      key: 'email',
      label: 'Email',
      sortable: true
    },
    {
      key: 'role',
      label: 'Role',
      sortable: true
    },
    {
      key: 'status',
      label: 'Status',
      sortable: true,
      render: (value: string) => (
        <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
          value === 'active' 
            ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' 
            : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
        }`}>
          {value}
        </span>
      )
    },
    {
      key: 'createdAt',
      label: 'Created At',
      sortable: true,
      render: (value: string) => new Date(value).toLocaleDateString()
    }
  ]

  // Action buttons
  const actions = [
    {
      icon: <FaEye className="w-4 h-4" />,
      onClick: (user: User) => console.log('View user:', user),
      title: 'View Details',
      className: 'text-blue-600 hover:text-blue-800'
    },
    {
      icon: <FaEdit className="w-4 h-4" />,
      onClick: (user: User) => console.log('Edit user:', user),
      title: 'Edit User',
      className: 'text-green-600 hover:text-green-800'
    },
    {
      icon: <FaTrash className="w-4 h-4" />,
      onClick: (user: User) => console.log('Delete user:', user),
      title: 'Delete User',
      className: 'text-red-600 hover:text-red-800'
    }
  ]

  // Handle sorting
  const handleSort = (key: string) => {
    if (sortKey === key) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')
    } else {
      setSortKey(key)
      setSortDirection('asc')
    }
  }

  // Sort data
  const sortedData = [...users].sort((a, b) => {
    if (!sortKey) return 0
    
    const aValue = a[sortKey as keyof User]
    const bValue = b[sortKey as keyof User]
    
    if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1
    if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1
    return 0
  })

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Enhanced Table Component Example</h1>
      
      <div className="mb-4">
        <h2 className="text-lg font-semibold mb-2">Users Table</h2>
        <p className="text-gray-600 dark:text-gray-400 mb-4">
          This table demonstrates the enhanced features including sorting, custom cell rendering, and configurable actions.
        </p>
      </div>

      <Table
        data={sortedData}
        columns={columns}
        actions={actions}
        onSort={handleSort}
        sortKey={sortKey}
        sortDirection={sortDirection}
        emptyStateMessage="No users found"
        emptyStateSubMessage="Try adding some users or adjusting your filters"
        loadingMessage="Loading users..."
        className="mb-6"
      />

      <div className="mt-8 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
        <h3 className="text-lg font-semibold mb-2">Features Demonstrated:</h3>
        <ul className="list-disc list-inside space-y-1 text-sm text-gray-600 dark:text-gray-400">
          <li>TypeScript interfaces for type safety</li>
          <li>Configurable columns with custom rendering</li>
          <li>Sortable columns with visual indicators</li>
          <li>Customizable action buttons</li>
          <li>Responsive design with dark mode support</li>
          <li>Loading and empty states</li>
          <li>Custom cell renderers for different data types</li>
          <li>Flexible row key configuration</li>
        </ul>
      </div>
    </div>
  )
}

export default TableExample
