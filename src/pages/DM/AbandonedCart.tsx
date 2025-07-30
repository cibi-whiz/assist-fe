import React, { useState } from 'react';
import { FaDownload, FaSearch, FaTimes, FaFilter, FaEye, FaEnvelope, FaCalendarAlt, FaUser, FaGlobe, FaEnvelopeOpen, FaDollarSign, FaSort, FaSortUp, FaSortDown, FaBell } from 'react-icons/fa';

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
  const [itemsPerPage, setItemsPerPage] = useState<number>(10);
  const [sortField, setSortField] = useState<string>('addedOn');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  const [selectedItems, setSelectedItems] = useState<number[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [searchTerm, setSearchTerm] = useState<string>('');

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

  const handleClear = (): void => {
    setFilters({
      dateRange: '01-May-2025 - 30-Jul-2025',
      email: '',
      country: '',
      mail: '',
      mailSentBy: '',
      existingCustomers: false
    });
    setSearchTerm('');
    setSelectedItems([]);
  };

  const handleExport = (): void => {
    // Export functionality
    console.log('Exporting data...');
  };

  const handleGenerateEmail = (customerId: number): void => {
    console.log('Generating email for customer:', customerId);
  };

  const handleViewDetails = (customerId: number): void => {
    console.log('Viewing details for customer:', customerId);
  };

  const handleSort = (field: string): void => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const handleSelectAll = (): void => {
    if (selectedItems.length === tableData.length) {
      setSelectedItems([]);
    } else {
      setSelectedItems(tableData.map(item => item.id));
    }
  };

  const handleSelectItem = (id: number): void => {
    setSelectedItems(prev => 
      prev.includes(id) 
        ? prev.filter(itemId => itemId !== id)
        : [...prev, id]
    );
  };

  const getPriorityColor = (priority: string): string => {
    switch (priority) {
      case 'high': return 'text-red-600 bg-red-100';
      case 'medium': return 'text-yellow-600 bg-yellow-100';
      case 'low': return 'text-green-600 bg-green-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getSortIcon = (field: string) => {
    if (sortField !== field) return <FaSort className="text-gray-400" />;
    return sortDirection === 'asc' ? <FaSortUp className="text-blue-600" /> : <FaSortDown className="text-blue-600" />;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-3 sm:space-y-0">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-gray-100">Abandoned Cart</h1>
          <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300 mt-1">Manage and recover abandoned shopping carts</p>
        </div>
        <div className="flex space-x-3">
          <button
            onClick={handleExport}
            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors duration-200 flex items-center space-x-2"
          >
            <FaDownload className="w-4 h-4" />
            <span>Export</span>
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white dark:bg-gray-900 p-6 rounded-xl shadow-lg border border-gray-200 dark:border-gray-800">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 flex items-center space-x-2">
            <FaFilter className="w-5 h-5" />
            <span>Filters</span>
          </h3>
          <button
            onClick={handleClear}
            className="text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 flex items-center space-x-1"
          >
            <FaTimes className="w-4 h-4" />
            <span>Clear</span>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">Date Range</label>
            <input
              type="text"
              value={filters.dateRange}
              onChange={(e) => handleFilterChange('dateRange', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">Email</label>
            <input
              type="email"
              value={filters.email}
              onChange={(e) => handleFilterChange('email', e.target.value)}
              placeholder="Search by email"
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">Country</label>
            <input
              type="text"
              value={filters.country}
              onChange={(e) => handleFilterChange('country', e.target.value)}
              placeholder="Search by country"
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">Mail Status</label>
            <select
              value={filters.mail}
              onChange={(e) => handleFilterChange('mail', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
            >
              <option value="">All</option>
              <option value="sent">Sent</option>
              <option value="not-sent">Not Sent</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">Mail Sent By</label>
            <input
              type="text"
              value={filters.mailSentBy}
              onChange={(e) => handleFilterChange('mailSentBy', e.target.value)}
              placeholder="Search by sender"
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
            />
          </div>
          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="existingCustomers"
              checked={filters.existingCustomers}
              onChange={(e) => handleFilterChange('existingCustomers', e.target.checked)}
              className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
            />
            <label htmlFor="existingCustomers" className="text-sm font-medium text-gray-700 dark:text-gray-200">
              Existing Customers Only
            </label>
          </div>
        </div>

        <div className="mt-4 flex space-x-3">
          <button
            onClick={handleSearch}
            disabled={isLoading}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 flex items-center space-x-2 disabled:opacity-50"
          >
            <FaSearch className="w-4 h-4" />
            <span>{isLoading ? 'Searching...' : 'Search'}</span>
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white dark:bg-gray-900 rounded-xl shadow-lg border border-gray-200 dark:border-gray-800 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-gray-800">
              <tr>
                <th className="px-6 py-3 text-left">
                  <input
                    type="checkbox"
                    checked={selectedItems.length === tableData.length}
                    onChange={handleSelectAll}
                    className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
                  />
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Customer
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  <button
                    onClick={() => handleSort('addedOn')}
                    className="flex items-center space-x-1 hover:text-gray-700 dark:hover:text-gray-200"
                  >
                    <span>Added On</span>
                    {getSortIcon('addedOn')}
                  </button>
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  <button
                    onClick={() => handleSort('orderTotal')}
                    className="flex items-center space-x-1 hover:text-gray-700 dark:hover:text-gray-200"
                  >
                    <span>Order Total</span>
                    {getSortIcon('orderTotal')}
                  </button>
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  <button
                    onClick={() => handleSort('lastActivity')}
                    className="flex items-center space-x-1 hover:text-gray-700 dark:hover:text-gray-200"
                  >
                    <span>Last Activity</span>
                    {getSortIcon('lastActivity')}
                  </button>
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Items
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Priority
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
              {tableData.map((item) => (
                <tr key={item.id} className="hover:bg-gray-50 dark:hover:bg-gray-800">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <input
                      type="checkbox"
                      checked={selectedItems.includes(item.id)}
                      onChange={() => handleSelectItem(item.id)}
                      className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
                    />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900 dark:text-gray-100">{item.customerName}</div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">{item.customerEmail}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                    {item.addedOn}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                    {item.orderTotal}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                    {item.lastActivity}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                    {item.items}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getPriorityColor(item.priority)}`}>
                      {item.priority}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleGenerateEmail(item.id)}
                        className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300"
                        title="Generate Email"
                      >
                        <FaEnvelope className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleViewDetails(item.id)}
                        className="text-green-600 hover:text-green-900 dark:text-green-400 dark:hover:text-green-300"
                        title="View Details"
                      >
                        <FaEye className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <span className="text-sm text-gray-700 dark:text-gray-300">Show</span>
          <select
            value={itemsPerPage}
            onChange={(e) => setItemsPerPage(Number(e.target.value))}
            className="px-3 py-1 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
          >
            <option value={10}>10</option>
            <option value={25}>25</option>
            <option value={50}>50</option>
            <option value={100}>100</option>
          </select>
          <span className="text-sm text-gray-700 dark:text-gray-300">entries</span>
        </div>
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
            disabled={currentPage === 1}
            className="px-3 py-1 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50"
          >
            Previous
          </button>
          <span className="text-sm text-gray-700 dark:text-gray-300">
            Page {currentPage} of {Math.ceil(tableData.length / itemsPerPage)}
          </span>
          <button
            onClick={() => setCurrentPage(Math.min(Math.ceil(tableData.length / itemsPerPage), currentPage + 1))}
            disabled={currentPage === Math.ceil(tableData.length / itemsPerPage)}
            className="px-3 py-1 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default AbandonedCart; 