import React from "react";
import { FaRedo, FaDownload } from "react-icons/fa";
import { useTranslation } from "react-i18next";

const Header = ({
  handleRefresh,
  isRefreshing,
  handleExport,
  tableData,
  ns,
}: {
  handleRefresh: () => void;
  isRefreshing: boolean;
  handleExport: () => void;
  tableData: any;
  ns: string;
}) => {
  const { t } = useTranslation(ns);
  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-2 sm:space-y-0">
      <div>
        <h1 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-gray-100">
          {t("title", { ns: ns })}
        </h1>
        <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
          {t("description", { ns: ns })}
        </p>
      </div>
      <div className="flex space-x-2">
        <button
          onClick={handleRefresh}
          disabled={isRefreshing}
          className="px-3 py-1.5 bg-gray-600 text-white text-sm rounded-lg hover:bg-gray-700 transition-colors duration-200 flex items-center space-x-1 disabled:opacity-50"
          title="Refresh Data"
        >
          <FaRedo className={`w-3 h-3 ${isRefreshing ? "animate-spin" : ""}`} />
          <span>
            {isRefreshing
              ? t("common.loading", { ns: "common" })
              : t("buttons.refresh", { ns: ns })}
          </span>
        </button>
        <button
          onClick={handleExport}
          disabled={tableData.length === 0}
          className="px-3 py-1.5 bg-green-600 text-white text-sm rounded-lg hover:bg-green-700 transition-colors duration-200 flex items-center space-x-1 disabled:opacity-50"
          title="Export to CSV"
        >
          <FaDownload className="w-3 h-3" />
          <span>{t("buttons.export", { ns: ns })}</span>
        </button>
      </div>
    </div>
  );
};

export default Header;
