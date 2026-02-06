import React, { useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";

const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:3000/api";

const AdminLogin = () => {
     const { login, loading, error } = useAuth();
     const navigate = useNavigate();
     const [email, setEmail] = useState("");
     const [password, setPassword] = useState("");
     const [localError, setLocalError] = useState("");

     const handleSubmit = async (e) => {
          e.preventDefault();
          if (!email || !password) {
               setLocalError("Email and password are required");
               return;
          }

          const success = await login(email, password);
          if (success) {
               navigate("/admin/products");
          }
     };

     return (
          <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
               <div className="w-full max-w-md bg-white rounded-lg shadow-md p-6">
                    <h1 className="text-3xl font-bold text-center mb-6 text-gray-900">
                         Admin Login
                    </h1>

                    {(error || localError) && (
                         <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
                              {error || localError}
                         </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-4">
                         <div>
                              <label
                                   htmlFor="email"
                                   className="block text-sm font-medium text-gray-700 mb-1"
                              >
                                   Email
                              </label>
                              <input
                                   id="email"
                                   type="email"
                                   value={email}
                                   onChange={(e) => setEmail(e.target.value)}
                                   className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                                   placeholder="Enter your email"
                                   required
                              />
                         </div>

                         <div>
                              <label
                                   htmlFor="password"
                                   className="block text-sm font-medium text-gray-700 mb-1"
                              >
                                   Password
                              </label>
                              <input
                                   id="password"
                                   type="password"
                                   value={password}
                                   onChange={(e) => setPassword(e.target.value)}
                                   className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                                   placeholder="Enter your password"
                                   required
                              />
                         </div>

                         <button
                              type="submit"
                              disabled={loading}
                              className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-bold py-2 px-4 rounded-lg transition"
                         >
                              {loading ? "Logging in..." : "Login"}
                         </button>
                    </form>
               </div>
          </div>
     );
};

export default AdminLogin;
