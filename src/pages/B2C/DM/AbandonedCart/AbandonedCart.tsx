import React, { useState, useEffect, useCallback } from "react";
import {

  FaChevronLeft,
  FaChevronRight,
  FaGlobe,
  FaEnvelope,
  FaUser,
  FaEye,
} from "react-icons/fa";
import {
  getCartData,
  createdByRequest,
} from "../../../../Services/DM/Abandoned/services";
import Daterange from "../../../../components/Daterange";
import Input from "../../../../components/Input";
import { useToast } from "../../../../components/ToastContext";
import { Countries } from "../../../../Props/Countries";
import MailDrawer from "./MailDrawer";
import { useTranslation } from "react-i18next";
import Autocomplete from "../../../../components/Autocomplete";
import Table from "../../../../components/Table";
import Header from "../../../../components/Header";
import tableProps from "../../../../Props/TableProps/B2C/DM/AbandonedCart.json";
import FilterBox from "../../../../components/FilterBox";
import FilterProps from "../../../../Props/FilterProps/FilterProps";
import Select from "../../../../components/Select";
import { useTheme } from "../../../../Hooks/useTheme";
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
  country: { value: string | number; label: string } | null;
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
  direction: "asc" | "desc";
}

interface AbandonedCartProps {
  darkMode?: boolean;
}

