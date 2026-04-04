import OfferTag from "./ui/OfferTag";
import PopularTag from "./ui/PopularTag";
import { useCart } from "../contexts/CartContext";
import { useCurrency } from "../contexts/CurrencyContext";
import { useLang } from "../contexts/LangContext";
import { ProductCardView } from "../types/product";

type ProductDetailModalProps = {
     product: ProductCardView | null;
     isOpen: boolean;
     onClose: () => void;
};

const ProductDetailModal = ({
     product,
     isOpen,
     onClose,
}: ProductDetailModalProps) => {
     const { symbol } = useCurrency();
     const { addToCart, openCartModal } = useCart();
     const { lang: language } = useLang();

     if (!product) {
          return null;
     }

     const handleAddToCart = () => {
          addToCart(product, 1);
          onClose();
          openCartModal();
     };

     const finalPrice =
          product.isOffer && product.offerPrice > 0
               ? product.offerPrice
               : product.price;

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
                         <button
                              onClick={onClose}
                              className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
                         >
                              ✕
                         </button>

                         <div className="flex flex-col md:flex-row gap-6">
                              <div className="w-full md:w-2/5">
                                   <img
                                        src={
                                             product.images.length
                                                  ? product.images[0]
                                                  : "https://placehold.co/600x400"
                                        }
                                        alt={product.title}
                                        className="w-full rounded-lg object-cover"
                                   />
                              </div>

                              <div className="w-full md:w-3/5 flex flex-col gap-4">
                                   <div className="flex gap-2">
                                        {product.isPopular && <PopularTag />}
                                        {product.isOffer && <OfferTag />}
                                   </div>

                                   <h2 className="text-2xl font-bold font-primary text-gray-900">
                                        {product.title}
                                   </h2>

                                   <div className="text-sm font-secondary text-gray-500">
                                        <span className="font-semibold">
                                             {language === "ar"
                                                  ? "الصنف:"
                                                  : "Category:"}
                                        </span>{" "}
                                        {product.category || "Uncategorized"}
                                   </div>

                                   <div className="flex items-center gap-3">
                                        {product.isOffer &&
                                             product.offerPrice > 0 && (
                                                  <span className="text-lg font-semibold line-through text-gray-400">
                                                       {product.price}
                                                       <span className="text-sm">
                                                            {symbol}
                                                       </span>
                                                  </span>
                                             )}

                                        <span className="text-3xl font-extrabold font-primary text-gray-900">
                                             {finalPrice}
                                             <span className="text-lg">
                                                  {symbol}
                                             </span>
                                        </span>
                                   </div>

                                   <div>
                                        <p className="font-semibold font-secondary text-gray-900 mb-2">
                                             {language === "ar"
                                                  ? "الوصف:"
                                                  : "Description:"}
                                        </p>
                                        <p className="text-gray-600 text-sm leading-relaxed">
                                             {product.description ||
                                                  "No description available"}
                                        </p>
                                   </div>

                                   <div className="modal-action gap-2">
                                        <button
                                             onClick={onClose}
                                             className="btn btn-ghost"
                                        >
                                             {language === "ar"
                                                  ? "اغلاق"
                                                  : "Close"}
                                        </button>
                                        <button
                                             onClick={handleAddToCart}
                                             className="btn border-0 text-white bg-green-500"
                                        >
                                             {language === "ar"
                                                  ? "اضف الي العربة"
                                                  : "Add to Cart"}
                                        </button>
                                   </div>
                              </div>
                         </div>
                    </div>

                    <form method="dialog" className="modal-backdrop">
                         <button onClick={onClose}>close</button>
                    </form>
               </div>
          </>
     );
};

export default ProductDetailModal;
