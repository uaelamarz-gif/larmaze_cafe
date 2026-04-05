import { FormEvent, useEffect, useState } from "react";
import { useProducts } from "../../hooks/useProducts";
import { showErrorAlert, showSuccessAlert } from "../../utils/alerts";

type CategoryOption = {
     name: string;
     order: number;
};

type Props = {
     fetchProducts: () => Promise<unknown>;
     categories: CategoryOption[];
};

type CategoryOrderState = {
     category: string;
     newOrder: number;
};

const initialState: CategoryOrderState = {
     category: "",
     newOrder: 0,
};

export default function CategoryOrderUpdate({
     fetchProducts,
     categories,
}: Props) {
     const [data, setData] = useState<CategoryOrderState>(initialState);
     const { setCategoryOrder } = useProducts();

     useEffect(() => {
          if (categories.length === 0) {
               setData(initialState);
               return;
          }

          setData((previousData) => {
               const selectedCategory = categories.find(
                    (category) => category.name === previousData.category,
               );

               if (selectedCategory) {
                    return {
                         ...previousData,
                         newOrder: previousData.newOrder,
                    };
               }

               return {
                    category: categories[0].name,
                    newOrder: categories[0].order,
               };
          });
     }, [categories]);

     const handleSave = async (e: FormEvent<HTMLFormElement>) => {
          e.preventDefault();

          try {
               if (!data.category.trim()) {
                    throw new Error("Please select a category");
               }

               await setCategoryOrder(data.category, data.newOrder);
               await showSuccessAlert("تم التحديث!", "تمت العملية بنجاح");
               const selectedCategory = categories.find(
                    (category) => category.name === data.category,
               );

               setData({
                    category: data.category,
                    newOrder: selectedCategory?.order ?? data.newOrder,
               });
               await fetchProducts();
          } catch (error) {
               const message =
                    error instanceof Error
                         ? error.message
                         : "فشل في حفظ البيانات";
               showErrorAlert("خطأ!", message);
          }
     };

     return (
          <form
               className="mb-4 flex flex-col gap-2 items-start"
               onSubmit={handleSave}
          >
               <p>UPDATE THE CATEGORY ORDER</p>
               <div className="flex gap-1.5">
                    <select
                         value={data.category}
                         className="input border"
                         onChange={(e) => {
                              const selectedCategory = categories.find(
                                   (category) =>
                                        category.name === e.target.value,
                              );

                              setData({
                                   category: e.target.value,
                                   newOrder: selectedCategory?.order ?? 0,
                              });
                         }}
                         disabled={categories.length === 0}
                    >
                         {categories.length === 0 ? (
                              <option value="">No categories available</option>
                         ) : (
                              categories.map((category) => (
                                   <option
                                        key={category.name}
                                        value={category.name}
                                   >
                                        {category.name} (Current Order{" "}
                                        {category.order})
                                   </option>
                              ))
                         )}
                    </select>

                    <input
                         type="number"
                         placeholder="newOrder"
                         value={data.newOrder}
                         className="input border"
                         onChange={(e) =>
                              setData({
                                   ...data,
                                   newOrder: Number(e.target.value || 0),
                              })
                         }
                    />

                    <button className="btn" type="submit">
                         Save
                    </button>
               </div>
          </form>
     );
}
