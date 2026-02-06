import React from "react";
import PopularTag from "./ui/PopularTag";
import OfferTag from "./ui/OfferTag";
import { useCurrency } from "../contexts/CurrencyContext";

const ProductCardH = ({
     price,
     offerPrice,
     isOffer,
     isPopular,
     image,
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
               className="main overflow-hidden flex flex-col justify-between bg-gray-100 rounded-lg cursor-pointer transition-all hover:shadow-lg hover:bg-gray-200"
               onClick={handleClick}
          >
               <div className="bg-gray-200 flex justify-center">
                    <img
                         src={image || "https://placehold.co/600x400"}
                         className="rounded-b-md object-cover min-h-47.25 md:h-auto max-h-47.25"
                         alt=""
                    />
               </div>
               <div className="tags p-1 gap-1 flex">
                    {Popular ? <PopularTag /> : ""}
                    {Offer ? <OfferTag /> : ""}
               </div>
               <div className="container px-2">
                    <div className="title font-primary font-bold text-lg">
                         {title || "No title"}
                    </div>
                    <div className="description font-secondary text-[12px] break-all">
                         {description ||
                              "Lorem, ipsum dolor sit amet consectetur adipisicing elit. Dicta, inventore."}
                    </div>
               </div>
               <div className="container p-2 flex items-center justify-between">
                    <div className=" flex items-center gap-2">
                         <span className="text-1xl font-primary font-extrabold line-through text-gray-400">
                              {offerPrice || ""}
                         </span>
                         <span className="text-2xl font-primary font-extrabold text-gray-900">
                              {price || 0}
                              <span className="text-sm">{symbol}</span>
                         </span>
                    </div>
               </div>
          </div>
     );
};
export default ProductCardH;
