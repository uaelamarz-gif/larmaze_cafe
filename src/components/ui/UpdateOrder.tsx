import { FormEvent, useState } from "react";
import { useProducts } from "../../hooks/useProducts";
import { showErrorAlert, showSuccessAlert } from "../../utils/alerts";

type Props = {
     fetchProducts: () => Promise<unknown>;
};

type CategoryOrderState = {
     category: string;
     newOrder: number;
};

const initialState: CategoryOrderState = {
     category: "",
     newOrder: 0,
};

export default function CategoryOrderUpdate({ fetchProducts }: Props) {
     const [data, setData] = useState<CategoryOrderState>(initialState);
     const { setCategoryOrder } = useProducts();

     const handleSave = async (e: FormEvent<HTMLFormElement>) => {
          e.preventDefault();

          try {
               if (!data.category.trim()) {
                    throw new Error("Category name is required");
               }

               await setCategoryOrder(data.category, data.newOrder);
               await showSuccessAlert("تم التحديث!", "تمت العملية بنجاح");
               setData(initialState);
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
          <form className="flex gap-2 items-center" onSubmit={handleSave}>
               <input
                    type="text"
                    placeholder="Category Name English"
                    value={data.category}
                    className="input border"
                    onChange={(e) =>
                         setData({ ...data, category: e.target.value })
                    }
               />

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
          </form>
     );
}
