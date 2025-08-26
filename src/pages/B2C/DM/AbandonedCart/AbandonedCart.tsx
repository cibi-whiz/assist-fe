import React, { useState, useEffect } from "react";
import {
  FaDownload,
  FaSearch,
  FaTimes,
  FaChevronLeft,
  FaChevronRight,
  FaGlobe,
  FaEnvelope,
  FaUser,
  FaEye,
  FaFilter,
  FaRedo,
  FaSort,
  FaSortUp,
  FaSortDown,
} from "react-icons/fa";
import { getCartData, createdByRequest } from "../../../../Services/DM/Abandoned/services";
import Daterange from "../../../../components/Daterange";
import { Input } from 'antd';
import { useToast } from "../../../../components/ToastContext";
import { Countries } from "../../../../Props/Countries";
import MailDrawer from "./MailDrawer";

import Autocomplete from "../../../../components/Autocomplete";
import Table from "../../../../components/Table";
// @ts-ignore
const moment = require("moment").default || require("moment");

interface Filters {
  from_date: string;
  to_date: string;
  email: string;
  country: { value: string | number; label: string } | null;
  customer: boolean;
  sent: string;
  sent_by: { value: string; label?: string } | null;
}

interface CartItem {
  id: number;
  first_name: string;
  user_id: number;
  last_name: string;
  email: string;
  country: { value: string | number; label: string } | null ;
  total_price: number;
  items_count: number;
  added_on: string;
  is_existing_customer: boolean;
  sent: boolean;
  sent_by: string;
  sender_name: string;
  currency_type: string;
  cart_details: any;
}

interface CreatedByOption {
  value: string;
  name?: string;
  email?: string;
}

interface SortConfig {
  key: keyof CartItem | null;
  direction: 'asc' | 'desc';
}

interface AbandonedCartProps {
  darkMode?: boolean;
}

