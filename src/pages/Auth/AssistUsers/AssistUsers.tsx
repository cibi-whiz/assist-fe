import { useState } from "react";
import Header from "../../../components/Header";
import FilterBox from "../../../components/FilterBox";
import { FaEnvelope } from "react-icons/fa";
import { useTranslation } from "react-i18next";
import { Input } from "antd";
import Daterange from "../../../components/Daterange";
import FilterProps from "../../../Props/FilterProps/FilterProps";

const AssistUsers = () => {
  const { t } = useTranslation("assistUsers");
  const [filters, setFilters] = useState<any>(FilterProps as any);

  const handleDateRangeChange = (dateRange: any) => {
    setFilters((prev: any) => ({
      ...prev,
      from_date: dateRange.startDate,
      to_date: dateRange.endDate,
    }));
  };
  return (
    <div className="space-y-4">
      <Header
        handleRefresh={() => {}}
        isRefreshing={false}
        handleExport={() => {}}
        tableData={[]}
        ns="assistUsers"
      />
      <FilterBox
        handleSearch={() => {}}
        handleClear={() => {}}
        isLoading={false}
        ns="assistUsers"
      >
          <div>
          <Daterange
            label={t("filters.assistUsersDateRange", {
              ns: "assistUsers",
            })}
            onChange={handleDateRangeChange}
          />
        </div>
        <div>
          <label className="flex block text-xs font-medium text-gray-700 dark:text-gray-200 mb-1">
            <FaEnvelope className="w-3 h-3 mr-1" />
            {t("filters.email", { ns: "assistUsers" })}
          </label>
          <Input
            type="email"
            value={filters.email}
            onChange={(e: any) => setFilters({ ...filters, email: e.target.value })}
            placeholder={t("common.searchByEmail", { ns: "common" })}
            className="w-full px-2 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
      </FilterBox>
    </div>
  );
};

export default AssistUsers;
