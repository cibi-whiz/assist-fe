import React, { useState, useEffect } from "react";
import { Drawer, Input, Select, Collapse, Button, Badge } from "antd";
import { useTranslation } from "react-i18next";
import {
  FaChevronRight,
  FaSearch,
  FaTimes,
  FaFilter,
  FaTimes as FaXmark,
} from "react-icons/fa";
import { Countries } from "../Props/Countries";
import  Daterange from "./Daterange";

export type FilterType =
  | "contains"
  | "equals"
  | "starts_with"
  | "ends_with";

export type FilterFieldType = "text" | "number" | "boolean" | "select" | "date" | "country";

interface FilterFieldConfig {
  key: keyof FilterValue;
  label: string;
  type: FilterFieldType;
  showFilterOptions: boolean;
  options?: Array<{ label: string; value: any }>;
  placeholder?: string;
  category: string;
}

export interface FilterValue {
  email?: {
    type: FilterType;
    value: string;
  };
  country?: {
    type: FilterType;
    value: string;
  };
  user_name?: {
    type: FilterType;
    value: string;
  };
  created_at?: {
    type: FilterType;
    value: { from: string; to: string };
  };
  last_login_at?: {
    type: FilterType;
    value: { last_login_from: string; last_login_to: string };
  };
  order_date?: {
    type: FilterType;
    value: { order_date_from: string; order_date_to: string };
  };
  renewed_at?: {
    type: FilterType;
    value: { renewed_from: string; renewed_to: string };
  };
  renewal_disabled_at?: {
    type: FilterType;
    value: { renewal_disabled_from: string; renewal_disabled_to: string };
  };
  renewal_status?: {
    type: FilterType;
    value: string;
  };
  order_id?: {
    type: FilterType;
    value: string;
  };

  order_status?: {
    type: FilterType;
    value: string;
  };
  created_by?: {
    type: FilterType;
    value: string;
  };
  mail_sent_by?: {
    type: FilterType;
    value: string;
  };
  product_id?: {
    type: FilterType;
    value: number;
  };
  category_id?: {
    type: FilterType;
    value: number;
  };
  count?: {
    type: FilterType;
    value: number;
  }
  product_type?: {
    type: FilterType;
    value: string;
  };
  coupon_code?: {
    type: FilterType;
    value: string;
  };
  coupon_type?: {
    type: FilterType;
    value: string;
  };
  is_active?: {
    type: FilterType;
    value: boolean;
  };
  is_purchased?: {
    type: FilterType;
    value: boolean;
  };
  state?: {
    type: FilterType;
    value: string;
  };
  city?: {
    type: FilterType;
    value: string;
  };
  phone_number?: {
    type: FilterType;
    value: string;
  };
  payment_method?: {
    type: FilterType;
    value: string;
  };
  is_subscription_user?: {
    type: FilterType;
    value: boolean;
  };
  exclude_customer?: {
    type: FilterType;
    value: string;
  };
  email_verified?: {
    type: FilterType;
    value: boolean;
  };
  last_login_count?: {
    type: FilterType;
    value: number;
  };
  accessed_pt?: {
    type: FilterType;
    value: boolean;
  };
  enrollment_type ?:{
    type: FilterType;
    value: string;
  };
  company_name?: {
    type: FilterType;
    value: string;
  }
  enrollment_id?: {
    type: FilterType;
    value: number;
  };
  enrollment_by?: {
    type: FilterType;
    value: string;
  };
  auto_renewal?: {
    type: FilterType;
    value: boolean;
  }
  renewal_count?: {
    type: FilterType;
    value: number;
  };
  plan_cycle?: {
    type: FilterType;
    value: string;
  };
  plan_id?: {
    type: FilterType;
    value: number;
  };
}

