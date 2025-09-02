import { FaSearch, FaTimes } from "react-icons/fa";
import { useTranslation } from "react-i18next";

const SearchandClearButtons = ({
  handleSearch,
  handleClear,
  isLoading,
  ns,
}: {
  handleSearch: () => void;
  handleClear: () => void;
  isLoading: boolean;
  ns: string;
}) => {
  const { t } = useTranslation(ns);
  return (
    <div className="mt-3 flex justify-end space-x-2">
      <button
        onClick={handleSearch}
        disabled={isLoading}
        className="px-3 py-1.5 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700 transition-colors duration-200 flex items-center space-x-1 disabled:opacity-50"
      >
        <FaSearch className="w-3 h-3" />
        <span>
          {isLoading
            ? t("common.loading", { ns: ns })
            : t("buttons.search", { ns: ns })}
        </span>
      </button>
      <button
        onClick={handleClear}
        className="px-3 py-1.5 bg-gray-500 text-white text-sm rounded-md hover:bg-gray-600 transition-colors duration-200 flex items-center space-x-1"
      >
        <FaTimes className="w-3 h-3" />
        <span>{t("buttons.clear", { ns: ns })}</span>
      </button>
    </div>
  );
};

export default SearchandClearButtons;
