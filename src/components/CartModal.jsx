import React from "react";
import { useCart } from "../contexts/CartContext";
import { useCurrency } from "../contexts/CurrencyContext";
import { AiOutlineMinus, AiOutlinePlus, AiOutlineDelete } from "react-icons/ai";

const CartModal = () => {
     const {
          cart,
          isCartModalOpen,
          closeCartModal,
          updateQuantity,
          removeFromCart,
          getTotalPrice,
     } = useCart();
     const { symbol } = useCurrency();

     const handleWhatsAppOrder = () => {
          if (cart.length === 0) {
               alert("Cart is empty");
               return;
          }

          // Format cart items for WhatsApp message
          const cartText = cart
               .map(
                    (item) =>
                         `${item.title} - Qty: ${item.quantity} - ${item.price}${symbol}`,
               )
               .join("\n");

          const totalPrice = getTotalPrice();
          const message = `*Order Request*\n\n${cartText}\n\n*Total: ${totalPrice}${symbol}*`;

          // WhatsApp number (replace with your restaurant's number)
          const whatsappNumber = "+97137667663"; // Format: country code + number without +
          const encodedMessage = encodeURIComponent(message);
          const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodedMessage}`;

          window.open(whatsappUrl, "_blank");
     };

     return (
          <>
               <input
                    type="checkbox"
                    id="cart-modal"
                    className="modal-toggle"
                    checked={isCartModalOpen}
                    onChange={() => {}}
               />
               <div className="modal" role="dialog">
                    <div className="modal-box bg-gray-50 w-full max-w-2xl">
                         {/* Close button */}
                         <button
                              onClick={closeCartModal}
                              className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
                         >
                              ✕
                         </button>

                         {/* Header */}
                         <h2 className="text-2xl font-bold font-primary text-gray-900 mb-4">
                              Your Cart
                         </h2>

                         {/* Cart Items */}
                         {cart.length > 0 ? (
                              <div className="flex flex-col gap-4 max-h-96 overflow-y-auto mb-6">
                                   {cart.map((item) => (
                                        <div
                                             key={item._id}
                                             className="flex items-center gap-4 p-3 bg-gray-100 rounded-lg"
                                        >
                                             {/* Image */}
                                             <div className="w-20 h-20 flex-shrink-0">
                                                  <img
                                                       src={
                                                            item.images &&
                                                            item.images.length
                                                                 ? item
                                                                        .images[0]
                                                                 : "https://placehold.co/80x80"
                                                       }
                                                       alt={item.title}
                                                       className="w-full h-full object-cover rounded"
                                                  />
                                             </div>

                                             {/* Item Details */}
                                             <div className="flex-1">
                                                  <p className="font-semibold text-gray-900">
                                                       {item.title}
                                                  </p>
                                                  <p className="text-sm text-gray-600">
                                                       {item.price}
                                                       {symbol}
                                                  </p>
                                             </div>

                                             {/* Quantity Controls */}
                                             <div className="flex items-center gap-2 bg-white rounded-lg p-2">
                                                  <button
                                                       onClick={() =>
                                                            updateQuantity(
                                                                 item._id,
                                                                 item.quantity -
                                                                      1,
                                                            )
                                                       }
                                                       className="btn btn-xs btn-ghost"
                                                  >
                                                       <AiOutlineMinus />
                                                  </button>
                                                  <span className="w-8 text-center font-semibold">
                                                       {item.quantity}
                                                  </span>
                                                  <button
                                                       onClick={() =>
                                                            updateQuantity(
                                                                 item._id,
                                                                 item.quantity +
                                                                      1,
                                                            )
                                                       }
                                                       className="btn btn-xs btn-ghost"
                                                  >
                                                       <AiOutlinePlus />
                                                  </button>
                                             </div>

                                             {/* Delete Button */}
                                             <button
                                                  onClick={() =>
                                                       removeFromCart(item._id)
                                                  }
                                                  className="btn btn-sm btn-error btn-ghost"
                                             >
                                                  <AiOutlineDelete />
                                             </button>
                                        </div>
                                   ))}
                              </div>
                         ) : (
                              <div className="text-center text-gray-500 py-8">
                                   Your cart is empty
                              </div>
                         )}

                         {/* Total Price */}
                         {cart.length > 0 && (
                              <div className="border-t-2 pt-4 mb-4">
                                   <div className="flex justify-between items-center text-xl font-bold">
                                        <span>Total:</span>
                                        <span className="text-primary">
                                             {getTotalPrice().toFixed(2)}
                                             {symbol}
                                        </span>
                                   </div>
                              </div>
                         )}

                         {/* Actions */}
                         <div className="modal-action gap-2">
                              <button
                                   onClick={closeCartModal}
                                   className="btn btn-ghost"
                              >
                                   Continue Shopping
                              </button>
                              {cart.length > 0 && (
                                   <button
                                        onClick={handleWhatsAppOrder}
                                        className="btn btn-success bg-green-400 text-white"
                                   >
                                        Send to WhatsApp
                                   </button>
                              )}
                         </div>
                    </div>

                    {/* Overlay */}
                    <form method="dialog" className="modal-backdrop">
                         <button onClick={closeCartModal}>close</button>
                    </form>
               </div>
          </>
     );
};

export default CartModal;
