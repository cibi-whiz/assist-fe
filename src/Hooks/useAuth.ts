import React, { createContext, useContext, useEffect, useMemo, useState, ReactNode, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useLocalStorage } from "./useLocalStorage";
import { userLogin, privileges } from "../Services/Auth";
import { useToast } from "../components/ToastContext";
import axios from "axios";

// Type definitions
interface User {
  token: string;
  user_name: string;
  user_email: string;
  [key: string]: any;
}

interface Access {
  web: string[];
  lms: string[];
  role: string;
}

interface AuthContextValue {
  access: Access;
  user: User | null;
  role: string;
  login: (data: any) => Promise<void>;
  logout: () => void;
  loading: boolean;
}

interface AuthProviderProps {
  children: ReactNode;
  userData?: User | null;
}

const DEFAULT_ACCESS: Access = { web: [], lms: [], role: "" };

/**
 * Sets or removes the default axios authorization header.
 * @param token - JWT token or null to remove.
 */
const setAxiosAuthToken = (token: string | null): void => {
  if (token) {
    axios.defaults.headers.common["authorization"] = token;
  } else {
    delete axios.defaults.headers.common["authorization"];
  }
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

/**
 * AuthProvider wraps the app and provides authentication context.
 */
export const AuthProvider = ({ children, userData }: AuthProviderProps) => {
  const navigate = useNavigate();
  const [user, setUser] = useLocalStorage<User | null>("assistuser", userData || null);
  const [access, setAccess] = useState<Access>(DEFAULT_ACCESS);
  const [role, setRole] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [privilegesFetched, setPrivilegesFetched] = useState<boolean>(false);
  const { showToast } = useToast();

  // Helper to reset access state
  const resetAccess = (): void => {
    setAccess(DEFAULT_ACCESS);
    setRole("");
    setPrivilegesFetched(false);
  };

  // Set axios token if user exists
  useEffect(() => {
    setAxiosAuthToken(user?.token || null);
  }, [user]);

  // Fetch privileges only on initial load if user exists and privileges haven't been fetched
  useEffect(() => {
    let isMounted = true;
    if (user && !privilegesFetched) {
      setLoading(true);
      privileges(user)
        .then((response: any) => {
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
            setPrivilegesFetched(true);
          } else {
            resetAccess();
            showToast(response?.message || "Failed to fetch privileges", "error");
          }
        })
        .catch((err: any) => {
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
    } else if (!user) {
      resetAccess();
    }
    return () => {
      isMounted = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, privilegesFetched]);

  /**
   * Fetch user privileges
   */
  const fetchPrivileges = async (userData: User): Promise<void> => {
    setLoading(true);
    try {
      const response = await privileges(userData);
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
        setPrivilegesFetched(true);
      } else {
        resetAccess();
        showToast(response?.message || "Failed to fetch privileges", "error");
      }
    } catch (err: any) {
      resetAccess();
      if (err?.response?.status === 401) {
        showToast("Session Expired. Please log in again.", "error");
        setTimeout(() => {
          setUser(null);
        }, 2000);
      } else {
        showToast("Error fetching privileges", "error");
        if (process.env.NODE_ENV === "development") {
          // eslint-disable-next-line no-console
          console.error("Privileges fetch error:", err);
        }
      }
    } finally {
      setLoading(false);
    }
  };

  /**
   * Logs in the user and sets auth state.
   * @param data - Login credentials
   */
  const login = useCallback(async (data: any): Promise<void> => {
    setLoading(true);
    try {
      const response = await userLogin(data);
      if (response?.status === "success") {
        setUser(response.data);
        setAxiosAuthToken(response?.data?.token);
        
        // Fetch privileges immediately after successful login
        await fetchPrivileges(response.data);
        
        showToast("Login Success", "success");
        // Navigation will be handled by App component based on welcome screen logic
      } else {
        showToast(response?.message || "Login failed", "error");
      }
    } catch (err: any) {
      showToast(err?.response?.data?.message || "Login error", "error");
      if (process.env.NODE_ENV === "development") {
        // eslint-disable-next-line no-console
        console.error("Login error:", err);
      }
    } finally {
      setLoading(false);
    }
  }, [setUser, showToast, fetchPrivileges]);

  /**
   * Logs out the user and resets auth state.
   */
  const logout = useCallback((): void => {
    setUser(null);
    resetAccess();
    setAxiosAuthToken(null);
    navigate("/", { replace: true });
  }, [setUser, navigate]);

  // Memoize context value for performance
  const value = useMemo<AuthContextValue>(
    () => ({
      access,
      user,
      role,
      login,
      logout,
      loading,
    }),
    [user, access, role, loading, login, logout]
  );

  return React.createElement(AuthContext.Provider, { value }, children);
};

/**
 * useAuth hook to access authentication context.
 * @returns AuthContextValue
 */
export const useAuth = (): AuthContextValue => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}; 