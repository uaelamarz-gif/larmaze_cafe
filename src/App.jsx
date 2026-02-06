import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./App.css";
import Home from "./pages/Home";
import AdminLogin from "./pages/AdminLogin";
import AdminProducts from "./pages/AdminProducts";
import ProtectedRoute from "./components/ProtectedRoute";
import { AuthProvider } from "./contexts/AuthContext";
import { CartProvider } from "./contexts/CartContext";
import CartModal from "./components/CartModal";

function App() {
     return (
          <BrowserRouter>
               <AuthProvider>
                    <CartProvider>
                         <CartModal />
                         <Routes>
                              <Route path="/" element={<Home />} />
                              <Route
                                   path="/admin/login"
                                   element={<AdminLogin />}
                              />
                              <Route
                                   path="/admin/products"
                                   element={
                                        <ProtectedRoute>
                                             <AdminProducts />
                                        </ProtectedRoute>
                                   }
                              />
                         </Routes>
                    </CartProvider>
               </AuthProvider>
          </BrowserRouter>
     );
}

export default App;
