import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useLocalStorage } from "./useLocalStorage";
import { userLogin, privileges } from "../Services/Auth";
import { useToast } from "../components/ToastContext";

import axios from "axios";

const AuthContext = createContext();

export const AuthProvider = ({ children, userData }) => {
  const navigate = useNavigate();
  const [user, setUser] = useLocalStorage("assistuser", userData);
  const [access, setAccess] = useState({
    web: [],
    lms: [],
    role: ""
  });
  const [loading, setLoading] = useState(false);
  const { showToast } = useToast();

  // Helper to reset access state
  const resetAccess = () => setAccess({ web: [], lms: [], role: "" });

  // Set axios token if user exists
  useEffect(() => {
    if (user?.token) {
      axios.defaults.headers.common["authorization"] = user.token;
    } else {
      delete axios.defaults.headers.common["authorization"];
    }
  }, [user]);

  // Fetch privileges when user changes
  useEffect(() => {
    if (user) {
      setLoading(true);
      privileges(user)
        .then((response) => {
          if (response?.status === "success") {
            setAccess(response?.data);
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
          }
        })
        .finally(() => setLoading(false));
    } else {
      resetAccess();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  const login = async (data) => {
    setLoading(true);
    try {
      const response = await userLogin(data);
      if (response?.status === "success") {
        setUser(response.data);
        showToast("Login Success", "success");
        navigate("/dashboard", { replace: true });
        axios.defaults.headers.common["authorization"] = response?.data?.token;
      } else {
        showToast(response?.message || "Login failed", "error");
      }
    } catch (err) {
      showToast(err?.response?.data?.message || "Login error", "error");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    resetAccess();
    delete axios.defaults.headers.common["authorization"];
    navigate("/", { replace: true });
  };

  const value = useMemo(
    () => ({
      access,
      user,
      login,
      logout,
      loading,
    }),
    [user, access, loading]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);
