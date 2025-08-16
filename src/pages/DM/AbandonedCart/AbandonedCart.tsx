import React, { useState, useEffect, useRef } from "react";
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
  FaChevronDown,
  FaFilter,
  FaRedo,
  FaSort,
  FaSortUp,
  FaSortDown,
} from "react-icons/fa";
import { FaCopy } from "react-icons/fa6";
import { getCartData, createdByRequest } from "../../../Services/DM/Abandoned/services";
import Daterange from "../../../components/Daterange";

import { useToast } from "../../../components/ToastContext";
import { Countries } from "../../../Props/Countries";
import MailModal from "./MailModal";
// @ts-ignore
const moment = require("moment").default || require("moment");

interface Filters {
  from_date: string;
  to_date: string;
  email: string;
  country: string;
  customer: boolean;
  sent: string;
  sent_by: string;
}

interface CartItem {
  id: number;
  first_name: string;
  user_id: number;
  last_name: string;
  email: string;
  country: string;
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
    country: "",
    customer: false,
    sent: "",
    sent_by: "",
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
  const [countrySearch, setCountrySearch] = useState("");
  const [showCountryDropdown, setShowCountryDropdown] = useState(false);
  const [filteredCountries, setFilteredCountries] = useState(Countries.data);
  const countryDropdownRef = useRef<HTMLDivElement>(null);
  const createdByDropdownRef = useRef<HTMLDivElement>(null);
  const [createdByOptions, setCreatedByOptions] = useState<CreatedByOption[]>([]);
  const [showCreatedByDropdown, setShowCreatedByDropdown] = useState(false);
  const [selectedCountry, setSelectedCountry] = useState<any>(null);
  const [selectedCreatedBy, setSelectedCreatedBy] = useState<CreatedByOption | null>(null);
  
  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCartItem, setSelectedCartItem] = useState<CartItem | null>(null);
  const [createdBySearch, setCreatedBySearch] = useState("");
  const [filteredCreatedByOptions, setFilteredCreatedByOptions] = useState<CreatedByOption[]>([]);

  const fetchData = async (page: number = 1) => {
    try {
      setIsLoading(true);
      const res = await getCartData({
        from_date: filters.from_date,
        to_date: filters.to_date,
        email: filters.email,
        country: filters.country,
        sent: filters.sent,
        sent_by: filters.sent_by,
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
      console.log("Created by response:", res);
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

  // Handle country search and filtering
  useEffect(() => {
    if (countrySearch.trim() === "") {
      setFilteredCountries(Countries.data);
    } else {
      const filtered = Countries.data.filter((country) =>
        country.label.toLowerCase().includes(countrySearch.toLowerCase())
      );
      setFilteredCountries(filtered);
    }
  }, [countrySearch]);

  // Handle created by search and filtering
  useEffect(() => {
    if (createdBySearch.trim() === "") {
      setFilteredCreatedByOptions(createdByOptions);
    } else {
      const filtered = createdByOptions.filter((option) =>
        (option.name?.toLowerCase().includes(createdBySearch.toLowerCase()) ||
         option.email?.toLowerCase().includes(createdBySearch.toLowerCase()))
      );
      setFilteredCreatedByOptions(filtered);
    }
  }, [createdBySearch, createdByOptions]);

  // Handle click outside to close dropdowns
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (countryDropdownRef.current && !countryDropdownRef.current.contains(event.target as Node)) {
        setShowCountryDropdown(false);
      }
      if (createdByDropdownRef.current && !createdByDropdownRef.current.contains(event.target as Node)) {
        setShowCreatedByDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Keyboard navigation for dropdowns
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setShowCountryDropdown(false);
        setShowCreatedByDropdown(false);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleFilterChange = (key: keyof Filters, value: string | boolean) => {
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
      country: "",
      customer: false,
      sent: "",
      sent_by: "",
    });
    setCountrySearch("");
    setCreatedBySearch("");
    setSelectedCountry(null);
    setSelectedCreatedBy(null);
    showToast('Filters cleared', 'info');
  };

  const handleCreatedBySelect = (createdBy: CreatedByOption) => {
    console.log("Selecting user:", createdBy);
    setFilters(prev => {
      const newFilters = { ...prev, sent_by: createdBy.value };
      console.log("Updated filters:", newFilters);
      return newFilters;
    });
    setSelectedCreatedBy(createdBy);
    setCreatedBySearch(createdBy.name || createdBy.email || "");
    setShowCreatedByDropdown(false);
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
  const handleCountrySelect = (country: any) => {
    setFilters(prev => ({ ...prev, country: country.value.toString() }));
    setCountrySearch(country.label);
    setSelectedCountry(country);
    setShowCountryDropdown(false);
  };

  const handleCountryInputChange = (value: string) => {
    setCountrySearch(value);
    setShowCountryDropdown(true);
    if (value === "") {
      setFilters(prev => ({ ...prev, country: "" }));
      setSelectedCountry(null);
    }
  };

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

  const handleSort = (key: keyof CartItem) => {
    setSortConfig(prev => ({
      key,
      direction: prev.key === key && prev.direction === 'asc' ? 'desc' : 'asc'
    }));
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
            <input
              type="email"
              value={filters.email}
              onChange={(e) => handleFilterChange("email", e.target.value)}
              placeholder="Search by email"
              className="w-full px-2 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div className="relative" ref={countryDropdownRef}>
            <label className="flex block text-xs font-medium text-gray-700 dark:text-gray-200 mb-1">
              <FaGlobe className="w-3 h-3 mr-1" />
              Country
            </label>
            <div className="relative">
              <input
                type="text"
                value={countrySearch}
                onChange={(e) => handleCountryInputChange(e.target.value)}
                onFocus={() => setShowCountryDropdown(true)}
                placeholder="Search countries..."
                className="w-full px-2 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 pr-8 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
              <button
                type="button"
                onClick={() => setShowCountryDropdown(!showCountryDropdown)}
                className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
              >
                <FaChevronDown className="w-3 h-3" />
              </button>
            </div>
            
            {/* Dropdown */}
            {showCountryDropdown && (
              <div className="absolute z-50 w-full mt-1 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md shadow-lg max-h-60 overflow-y-auto">
                {filteredCountries.length > 0 ? (
                  filteredCountries.map((country) => (
                    <div
                      key={country.value}
                      onClick={() => handleCountrySelect(country)}
                      className="px-3 py-2 text-sm text-gray-900 dark:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer border-b border-gray-100 dark:border-gray-700 last:border-b-0"
                    >
                      {country.label}
                    </div>
                  ))
                ) : (
                  <div className="px-3 py-2 text-sm text-gray-500 dark:text-gray-400">
                    No countries found
                  </div>
                )}
              </div>
            )}
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
                      <div className="relative" ref={createdByDropdownRef}>
              <label className="flex block text-xs font-medium text-gray-700 dark:text-gray-200 mb-1">
                <FaUser className="w-3 h-3 mr-1" />
                Mail Sent By
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={createdBySearch}
                  onChange={(e) => {
                    const value = e.target.value;
                    setCreatedBySearch(value);
                    setShowCreatedByDropdown(true);
                    
                    // Only clear the filter if the search is empty and no user is selected
                    if (value === "" && !selectedCreatedBy) {
                      setFilters(prev => ({ ...prev, sent_by: "" }));
                    }
                  }}
                  onFocus={() => setShowCreatedByDropdown(true)}
                  placeholder="Search created by..."
                  className="w-full px-2 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 pr-12 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
                <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex items-center space-x-1">
                  {selectedCreatedBy && (
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedCreatedBy(null);
                        setCreatedBySearch("");
                        setFilters(prev => ({ ...prev, sent_by: "" }));
                      }}
                      className="text-gray-400 hover:text-red-600 dark:hover:text-red-400"
                      title="Clear selection"
                    >
                      <FaTimes className="w-3 h-3" />
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={() => setShowCreatedByDropdown(!showCreatedByDropdown)}
                    className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                  >
                    <FaChevronDown className="w-3 h-3" />
                  </button>
                </div>
              </div>
              
              {/* Dropdown */}
              {showCreatedByDropdown && (
                <div className="absolute z-50 w-full mt-1 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md shadow-lg max-h-60 overflow-y-auto">
                  {filteredCreatedByOptions.length > 0 ? (
                    filteredCreatedByOptions.map((createdBy: CreatedByOption) => (
                      <div
                        key={createdBy.value}
                        onClick={() => handleCreatedBySelect(createdBy)}
                        className="px-3 py-2 text-sm text-gray-900 dark:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer border-b border-gray-100 dark:border-gray-700 last:border-b-0"
                      >
                        {createdBy?.name || createdBy?.email}
                      </div>
                    ))
                  ) : (
                    <div className="px-3 py-2 text-sm text-gray-500 dark:text-gray-400">
                      No users found
                    </div>
                  )}
                </div>
              )}
            </div>
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
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-gray-800">
              <tr>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  #
                </th>
                <th 
                  className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700"
                  onClick={() => handleSort('first_name')}
                >
                  <div className="flex items-center space-x-1">
                    <span>Customer</span>
                    {getSortIcon('first_name')}
                  </div>
                </th>
                <th 
                  className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700"
                  onClick={() => handleSort('added_on')}
                >
                  <div className="flex items-center space-x-1">
                    <span>Added On</span>
                    {getSortIcon('added_on')}
                  </div>
                </th>
                <th 
                  className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700"
                  onClick={() => handleSort('total_price')}
                >
                  <div className="flex items-center space-x-1">
                    <span>Order Total</span>
                    {getSortIcon('total_price')}
                  </div>
                </th>
                <th 
                  className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700"
                  onClick={() => handleSort('items_count')}
                >
                  <div className="flex items-center space-x-1">
                    <span>Items</span>
                    {getSortIcon('items_count')}
                  </div>
                </th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Priority
                </th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Mail Sent By
                </th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
              {isLoading ? (
                <tr>
                  <td colSpan={8} className="px-4 py-8 text-center text-sm text-gray-500 dark:text-gray-400">
                    <div className="flex items-center justify-center space-x-2">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                      <span>Loading abandoned cart data...</span>
                    </div>
                  </td>
                </tr>
              ) : sortedData.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-4 py-8 text-center text-sm text-gray-500 dark:text-gray-400">
                    <div className="flex flex-col items-center space-y-2">
                      <FaSearch className="w-8 h-8 text-gray-300" />
                      <span>No abandoned cart data found</span>
                      <span className="text-xs text-gray-400">Try adjusting your filters</span>
                    </div>
                  </td>
                </tr>
              ) : (
                sortedData.map((item, index) => (
                  <tr
                    key={item.id}
                    className="hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors duration-150"
                  >
                    <td className="px-4 py-2 whitespace-nowrap text-xs text-gray-900 dark:text-gray-100">
                      {pagination.from + index + 1}
                    </td>
                    <td className="px-4 py-2 whitespace-nowrap">
                      <div>
                        <div className="text-xs font-medium text-gray-900 dark:text-gray-100">
                          {item.first_name}
                        </div>
                        <div className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400">
                          {item.email} 
                          <FaCopy 
                            className="w-3 h-3 cursor-pointer hover:text-blue-600 transition-colors" 
                            onClick={() => {
                              navigator.clipboard.writeText(item.email);
                              showToast("Email copied to clipboard", "success");
                            }}
                            title="Copy email"
                          />
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-2 whitespace-nowrap text-xs text-gray-900 dark:text-gray-100">
                      {moment(item.added_on).format("DD-MM-YYYY")}
                    </td>
                    <td className="px-4 py-2 whitespace-nowrap text-xs text-gray-900 dark:text-gray-100">
                     {item.currency_type === "INR" ? "₹" :item.currency_type === "USD" ? "$" : item.currency_type === "EUR" ? "€" : item.currency_type === "GBP" ? "£" :"₹"} {item.total_price}
                    </td>
                    <td className="px-4 py-2 whitespace-nowrap text-xs text-gray-900 dark:text-gray-100">
                      {item.items_count}
                    </td>
                    <td className="px-4 py-2 whitespace-nowrap">
                      <span
                        className={`inline-flex px-2 py-0.5 text-xs font-medium rounded-full border ${getPriorityColor(
                          item.items_count 
                        )}`}
                      >
                        {item.items_count >= 3 ? "High" : item.items_count == 2 ? "Medium" : "Low"}
                      </span>
                    </td>
                    <td className="px-4 py-2 whitespace-nowrap text-xs text-gray-900 dark:text-gray-100">
                      {item.sender_name ? item.sender_name : "-"}
                    </td>
                    <td className="px-4 py-2 whitespace-nowrap text-xs font-medium">
                      <div className="flex space-x-1">
                        <button
                          onClick={() => handleOpenModal(item)}
                          className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300 p-1 transition-colors duration-150"
                          title="Generate Email"
                        >
                          <FaEnvelope className="w-3 h-3" />
                        </button>
                        <button
                          onClick={() =>
                            console.log("View details for:", item.id)
                          }
                          className="text-green-600 hover:text-green-900 dark:text-green-400 dark:hover:text-green-300 p-1 transition-colors duration-150"
                          title="View Details"
                        >
                          <FaEye className="w-3 h-3" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
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
        <MailModal
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          item={selectedCartItem.user_id}
          products={selectedCartItem.cart_details}
          darkMode={darkMode}
        />
      )}
    </div>
  );
};

export default AbandonedCart;
