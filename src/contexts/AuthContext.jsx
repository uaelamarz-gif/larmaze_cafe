import React, { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
     const [token, setToken] = useState(
          localStorage.getItem("adminToken") || null,
     );
     const [loading, setLoading] = useState(false);
     const [error, setError] = useState(null);

     const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:3000/api";

     const login = async (email, password) => {
          setLoading(true);
          setError(null);
          try {
               const res = await fetch(`${apiUrl}/admin/login`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ email, password }),
               });

               if (!res.ok) throw new Error("Login failed");

               const data = await res.json();
               setToken(data.token);
               localStorage.setItem("adminToken", data.token);
               return true;
          } catch (err) {
               setError(err.message);
               return false;
          } finally {
               setLoading(false);
          }
     };

     const logout = () => {
          setToken(null);
          localStorage.removeItem("adminToken");
     };

     const isAuthenticated = !!token;

     return (
          <AuthContext.Provider
               value={{ token, login, logout, isAuthenticated, loading, error }}
          >
               {children}
          </AuthContext.Provider>
     );
}

export function useAuth() {
     const ctx = useContext(AuthContext);
     if (!ctx) throw new Error("useAuth must be used within AuthProvider");
     return ctx;
}
