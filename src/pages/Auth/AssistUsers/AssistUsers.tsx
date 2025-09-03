import { useState } from "react";
import Header from "../../../components/Header";
import FilterBox from "../../../components/FilterBox";
import { FaEnvelope } from "react-icons/fa";
import { useTranslation } from "react-i18next";
import Daterange from "../../../components/Daterange";
import FilterProps from "../../../Props/FilterProps/FilterProps";
import Input from "../../../components/Input";


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
    <div className="space-y-3 sm:space-y-4">
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
          <Input
            label={t("filters.email", { ns: "assistUsers" })}
            value={filters.email}
            onChange={(e: any) => setFilters({ ...filters, email: e.target.value })}
            placeholder={t("common.searchByEmail", { ns: "common" })}
            Icon={<FaEnvelope />}
          />
        </div>
      </FilterBox>
    </div>
  );
};

export default AssistUsers;
