import React, { useState } from 'react';
import { FaDownload, FaSearch, FaSort, FaSortUp, FaSortDown, FaTimes, FaChevronLeft, FaChevronRight, FaEye, FaEnvelope } from 'react-icons/fa';

interface Filters {
  dateRange: string;
  email: string;
  country: string;
  mail: string;
  mailSentBy: string;
  existingCustomers: boolean;
}

interface CartItem {
  id: number;
  customerName: string;
  customerEmail: string;
  mailStatus: string;
  mailSentBy: string;
  addedOn: string;
  orderTotal: string;
  lastActivity: string;
  items: number;
  priority: 'high' | 'medium' | 'low';
}

const AbandonedCart: React.FC = () => {
  const [filters, setFilters] = useState<Filters>({
    dateRange: '01-May-2025 - 30-Jul-2025',
    email: '',
    country: '',
    mail: '',
    mailSentBy: '',
    existingCustomers: false
  });

  const [currentPage, setCurrentPage] = useState<number>(1);
  const [itemsPerPage, setItemsPerPage] = useState<number>(5);
  const [sortField, setSortField] = useState<string>('addedOn');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const [tableData] = useState<CartItem[]>([
    {
      id: 1,
      customerName: 'Bala',
      customerEmail: 'balasonavane622@gmail.com',
      mailStatus: 'Generate Email',
      mailSentBy: '-',
      addedOn: '30-Jul-2025',
      orderTotal: '₹ 85049.00',
      lastActivity: '2 hours ago',
      items: 3,
      priority: 'high'
    },
    {
      id: 2,
      customerName: 'Ashwini Anandhakumar',
      customerEmail: 'almeer_91@hotmail.com',
      mailStatus: 'Generate Email',
      mailSentBy: '-',
      addedOn: '30-Jul-2025',
      orderTotal: '$39.90',
      lastActivity: '4 hours ago',
      items: 1,
      priority: 'medium'
    },
    {
      id: 3,
      customerName: 'Prenesh',
      customerEmail: 'prenesh@example.com',
      mailStatus: 'Generate Email',
      mailSentBy: '-',
      addedOn: '30-Jul-2025',
      orderTotal: '$19.95',
      lastActivity: '6 hours ago',
      items: 2,
      priority: 'low'
    },
    {
      id: 4,
      customerName: 'Hasan',
      customerEmail: 'hasan@example.com',
      mailStatus: 'Generate Email',
      mailSentBy: '-',
      addedOn: '30-Jul-2025',
      orderTotal: '₹ 25000.00',
      lastActivity: '8 hours ago',
      items: 4,
      priority: 'high'
    },
    {
      id: 5,
      customerName: 'Alister',
      customerEmail: 'alister@example.com',
      mailStatus: 'Generate Email',
      mailSentBy: '-',
      addedOn: '30-Jul-2025',
      orderTotal: '$29.99',
      lastActivity: '1 day ago',
      items: 1,
      priority: 'medium'
    },
    {
      id: 6,
      customerName: 'Sundar',
      customerEmail: 'sundar@example.com',
      mailStatus: 'Generate Email',
      mailSentBy: '-',
      addedOn: '30-Jul-2025',
      orderTotal: '₹ 15000.00',
      lastActivity: '1 day ago',
      items: 2,
      priority: 'low'
    },
    {
      id: 7,
      customerName: 'swathi',
      customerEmail: 'swathi@example.com',
      mailStatus: 'Generate Email',
      mailSentBy: '-',
      addedOn: '30-Jul-2025',
      orderTotal: '$45.00',
      lastActivity: '2 days ago',
      items: 1,
      priority: 'medium'
    },
    {
      id: 8,
      customerName: 'Rahul',
      customerEmail: 'rahul@example.com',
      mailStatus: 'Generate Email',
      mailSentBy: '-',
      addedOn: '30-Jul-2025',
      orderTotal: '₹ 30000.00',
      lastActivity: '2 days ago',
      items: 3,
      priority: 'high'
    },
    {
      id: 9,
      customerName: 'Priya',
      customerEmail: 'priya@example.com',
      mailStatus: 'Generate Email',
      mailSentBy: '-',
      addedOn: '30-Jul-2025',
      orderTotal: '$25.50',
      lastActivity: '3 days ago',
      items: 2,
      priority: 'low'
    },
    {
      id: 10,
      customerName: 'Vikram',
      customerEmail: 'vikram@example.com',
      mailStatus: 'Generate Email',
      mailSentBy: '-',
      addedOn: '30-Jul-2025',
      orderTotal: '₹ 50000.00',
      lastActivity: '3 days ago',
      items: 5,
      priority: 'high'
    }
  ]);

  const handleFilterChange = (field: keyof Filters, value: string | boolean): void => {
    setFilters(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSearch = (): void => {
    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
    }, 1000);
  };

  const handleExport = (): void => {
    // Export functionality
    console.log('Exporting data...');
  };

  const handleSort = (field: string): void => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const getSortIcon = (field: string) => {
    if (sortField !== field) return <FaSort className="text-gray-400" />;
    return sortDirection === 'asc' ? <FaSortUp className="text-blue-600" /> : <FaSortDown className="text-blue-600" />;
  };

  const handleClear = (): void => {
    setFilters({
      dateRange: '01-May-2025 - 30-Jul-2025',
      email: '',
      country: '',
      mail: '',
      mailSentBy: '',
      existingCustomers: false
    });
  };

  // Pagination calculations
  const totalPages = Math.ceil(tableData.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentData = tableData.slice(startIndex, endIndex);

  // Generate page numbers for pagination
  const getPageNumbers = () => {
    const pages = [];
    const maxVisiblePages = 5;
    
    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      if (currentPage <= 3) {
        for (let i = 1; i <= 4; i++) {
          pages.push(i);
        }
        pages.push('...');
        pages.push(totalPages);
      } else if (currentPage >= totalPages - 2) {
        pages.push(1);
        pages.push('...');
        for (let i = totalPages - 3; i <= totalPages; i++) {
          pages.push(i);
        }
      } else {
        pages.push(1);
        pages.push('...');
        for (let i = currentPage - 1; i <= currentPage + 1; i++) {
          pages.push(i);
        }
        pages.push('...');
        pages.push(totalPages);
      }
    }
    
    return pages;
  };

  const getPriorityColor = (priority: string): string => {
    switch (priority) {
      case 'high': return 'text-red-600 bg-red-50 border-red-200';
      case 'medium': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'low': return 'text-green-600 bg-green-50 border-green-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-2 sm:space-y-0">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-gray-100">Abandoned Cart</h1>
          <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">Manage and recover abandoned shopping carts</p>
        </div>
        <div className="flex space-x-2">
          <button
            onClick={handleExport}
            className="px-3 py-1.5 bg-green-600 text-white text-sm rounded-lg hover:bg-green-700 transition-colors duration-200 flex items-center space-x-1"
          >
            <FaDownload className="w-3 h-3" />
            <span>Export</span>
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white dark:bg-gray-900 p-4 rounded-lg shadow-sm border border-gray-200 dark:border-gray-800">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          <div>
            <label className="block text-xs font-medium text-gray-700 dark:text-gray-200 mb-1">Date Range</label>
            <input
              type="text"
              value={filters.dateRange}
              onChange={(e) => handleFilterChange('dateRange', e.target.value)}
              className="w-full px-2 py-1.5 text-sm border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-700 dark:text-gray-200 mb-1">Email</label>
            <input
              type="email"
              value={filters.email}
              onChange={(e) => handleFilterChange('email', e.target.value)}
              placeholder="Search by email"
              className="w-full px-2 py-1.5 text-sm border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-700 dark:text-gray-200 mb-1">Country</label>
            <select
              value={filters.mail}
              onChange={(e) => handleFilterChange('mail', e.target.value)}
              className="w-full px-2 py-1.5 text-sm border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
            >
              <option value="">All</option>
              <option value="sent">Already Sent</option>
              <option value="not-sent">Generate Email</option>
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-700 dark:text-gray-200 mb-1">Mail Status</label>
            <select
              value={filters.mail}
              onChange={(e) => handleFilterChange('mail', e.target.value)}
              className="w-full px-2 py-1.5 text-sm border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
            >
              <option value="">All</option>
              <option value="sent">Already Sent</option>
              <option value="not-sent">Generate Email</option>
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-700 dark:text-gray-200 mb-1">Mail Sent By</label>
            <select
              value={filters.mail}
              onChange={(e) => handleFilterChange('mail', e.target.value)}
              className="w-full px-2 py-1.5 text-sm border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
            >
              <option value="">All</option>
              <option value="sent">Already Sent</option>
              <option value="not-sent">Generate Email</option>
            </select>
          </div>
          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="existingCustomers"
              checked={filters.existingCustomers}
              onChange={(e) => handleFilterChange('existingCustomers', e.target.checked)}
              className="w-3 h-3 cursor-pointer text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
            />
            <label htmlFor="existingCustomers" className="text-xs font-medium text-gray-700 dark:text-gray-200">
              Existing Customers Only
            </label>
          </div>
        </div>

        <div className="mt-3 flex space-x-2">
          <button
            onClick={handleSearch}
            disabled={isLoading}
            className="px-3 py-1.5 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700 transition-colors duration-200 flex items-center space-x-1 disabled:opacity-50"
          >
            <FaSearch className="w-3 h-3" />
            <span>{isLoading ? 'Searching...' : 'Search'}</span>
          </button>
          <button
            onClick={handleClear}
            className="px-3 py-1.5 bg-gray-500 text-white text-sm rounded-md hover:bg-gray-600 transition-colors duration-200 flex items-center space-x-1"
          >
            <FaTimes className="w-3 h-3" />
            <span>Clear</span>
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white dark:bg-gray-900 rounded-lg shadow-sm border border-gray-200 dark:border-gray-800 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-gray-800">
              <tr>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  #
                </th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Customer
                </th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  <button
                    onClick={() => handleSort('addedOn')}
                    className="flex items-center space-x-1 hover:text-gray-700 dark:hover:text-gray-200"
                  >
                    <span>Added On</span>
                    {getSortIcon('addedOn')}
                  </button>
                </th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  <button
                    onClick={() => handleSort('orderTotal')}
                    className="flex items-center space-x-1 hover:text-gray-700 dark:hover:text-gray-200"
                  >
                    <span>Order Total</span>
                    {getSortIcon('orderTotal')}
                  </button>
                </th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  <button
                    onClick={() => handleSort('lastActivity')}
                    className="flex items-center space-x-1 hover:text-gray-700 dark:hover:text-gray-200"
                  >
                    <span>Last Activity</span>
                    {getSortIcon('lastActivity')}
                  </button>
                </th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Items
                </th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Priority
                </th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
              {currentData.map((item, index) => (
                <tr key={item.id} className="hover:bg-gray-50 dark:hover:bg-gray-800">
                  <td className="px-4 py-2 whitespace-nowrap text-xs text-gray-900 dark:text-gray-100">
                    {startIndex + index + 1}
                  </td>
                  <td className="px-4 py-2 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900 dark:text-gray-100">{item.customerName}</div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">{item.customerEmail}</div>
                    </div>
                  </td>
                  <td className="px-4 py-2 whitespace-nowrap text-xs text-gray-900 dark:text-gray-100">
                    {item.addedOn}
                  </td>
                  <td className="px-4 py-2 whitespace-nowrap text-xs text-gray-900 dark:text-gray-100">
                    {item.orderTotal}
                  </td>
                  <td className="px-4 py-2 whitespace-nowrap text-xs text-gray-500 dark:text-gray-400">
                    {item.lastActivity}
                  </td>
                  <td className="px-4 py-2 whitespace-nowrap text-xs text-gray-900 dark:text-gray-100">
                    {item.items}
                  </td>
                  <td className="px-4 py-2 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-0.5 text-xs font-medium rounded-full border ${getPriorityColor(item.priority)}`}>
                      {item.priority}
                    </span>
                  </td>
                  <td className="px-4 py-2 whitespace-nowrap text-xs font-medium">
                    <div className="flex space-x-1">
                      <button
                        onClick={() => console.log('Generate email for:', item.id)}
                        className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300 p-1"
                        title="Generate Email"
                      >
                        <FaEnvelope className="w-3 h-3" />
                      </button>
                      <button
                        onClick={() => console.log('View details for:', item.id)}
                        className="text-green-600 hover:text-green-900 dark:text-green-400 dark:hover:text-green-300 p-1"
                        title="View Details"
                      >
                        <FaEye className="w-3 h-3" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Enhanced Pagination */}
      <div className="bg-white dark:bg-gray-900 rounded-lg shadow-sm border border-gray-200 dark:border-gray-800 p-3">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-2 sm:space-y-0">
          {/* Items per page and info */}
          <div className="flex items-center space-x-2 text-xs text-gray-700 dark:text-gray-300">
            <span>Show</span>
            <select
              value={itemsPerPage}
              onChange={(e) => {
                setItemsPerPage(Number(e.target.value));
                setCurrentPage(1);
              }}
              className="px-2 py-1 text-xs border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
            >
              <option value={5}>5</option>
              <option value={10}>10</option>
              <option value={25}>25</option>
              <option value={50}>50</option>
            </select>
            <span>entries</span>
            <span className="text-gray-500 dark:text-gray-400">
              Showing {startIndex + 1} to {Math.min(endIndex, tableData.length)} of {tableData.length} results
            </span>
          </div>

          {/* Pagination Controls */}
          <div className="flex items-center space-x-1">
            {/* Previous Button */}
            <button
              onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
              className="px-2 py-1 text-xs border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-1"
            >
              <FaChevronLeft className="w-2 h-2" />
              <span>Prev</span>
            </button>

            {/* Page Numbers */}
            <div className="flex items-center space-x-1">
              {getPageNumbers().map((page, index) => (
                <button
                  key={index}
                  onClick={() => typeof page === 'number' && setCurrentPage(page)}
                  disabled={page === '...'}
                  className={`px-2 py-1 text-xs rounded-md border transition-colors duration-200 ${
                    page === currentPage
                      ? 'bg-blue-600 text-white border-blue-600'
                      : page === '...'
                      ? 'text-gray-400 cursor-default'
                      : 'border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
                  }`}
                >
                  {page}
                </button>
              ))}
            </div>

            {/* Next Button */}
            <button
              onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
              disabled={currentPage === totalPages}
              className="px-2 py-1 text-xs border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-1"
            >
              <span>Next</span>
              <FaChevronRight className="w-2 h-2" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AbandonedCart; 