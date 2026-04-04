import { createContext, useContext, useMemo, useState } from "react";

type CartProduct = {
     id: string;
     title: string;
     price: number;
     offerPrice: number;
     isOffer: boolean;
     images: string[];
};

type CartItem = CartProduct & { quantity: number };

type CartContextValue = {
     cart: CartItem[];
     isCartModalOpen: boolean;
     addToCart: (product: CartProduct, quantity?: number) => void;
     removeFromCart: (productId: string) => void;
     updateQuantity: (productId: string, quantity: number) => void;
     clearCart: () => void;
     getTotalPrice: () => number;
     getTotalItems: () => number;
     openCartModal: () => void;
     closeCartModal: () => void;
};

const CartContext = createContext<CartContextValue | undefined>(undefined);

type CartProviderProps = {
     children: React.ReactNode;
};

export const useCart = (): CartContextValue => {
     const context = useContext(CartContext);
     if (!context) {
          throw new Error("useCart must be used within a CartProvider");
     }

     return context;
};

export const CartProvider = ({ children }: CartProviderProps) => {
     const [cart, setCart] = useState<CartItem[]>([]);
     const [isCartModalOpen, setIsCartModalOpen] = useState<boolean>(false);

     const addToCart = (product: CartProduct, quantity = 1) => {
          setCart((prevCart) => {
               const existingItem = prevCart.find(
                    (item) => item.id === product.id,
               );

               if (existingItem) {
                    return prevCart.map((item) =>
                         item.id === product.id
                              ? { ...item, quantity: item.quantity + quantity }
                              : item,
                    );
               }

               return [...prevCart, { ...product, quantity }];
          });
     };

     const removeFromCart = (productId: string) => {
          setCart((prevCart) =>
               prevCart.filter((item) => item.id !== productId),
          );
     };

     const updateQuantity = (productId: string, quantity: number) => {
          if (quantity <= 0) {
               removeFromCart(productId);
               return;
          }

          setCart((prevCart) =>
               prevCart.map((item) =>
                    item.id === productId ? { ...item, quantity } : item,
               ),
          );
     };

     const clearCart = () => {
          setCart([]);
     };

     const getTotalPrice = () => {
          return cart.reduce((total, item) => {
               const unitPrice =
                    item.isOffer && item.offerPrice > 0
                         ? item.offerPrice
                         : item.price;
               return total + unitPrice * item.quantity;
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

     const value = useMemo(
          () => ({
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
          }),
          [cart, isCartModalOpen],
     );

     return (
          <CartContext.Provider value={value}>{children}</CartContext.Provider>
     );
};
