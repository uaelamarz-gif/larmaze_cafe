import { useEffect, useMemo, useState } from "react";
import { CiGlobe } from "react-icons/ci";
import { FiShoppingCart } from "react-icons/fi";
import Carousel from "../components/Carousel";
import CategorySelector from "../components/CategorySelector";
import Footer from "../components/Footer";
import ProductsContainer from "../components/ProductsContainer";
import CardsSection from "../components/Sections/CardsSection";
import Loading from "../components/ui/Loading";
import SocialBtns from "../components/ui/SocialBtns";
import { useProducts } from "../hooks/useProducts";
import { useCart } from "../contexts/CartContext";
import { useLang } from "../contexts/LangContext";
import { mapRowToProductView } from "../types/product";
import { showErrorAlert } from "../utils/alerts";

type CategoryItem = {
     id: number;
     name: string;
};

const Home = () => {
     const { lang: language, toggleLang } = useLang();
     const { products: rows, loading, fetchProducts } = useProducts();
     const { getTotalItems, openCartModal } = useCart();

     const [categoriesList, setCategoriesList] = useState<CategoryItem[]>([]);

     const products = useMemo(() => {
          return rows.map((row) => mapRowToProductView(row, language));
     }, [rows, language]);

     useEffect(() => {
          fetchProducts().catch((err) => {
               const message =
                    err instanceof Error
                         ? err.message
                         : "Failed to load products";
               showErrorAlert("خطأ!", message);
          });
     }, [fetchProducts]);

     useEffect(() => {
          const catMap = new Map<string, CategoryItem>();

          products.forEach((item) => {
               const name = item.category || "Uncategorized";
               if (!catMap.has(name)) {
                    catMap.set(name, { id: catMap.size + 1, name });
               }
          });

          setCategoriesList([
               {
                    id: 0,
                    name:
                         language === "ar"
                              ? "عروض خاصة!🔥"
                              : "Special Offers !🔥",
               },
               ...Array.from(catMap.values()),
          ]);
     }, [products, language]);

     return (
          <div>
               <button
                    onClick={openCartModal}
                    className="rounded-md p-5 fixed bottom-5 right-8 bg-orange-500 hover:bg-orange-600 transition-colors flex items-center justify-center text-xl text-white"
                    title="Shopping Cart"
               >
                    <FiShoppingCart />
                    {getTotalItems() > 0 && (
                         <span className="absolute top-1 right-1 bg-red-600 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                              {getTotalItems()}
                         </span>
                    )}
               </button>

               <div className="img relative pt-3 pb-8 overflow-hidden px-2 bg-black">
                    <img
                         src="/bg-cover.webp"
                         className="object-cover w-full h-full filter brightness-50 top-0 left-0 absolute"
                         alt="cover"
                    />

                    <div className="resturant-details flex flex-col gap-16 relative m-auto max-w-3xl">
                         <SocialBtns />
                         <div className="container flex gap-3">
                              <div className="flex w-full justify-between">
                                   <div className="flex flex-col gap-2">
                                        <div className="logo rounded-full aspect-square w-20 md:w-28 border-white border-4 overflow-hidden">
                                             <img
                                                  src="logo.png"
                                                  className="object-cover w-full object-center"
                                                  alt=""
                                             />
                                        </div>
                                        <h2 className="store-name font-secondary font-semibold text-md md:text-2xl text-white">
                                             Lamarz Restaurant & Cafe
                                        </h2>
                                   </div>

                                   <div className="flex flex-col font-primary font-bold justify-end">
                                        <button
                                             className="btn rounded-2xl bg-gray-100"
                                             onClick={toggleLang}
                                        >
                                             {language === "en"
                                                  ? "العربية"
                                                  : "English"}
                                             <CiGlobe />
                                        </button>
                                   </div>
                              </div>
                         </div>
                    </div>
               </div>

               <CategorySelector categories={categoriesList} />

               <div className="container flex flex-col gap-3 max-w-2xl lg:max-w-4xl mx-auto">
                    <div>
                         <Carousel />
                    </div>

                    {loading ? (
                         <Loading />
                    ) : (
                         <>
                              <CardsSection
                                   title={
                                        language === "en"
                                             ? "Special Offers !🔥"
                                             : "عروض خاصة!🔥"
                                   }
                                   cards={products.filter((p) => p.isOffer)}
                              />

                              <CardsSection
                                   title={
                                        language === "en"
                                             ? "Picked For You !"
                                             : "مختار لك"
                                   }
                                   cards={products.filter((p) => p.isPopular)}
                              />

                              {categoriesList.length > 0 &&
                                   categoriesList.slice(1).map((cat) => {
                                        const catProducts = products
                                             .filter(
                                                  (p) =>
                                                       (p.category ||
                                                            "Uncategorized") ===
                                                       cat.name,
                                             )
                                             .sort(
                                                  (a, b) =>
                                                       a.itemOrder -
                                                       b.itemOrder,
                                             );

                                        return (
                                             <ProductsContainer
                                                  key={cat.id}
                                                  id={`category-${cat.name}`}
                                                  title={cat.name}
                                                  products={catProducts}
                                             />
                                        );
                                   })}

                              <ProductsContainer
                                   title={
                                        language === "en"
                                             ? "All Products"
                                             : "كل الاطباق"
                                   }
                                   products={products}
                              />
                         </>
                    )}
               </div>

               <Footer />
          </div>
     );
};

export default Home;