// Filter configuration
const FILTER_CONFIG: FilterFieldConfig[] = [
  // User Information
  { key: "user_name", label: "User Name", type: "text", showFilterOptions: true, category: "User Information" },
  { key: "email", label: "Email", type: "text", showFilterOptions: true, category: "User Information" },
  { key: "country", label: "Country", type: "country", showFilterOptions: false, category: "User Information" },
  { key: "created_at", label: "Created At", type: "date", showFilterOptions: false, category: "User Information" },
  { key: "last_login_at", label: "Last Login At", type: "date", showFilterOptions: false, category: "User Information" },
  
  // Order Information
  { key: "order_date", label: "Order Date", type: "date", showFilterOptions: false, category: "Order Information" },
  { key: "order_id", label: "Order ID", type: "text", showFilterOptions: true, category: "Order Information" },
  { key: "order_status", label: "Order Status", type: "select", showFilterOptions: false, options: [
    { label: "Pending", value: "pending" },
    { label: "Processing", value: "processing" },
    { label: "Shipped", value: "shipped" },
    { label: "Delivered", value: "delivered" },
    { label: "Cancelled", value: "cancelled" },
    { label: "Refunded", value: "refunded" }
  ], category: "Order Information" },
  
  // Renewal Information
  { key: "renewed_at", label: "Renewed At", type: "date", showFilterOptions: false, category: "Renewal Information" },
  { key: "renewal_disabled_at", label: "Renewal Disabled At", type: "date", showFilterOptions: false, category: "Renewal Information" },
  { key: "renewal_status", label: "Renewal Status", type: "select", showFilterOptions: false, options: [
    { label: "Active", value: "active" },
    { label: "Inactive", value: "inactive" },
    { label: "Pending", value: "pending" },
    { label: "Cancelled", value: "cancelled" },
    { label: "Expired", value: "expired" }
  ], category: "Renewal Information" },
  
  // User Management
  { key: "created_by", label: "Created By", type: "text", showFilterOptions: true, category: "User Management" },
  { key: "mail_sent_by", label: "Mail Sent By", type: "text", showFilterOptions: true, category: "User Management" },
  { key: "company_name", label: "Company Name", type: "text", showFilterOptions: true, category: "User Management" },
  { key: "enrollment_by", label: "Enrollment By", type: "text", showFilterOptions: true, category: "User Management" },
  
  // Product & Category
  { key: "product_id", label: "Product ID", type: "number", showFilterOptions: true, category: "Product & Category" },
  { key: "category_id", label: "Category ID", type: "number", showFilterOptions: true, category: "Product & Category" },
  { key: "product_type", label: "Product Type", type: "select", showFilterOptions: false, options: [
    { label: "Course", value: "course" },
    { label: "Practice Test", value: "practice_test" },
    { label: "Lab", value: "lab" },
    { label: "Bundle", value: "bundle" },
    { label: "Subscription", value: "subscription" }
  ], category: "Product & Category" },
  { key: "count", label: "Count", type: "number", showFilterOptions: true, category: "Product & Category" },
  
  // Coupon Management
  { key: "coupon_code", label: "Coupon Code", type: "text", showFilterOptions: true, category: "Coupon Management" },
  { key: "coupon_type", label: "Coupon Type", type: "select", showFilterOptions: false, options: [
    { label: "Percentage", value: "percentage" },
    { label: "Fixed Amount", value: "fixed_amount" },
    { label: "Free Shipping", value: "free_shipping" },
    { label: "Buy One Get One", value: "bogo" }
  ], category: "Coupon Management" },
  
  // Location
  { key: "state", label: "State", type: "text", showFilterOptions: true, category: "Location" },
  { key: "city", label: "City", type: "text", showFilterOptions: true, category: "Location" },
  { key: "phone_number", label: "Phone Number", type: "text", showFilterOptions: true, category: "Location" },
  
  // Payment & Subscription
  { key: "payment_method", label: "Payment Method", type: "select", showFilterOptions: false, options: [
    { label: "Credit Card", value: "credit_card" },
    { label: "Debit Card", value: "debit_card" },
    { label: "PayPal", value: "paypal" },
    { label: "Bank Transfer", value: "bank_transfer" },
    { label: "Cash on Delivery", value: "cod" }
  ], category: "Payment & Subscription" },
  { key: "exclude_customer", label: "Exclude Customer", type: "text", showFilterOptions: true, category: "Payment & Subscription" },
  
  // Boolean Status
  { key: "is_active", label: "Is Active", type: "boolean", showFilterOptions: false, options: [
    { label: "Yes", value: true },
    { label: "No", value: false }
  ], category: "Boolean Status" },
  { key: "is_purchased", label: "Is Purchased", type: "boolean", showFilterOptions: false, options: [
    { label: "Yes", value: true },
    { label: "No", value: false }
  ], category: "Boolean Status" },
  { key: "is_subscription_user", label: "Is Subscription User", type: "boolean", showFilterOptions: false, options: [
    { label: "Yes", value: true },
    { label: "No", value: false }
  ], category: "Boolean Status" },
  { key: "email_verified", label: "Email Verified", type: "boolean", showFilterOptions: false, options: [
    { label: "Yes", value: true },
    { label: "No", value: false }
  ], category: "Boolean Status" },
  { key: "accessed_pt", label: "Accessed PT", type: "boolean", showFilterOptions: false, options: [
    { label: "Yes", value: true },
    { label: "No", value: false }
  ], category: "Boolean Status" },
  { key: "auto_renewal", label: "Auto Renewal", type: "boolean", showFilterOptions: false, options: [
    { label: "Yes", value: true },
    { label: "No", value: false }
  ], category: "Boolean Status" },
  
  // Enrollment
  { key: "enrollment_type", label: "Enrollment Type", type: "select", showFilterOptions: false, options: [
    { label: "Self-Paced", value: "self_paced" },
    { label: "Instructor-Led", value: "instructor_led" },
    { label: "Live Online", value: "live_online" },
    { label: "Classroom", value: "classroom" }
  ], category: "Enrollment" },
  { key: "enrollment_id", label: "Enrollment ID", type: "number", showFilterOptions: true, category: "Enrollment" },
  
  // Plan & Renewal
  { key: "renewal_count", label: "Renewal Count", type: "number", showFilterOptions: true, category: "Plan & Renewal" },
  { key: "plan_cycle", label: "Plan Cycle", type: "select", showFilterOptions: false, options: [
    { label: "Monthly", value: "monthly" },
    { label: "Quarterly", value: "quarterly" },
    { label: "Semi-Annual", value: "semi_annual" },
    { label: "Annual", value: "annual" },
    { label: "Lifetime", value: "lifetime" }
  ], category: "Plan & Renewal" },
  { key: "plan_id", label: "Plan ID", type: "number", showFilterOptions: true, category: "Plan & Renewal" },
  { key: "last_login_count", label: "Last Login Count", type: "number", showFilterOptions: true, category: "Plan & Renewal" }
];

