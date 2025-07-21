import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import {
  FaBullhorn, FaUsers, FaChartBar, FaRocket, FaChevronDown, FaChevronRight,
  FaRegFileAlt, FaRegChartBar, FaRegStar, FaRegListAlt, FaRegBell, FaRegHeart, FaRegUser, FaRegClock, FaRegCheckCircle, FaRegEdit, FaRegFolderOpen, FaRegFlag, FaRegEnvelope, FaRegThumbsUp, FaRegCalendarAlt, FaRegMoneyBillAlt, FaRegLightbulb, FaRegBookmark, FaRegCopy, FaRegQuestionCircle
} from "react-icons/fa";
import { useAuth } from "../Hooks/useAuth";

const navItems = [
  {
    title: "Digital Marketing",
    icon: <FaChartBar />,
    subNav: [
      { title: "Abandoned Cart", url: "/dashboard/abandonedcart", icon: <FaRegFileAlt /> },
      { title: "FT Conversion", url: "/dashboard/ft-conversion-report", icon: <FaRegChartBar /> },
      { title: "Product Sale Report", url: "/dashboard/product-sale-report", icon: <FaRegListAlt /> },
      { title: "Tracking Stats", url: "/dashboard/tracking-stats", icon: <FaRegChartBar /> },
      { title: "User Course Preview", url: "/dashboard/user-course-preview", icon: <FaRegUser /> },
      { title: "New Product Notification", url: "/dashboard/new_product_notification", icon: <FaRegBell /> },
      { title: "Website Redirections", url: "/dashboard/website_redirections", icon: <FaRegFlag /> },
      { title: "Wishlist", url: "/dashboard/wishlists", icon: <FaRegHeart /> },
      { title: "Whizcards Download", url: "/dashboard/whizcard_download", icon: <FaRegCopy /> },
      { title: "Website 404", url: "/dashboard/web_404_errors", icon: <FaRegQuestionCircle /> },
      { title: "Campaign", url: "/dashboard/campaign_report", icon: <FaBullhorn /> },
      { title: "Subscription Campaigns", url: "/dashboard/subscription_campaign", icon: <FaRegBookmark /> },
      { title: "User Favourite Courses", url: "/dashboard/user_favourite_courses", icon: <FaRegStar /> },
      { title: "Landing Page", url: "/dashboard/landing-page", icon: <FaRegFolderOpen /> },
      { title: "Referrals", url: "/dashboard/referrals", icon: <FaRegEnvelope /> },
      {
        title: "Reviews",
        url: "",
        icon: <FaRegThumbsUp />,
        subNav: [
          { title: "Website", url: "/dashboard/reviews/website", icon: <FaRegEdit /> },
          { title: "Social", url: "/dashboard/reviews/social", icon: <FaRegUser /> },
          { title: "Improvements", url: "/dashboard/reviews/improvements", icon: <FaRegLightbulb /> },
        ],
      },
    ],
  },
  {
    title: "Promotions",
    icon: <FaBullhorn />,
    subNav: [
      { title: "Coupons", url: "/dashboard/coupons", icon: <FaRegMoneyBillAlt /> },
      { title: "Declined Coupons", url: "/dashboard/declined_coupon", icon: <FaRegFlag /> },
      { title: "Offers/Deals", url: "/dashboard/promotions", icon: <FaRegStar /> },
      { title: "Combo Offer", url: "/dashboard/combo-offer", icon: <FaRegCopy /> },
      { title: "Campaign Timer", url: "/dashboard/campaigntimer", icon: <FaRegClock /> },
      { title: "Banners", url: "/dashboard/offers", icon: <FaRegFolderOpen /> },
    ],
  },
  {
    title: "Retail Users",
    icon: <FaUsers />,
    subNav: [
      { title: "Users", url: "/dashboard/users", icon: <FaRegUser /> },
      { title: "Outreach", url: "/dashboard/outreach-users", icon: <FaRegEnvelope /> },
      { title: "Domains", url: "/dashboard/user-domains", icon: <FaRegFolderOpen /> },
      { title: "Active", url: "/dashboard/active/users", icon: <FaRegCheckCircle /> },
      { title: "Orders", url: "/dashboard/orders", icon: <FaRegFileAlt /> },
      { title: "Order Refunds", url: "/dashboard/order_refunds", icon: <FaRegMoneyBillAlt /> },
      { title: "Manual Enrollments", url: "/dashboard/manual-enrollments", icon: <FaRegEdit /> },
      { title: "Manual Individual Lab Enrollment", url: "/dashboard/manual-individual-lab-enrollment", icon: <FaRegEdit /> },
      {
        title: "Subscription",
        url: "",
        icon: <FaRegBookmark />,
        subNav: [
          { title: "Dashboard", url: "/dashboard/subscription_dashboard", icon: <FaRegChartBar /> },
          { title: "Subscriptions", url: "/dashboard/subscription/enrolled", icon: <FaRegStar /> },
          { title: "Renewals", url: "/dashboard/renewals", icon: <FaRegCalendarAlt /> },
          { title: "Multiple", url: "/dashboard/subscription/duplicates", icon: <FaRegCopy /> },
          { title: "Plans", url: "/dashboard/subscription_plan", icon: <FaRegFolderOpen /> },
          { title: "Cancelled", url: "/dashboard/subscription_cancelled", icon: <FaRegFlag /> },
        ],
      },
    ],
  },
  {
    title: "Whizlabs-V2",
    icon: <FaRocket />,
    subNav: [
      { title: "Orders (V2)", url: "/dashboard/v2_orders", icon: <FaRegFileAlt /> },
      { title: "Subscriptions (V2)", url: "/dashboard/v2_subscriptions", icon: <FaRegStar /> },
    ],
  },
];

