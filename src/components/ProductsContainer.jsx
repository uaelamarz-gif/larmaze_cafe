import React, { useState } from "react";
import ProductCard from "./ProductCard";
import ProductDetailModal from "./ProductDetailModal";

const ProductsContainer = ({ title, products = [], id }) => {
     const [selectedProduct, setSelectedProduct] = useState(null);
     const [isModalOpen, setIsModalOpen] = useState(false);

     const handleCardClick = (product) => {
          setSelectedProduct(product);
          setIsModalOpen(true);
     };

     const handleCloseModal = () => {
          setIsModalOpen(false);
          setSelectedProduct(null);
     };

     return (
          <>
               <div
                    id={id}
                    className="container max-w-2xl lg:max-w-4xl mx-auto px-2 py-3"
               >
                    <div className="container-title-sm md:text-center text-start pb-4 font-primary font-bold text-2xl">
                         {title || "Products"}
                    </div>
                    <div className="products-wrapper grid gap-3 grid-cols-1 md:grid-cols-2">
                         {products.length > 0 ? (
                              products.map((p) => (
                                   <ProductCard
                                        key={p.id}
                                        product={p}
                                        onCardClick={handleCardClick}
                                        title={p.title}
                                        description={p.description}
                                        price={
                                             p.price ? `${p.price}` : undefined
                                        }
                                        offerPrice={
                                             p.offerPrice
                                                  ? `${p.offerPrice}`
                                                  : undefined
                                        }
                                        image={
                                             p.images && p.images.length
                                                  ? `${p.images[0]}`
                                                  : undefined
                                        }
                                        isOffer={p.isOffer}
                                        isPopular={p.isPopular}
                                   />
                              ))
                         ) : (
                              <div className="text-center text-sm text-gray-500">
                                   No products
                              </div>
                         )}
                    </div>
               </div>

               {selectedProduct && (
                    <ProductDetailModal
                         product={selectedProduct}
                         isOpen={isModalOpen}
                         onClose={handleCloseModal}
                    />
               )}
          </>
     );
};

export default ProductsContainer;