interface FilterCategory {
  key: string;
  label: string;
  isActive?: boolean;
}

interface FilterDrawerProps {
  ns: string;
  children?: React.ReactNode;
  handleSearch: (filters: FilterValue) => void;
  handleClear: () => void;
  isLoading: boolean;
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  categories?: FilterCategory[];
  onCategorySelect?: (category: FilterCategory) => void;
  filterLogic?: "any" | "all";
  onFilterLogicChange?: (logic: "any" | "all") => void;
  initialFilters?: FilterValue;
}

// Helper function to initialize filters dynamically
const initializeFilters = (initialFilters?: FilterValue): FilterValue => {
  const defaultFilters: FilterValue = {};
  
  FILTER_CONFIG.forEach(config => {
    let defaultValue: any;
    switch (config.type) {
      case "date":
        if (config.key === "created_at") {
          defaultValue = { from: "", to: "" };
        } else {
          const fieldName = config.key.replace(/_at$/, "");
          defaultValue = { [`${fieldName}_from`]: "", [`${fieldName}_to`]: "" };
        }
        break;
      case "number":
        defaultValue = 0;
        break;
      case "boolean":
        defaultValue = false;
        break;
      default:
        defaultValue = "";
    }
    
    (defaultFilters as any)[config.key] = {
      type: "contains",
      value: defaultValue
    };
  });
  
  return { ...defaultFilters, ...initialFilters };
};

