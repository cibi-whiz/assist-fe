import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useLocalStorage } from "./useLocalStorage";
import { userLogin, privileges } from "../Services/Auth";
import { useToast } from "../components/ToastContext";

import axios from "axios";

/**
 * AuthContext provides authentication and authorization state and actions.
 * @typedef {Object} AuthContextValue
 * @property {Object} access - User access privileges (web, lms, role).
 * @property {Object|null} user - Current user object or null.
 * @property {string} role - User's role as a string (e.g., 'Super Admin', 'Admin', 'User', 'Guest').
 * @property {Function} login - Function to log in a user.
 * @property {Function} logout - Function to log out the user.
 * @property {boolean} loading - Loading state for async actions.
 */

const DEFAULT_ACCESS = { web: [], lms: [], role: "" };

/**
 * Sets or removes the default axios authorization header.
 * @param {string|null} token - JWT token or null to remove.
 */
const setAxiosAuthToken = (token) => {
  if (token) {
    axios.defaults.headers.common["authorization"] = token;
  } else {
    delete axios.defaults.headers.common["authorization"];
  }
};

const AuthContext = createContext();

/**
 * AuthProvider wraps the app and provides authentication context.
 * @param {Object} props
 * @param {React.ReactNode} props.children
 * @param {Object} [props.userData] - Initial user data (optional)
 */
export const AuthProvider = ({ children, userData }) => {
  const navigate = useNavigate();
  const [user, setUser] = useLocalStorage("assistuser", userData);
  const [access, setAccess] = useState(DEFAULT_ACCESS);
  const [role, setRole] = useState("");
  const [loading, setLoading] = useState(false);
  const { showToast } = useToast();

  // Helper to reset access state
  const resetAccess = () => {
    setAccess(DEFAULT_ACCESS);
    setRole("");
  };

  // Set axios token if user exists
  useEffect(() => {
    setAxiosAuthToken(user?.token || null);
  }, [user]);

  // Fetch privileges when user changes
  useEffect(() => {
    let isMounted = true;
    if (user) {
      setLoading(true);
      privileges(user)
        .then((response) => {
          if (!isMounted) return;
          if (response?.status === "success") {
            let roleValue = response?.data?.role;
            if (roleValue.includes("1")) {
              setRole("Super Admin");
            } else if (roleValue.includes("2")) {
              setRole("Admin");
            } else if (!roleValue.includes("1") && !roleValue.includes("2")) {
              setRole("User");
            } else {
              setRole("Guest");
            }
            setAccess(response?.data || DEFAULT_ACCESS);
          } else {
            resetAccess();
            showToast(response?.message || "Failed to fetch privileges", "error");
          }
        })
        .catch((err) => {
          resetAccess();
          if (err?.response?.status === 401) {
            showToast("Session Expired. Please log in again.", "error");
            setTimeout(() => {
              setUser(null);
            }, 2000);
          } else {
            showToast("Error fetching privileges", "error");
            if (process.env.NODE_ENV === "development") {
              // Log error details in development
              // eslint-disable-next-line no-console
              console.error("Privileges fetch error:", err);
            }
          }
        })
        .finally(() => {
          if (isMounted) setLoading(false);
        });
    } else {
      resetAccess();
    }
    return () => {
      isMounted = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  /**
   * Logs in the user and sets auth state.
   * @param {Object} data - Login credentials
   */
  const login = async (data) => {
    setLoading(true);
    try {
      const response = await userLogin(data);
      if (response?.status === "success") {
        setUser(response.data);
        showToast("Login Success", "success");
        navigate("/dashboard", { replace: true });
        setAxiosAuthToken(response?.data?.token);
      } else {
        showToast(response?.message || "Login failed", "error");
      }
    } catch (err) {
      showToast(err?.response?.data?.message || "Login error", "error");
      if (process.env.NODE_ENV === "development") {
        // eslint-disable-next-line no-console
        console.error("Login error:", err);
      }
    } finally {
      setLoading(false);
    }
  };

  /**
   * Logs out the user and resets auth state.
   */
  const logout = () => {
    setUser(null);
    resetAccess();
    setAxiosAuthToken(null);
    navigate("/", { replace: true });
  };

  // Memoize context value for performance
  const value = useMemo(
    () => ({
      access,
      user,
      role,
      login,
      logout,
      loading,
    }),
    [user, access, role, loading]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

/**
 * useAuth hook to access authentication context.
 * @returns {AuthContextValue}
 */
export const useAuth = () => useContext(AuthContext);
