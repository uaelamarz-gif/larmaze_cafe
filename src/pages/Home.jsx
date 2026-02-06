import React, { useEffect, useState } from "react";
import CategorySelector from "../components/CategorySelector";
import Carousel from "../components/Carousel";
import ProductsContainer from "../components/ProductsContainer";
import CardsSection from "../components/Sections/CardsSection";
import { CiGlobe } from "react-icons/ci";
import { FiShoppingCart } from "react-icons/fi";
import { useCart } from "../contexts/CartContext";
import SocialBtns from "../components/ui/SocialBtns";
import Footer from "../components/Footer";
import Loading from "../components/ui/Loading";

const Home = () => {
     const [language, setLanguage] = useState("en"); // "en" | "ar"
     const [products, setProducts] = useState([]);
     const [categoriesList, setCategoriesList] = useState([]);
     const [loading, setLoading] = useState(false);
     const [error, setError] = useState(null);
     const { getTotalItems, openCartModal } = useCart();

     const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:3000/api";

     useEffect(() => {
          const controller = new AbortController();

          async function fetchProducts() {
               try {
                    setLoading(true);
                    setError(null);

                    const res = await fetch(
                         `${apiUrl}/products?lang=${language}`,
                         {
                              signal: controller.signal,
                         },
                    );

                    if (!res.ok) throw new Error("Fetch failed");

                    const data = await res.json();
                    // API might return an array or an object with .products
                    const productsArray = Array.isArray(data)
                         ? data
                         : data.products || [];
                    setProducts(productsArray);
                    // derive categories from productsArray (category can be string or object)
                    const catsMap = new Map();
                    const getCatName = (p) => {
                         const raw = p.category;
                         if (!raw) return "Uncategorized";
                         return typeof raw === "string"
                              ? raw
                              : raw.name || "Uncategorized";
                    };
                    productsArray.forEach((p) => {
                         const name = getCatName(p);
                         if (!catsMap.has(name))
                              catsMap.set(name, { id: catsMap.size + 1, name });
                    });
                    const cats = [
                         { id: 0, name: "All" },
                         ...Array.from(catsMap.values()),
                    ];
                    setCategoriesList(cats);
                    console.log(cats);
                    console.log(productsArray);
               } catch (err) {
                    if (err.name !== "AbortError") {
                         setError(err.message);
                    }
               } finally {
                    setLoading(false);
               }
          }

          fetchProducts();

          return () => controller.abort(); // cancel old request on lang switch
     }, [language]);
     useEffect(() => {
          document.documentElement.dir = language === "ar" ? "rtl" : "ltr";
     }, [language]);

     return (
          <div className="">
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
               <div className="img relative pt-3 pb-8  overflow-hidden px-2 bg-black">
                    <img
                         src="/bg-cover.webp"
                         className="object-cover filter brightness-50 top-0 left-0 absolute"
                         alt="cover"
                    />
                    <div className=" resturant-details flex flex-col gap-16 relative m-auto max-w-3xl">
                         <SocialBtns />
                         <div className="container flex gap-3">
                              <div className="flex w-full justify-between">
                                   <div className="flex flex-col  gap-2">
                                        <div className="logo rounded-full aspect-square w-20 md:w-28 border-white border-4 overflow-hidden">
                                             <img
                                                  src="logo-larmaze.png"
                                                  className="object-cover object-center"
                                                  alt=""
                                             />
                                        </div>
                                        <h2 className="store-name font-secondary font-semibold text-md md:text-2xl text-white">
                                             Lamarz Restaurant & Cafe
                                        </h2>
                                   </div>

                                   <div className="flex flex-col  font-primary font-bold justify-end">
                                        <button
                                             className="btn rounded-2xl bg-gray-100"
                                             onClick={() => {
                                                  language == "en"
                                                       ? setLanguage("ar")
                                                       : setLanguage("en");
                                             }}
                                        >
                                             {language == "en"
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
                    
{
     loading ? <Loading/> :
                    (
                         <>
                    <CardsSection
                         title={
                              language === "en"
                                   ? "Special Offers !"
                                   : "عروض خاصة!"
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
                    
                    {/* Category sections */}
                    {categoriesList &&
                         categoriesList.length > 0 &&
                         categoriesList.slice(1).map((cat) => {
                              const slug = cat.name
                                   .toLowerCase()
                                   .replace(/\s+/g, "-")
                                   .replace(/[^a-z0-9\-]/g, "");
                              const catProducts = products.filter((p) => {
                                   const raw = p.category;
                                   const name = !raw
                                        ? "Uncategorized"
                                        : typeof raw === "string"
                                          ? raw
                                          : raw.name || "Uncategorized";
                                   return name === cat.name;
                              });
                              return (
                                   <ProductsContainer
                                        key={cat.id}
                                        id={`category-${slug}`}
                                        title={cat.name}
                                        products={catProducts}
                                   />
                              );
                         })}

                    {/* Fallback main products */}
                    <ProductsContainer products={products} />
                    </>)
}
               </div>
               <Footer />
          </div>
     );
};

export default Home;