const AbandonedCart: React.FC<AbandonedCartProps> = ({ darkMode = false }) => {
  const { showToast } = useToast();
  const [filters, setFilters] = useState<Filters>({
    from_date: moment().subtract(6, 'days').format('YYYY-MM-DD'),
    to_date: moment().format('YYYY-MM-DD'),
    email: "",
    country: null,
    customer: false,
    sent: "",
    sent_by: null,
  });
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  const [tableData, setTableData] = useState<CartItem[]>([]);
  const [sortConfig, setSortConfig] = useState<SortConfig>({ key: null, direction: 'asc' });
  const [pagination, setPagination] = useState({
    total: 0,
    page: 1,
    from: 0,
    current_page: 1,
    last_page: 1,
    per_page: 25,
  });

  // Country autocomplete states
  const [createdByOptions, setCreatedByOptions] = useState<CreatedByOption[]>([]);
  
  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCartItem, setSelectedCartItem] = useState<CartItem | null>(null);

  const columns = [
    {
      key: 'index',
      label: '#',
      sortable: false,
    },
    {
      key: 'email',
      label: 'Customer',
      sortable: true,
    },
    {
      key: 'total_price',
      label: 'Total Price',
      sortable: true,
    },
    {
      key: 'items_count',
      label: 'Items Count',
      sortable: true,
    },
    {
      key: 'updated_at',
      label: 'Added On',
      sortable: true,
    },
    {
      key: 'items_count',
      label: 'Priority',
      sortable: true,
    },
    {
      key: 'sender_name',
      label: 'Mail Sent By',
      sortable: true,
    }
  ]
  const actions = [
    {
      icon: <FaEye />,
      onClick: (item:any) => handleOpenModal(item),
      title: 'View Details'
    }
  ]

  const fetchData = async (page: number = 1) => {
    try {
      setIsLoading(true);
      const res = await getCartData({
        from_date: filters.from_date,
        to_date: filters.to_date,
        email: filters.email,
        country: filters.country ? String(filters.country.value) : "",
        sent: filters.sent,
        sent_by: filters.sent_by ? String(filters.sent_by.value) : "",
        customer: filters.customer ? 1 : 0,
        page: page,
        limit: pagination.per_page,
      });
      
      let data = res.data.data;
      data.forEach((item: CartItem) => {
        try {
          item.cart_details = JSON.parse(item.cart_details);
          item.items_count = item.cart_details.reduce((sum: number, item: any) => {
            return sum + (item.selectedCourseType?.length || 0);
          }, 0);
        } catch (parseError) {
          console.error('Error parsing cart details:', parseError);
          item.cart_details = [];
          item.items_count = 0;
        }
      });
      
      setTableData(data);
      setPagination({
        total: res.data.pagination.total,
        page: res.data.pagination.page,
        from: res.data.pagination.from,
        current_page: res.data.pagination.currentPage,
        last_page: res.data.pagination.lastPage,
        per_page: res.data.pagination.perPage,
      });
    } catch (error) {
      console.error('Error fetching cart data:', error);
      showToast('Failed to load abandoned cart data', 'error');
      setTableData([]);
      setPagination({
        total: 0,
        page: 1,
        from: 0,
        current_page: 1,
        last_page: 1,
        per_page: 25,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const fetchCreatedBy = async () => {
    try {
      const res = await createdByRequest();
      setCreatedByOptions(res.data || []);
    } catch (error) {
      console.error('Error fetching created by:', error);
      showToast('Failed to load created by options', 'error');
    }
  };

  useEffect(() => {
    fetchData();
  }, [filters]);

  useEffect(() => {
    fetchCreatedBy();
  }, []);


  const handleFilterChange = (key: keyof Filters, value: string | boolean | { value: string | number; label: string } | { value: string; label?: string } | null) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const handleDateRangeChange = (dateRange: any) => {
    setFilters((prev) => ({
      ...prev,
      from_date: dateRange.startDate,
      to_date: dateRange.endDate,
    }));
  };

  const handleSearch = (): void => {
    fetchData(1);
  };

  const handleRefresh = async (): Promise<void> => {
    setIsRefreshing(true);
    try {
      await fetchData(1);
      showToast('Data refreshed successfully', 'success');
    } catch (error) {
      showToast('Failed to refresh data', 'error');
    } finally {
      setIsRefreshing(false);
    }
  };

  const handleExport = (): void => {
    // Enhanced export functionality
    if (tableData.length === 0) {
      showToast('No data to export', 'warning');
      return;
    }
    
    const csvContent = generateCSV();
    downloadCSV(csvContent, `abandoned-cart-${moment().format('YYYY-MM-DD')}.csv`);
    showToast('Export completed successfully', 'success');
  };

  const generateCSV = (): string => {
    const headers = ['Customer Name', 'Email', 'Total Price', 'Items Count', 'Added On', 'Priority', 'Mail Sent By'];
    const rows = tableData.map(item => [
      `${item.first_name} ${item.last_name}`,
      item.email,
      `${item.currency_type === 'INR' ? '₹' :item.currency_type === 'USD' ? '$' :item.currency_type === 'EUR' ? '€' :item.currency_type ==="GBP" ? '£' : ''} ${item.total_price}`,
      item.items_count,
      moment(item.added_on).format('DD-MM-YYYY'),
      item.items_count >= 3 ? 'High' : item.items_count === 2 ? 'Medium' : 'Low',
      item.sender_name || '-'
    ]);
    
    return [headers, ...rows].map(row => row.join(',')).join('\n');
  };

  const downloadCSV = (content: string, filename: string): void => {
    const blob = new Blob([content], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', filename);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleClear = (): void => {
    setFilters({
      from_date: moment().subtract(6, 'days').format('YYYY-MM-DD'),
      to_date: moment().format('YYYY-MM-DD'),
      email: "",
      country: null,
      customer: false,
      sent: "",
      sent_by: null,
    });
    showToast('Filters cleared', 'info');
  };


  // Modal handlers
  const handleOpenModal = (item: CartItem) => {
    setSelectedCartItem(item);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedCartItem(null);
  };

  // Country autocomplete handlers


  const handlePageChange = (page: number) => {
    setPagination(prev => ({ ...prev, current_page: page }));
    fetchData(page);
  };

  const handlePerPageChange = (perPage: number) => {
    setPagination(prev => ({ 
      ...prev, 
      per_page: perPage,
      current_page: 1 
    }));
    fetchData(1);
  };


  const getSortedData = (): CartItem[] => {
    if (!sortConfig.key) return tableData;

    return [...tableData].sort((a, b) => {
      const aValue = a[sortConfig.key!];
      const bValue = b[sortConfig.key!];

      if (typeof aValue === 'string' && typeof bValue === 'string') {
        return sortConfig.direction === 'asc' 
          ? aValue.localeCompare(bValue)
          : bValue.localeCompare(aValue);
      }

      if (typeof aValue === 'number' && typeof bValue === 'number') {
        return sortConfig.direction === 'asc' ? aValue - bValue : bValue - aValue;
      }

      return 0;
    });
  };

  // Generate page numbers for pagination
  const getPageNumbers = () => {
    const pages = [];
    const maxVisiblePages = 5;

    if (pagination.last_page <= maxVisiblePages) {
      for (let i = 1; i <= pagination.last_page; i++) {
        pages.push(i);
      }
    } else {
      if (pagination.current_page <= 3) {
        for (let i = 1; i <= 4; i++) {
          pages.push(i);
        }
        pages.push("...");
        pages.push(pagination.last_page);
      } else if (pagination.current_page >= pagination.last_page - 2) {
        pages.push(1);
        pages.push("...");
        for (let i = pagination.last_page - 3; i <= pagination.last_page; i++) {
          pages.push(i);
        }
      } else {
        pages.push(1);
        pages.push("...");
        for (let i = pagination.current_page - 1; i <= pagination.current_page + 1; i++) {
          pages.push(i);
        }
        pages.push("...");
        pages.push(pagination.last_page);
      }
    }

    return pages;
  };

  const getPriorityColor = (items: number): string => {
    if (items >= 3) {
      return "text-emerald-700 bg-emerald-100 border-emerald-300 dark:text-emerald-400 dark:bg-emerald-900/30 dark:border-emerald-600";
    } else if (items == 2) {
      return "text-amber-700 bg-amber-100 border-amber-300 dark:text-amber-400 dark:bg-amber-900/30 dark:border-amber-600";
    } else {
      return "text-slate-700 bg-slate-100 border-slate-300 dark:text-slate-400 dark:bg-slate-900/30 dark:border-slate-600";
    }
  };

  const getSortIcon = (columnKey: keyof CartItem) => {
    if (sortConfig.key !== columnKey) {
      return <FaSort className="w-3 h-3 text-gray-400" />;
    }
    return sortConfig.direction === 'asc' 
      ? <FaSortUp className="w-3 h-3 text-blue-600" />
      : <FaSortDown className="w-3 h-3 text-blue-600" />;
  };

  const sortedData = getSortedData();

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-2 sm:space-y-0">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-gray-100">
            Abandoned Cart
          </h1>
          <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
            Manage and recover abandoned shopping carts
          </p>
        </div>
        <div className="flex space-x-2">
            <button
              onClick={handleRefresh}
              disabled={isRefreshing}
              className="px-3 py-1.5 bg-gray-600 text-white text-sm rounded-lg hover:bg-gray-700 transition-colors duration-200 flex items-center space-x-1 disabled:opacity-50"
              title="Refresh Data"
            >
              <FaRedo className={`w-3 h-3 ${isRefreshing ? 'animate-spin' : ''}`} />
              <span>{isRefreshing ? 'Refreshing...' : 'Refresh'}</span>
            </button>
          <button
            onClick={handleExport}
            disabled={tableData.length === 0}
            className="px-3 py-1.5 bg-green-600 text-white text-sm rounded-lg hover:bg-green-700 transition-colors duration-200 flex items-center space-x-1 disabled:opacity-50"
            title="Export to CSV"
          >
            <FaDownload className="w-3 h-3" />
            <span>Export</span>
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white dark:bg-gray-900 p-4 rounded-lg shadow-sm border border-gray-200 dark:border-gray-800">
        <div className="flex items-center space-x-2 mb-3">
          <FaFilter className="w-4 h-4 text-gray-500" />
          <h3 className="text-sm font-medium text-gray-700 dark:text-gray-200">Filters</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          <div>
            <Daterange
              label="Abandoned Cart Date Range"
              onChange={handleDateRangeChange}
            />
          </div>
          <div>
            <label className="flex block text-xs font-medium text-gray-700 dark:text-gray-200 mb-1">
              <FaEnvelope className="w-3 h-3 mr-1" />
              Email
            </label>
            <Input
              type="email"
              value={filters.email}
              onChange={(e) => handleFilterChange("email", e.target.value)}
              placeholder="Search by email"
              className="w-full px-2 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div>
            <Autocomplete
              label="Country"
              options={Countries.data.map((country:any) => ({
                value: country.value,
                label: country.label
              }))}
              Icon={<FaGlobe />}
              value={filters.country}
              onChange={(value: any) => handleFilterChange("country", value)}
              placeholder="Search by country"
            />
          </div>

          <div>
            <label className="flex block text-xs font-medium text-gray-700 dark:text-gray-200 mb-1">
              <FaEnvelope className="w-3 h-3 mr-1" />
              Mail Status
            </label>
            <select
              value={filters.sent}
              onChange={(e) => handleFilterChange("sent", e.target.value)}
              className="w-full px-2 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">All</option>
              <option value="1">Already Sent</option>
              <option value="0">Generate Email</option>
            </select>
          </div>
          <Autocomplete
            label="Mail Sent By"
            options={createdByOptions}
            Icon={<FaUser />}
            value={filters.sent_by}
            onChange={(value: any) => handleFilterChange("sent_by", value)}
            placeholder="Search by created by"
          />
          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="existingCustomers"
              checked={filters.customer}
              onChange={(e) =>
                handleFilterChange("customer", e.target.checked)
              }
              className="w-4 h-4 cursor-pointer text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
            />
            <label
              htmlFor="existingCustomers"
              className="text-sm font-medium text-gray-700 dark:text-gray-200"
            >
              Existing Customers Only
            </label>
          </div>
        </div>

        <div className="mt-3 flex justify-end space-x-2">
          <button
            onClick={handleSearch}
            disabled={isLoading}
            className="px-3 py-1.5 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700 transition-colors duration-200 flex items-center space-x-1 disabled:opacity-50"
          >
            <FaSearch className="w-3 h-3" />
            <span>{isLoading ? "Searching..." : "Search"}</span>
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
          <Table
            data={sortedData}
            isLoading={isLoading}
            columns={columns}
            actions={actions}
          />
        </div>
      </div>

      {/* Enhanced Pagination */}
      {sortedData.length > 0 && (
        <div className="bg-white dark:bg-gray-900 rounded-lg shadow-sm border border-gray-200 dark:border-gray-800 p-3">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-2 sm:space-y-0">
            {/* Items per page and info */}
            <div className="flex items-center space-x-2 text-xs text-gray-700 dark:text-gray-300">
              <span>Show</span>
              <select
                value={pagination.per_page}
                onChange={(e) => handlePerPageChange(Number(e.target.value))}
                className="px-2 py-1 text-xs border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value={5}>5</option>
                <option value={10}>10</option>
                <option value={25}>25</option>
                <option value={50}>50</option>
              </select>
              <span>entries</span>
              <span className="text-gray-500 dark:text-gray-400">
                Showing {pagination.from + 1} to {Math.min(pagination.from + sortedData.length, pagination.total)}{" "}
                of {pagination.total} results
              </span>
            </div>

            {/* Pagination Controls */}
            <div className="flex items-center space-x-1">
              {/* Previous Button */}
              <button
                onClick={() => handlePageChange(Math.max(1, pagination.current_page - 1))}
                disabled={pagination.current_page === 1}
                className="px-2 py-1 text-xs border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-1 transition-colors duration-150"
              >
                <FaChevronLeft className="w-2 h-2" />
                <span>Prev</span>
              </button>

              {/* Page Numbers */}
              <div className="flex items-center space-x-1">
                {getPageNumbers().map((page, index) => (
                  <button
                    key={index}
                    onClick={() =>
                      typeof page === "number" && handlePageChange(page)
                    }
                    disabled={page === "..."}
                    className={`px-2 py-1 text-xs rounded-md border transition-colors duration-200 ${
                      page === pagination.current_page
                        ? "bg-blue-600 text-white border-blue-600"
                        : page === "..."
                        ? "text-gray-400 cursor-default"
                        : "border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
                    }`}
                  >
                    {page}
                  </button>
                ))}
              </div>

              {/* Next Button */}
              <button
                onClick={() =>
                  handlePageChange(Math.min(pagination.last_page, pagination.current_page + 1))
                }
                disabled={pagination.current_page === pagination.last_page}
                className="px-2 py-1 text-xs border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-1 transition-colors duration-150"
              >
                <span>Next</span>
                <FaChevronRight className="w-2 h-2" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Mail Modal */}
      {selectedCartItem && (
        <MailDrawer
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          userId={selectedCartItem?.user_id}
          userEmail={selectedCartItem?.email}
          darkMode={darkMode}
        />
      )}
    </div>
  );
};

export default AbandonedCart;
