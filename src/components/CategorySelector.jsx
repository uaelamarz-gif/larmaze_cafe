// file: components/CategorySelector.jsx
import { useEffect, useState } from "react";

export default function CategorySelector({ categories: categoriesProp }) {
     const DEFAULT_CATEGORIES = [
          { id: 1, name: "All" },
          { id: 2, name: "Technology" },
          { id: 3, name: "Design" },
          { id: 4, name: "Lifestyle" },
          { id: 5, name: "Business" },
          { id: 6, name: "Health" },
          { id: 7, name: "Education" },
          { id: 8, name: "Cooking" },
          { id: 9, name: "Travel" },
     ];
     const [categories, setCategories] = useState(
          categoriesProp || DEFAULT_CATEGORIES,
     );
     const [selected, setSelected] = useState(
          categories && categories[0] ? categories[0].id : 1,
     );
     const [loading, setLoading] = useState(false);

     useEffect(() => {
          if (categoriesProp && categoriesProp.length) {
               setCategories(categoriesProp);
               setSelected(categoriesProp[0].id || 1);
          }
     }, [categoriesProp]);

     if (loading) return <div>Loading...</div>;

     const slug = (s) =>
          s
               .toLowerCase()
               .replace(/\s+/g, "-")
               .replace(/[^a-z0-9\-]/g, "");

     const handleClick = (category, index) => {
          setSelected(category.id);
          // scroll to section with id `category-{slug}`
          const targetId = `category-${slug(category.name)}`;
          const el = document.getElementById(targetId);
          if (el) {
               el.scrollIntoView({ behavior: "smooth", block: "start" });
          } else {
               // if 'All', scroll to top of products container
               if (category.name.toLowerCase() === "all") {
                    const container =
                         document.querySelector(".container.max-w-2xl") ||
                         document.documentElement;
                    container.scrollIntoView({
                         behavior: "smooth",
                         block: "start",
                    });
               }
          }
     };

     return (
          <div className="sticky top-0 z-50 -mt-6 px-3 mb-3 rounded-md max-w-3xl mx-auto bg-[#eaeaea] shadow-sm">
               <div className="flex items-center min-h-18 gap-3">
                    <div className="flex overflow-scroll no-scrollbar font-secondary font-bold text-[1.1rem]">
                         {categories.map((category, index) => {
                              const isActive = selected === category.id;
                              return (
                                   <div
                                        key={category.id}
                                        role="button"
                                        tabIndex={0}
                                        onClick={() =>
                                             handleClick(category, index)
                                        }
                                        onKeyDown={(e) => {
                                             if (
                                                  e.key === "Enter" ||
                                                  e.key === " "
                                             )
                                                  handleClick(category, index);
                                        }}
                                        className={`p-5 cursor-pointer ${isActive ? "border-b-4 text-[#F5A623] border-[#8B2E2E]" : ""}`}
                                   >
                                        {category.name}
                                   </div>
                              );
                         })}
                    </div>
               </div>
          </div>
     );
}
