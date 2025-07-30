import React, { useState } from 'react';
import { FaDownload, FaSearch, FaTimes, FaFilter, FaEye, FaEnvelope, FaCalendarAlt, FaUser, FaGlobe, FaEnvelopeOpen, FaDollarSign, FaSort, FaSortUp, FaSortDown, FaBell } from 'react-icons/fa';

const AbandonedCart = () => {
  const [filters, setFilters] = useState({
    dateRange: '01-May-2025 - 30-Jul-2025',
    email: '',
    country: '',
    mail: '',
    mailSentBy: '',
    existingCustomers: false
  });

  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [sortField, setSortField] = useState('addedOn');
  const [sortDirection, setSortDirection] = useState('desc');
  const [selectedItems, setSelectedItems] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const [tableData] = useState([
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
      orderTotal: '$49.99',
      lastActivity: '2 days ago',
      items: 1,
      priority: 'medium'
    },
    {
      id: 8,
      customerName: 'Ashish Das',
      customerEmail: 'ashish@example.com',
      mailStatus: 'Generate Email',
      mailSentBy: '-',
      addedOn: '30-Jul-2025',
      orderTotal: '₹ 30000.00',
      lastActivity: '2 days ago',
      items: 3,
      priority: 'high'
    }
  ]);

  // Filter and sort data
  const filteredData = tableData.filter(item => {
    const matchesSearch = searchTerm === '' || 
      item.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.customerEmail.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesEmail = filters.email === '' || 
      item.customerEmail.toLowerCase().includes(filters.email.toLowerCase());
    
    const matchesCountry = filters.country === '' || true; // Add country logic
    const matchesMail = filters.mail === '' || true; // Add mail status logic
    const matchesMailSentBy = filters.mailSentBy === '' || true; // Add mail sent by logic
    
    return matchesSearch && matchesEmail && matchesCountry && matchesMail && matchesMailSentBy;
  });

  const sortedData = [...filteredData].sort((a, b) => {
    let aValue = a[sortField];
    let bValue = b[sortField];
    
    if (sortField === 'orderTotal') {
      aValue = parseFloat(aValue.replace(/[₹$,]/g, ''));
      bValue = parseFloat(bValue.replace(/[₹$,]/g, ''));
    }
    
    if (sortDirection === 'asc') {
      return aValue > bValue ? 1 : -1;
    } else {
      return aValue < bValue ? 1 : -1;
    }
  });

  const totalPages = Math.ceil(sortedData.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentData = sortedData.slice(startIndex, endIndex);

  const handleFilterChange = (field, value) => {
    setFilters(prev => ({
      ...prev,
      [field]: value
    }));
    setCurrentPage(1);
  };

  const handleSearch = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
    }, 1000);
  };

  const handleClear = () => {
    setFilters({
      dateRange: '01-May-2025 - 30-Jul-2025',
      email: '',
      country: '',
      mail: '',
      mailSentBy: '',
      existingCustomers: false
    });
    setSearchTerm('');
    setCurrentPage(1);
  };

  const handleExport = () => {
    console.log('Exporting data...');
  };

  const handleGenerateEmail = (customerId) => {
    console.log('Generating email for customer:', customerId);
  };

  const handleViewDetails = (customerId) => {
    console.log('Viewing details for customer:', customerId);
  };

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 p-2">
      <div className="max-w-9xl mx-auto space-y-6">
        {/* Enhanced Header with Notifications */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
            <div className="mb-4 lg:mb-0">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-gradient-to-r from-orange-500 to-red-500 rounded-lg">
                  <FaEnvelopeOpen className="text-white text-lg" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
                    Abandoned Cart
                  </h1>
                  <p className="text-gray-600 dark:text-gray-400 mt-1 text-sm">
                    Track and recover abandoned shopping carts with advanced analytics
                  </p>
                </div>
              </div>
            </div>
            <div className="flex flex-col sm:flex-row items-center space-y-3 sm:space-y-0 sm:space-x-3">
              <div className="relative">
                <select 
                  value={itemsPerPage}
                  onChange={(e) => setItemsPerPage(Number(e.target.value))}
                  className="appearance-none px-4 py-2 pr-8 border-2 border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all duration-200 text-sm font-medium"
                >
                  <option value={10}>10 per page</option>
                  <option value={25}>25 per page</option>
                  <option value={50}>50 per page</option>
                  <option value={100}>100 per page</option>
                </select>
                <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                  <FaFilter className="text-gray-400 text-sm" />
                </div>
              </div>
              <button
                onClick={handleExport}
                className="flex items-center px-4 py-2 bg-gradient-to-r from-gray-600 to-gray-700 text-white rounded-lg hover:from-gray-700 hover:to-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-500 transform hover:scale-105 transition-all duration-200 text-sm font-medium shadow-lg"
              >
                <FaDownload className="mr-2 text-sm" />
                EXPORT
              </button>
              <div className="relative">
                <button className="flex items-center px-4 py-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:from-blue-700 hover:to-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-500 transform hover:scale-105 transition-all duration-200 text-sm font-medium shadow-lg">
                  <FaBell className="mr-2 text-sm" />
                  <span className="bg-red-500 text-white text-xs rounded-full px-2 py-1 ml-2">3</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Enhanced Filter Section */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 px-6 py-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <FaFilter className="text-white text-sm" />
                <h2 className="text-lg font-semibold text-white">Advanced Filters</h2>
              </div>
              <button
                onClick={handleClear}
                className="text-white text-xs hover:text-gray-200 transition-colors"
              >
                Clear All
              </button>
            </div>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="space-y-1">
                <label className="flex items-center text-xs font-semibold text-gray-700 dark:text-gray-300">
                  <FaCalendarAlt className="mr-2 text-orange-500 text-xs" />
                  Date Range
                </label>
                <select
                  value={filters.dateRange}
                  onChange={(e) => handleFilterChange('dateRange', e.target.value)}
                  className="w-full px-3 py-2 border-2 border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all duration-200 bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
                >
                  <option>01-May-2025 - 30-Jul-2025</option>
                  <option>01-Jun-2025 - 30-Aug-2025</option>
                  <option>01-Jul-2025 - 30-Sep-2025</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="flex items-center text-xs font-semibold text-gray-700 dark:text-gray-300">
                  <FaEnvelope className="mr-2 text-blue-500 text-xs" />
                  Email Address
                </label>
                <input
                  type="email"
                  value={filters.email}
                  onChange={(e) => handleFilterChange('email', e.target.value)}
                  className="w-full px-3 py-2 border-2 border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all duration-200 bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
                  placeholder="Enter customer email"
                />
              </div>

              <div className="space-y-1">
                <label className="flex items-center text-xs font-semibold text-gray-700 dark:text-gray-300">
                  <FaGlobe className="mr-2 text-green-500 text-xs" />
                  Country
                </label>
                <select
                  value={filters.country}
                  onChange={(e) => handleFilterChange('country', e.target.value)}
                  className="w-full px-3 py-2 border-2 border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all duration-200 bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
                >
                  <option value="">All Countries</option>
                  <option value="US">United States</option>
                  <option value="IN">India</option>
                  <option value="UK">United Kingdom</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="flex items-center text-xs font-semibold text-gray-700 dark:text-gray-300">
                  <FaEnvelopeOpen className="mr-2 text-purple-500 text-xs" />
                  Mail Status
                </label>
                <select
                  value={filters.mail}
                  onChange={(e) => handleFilterChange('mail', e.target.value)}
                  className="w-full px-3 py-2 border-2 border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all duration-200 bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
                >
                  <option value="">All Status</option>
                  <option value="sent">Sent</option>
                  <option value="not-sent">Not Sent</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="flex items-center text-xs font-semibold text-gray-700 dark:text-gray-300">
                  <FaUser className="mr-2 text-indigo-500 text-xs" />
                  Mail Sent By
                </label>
                <select
                  value={filters.mailSentBy}
                  onChange={(e) => handleFilterChange('mailSentBy', e.target.value)}
                  className="w-full px-3 py-2 border-2 border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all duration-200 bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
                >
                  <option value="">All Sources</option>
                  <option value="system">System</option>
                  <option value="manual">Manual</option>
                </select>
              </div>

              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="existingCustomers"
                  checked={filters.existingCustomers}
                  onChange={(e) => handleFilterChange('existingCustomers', e.target.checked)}
                  className="h-4 w-4 text-orange-600 focus:ring-orange-500 border-gray-300 rounded transition-all duration-200"
                />
                <label htmlFor="existingCustomers" className="text-xs font-semibold text-gray-700 dark:text-gray-300">
                  Existing Customers Only
                </label>
              </div>
            </div>

            <div className="mt-6 flex justify-end flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-3">
              <button
                onClick={handleSearch}
                disabled={isLoading}
                className="flex-1 sm:flex-none flex items-center justify-center px-6 py-3 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-lg hover:from-blue-600 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transform hover:scale-105 transition-all duration-200 text-sm font-semibold shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                ) : (
                  <FaSearch className="mr-2 text-sm" />
                )}
                {isLoading ? 'SEARCHING...' : 'SEARCH'}
              </button>
              <button
                onClick={handleClear}
                className="flex-1 sm:flex-none flex items-center justify-center px-6 py-3 bg-gradient-to-r from-gray-500 to-gray-600 text-white rounded-lg hover:from-gray-600 hover:to-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 transform hover:scale-105 transition-all duration-200 text-sm font-semibold shadow-lg"
              >
                <FaTimes className="mr-2 text-sm" />
                CLEAR
              </button>
            </div>
          </div>
        </div>

        {/* Enhanced Data Table */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
          <div className="bg-gradient-to-r from-blue-800 to-blue-900 px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <FaEnvelopeOpen className="text-white text-lg" />
                <h2 className="text-xl font-bold text-white">Recent Abandoned Carts</h2>
              </div>
              <div className="text-white text-xs">
                Showing {startIndex + 1}-{Math.min(endIndex, sortedData.length)} of {sortedData.length} results
              </div>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-700 dark:to-gray-800">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                    <button
                      onClick={() => handleSort('id')}
                      className="flex items-center space-x-1 hover:text-gray-900 transition-colors"
                    >
                      <span>S.No</span>
                      {sortField === 'id' ? (
                        sortDirection === 'asc' ? <FaSortUp className="text-xs" /> : <FaSortDown className="text-xs" />
                      ) : (
                        <FaSort className="text-xs text-gray-400" />
                      )}
                    </button>
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                    <button
                      onClick={() => handleSort('customerName')}
                      className="flex items-center space-x-1 hover:text-gray-900 transition-colors"
                    >
                      <span>Customer Details</span>
                      {sortField === 'customerName' ? (
                        sortDirection === 'asc' ? <FaSortUp className="text-xs" /> : <FaSortDown className="text-xs" />
                      ) : (
                        <FaSort className="text-xs text-gray-400" />
                      )}
                    </button>
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider">Mail Status</th>
                  <th className="px-4 py-3 text-left text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider">Mail Sent By</th>
                  <th className="px-4 py-3 text-left text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                    <button
                      onClick={() => handleSort('addedOn')}
                      className="flex items-center space-x-1 hover:text-gray-900 transition-colors"
                    >
                      <span>Added On</span>
                      {sortField === 'addedOn' ? (
                        sortDirection === 'asc' ? <FaSortUp className="text-xs" /> : <FaSortDown className="text-xs" />
                      ) : (
                        <FaSort className="text-xs text-gray-400" />
                      )}
                    </button>
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                    <button
                      onClick={() => handleSort('orderTotal')}
                      className="flex items-center space-x-1 hover:text-gray-900 transition-colors"
                    >
                      <span>Order Total</span>
                      {sortField === 'orderTotal' ? (
                        sortDirection === 'asc' ? <FaSortUp className="text-xs" /> : <FaSortDown className="text-xs" />
                      ) : (
                        <FaSort className="text-xs text-gray-400" />
                      )}
                    </button>
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                {currentData.map((row, index) => (
                  <tr key={row.id} className={`hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 dark:hover:from-gray-700 dark:hover:to-gray-800 transition-all duration-200 ${index % 2 === 0 ? 'bg-white dark:bg-gray-800' : 'bg-gray-50 dark:bg-gray-700'}`}>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="w-6 h-6 bg-gradient-to-r from-orange-500 to-red-500 rounded-full flex items-center justify-center text-white text-xs font-bold">
                          {row.id}
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <div className="space-y-1">
                        <div className="flex items-center space-x-2">
                          <span className="text-xs font-semibold text-gray-900 dark:text-white">{row.customerName}</span>
                        </div>
                        <div className="text-xs text-gray-600 dark:text-gray-400">{row.customerEmail}</div>
                      </div>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <button
                        onClick={() => handleGenerateEmail(row.id)}
                        className="inline-flex items-center px-3 py-1 bg-gradient-to-r from-blue-600 to-blue-700 text-white text-xs font-medium rounded-md hover:from-blue-700 hover:to-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-500 transform hover:scale-105 transition-all duration-200"
                      >
                        <FaEnvelope className="mr-1 text-xs" />
                        {row.mailStatus}
                      </button>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <div className="flex items-center">
                        <span className="text-xs text-gray-900 dark:text-white">{row.mailSentBy}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <div className="flex items-center">
                        <FaCalendarAlt className="mr-1 text-gray-400 text-xs" />
                        <span className="text-xs text-gray-900 dark:text-white">{row.addedOn}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <div className="flex items-center">
                        <FaDollarSign className="mr-1 text-green-500 text-xs" />
                        <span className="text-xs font-semibold text-gray-900 dark:text-white">{row.orderTotal}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <div className="flex space-x-1">
                        <button
                          onClick={() => handleViewDetails(row.id)}
                          className="inline-flex items-center px-2 py-1 border border-gray-300 dark:border-gray-600 text-xs font-medium rounded-md text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200"
                          title="View Details"
                        >
                          <FaEye className="mr-1 text-xs" />
                          View
                        </button>
                        <button
                          onClick={() => handleGenerateEmail(row.id)}
                          className="inline-flex items-center px-2 py-1 border border-transparent text-xs font-medium rounded-md text-white bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 focus:outline-none focus:ring-2 focus:ring-green-500 transition-all duration-200"
                          title="Send Email"
                        >
                          <FaEnvelope className="mr-1 text-xs" />
                          Email
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Enhanced Pagination */}
          {totalPages > 1 && (
            <div className="bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-700 dark:to-gray-800 px-6 py-4 border-t border-gray-200 dark:border-gray-600">
              <div className="flex items-center justify-between">
                <div className="text-sm text-gray-700 dark:text-gray-300 font-medium">
                  Showing <span className="font-bold text-blue-600 dark:text-blue-400">{startIndex + 1}</span> to <span className="font-bold text-blue-600 dark:text-blue-400">{Math.min(endIndex, sortedData.length)}</span> of <span className="font-bold text-blue-600 dark:text-blue-400">{sortedData.length}</span> results
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                    disabled={currentPage === 1}
                    className="px-4 py-2 text-sm border-2 border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gradient-to-r hover:from-blue-50 hover:to-blue-100 dark:hover:from-gray-600 dark:hover:to-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 font-medium shadow-sm"
                  >
                    Previous
                  </button>
                  
                  <div className="flex items-center space-x-1">
                    {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                      const page = i + 1;
                      return (
                        <button
                          key={page}
                          onClick={() => setCurrentPage(page)}
                          className={`px-3 py-2 text-sm rounded-lg transition-all duration-200 font-medium shadow-sm ${
                            currentPage === page
                              ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-lg transform scale-105'
                              : 'border-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gradient-to-r hover:from-blue-50 hover:to-blue-100 dark:hover:from-gray-600 dark:hover:to-gray-700'
                          }`}
                        >
                          {page}
                        </button>
                      );
                    })}
                  </div>
                  
                  <button
                    onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                    disabled={currentPage === totalPages}
                    className="px-4 py-2 text-sm border-2 border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gradient-to-r hover:from-blue-50 hover:to-blue-100 dark:hover:from-gray-600 dark:hover:to-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 font-medium shadow-sm"
                  >
                    Next
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AbandonedCart;