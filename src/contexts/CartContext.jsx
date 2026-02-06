import React, { createContext, useState, useContext } from "react";

const CartContext = createContext();

export const useCart = () => {
     const context = useContext(CartContext);
     if (!context) {
          throw new Error("useCart must be used within a CartProvider");
     }
     return context;
};

export const CartProvider = ({ children }) => {
     const [cart, setCart] = useState([]);
     const [isCartModalOpen, setIsCartModalOpen] = useState(false);

     const addToCart = (product, quantity = 1) => {
          console.log("Adding to cart:", {
               productId: product._id,
               productTitle: product.title,
               quantity,
          });
          setCart((prevCart) => {
               const existingItem = prevCart.find(
                    (item) => item._id === product._id,
               );
               console.log("Existing item found:", existingItem ? "YES" : "NO");

               if (existingItem) {
                    return prevCart.map((item) =>
                         item._id === product._id
                              ? { ...item, quantity: item.quantity + quantity }
                              : item,
                    );
               } else {
                    return [...prevCart, { ...product, quantity }];
               }
          });
     };

     const removeFromCart = (productId) => {
          setCart((prevCart) =>
               prevCart.filter((item) => item._id !== productId),
          );
     };

     const updateQuantity = (productId, quantity) => {
          if (quantity <= 0) {
               removeFromCart(productId);
          } else {
               setCart((prevCart) =>
                    prevCart.map((item) =>
                         item._id === productId ? { ...item, quantity } : item,
                    ),
               );
          }
     };

     const clearCart = () => {
          setCart([]);
     };

     const getTotalPrice = () => {
          return cart.reduce((total, item) => {
               const price = item.price || 0;
               return total + price * item.quantity;
          }, 0);
     };

     const getTotalItems = () => {
          return cart.reduce((total, item) => total + item.quantity, 0);
     };

     const openCartModal = () => {
          setIsCartModalOpen(true);
     };

     const closeCartModal = () => {
          setIsCartModalOpen(false);
     };

     const value = {
          cart,
          addToCart,
          removeFromCart,
          updateQuantity,
          clearCart,
          getTotalPrice,
          getTotalItems,
          isCartModalOpen,
          openCartModal,
          closeCartModal,
     };

     return (
          <CartContext.Provider value={value}>{children}</CartContext.Provider>
     );
};
