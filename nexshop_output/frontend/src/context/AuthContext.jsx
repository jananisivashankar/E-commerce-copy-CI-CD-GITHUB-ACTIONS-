import { createContext, useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";

export const AuthContext = createContext();

export default function AuthProvider({ children }) {
  const [user, setUser] = useState(null);

  const decodeAndSetUser = (token) => {
    try {
      const decoded = jwtDecode(token);
      // Normalize role: strip ROLE_ prefix for consistent checks
      const rawRole = decoded.role || "";
      const role = rawRole.startsWith("ROLE_") ? rawRole.replace("ROLE_", "") : rawRole;
      const userObj = {
        email: decoded.sub,
        role,
        userId: decoded.userId || decoded.id || null,
        name: decoded.name || decoded.sub,
        token,
      };
      setUser(userObj);
      return userObj;
    } catch {
      localStorage.removeItem("token");
      setUser(null);
      return null;
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) decodeAndSetUser(token);
  }, []);

  const login = (token) => {
    localStorage.setItem("token", token);
    return decodeAndSetUser(token);
  };

  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: !!user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