const Sidebar = ({ isOpen }) => {
  const [openPath, setOpenPath] = useState([]);
  const { user } = useAuth();
  console.log("user", user);
  // Tooltip state: { title, depth, position: {top, left, width} }
  const [tooltip, setTooltip] = useState(null);

  // Clear tooltip on scroll to prevent positioning issues
  React.useEffect(() => {
    const handleScroll = () => {
      if (tooltip) {
        setTooltip(null);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [tooltip]);

  const handleToggle = (title, depth) => {
    setOpenPath((prev) => {
      if (prev[depth] === title) {
        return prev.slice(0, depth);
      } else {
        const newPath = prev.slice(0, depth);
        newPath[depth] = title;
        return newPath;
      }
    });
  };

  // Show tooltip if sidebar is collapsed or title is long
  const shouldShowTooltip = (title) => !isOpen || title.length > 20;

  // Mouse events for tooltip
  const handleMouseEnter = (e, title, depth) => {
    if (!shouldShowTooltip(title)) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;
    
    // Calculate tooltip position
    let left = rect.right + 8;
    let top = rect.top + rect.height / 2;
    
    // Adjust horizontal position if tooltip would go off-screen
    const tooltipWidth = Math.min(title.length * 8 + 24, 200); // Estimate tooltip width
    if (left + tooltipWidth > viewportWidth - 16) {
      left = rect.left - tooltipWidth - 8;
    }
    
    // Adjust vertical position if tooltip would go off-screen
    const tooltipHeight = 32; // Estimate tooltip height
    if (top + tooltipHeight > viewportHeight - 16) {
      top = viewportHeight - tooltipHeight - 16;
    } else if (top - tooltipHeight < 16) {
      top = 16;
    }
    
    setTooltip({
      title,
      depth,
      position: {
        top: top + window.scrollY,
        left: left,
        width: rect.width,
      },
    });
  };
  const handleMouseLeave = () => setTooltip(null);

  const renderNav = (items, depth = 0) => (
    <ul className={depth === 0 ? "w-full" : "pl-4 border-l border-gray-200 dark:border-gray-700 ml-2"}>
      {items.map((item) => {
        const hasChildren = item.subNav && item.subNav.length > 0;
        const isOpenMenu = openPath[depth] === item.title;
        const tooltipProps = shouldShowTooltip(item.title)
          ? {
              onMouseEnter: (e) => handleMouseEnter(e, item.title, depth),
              onMouseLeave: handleMouseLeave,
            }
          : {};
        return (
          <li key={item.title} className="w-full">
            {hasChildren ? (
              <button
                type="button"
                onClick={() => handleToggle(item.title, depth)}
                className={`group flex items-center w-full rounded-xl transition-all hover:bg-gray-100 dark:hover:bg-gray-800 py-2 ${
                  isOpen ? "justify-start px-4" : "justify-center px-2"
                } text-gray-600 dark:text-gray-300 focus:outline-none`}
                aria-expanded={isOpenMenu}
                {...tooltipProps}
              >
                <span className="w-6 h-6 flex items-center justify-center">
                  {item.icon || <FaChevronRight className="opacity-60" />}
                </span>
                <span
                  className={`ml-3 text-sm font-medium transition-opacity duration-300 ${
                    isOpen ? "opacity-100" : "opacity-0 hidden"
                  } ${item.title.length > 20 ? "truncate max-w-[140px]" : "whitespace-nowrap"}`}
                  title={item.title.length > 20 ? item.title : ""}
                >
                  {item.title}
                </span>
                <span className={`ml-auto transition-transform duration-200 ${isOpenMenu ? "rotate-90" : ""} ${!isOpen ? "hidden" : ""}`}>
                  <FaChevronDown />
                </span>
              </button>
            ) : (
              <NavLink
                to={item.url}
                className={({ isActive }) =>
                  `group flex items-center w-full rounded-xl transition-all hover:bg-gray-100 dark:hover:bg-gray-800 py-2 ${
                    isOpen ? "justify-start px-4" : "justify-center px-2"
                  } ${
                    isActive
                      ? "bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-300"
                      : "text-gray-600 dark:text-gray-300"
                  }`
                }
                {...tooltipProps}
              >
                <span className="w-6 h-6 flex items-center justify-center">
                  {item.icon || <FaChevronRight className="opacity-60" />}
                </span>
                <span
                  className={`ml-3 text-sm font-medium transition-opacity duration-300 ${
                    isOpen ? "opacity-100" : "opacity-0 hidden"
                  } ${item.title.length > 20 ? "truncate max-w-[140px]" : "whitespace-nowrap"}`}
                  title={item.title.length > 20 ? item.title : ""}
                >
                  {item.title}
                </span>
              </NavLink>
            )}
            {hasChildren && isOpenMenu && renderNav(item.subNav, depth + 1)}
          </li>
        );
      })}
    </ul>
  );

  return (
    <>
      <aside
        className={`fixed top-16 left-0 h-[calc(100%-4rem)] z-50 flex flex-col justify-between border-r shadow-md transition-all duration-300 ease-in-out
          ${isOpen ? "w-64" : "w-16"}
          bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800
        `}
        style={{ transitionProperty: "width" }}
      >
        {/* Navigation Items */}
        {/* NOTE: Add the .scrollbar-hide CSS to your global styles if not using the Tailwind plugin */}
        <nav className="flex flex-col p-2 pb-4 gap-2 items-center w-full overflow-y-auto scrollbar-hide" style={{msOverflowStyle:'none', scrollbarWidth:'none'}}>
          {renderNav(navItems)}
        </nav>
        {/* Bottom User Info */}
        {isOpen ? (
          <div className="w-full px-4 pb-4 transition-all duration-500 ease-in-out">
            <div
              className={`flex items-center p-3 rounded-xl bg-gray-50 dark:bg-gray-800 shadow-sm
          justify-start space-x-3 hover:shadow-md transition-all duration-300 ease-in-out
        `}
            >
              <div className="w-10 h-10 rounded-full bg-gradient-to-r from-green-400 to-blue-500 text-white font-bold flex items-center justify-center">
                {(user?.user_name && user.user_name.charAt(0)) || "U"}
                
              </div>
              <div className="transition-all duration-300 ease-in-out">
                <p className="text-sm font-semibold text-gray-900 dark:text-white">
                  {user?.user_name || "User"}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-300">
                  {user?.user_email || "No email"}
                </p>
              </div>
            </div>
          </div>
        ) : (
          <div className="w-full px-4 pb-4 flex items-center justify-center transition-all duration-500 ease-in-out">
            <div className="w-8 h-8 rounded-full bg-gradient-to-r from-green-400 to-blue-500 text-white font-bold flex items-center justify-center">
              {(user?.user_name && user.user_name.charAt(0)) || "U"}
            </div>
          </div>
        )}

      </aside>
      {/* Custom Tooltip */}
      {tooltip && (
        <div
          className="pointer-events-none fixed z-[9999] px-3 py-1.5 text-xs font-medium rounded shadow-lg bg-gray-900 text-white dark:bg-gray-800 dark:text-gray-100 opacity-90 animate-fade-in"
          style={{
            top: Math.max(0, tooltip.position.top),
            left: Math.max(0, tooltip.position.left),
            transform: "translateY(-50%)",
            whiteSpace: "nowrap",
            maxWidth: "200px",
            overflow: "hidden",
            textOverflow: "ellipsis",
          }}
        >
          {tooltip.title}
        </div>
      )}
    </>
  );
};

export default Sidebar;

// Add this to your global CSS for fade-in animation:
// .animate-fade-in { animation: fadeIn 0.15s ease; }
// @keyframes fadeIn { from { opacity: 0; } to { opacity: 0.9; } }
