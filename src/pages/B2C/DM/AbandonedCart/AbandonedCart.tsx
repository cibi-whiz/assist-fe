import React, { useState, useEffect, useCallback } from "react";
import { FaEye } from "react-icons/fa";
import { getCartData } from "../../../../Services/DM/Abandoned/services";
import { useToast } from "../../../../components/ToastContext";
import MailDrawer from "./MailDrawer";
import { useTranslation } from "react-i18next";
import Table from "../../../../components/Table";
import tableProps from "../../../../Props/TableProps/B2C/DM/AbandonedCart.json";

import FilterDrawer from "../../../../components/FilterDrawer";
import FilterDrawerTrigger from "../../../../components/FilterDrawerTrigger";
import { useFilterDrawer } from "../../../../Hooks/useFilterDrawer";
import { useTheme } from "../../../../Hooks/useTheme";
import Pagination from "../../../../components/Pagination";

import moment from "moment";

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

interface FilterCategory {
  key: string;
  label: string;
  isActive?: boolean;
  section?: string;
  component?: React.ReactNode;
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
  const {
    isOpen: isFilterDrawerOpen,
    openDrawer,
    closeDrawer,
  } = useFilterDrawer();

  // Initialize filters with proper default values
  const [filters, setFilters] = useState<Filters>({
    from_date: moment().subtract(6, "days").format("YYYY-MM-DD"),
    to_date: moment().format("YYYY-MM-DD"),
    email: "",
    country: null,
    customer: false,
    sent: "",
    sent_by: null,
  });

  const [isLoading, setIsLoading] = useState<boolean>(false);
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
  const [filterLogic, setFilterLogic] = useState<"any" | "all">("all");

  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCartItem, setSelectedCartItem] = useState<CartItem | null>(
    null
  );

  const actions = [
    {
      icon: <FaEye />,
      onClick: (item: CartItem) => handleOpenModal(item),
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
            if (typeof item.cart_details === "string") {
              item.cart_details = JSON.parse(item.cart_details);
            }
            item.items_count = Array.isArray(item.cart_details)
              ? item.cart_details.reduce((sum: number, cartItem: any) => {
                  return sum + (cartItem.selectedCourseType?.length || 0);
                }, 0)
              : 0;
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

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleSearch = (): void => {
    fetchData(1);
  };

  const handleClear = (): void => {
    const clearedFilters = {
      from_date: moment().subtract(6, "days").format("YYYY-MM-DD"),
      to_date: moment().format("YYYY-MM-DD"),
      email: "",
      country: null,
      customer: false,
      sent: "",
      sent_by: null,
    };
    setFilters(clearedFilters);
    showToast(t("messages.filtersCleared", { ns: "abandonedCart" }), "info");
  };

  const handleFilterLogicChange = (logic: "any" | "all") => {
    setFilterLogic(logic);
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
    const pages: (number | string)[] = [];
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
        render: (value: any, item: CartItem) => item.items_count, // Use items_count for priority calculation
      };
    }

    return baseColumn;
  });

  return (
    <div className="min-h-screen rounded-lg bg-gray-50 dark:bg-gray-900">
      <div className="max-w-full mx-auto p-2 rounded-lg">
        <div className="space-y-6">
          <FilterDrawerTrigger
            onClick={openDrawer}
            ns="abandonedCart"
            variant="primary"
            size="large"
          />

          <FilterDrawer
            ns="abandonedCart"
            isOpen={isFilterDrawerOpen}
            onClose={closeDrawer}
            handleSearch={handleSearch}
            handleClear={handleClear}
            isLoading={isLoading}
            filterLogic={filterLogic}
            onFilterLogicChange={handleFilterLogicChange}
          >
          </FilterDrawer>

          {/* Table */}
          <div className="bg-white dark:bg-gray-900 rounded-lg shadow-sm border border-gray-200 dark:border-gray-800 overflow-hidden">
            <div className="overflow-x-auto">
              <div className="min-w-full">
                <Table
                  data={sortedData}
                  isLoading={isLoading}
                  columns={columns}
                  actions={actions}
                />
              </div>
            </div>
          </div>

          {/* Enhanced Pagination */}
          {sortedData.length > 0 && (
            <Pagination
              pagination={pagination}
              handlePerPageChange={handlePerPageChange}
              handlePageChange={handlePageChange}
              getPageNumbers={getPageNumbers}
              sortedData={sortedData}
              t={t}
            />
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
      </div>
    </div>
  );
};

export default AbandonedCart;
