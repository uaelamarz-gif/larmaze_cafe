import React from "react";
import PopularTag from "./ui/PopularTag";
import OfferTag from "./ui/OfferTag";
import { useCurrency } from "../contexts/CurrencyContext";
import { useCart } from "../contexts/CartContext";

const ProductDetailModal = ({ product, isOpen, onClose }) => {
     const { symbol } = useCurrency();
     const { addToCart, openCartModal } = useCart();

     if (!product) return null;

     const handleAddToCart = () => {
          addToCart(product, 1);
          onClose()
          openCartModal();
     };

     return (
          <>
               <input
                    type="checkbox"
                    id="product-modal"
                    className="modal-toggle"
                    checked={isOpen}
                    onChange={() => {}}
               />
               <div className="modal" role="dialog">
                    <div className="modal-box w-full bg-gray-50 max-w-2xl">
                         {/* Close button */}
                         <button
                              onClick={onClose}
                              className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
                         >
                              ✕
                         </button>

                         {/* Content */}
                         <div className="flex flex-col md:flex-row gap-6">
                              {/* Image Section */}
                              <div className="w-full md:w-2/5">
                                   <img
                                        src={
                                             product.images &&
                                             product.images.length
                                                  ? product.images[0]
                                                  : "https://placehold.co/600x400"
                                        }
                                        alt={product.title}
                                        className="w-full rounded-lg object-cover"
                                   />
                              </div>

                              {/* Details Section */}
                              <div className="w-full md:w-3/5 flex flex-col gap-4">
                                   {/* Tags */}
                                   <div className="flex gap-2">
                                        {product.isPopular && <PopularTag />}
                                        {product.isOffer && <OfferTag />}
                                   </div>

                                   {/* Title */}
                                   <h2 className="text-2xl font-bold font-primary text-gray-900">
                                        {product.title}
                                   </h2>

                                   {/* Category */}
                                   {product.category && (
                                        <div className="text-sm text-gray-500">
                                             <span className="font-semibold">
                                                  Category:
                                             </span>{" "}
                                             {typeof product.category ===
                                             "string"
                                                  ? product.category
                                                  : product.category.name ||
                                                    "Uncategorized"}
                                        </div>
                                   )}

                                   {/* Price */}
                                   <div className="flex items-center gap-3">
                                        {product.offerPrice != 0 ? (
                                             <span className="text-lg font-semibold line-through text-gray-400">
                                                  {product.offerPrice || ""}
                                                  <span className="text-sm">
                                                       {symbol}
                                                  </span>
                                             </span>
                                        ) : ""}
                                        <span className="text-3xl font-extrabold font-primary text-gray-900">
                                             {product.price || ""}
                                             <span className="text-lg">
                                                  {symbol}
                                             </span>
                                        </span>
                                   </div>

                                   {/* Description */}
                                   
                                   <div>
                                        <p className="font-semibold text-gray-900 mb-2">
                                             Description
                                        </p>
                                        <p className="text-gray-600 text-sm leading-relaxed">
                                             {product.description ||
                                                  "No description available"}
                                        </p>
                                   </div>

                                   {/* Additional Info */}
                                   {product.ingredients && (
                                        <div>
                                             <p className="font-semibold text-gray-900 mb-2">
                                                  Ingredients
                                             </p>
                                             <p className="text-gray-600 text-sm">
                                                  {product.ingredients}
                                             </p>
                                        </div>
                                   )}

                                   {/* Actions */}
                                   <div className="modal-action gap-2">
                                        <button
                                             onClick={onClose}
                                             className="btn btn-ghost"
                                        >
                                             Close
                                        </button>
                                        <button
                                             onClick={handleAddToCart}
                                             className="btn border-0 text-white bg-green-500"
                                        >
                                             Add to Cart
                                        </button>
                                   </div>
                              </div>
                         </div>
                    </div>

                    {/* Overlay */}
                    <form method="dialog" className="modal-backdrop">
                         <button onClick={onClose}>close</button>
                    </form>
               </div>
          </>
     );
};

export default ProductDetailModal;
