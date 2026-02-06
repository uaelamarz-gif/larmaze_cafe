import React from "react";
import PopularTag from "./ui/PopularTag";
import OfferTag from "./ui/OfferTag";
import { useCurrency } from "../contexts/CurrencyContext";

const ProductCard = ({
     price,
     offerPrice,
     image,
     isOffer,
     isPopular,
     title,
     description,
     product,
     onCardClick,
}) => {
     const Popular = isPopular || false;
     const Offer = isOffer || false;
     const { symbol } = useCurrency();

     const handleClick = () => {
          if (onCardClick && product) {
               onCardClick(product);
          }
     };

     return (
          <div
               className="card-main flex gap-4 p-4 rounded-xl bg-gray-100 cursor-pointer transition-all hover:shadow-lg hover:bg-gray-200"
               onClick={handleClick}
          >
               {/* INFO */}
               <div className="info flex flex-col justify-between flex-1">
                    {/* Tags */}
                    <div className="tags mb-1 flex gap-1">
                         {Popular ? <PopularTag /> : ""}
                         {Offer ? <OfferTag /> : ""}
                    </div>

                    {/* Title */}
                    <div className="title text-base font-semibold font-primary text-gray-900">
                         {title || "No title"}
                    </div>

                    {/* Description */}
                    <div className="description text-sm font-secondary text-gray-600 line-clamp-2">
                         {description ||
                              "Two dry aged 100% beef smashed patties, double American cheese Two dry aged 100% beef smashed patties, double American cheese..."}
                    </div>

                    {/* Price */}
                    <div className="price mt-2 flex items-center gap-2">
                         <span className="text-1xl font-primary font-extrabold line-through text-gray-400">
                              {offerPrice || ""}
                         </span>
                         <span className="text-xl font-primary font-extrabold text-gray-900">
                              {price || 0}
                              <span className="text-sm">{symbol}</span>
                         </span>
                    </div>
               </div>

               {/* IMAGE */}
               <div className="product-img aspect-square w-30 shrink-0 rounded-lg overflow-hidden">
                    <img
                         src={image || "https://placehold.co/600x400"}
                         alt="Burger"
                         className="w-full h-full object-cover"
                    />
               </div>
          </div>
     );
};

export default ProductCard;
