import React, { useState } from "react";
import ProductCardH from "../ProductCardH";
import ProductDetailModal from "../ProductDetailModal";

const CardsSection = ({ title, cards = [] }) => {
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
               <div className="specialProductsContainer py-3 px-3">
                    <div className="container-title-lg md:text-center text-start pb-4 font-primary font-bold text-3xl">
                         {title || "Not Title"}
                    </div>

                    <div className="grid gap-3 grid-cols-2  md:grid-cols-3">
                         {cards.length > 0 ? (
                              cards.map((c) => (
                                   <ProductCardH
                                        key={c.id}
                                        product={c}
                                        onCardClick={handleCardClick}
                                        title={c.title}
                                        description={c.description}
                                        price={
                                             c.price ? `${c.price}` : undefined
                                        }
                                        offerPrice={
                                             c.offerPrice
                                                  ? `${c.offerPrice}`
                                                  : undefined
                                        }
                                        image={
                                             c.images && c.images.length
                                                  ? `${c.images[0]}`
                                                  : undefined
                                        }
                                        isOffer={c.isOffer}
                                        isPopular={c.isPopular}
                                   />
                              ))
                         ) : (
                              <div className="text-sm text-gray-500">
                                   No items
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

export default CardsSection;