const AbandonedCart: React.FC<AbandonedCartProps> = ({ darkMode = false }) => {
  const { showToast } = useToast();
  const { t } = useTranslation(["abandonedCart", "common"]);
  const { isDark } = useTheme();
  const [filters, setFilters] = useState<Filters>(FilterProps as any);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  const [tableData, setTableData] = useState<CartItem[]>([]);
  const [sortConfig] = useState<SortConfig>({ key: null, direction: "asc" });
  const [pagination, setPagination] = useState({
    total: 0,
    page: 1,
    from: 0,
    current_page: 1,
    last_page: 1,
    per_page: 25,
  });

  // Country autocomplete states
  const [createdByOptions, setCreatedByOptions] = useState<CreatedByOption[]>(
    []
  );

  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCartItem, setSelectedCartItem] = useState<CartItem | null>(
    null
  );

  const actions = [
    {
      icon: <FaEye />,
      onClick: (item: any) => handleOpenModal(item),
      title: t("buttons.viewDetails", { ns: "abandonedCart" }),
    },
  ];

  const fetchData = useCallback(
    async (page: number = 1) => {
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
            item.items_count = item.cart_details.reduce(
              (sum: number, item: any) => {
                return sum + (item.selectedCourseType?.length || 0);
              },
              0
            );
          } catch (parseError) {
            console.error("Error parsing cart details:", parseError);
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
        console.error("Error fetching cart data:", error);
        showToast(t("messages.error.loadFailed", { ns: "common" }), "error");
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
    },
    [filters, pagination.per_page, showToast, t]
  );

  const fetchCreatedBy = useCallback(async () => {
    try {
      const res = await createdByRequest();
      setCreatedByOptions(res.data || []);
    } catch (error) {
      console.error("Error fetching created by:", error);
      showToast(t("messages.error.loadFailed", { ns: "common" }), "error");
    }
  }, [showToast, t]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  useEffect(() => {
    fetchCreatedBy();
  }, [fetchCreatedBy]);

  const handleFilterChange = (
    key: keyof Filters,
    value:
      | string
      | boolean
      | { value: string | number; label: string }
      | { value: string; label?: string }
      | null
  ) => {
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
      showToast(
        t("messages.dataRefreshed", { ns: "abandonedCart" }),
        "success"
      );
    } catch (error) {
      showToast(t("messages.error.loadFailed", { ns: "common" }), "error");
    } finally {
      setIsRefreshing(false);
    }
  };

  const handleExport = (): void => {
    // Enhanced export functionality
    if (tableData.length === 0) {
      showToast(
        t("messages.noDataToExport", { ns: "abandonedCart" }),
        "warning"
      );
      return;
    }

    const csvContent = generateCSV();
    downloadCSV(
      csvContent,
      t("export.filename", {
        ns: "abandonedCart",
        date: moment().format("YYYY-MM-DD"),
      })
    );
    showToast(
      t("messages.exportCompleted", { ns: "abandonedCart" }),
      "success"
    );
  };

  const generateCSV = (): string => {
    const headers = [
      t("export.headers.customerName", { ns: "abandonedCart" }),
      t("export.headers.email", { ns: "abandonedCart" }),
      t("export.headers.totalPrice", { ns: "abandonedCart" }),
      t("export.headers.itemsCount", { ns: "abandonedCart" }),
      t("export.headers.addedOn", { ns: "abandonedCart" }),
      t("export.headers.priority", { ns: "abandonedCart" }),
      t("export.headers.mailSentBy", { ns: "abandonedCart" }),
    ];
    const rows = tableData.map((item) => [
      `${item.first_name} ${item.last_name}`,
      item.email,
      `${
        item.currency_type === "INR"
          ? "₹"
          : item.currency_type === "USD"
          ? "$"
          : item.currency_type === "EUR"
          ? "€"
          : item.currency_type === "GBP"
          ? "£"
          : ""
      } ${item.total_price}`,
      item.items_count,
      moment(item.added_on).format("DD-MM-YYYY"),
      item.items_count >= 3
        ? t("table.priority.high", { ns: "abandonedCart" })
        : item.items_count === 2
        ? t("table.priority.medium", { ns: "abandonedCart" })
        : t("table.priority.low", { ns: "abandonedCart" }),
      item.sender_name || "-",
    ]);

    return [headers, ...rows].map((row) => row.join(",")).join("\n");
  };

  const downloadCSV = (content: string, filename: string): void => {
    const blob = new Blob([content], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", filename);
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleClear = (): void => {
    setFilters({
      from_date: moment().subtract(6, "days").format("YYYY-MM-DD"),
      to_date: moment().format("YYYY-MM-DD"),
      email: "",
      country: null,
      customer: false,
      sent: "",
      sent_by: null,
    });
    showToast(t("messages.filtersCleared", { ns: "abandonedCart" }), "info");
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
    setPagination((prev) => ({ ...prev, current_page: page }));
    fetchData(page);
  };

  const handlePerPageChange = (perPage: number) => {
    setPagination((prev) => ({
      ...prev,
      per_page: perPage,
      current_page: 1,
    }));
    fetchData(1);
  };

  const getSortedData = (): CartItem[] => {
    if (!sortConfig.key) return tableData;

    return [...tableData].sort((a, b) => {
      const aValue = a[sortConfig.key!];
      const bValue = b[sortConfig.key!];

      if (typeof aValue === "string" && typeof bValue === "string") {
        return sortConfig.direction === "asc"
          ? aValue.localeCompare(bValue)
          : bValue.localeCompare(aValue);
      }

      if (typeof aValue === "number" && typeof bValue === "number") {
        return sortConfig.direction === "asc"
          ? aValue - bValue
          : bValue - aValue;
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
        for (
          let i = pagination.current_page - 1;
          i <= pagination.current_page + 1;
          i++
        ) {
          pages.push(i);
        }
        pages.push("...");
        pages.push(pagination.last_page);
      }
    }

    return pages;
  };

  const sortedData = getSortedData();

  // Create columns with translated labels
  const columns = tableProps.table_columns.map((column: any) => {
    const baseColumn = {
      ...column,
      label:
        t(`table.columns.${column.key}`, { ns: "abandonedCart" }) ||
        column.label,
    };

    // Add custom render function for priority column
    if (column.key === "priority") {
      return {
        ...baseColumn,
        render: (value: any, item: any) => item.items_count, // Use items_count for priority calculation
      };
    }

    return baseColumn;
  });

  return (
    <div className="space-y-4">
      <Header
        handleRefresh={handleRefresh}
        isRefreshing={isRefreshing}
        handleExport={handleExport}
        tableData={tableData}
        ns="abandonedCart"
      />
      <FilterBox ns="abandonedCart" handleSearch={handleSearch} handleClear={handleClear} isLoading={isLoading}>
        <div>
          <Daterange
            label={t("filters.abandonedCartDateRange", {
              ns: "abandonedCart",
            })}
            onChange={handleDateRangeChange}
          />
        </div>
        <div>
          <Input
            label={t("filters.email", { ns: "abandonedCart" })}
            value={filters.email}
            onChange={(e) => handleFilterChange("email", e.target.value)}
            placeholder={t("common.searchByEmail", { ns: "common" })}
            Icon={<FaEnvelope />}
          />
         
        </div>
        <div>
          <Autocomplete
            label={t("filters.country", { ns: "abandonedCart" })}
            options={Countries.data.map((country: any) => ({
              value: country.value,
              label: country.label,
            }))}
            Icon={<FaGlobe />}
            value={filters.country}
            onChange={(value: any) => handleFilterChange("country", value)}
            placeholder={t("common.searchByCountry", { ns: "common" })}
          />
        </div>
        <div>
          <Select
            label={t("filters.sent", { ns: "abandonedCart" })}
            options={[{ label: t("common.all", { ns: "common" }), value: "" }, { label: t("table.status.sent", { ns: "abandonedCart" }), value: "1" }, { label: t("table.status.notSent", { ns: "abandonedCart" }), value: "0" }]}
            Icon={<FaEnvelope />}
            value={filters.sent}
            onChange={(value: any) => handleFilterChange("sent", value)}
            placeholder={t("common.searchBySent", { ns: "common" })}
          /> 
        </div>
        <Autocomplete
          label={t("filters.sentBy", { ns: "abandonedCart" })}
          options={createdByOptions}
          Icon={<FaUser />}
          value={filters.sent_by}
          onChange={(value: any) => handleFilterChange("sent_by", value)}
          placeholder={t("common.searchBySentBy", { ns: "common" })}
        />
        <div className="flex items-center space-x-2">
          <input
            type="checkbox"
            id="existingCustomers"
            checked={filters.customer}
            onChange={(e) => handleFilterChange("customer", e.target.checked)}
            className="w-4 h-4 cursor-pointer text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
          />
          <label
            htmlFor="existingCustomers"
            className="text-sm font-medium text-gray-700 dark:text-gray-200"
          >
            {t("filters.customer", { ns: "abandonedCart" })}
          </label>
        </div>
      </FilterBox>


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
              <span>{t("pagination.showing", { ns: "common" })}</span>
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
              <span>{t("pagination.entries", { ns: "common" })}</span>
              <span className="text-gray-500 dark:text-gray-400">
                {t("pagination.showing", { ns: "common" })}{" "}
                {pagination.from + 1} {t("pagination.to", { ns: "common" })}{" "}
                {Math.min(
                  pagination.from + sortedData.length,
                  pagination.total
                )}{" "}
                {t("pagination.of", { ns: "common" })} {pagination.total}{" "}
                {t("pagination.results", { ns: "common" })}
              </span>
            </div>

            {/* Pagination Controls */}
            <div className="flex items-center space-x-1">
              {/* Previous Button */}
              <button
                onClick={() =>
                  handlePageChange(Math.max(1, pagination.current_page - 1))
                }
                disabled={pagination.current_page === 1}
                className="px-2 py-1 text-xs border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-1 transition-colors duration-150"
              >
                <FaChevronLeft className="w-2 h-2" />
                <span>{t("pagination.previous", { ns: "common" })}</span>
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
                  handlePageChange(
                    Math.min(pagination.last_page, pagination.current_page + 1)
                  )
                }
                disabled={pagination.current_page === pagination.last_page}
                className="px-2 py-1 text-xs border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-1 transition-colors duration-150"
              >
                <span>{t("pagination.next", { ns: "common" })}</span>
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
          darkMode={isDark}
        />
      )}
    </div>
  );
};

export default AbandonedCart;
