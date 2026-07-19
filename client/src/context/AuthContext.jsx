import { createContext, useContext, useState, useEffect } from "react";
import { loginUser, registerUser, getUserProfile } from "../services/authService";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem("user");
    return savedUser ? JSON.parse(savedUser) : null;
  });
  const [token, setToken] = useState(() => localStorage.getItem("token") || null);
  const [loading, setLoading] = useState(true);

  // Auto-login / verify token on refresh
  useEffect(() => {
    const verifyToken = async () => {
      const storedToken = localStorage.getItem("token");
      if (storedToken) {
        try {
          const data = await getUserProfile();
          if (data && data.success && data.user) {
            setUser(data.user);
            localStorage.setItem("user", JSON.stringify(data.user));
          } else {
            logout();
          }
        } catch (error) {
          console.error("Token verification failed:", error);
          logout();
        }
      } else {
        setUser(null);
        setToken(null);
      }
      setLoading(false);
    };

    verifyToken();
  }, []);

  const login = async (email, password) => {
    setLoading(true);
    try {
      const data = await loginUser(email, password);
      if (data && data.success && data.token) {
        setToken(data.token);
        setUser(data.user);
        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data.user));
        window.dispatchEvent(new Event("auth-change"));
        return { success: true, message: data.message || "Login successful!" };
      } else {
        return { success: false, message: data.message || "Login failed" };
      }
    } catch (error) {
      const msg = error.response?.data?.message || error.message || "Invalid credentials";
      return { success: false, message: msg };
    } finally {
      setLoading(false);
    }
  };

  const register = async (name, email, password, phone = "") => {
    setLoading(true);
    try {
      const data = await registerUser(name, email, password);
      if (data && data.success) {
        // If phone was provided, attach it locally to user object if returned
        const userObj = { ...data.user, phone };
        // Auto login or return success
        return { success: true, message: data.message || "Registration successful! Please login.", user: userObj };
      } else {
        return { success: false, message: data.message || "Registration failed" };
      }
    } catch (error) {
      const msg = error.response?.data?.message || error.message || "Registration failed";
      return { success: false, message: msg };
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
    setToken(null);
    window.dispatchEvent(new Event("auth-change"));
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        isAuthenticated: !!token && !!user,
        login,
        register,
        logout,
        setUser
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