const FilterDrawer: React.FC<FilterDrawerProps> = ({
  ns,
  handleSearch,
  handleClear,
  isLoading,
  isOpen,
  onClose,
  title,
  initialFilters,
}) => {
  const { t } = useTranslation(ns);
  const [drawerWidth, setDrawerWidth] = useState(400);
  const [activePanel, setActivePanel] = useState<string | string[]>([]);
  const [filters, setFilters] = useState<FilterValue>(initializeFilters(initialFilters));

  const handleDateRangeChange = (dateRange: any, field: string) => {
    setFilters((prev: any) => {
      let value;
      switch (field) {
        case 'created_at':
          value = { from: dateRange.startDate, to: dateRange.endDate };
          break;
        case 'last_login_at':
          value = { last_login_from: dateRange.startDate, last_login_to: dateRange.endDate };
          break;
        case 'order_date':
          value = { order_date_from: dateRange.startDate, order_date_to: dateRange.endDate };
          break;
        case 'renewed_at':
          value = { renewed_from: dateRange.startDate, renewed_to: dateRange.endDate };
          break;
        case 'renewal_disabled_at':
          value = { renewal_disabled_from: dateRange.startDate, renewal_disabled_to: dateRange.endDate };
          break;
        default:
          value = { from: dateRange.startDate, to: dateRange.endDate };
      }
      
      return {
        ...prev,
        [field]: {
          type: "between",
          value,
        },
      };
    });
  };

  useEffect(() => {
    const updateWidth = () => {
      setDrawerWidth(window.innerWidth < 768 ? window.innerWidth : 400);
    };
    updateWidth();
    window.addEventListener("resize", updateWidth);
    return () => window.removeEventListener("resize", updateWidth);
  }, []);

  // Handle escape key & swipe gestures
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };

    let startX = 0;
    let startY = 0;

    const handleTouchStart = (e: TouchEvent) => {
      startX = e.touches[0].clientX;
      startY = e.touches[0].clientY;
    };

    const handleTouchEnd = (e: TouchEvent) => {
      if (!isOpen) return;
      const endX = e.changedTouches[0].clientX;
      const endY = e.changedTouches[0].clientY;
      const diffX = startX - endX;
      const diffY = Math.abs(startY - endY);
      if (diffX > 100 && diffY < 100) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
      document.addEventListener("touchstart", handleTouchStart, {
        passive: true,
      });
      document.addEventListener("touchend", handleTouchEnd, { passive: true });
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.removeEventListener("touchstart", handleTouchStart);
      document.removeEventListener("touchend", handleTouchEnd);
      document.body.style.overflow = "unset";
    };
  }, [isOpen, onClose]);

  // Count active filters


  const handleReset = () => {
    const resetFilters = initializeFilters();
    setFilters(resetFilters);
    handleClear();
  };

  const handleSearchClick = () => {
    handleSearch(filters);
  };

  // FIX: Accept both string and date range objects
  const updateFilter = (
    field: keyof FilterValue,
    type: FilterType,
    value: string | number | boolean | { from: string; to: string } | { [key: string]: string }
  ) => {
    setFilters((prev) => ({
      ...prev,
      [field]: { type, value },
    }));
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSearchClick();
    }
  };

  const stringFilterOptions = [
    { label: "Contains", value: "contains" },
    { label: "Equals", value: "equals" },
    { label: "Starts With", value: "starts_with" },
    { label: "Ends With", value: "ends_with" },
  ];

  const getFilterOptions = (field: keyof FilterValue) => {
    const config = FILTER_CONFIG.find(c => c.key === field);
    if (config?.type === "boolean" || config?.type === "select" || config?.type === "country" || config?.type === "date") {
      return [];
    }
    return stringFilterOptions;
  };

  const getFieldOptions = (field: keyof FilterValue) => {
    const config = FILTER_CONFIG.find(c => c.key === field);
    return config?.options || [];
  };

  const hasFilterValue = (field: keyof FilterValue) => {
    const val = filters[field]?.value;
    if (typeof val === "string") {
      return val.trim() !== "";
    }
    if (typeof val === "number") {
      return val !== 0;
    }
    if (typeof val === "boolean") {
      return val !== false;
    }
    if (val && typeof val === "object") {
      // Handle different date range structures
      if ('from' in val && 'to' in val) {
        const result = val.from !== "" || val.to !== "";
        return result;
      }
      // Handle specific field date ranges (e.g., last_login_from, last_login_to)
      const keys = Object.keys(val);
      const result = keys.some(key => {
        const keyVal = val[key as keyof typeof val];
        return keyVal !== "" && keyVal !== null && keyVal !== undefined;
      });
      return result;
    }
    return false;
  };

  const renderFilterInput = (config: FilterFieldConfig) => {
    const currentValue = filters[config.key]?.value;
    const currentType = filters[config.key]?.type || "contains";
    const fieldOptions = getFieldOptions(config.key);

    switch (config.type) {
      case "date":
        return <Daterange onChange={handleDateRangeChange} field={config.key} value={currentValue} />;
      
      case "country":
        return (
          <Select
            value={currentValue as string || undefined}
            showSearch
            placeholder={config.placeholder || `Select ${config.label.toLowerCase()}...`}
            onChange={(value: string) =>
              updateFilter(config.key, currentType, value || "")
            }
            onKeyDown={handleKeyPress}
            optionFilterProp="label"
            className="filter-select w-full"
            aria-label={`${config.key} filter selection`}
            allowClear
            showArrow
            filterOption={(input, option) =>
              String(option?.label ?? "").toLowerCase().includes(input.toLowerCase())
            }
            notFoundContent="No countries found"
            options={Countries.data.map((country) => ({
              label: country.label,
              value: country.value,
            }))}
          />
        );
      
      case "select":
      case "boolean":
        return (
          <Select
            value={currentValue as any}
            showSearch={config.type === "select"}
            placeholder={config.placeholder || `Select ${config.label.toLowerCase()}...`}
            onChange={(value: any) =>
              updateFilter(config.key, currentType, value || "")
            }
            optionFilterProp="label"
            className="filter-select w-full"
            aria-label={`${config.key} filter selection`}
            allowClear
            showArrow
            filterOption={(input, option) =>
              String(option?.label ?? "").toLowerCase().includes(input.toLowerCase())
            }
            notFoundContent="No options found"
            options={fieldOptions as any}
          />
        );
      
      case "number":
        return (
          <Input
            type="number"
            placeholder={config.placeholder || `Enter ${config.label.toLowerCase()}...`}
            value={currentValue as number || ""}
            onChange={(e) =>
              updateFilter(config.key, currentType, parseInt(e.target.value) || 0)
            }
            className="dark:bg-gray-800 dark:text-gray-100 dark:placeholder-gray-400"
            aria-label={`${config.key} filter input`}
            allowClear
          />
        );
      
      default: // text
        return (
          <Input
            placeholder={config.placeholder || `Enter ${config.label.toLowerCase()}...`}
            value={currentValue as string || ""}
            onChange={(e) =>
              updateFilter(config.key, currentType, e.target.value)
            }
            onKeyDown={handleKeyPress}
            className="dark:bg-gray-800 dark:text-gray-100 dark:placeholder-gray-400"
            aria-label={`${config.key} filter input`}
            allowClear
          />
        );
    }
  };

  const renderPanelHeader = (config: FilterFieldConfig, panelKey: string) => (
    <div className="flex items-center gap-2 w-full">
      <div className="flex items-center gap-1">
        <span className="text-sm font-medium text-gray-700 dark:text-gray-100">
          {config.label}
        </span>
        {hasFilterValue(config.key) && (
          <Badge
            size="small"
            count={1}
            className="ml-1"
            style={{ backgroundColor: "#1677ff" }}
          />
        )}
      </div>
      {config.showFilterOptions && activePanel.includes(panelKey) && (
        <div onClick={(e) => e.stopPropagation()} className="">
          <Select
            value={filters[config.key]?.type || "contains"}
            className="filter-select w-28"
            size="small"
            onChange={(value: FilterType) =>
              updateFilter(
                config.key,
                value,
                typeof filters[config.key]?.value === "string"
                  ? filters[config.key]?.value || ""
                  : ""
              )
            }
            options={getFilterOptions(config.key)}
            popupClassName="dark:bg-gray-800"
          />
        </div>
      )}
    </div>
  );

  // Group filters by category
  const groupedFilters = FILTER_CONFIG.reduce((acc, config) => {
    if (!acc[config.category]) {
      acc[config.category] = [];
    }
    acc[config.category].push(config);
    return acc;
  }, {} as Record<string, FilterFieldConfig[]>);

  // Count active filters
  const getActiveFiltersCount = () => {
    return Object.values(filters).filter((filter) => {
      if (!filter?.value) return false;
      if (typeof filter.value === "string") {
        return filter.value.trim() !== "";
      }
      if (typeof filter.value === "number") {
        return filter.value !== 0;
      }
      if (typeof filter.value === "boolean") {
        return filter.value !== false;
      }
      if (filter.value && typeof filter.value === "object") {
        // Handle different date range structures
        if ('from' in filter.value && 'to' in filter.value) {
          return filter.value.from !== "" || filter.value.to !== "";
        }
        // Handle specific field date ranges (e.g., last_login_from, last_login_to)
        const keys = Object.keys(filter.value);
        return keys.some(key => {
          const keyVal = filter.value[key as keyof typeof filter.value];
          return keyVal !== "" && keyVal !== null && keyVal !== undefined;
        });
      }
      return false;
    }).length;
  };

  return (
    <Drawer
      title={
        <div className="flex items-center justify-between w-full">
          <div className="flex items-center gap-2">
            <FaFilter className="text-blue-500 text-sm" />
            <h3 className="text-lg font-semibold m-0 text-gray-900 dark:text-gray-100">
              {title || t("filters.title", { ns: "common" })}
            </h3>
            {getActiveFiltersCount() > 0 && (
              <Badge
                count={getActiveFiltersCount()}
                className="ml-1"
                style={{ backgroundColor: "#52c41a" }}
              />
            )}
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handleReset}
              disabled={getActiveFiltersCount() === 0}
              className={`rounded px-2 py-1 text-xs font-medium transition-colors ${
                getActiveFiltersCount() === 0
                  ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                  : "bg-blue-500 hover:bg-blue-600 text-white"
              }`}
            >
              Reset
            </button>
            <button
              onClick={onClose}
              className="p-1 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors"
              aria-label="Close filter drawer"
            >
              <FaXmark className="text-sm" />
            </button>
          </div>
        </div>
      }
      placement="right"
      width={drawerWidth}
      onClose={onClose}
      open={isOpen}
      className="filter-drawer dark:bg-gray-900"
      maskClosable={true}
      closable={false}
      destroyOnClose={false}
      styles={{
        body: { 
          padding: "12px", 
          backgroundColor: "transparent",
          display: "flex",
          flexDirection: "column",
          height: "100%"
        },
        header: {
          backgroundColor: "transparent",
          borderBottom: "1px solid #e5e7eb",
          padding: "12px 16px",
        },
        mask: { backgroundColor: "rgba(0, 0, 0, 0.5)" },
      }}
    >
      <div className="flex-1 overflow-y-auto">
        <Collapse
          size="small"
          accordion
          expandIconPosition="end"
          activeKey={activePanel}
          expandIcon={({ isActive }) => (
            <FaChevronRight
              className={`transition-transform cursor-pointer duration-200 text-gray-600 dark:text-gray-300 ${
                isActive ? "rotate-90" : ""
              }`}
              aria-label={isActive ? "Collapse panel" : "Expand panel"}
            />
          )}
          onChange={(key) => setActivePanel(key)}
          className="filter-accordion w-full dark:bg-gray-900 dark:text-gray-100"
        >
          {Object.entries(groupedFilters).map(([category, configs]) => (
            <React.Fragment key={category}>
              {configs.map((config, index) => (
                <Collapse.Panel
                  key={`${category}-${index}`}
                  header={renderPanelHeader(config, `${category}-${index}`)}
                  className={
                    hasFilterValue(config.key) ? "border-l-4 border-l-blue-500" : ""
                  }
                >
                  {renderFilterInput(config)}
                </Collapse.Panel>
              ))}
            </React.Fragment>
          ))}
        </Collapse>
      </div>

      {/* Fixed Footer */}
      <div className="mt-4 border-t border-gray-200 dark:border-gray-700  sticky bottom-0">
        <div className="my-4 flex gap-2 justify-end">
          <Button
            onClick={handleReset}
            icon={<FaTimes />}
            className="dark:bg-gray-800 dark:text-gray-100 dark:border-gray-600"
            disabled={getActiveFiltersCount() === 0}
            
          >
            Clear
          </Button>
          <Button
            type="primary"
            onClick={handleSearchClick}
            loading={isLoading}
            icon={<FaSearch />}
            className="bg-blue-500 hover:bg-blue-600 border-blue-500 hover:border-blue-600"
          >
            Apply ({getActiveFiltersCount()})
          </Button>
        </div>
      </div>
    </Drawer>
  );
};

export default FilterDrawer;
