import { FormEvent, useEffect, useMemo, useState } from "react";
import { Image as ImageIcon, Pencil, Plus, Trash2, X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { useProducts } from "../hooks/useProducts";
import {
     ProductFormValues,
     ProductRow,
     emptyProductForm,
} from "../types/product";
import {
     confirmDeleteAlert,
     showErrorAlert,
     showSuccessAlert,
} from "../utils/alerts";
import CategoryOrderUpdate from "../components/ui/UpdateOrder";

const AdminProducts = () => {
     const [formData, setFormData] =
          useState<ProductFormValues>(emptyProductForm);
     const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
     const [editingId, setEditingId] = useState<string | null>(null);
     const [selectedCategory, setSelectedCategory] = useState<string>("");

     const { logout } = useAuth();
     const navigate = useNavigate();

     const {
          products,
          loading,
          fetchProducts,
          addProduct,
          editProduct,
          deleteProduct,
     } = useProducts();

     useEffect(() => {
          fetchProducts().catch((err) => {
               const message =
                    err instanceof Error
                         ? err.message
                         : "Failed to fetch products";
               showErrorAlert("خطأ!", message);
          });
     }, [fetchProducts]);

     const sortedProducts = useMemo(() => {
          return [...products].sort((a, b) => {
               if (a.category_order !== b.category_order) {
                    return a.category_order - b.category_order;
               }

               return a.item_order - b.item_order;
          });
     }, [products]);

     const categoryOptions = useMemo(() => {
          const categoryMap = new Map<string, number>();

          sortedProducts.forEach((product) => {
               const categoryName = product.category_en?.trim();
               if (!categoryName) {
                    return;
               }

               const categoryOrder = Number(product.category_order ?? 0);
               const existingOrder = categoryMap.get(categoryName);
               if (
                    existingOrder === undefined ||
                    categoryOrder < existingOrder
               ) {
                    categoryMap.set(categoryName, categoryOrder);
               }
          });

          return [...categoryMap.entries()]
               .map(([name, order]) => ({ name, order }))
               .sort(
                    (a, b) => a.order - b.order || a.name.localeCompare(b.name),
               );
     }, [sortedProducts]);

     const filteredProducts = useMemo(() => {
          if (!selectedCategory) {
               return sortedProducts;
          }

          return sortedProducts.filter(
               (product) =>
                    (product.category_en ?? "").trim() === selectedCategory,
          );
     }, [selectedCategory, sortedProducts]);

     useEffect(() => {
          if (categoryOptions.length === 0) {
               setSelectedCategory("");
               return;
          }

          setSelectedCategory((previousCategory) => {
               if (
                    previousCategory &&
                    categoryOptions.some(
                         (category) => category.name === previousCategory,
                    )
               ) {
                    return previousCategory;
               }

               return categoryOptions[0].name;
          });
     }, [categoryOptions]);

     const resetForm = () => {
          setFormData(emptyProductForm);
          setEditingId(null);
     };

     const openCreateModal = () => {
          resetForm();
          setIsModalOpen(true);
     };

     const handleEdit = (product: ProductRow) => {
          setFormData({
               title_en: product.title_en,
               title_ar: product.title_ar,
               description_en: product.description_en ?? "",
               description_ar: product.description_ar ?? "",
               images: product.images?.length ? product.images : [""],
               after_price: Number(product.after_price ?? 0),
               before_price: Number(product.before_price ?? 0),
               category_order: Number(product.category_order ?? 0),
               item_order: Number(product.item_order ?? 0),
               is_offer: Boolean(product.is_offer),
               is_popular: Boolean(product.is_popular),
               category_en: product.category_en ?? "",
               category_ar: product.category_ar ?? "",
          });
          setEditingId(product.id);
          setIsModalOpen(true);
     };

     const handleSave = async (e: FormEvent<HTMLFormElement>) => {
          e.preventDefault();

          try {
               if (editingId) {
                    await editProduct(editingId, formData);
                    await showSuccessAlert("تم التحديث!", "تمت العملية بنجاح");
               } else {
                    await addProduct(formData);
                    await showSuccessAlert("تمت الإضافة!", "تمت العملية بنجاح");
               }

               setIsModalOpen(false);
               resetForm();
               await fetchProducts();
          } catch (err) {
               const message =
                    err instanceof Error ? err.message : "فشل في حفظ البيانات";
               showErrorAlert("خطأ!", message);
          }
     };

     const handleDelete = async (id: string) => {
          const confirmResult = await confirmDeleteAlert();
          if (!confirmResult.isConfirmed) {
               return;
          }

          try {
               await deleteProduct(id);
               await showSuccessAlert("تم المسح!", "تم حذف المنتج بنجاح.");
               await fetchProducts();
          } catch (err) {
               const message =
                    err instanceof Error ? err.message : "فشل في الحذف";
               showErrorAlert("خطأ!", message);
          }
     };

     return (
          <div className="md:p-8 bg-zinc-50 min-h-screen">
               <div className="max-w-6xl mx-auto">
                    <header className="flex justify-between items-center mb-8">
                         <h1 className="text-3xl font-black text-zinc-900">
                              Inventory
                         </h1>
                         <div className="flex items-center gap-3">
                              <button
                                   onClick={openCreateModal}
                                   className="bg-zinc-900 text-xs md:text-1xl text-white px-6 py-3 rounded-xl font-bold flex items-center gap-2 hover:scale-105 transition-transform"
                              >
                                   <Plus size={20} /> Add Product
                              </button>

                              <button
                                   onClick={async () => {
                                        await logout();
                                        navigate("/admin/login");
                                   }}
                                   className="bg-red-600 hover:bg-red-700 text-xs md:text-1xl text-white px-4 py-3 rounded-xl font-bold flex items-center gap-2 transition"
                              >
                                   Sign Out
                              </button>
                         </div>
                    </header>

                    <div className="mb-4 rounded-xl bg-white p-4 shadow-sm">
                         <label
                              htmlFor="category-filter"
                              className="mb-2 block text-sm font-semibold text-zinc-700"
                         >
                              Select Category
                         </label>
                         <select
                              id="category-filter"
                              className="w-full rounded-lg border border-zinc-300 bg-white p-3"
                              value={selectedCategory}
                              onChange={(e) =>
                                   setSelectedCategory(e.target.value)
                              }
                              disabled={categoryOptions.length === 0}
                         >
                              {categoryOptions.length === 0 ? (
                                   <option value="">
                                        No categories available
                                   </option>
                              ) : (
                                   categoryOptions.map((category) => (
                                        <option
                                             key={category.name}
                                             value={category.name}
                                        >
                                             {category.name} (Order{" "}
                                             {category.order})
                                        </option>
                                   ))
                              )}
                         </select>
                    </div>

                    <CategoryOrderUpdate
                         fetchProducts={fetchProducts}
                         categories={categoryOptions}
                    />

                    {isModalOpen && (
                         <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md">
                              <div className="bg-white w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-3xl shadow-2xl no-scrollbar">
                                   <div className="sticky top-0 bg-white p-6 border-b border-zinc-100 flex justify-between items-center">
                                        <h2 className="text-xl font-bold">
                                             {editingId
                                                  ? "Edit Product"
                                                  : "New Product"}
                                        </h2>
                                        <button
                                             onClick={() =>
                                                  setIsModalOpen(false)
                                             }
                                             className="p-2 hover:bg-zinc-100 rounded-full"
                                        >
                                             <X />
                                        </button>
                                   </div>

                                   <form
                                        onSubmit={handleSave}
                                        className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6"
                                   >
                                        <div className="space-y-2">
                                             <label className="text-sm font-semibold opacity-70">
                                                  Title (EN)
                                             </label>
                                             <input
                                                  type="text"
                                                  className="w-full p-3 rounded-xl border-green-400 border bg-transparent"
                                                  value={formData.title_en}
                                                  onChange={(e) =>
                                                       setFormData({
                                                            ...formData,
                                                            title_en:
                                                                 e.target.value,
                                                       })
                                                  }
                                                  required
                                             />
                                        </div>

                                        <div
                                             className="space-y-2 text-right"
                                             dir="rtl"
                                        >
                                             <label className="text-sm font-semibold opacity-70">
                                                  العنوان (AR)
                                             </label>
                                             <input
                                                  type="text"
                                                  className="w-full p-3 rounded-xl border-amber-400 border bg-transparent"
                                                  value={formData.title_ar}
                                                  onChange={(e) =>
                                                       setFormData({
                                                            ...formData,
                                                            title_ar:
                                                                 e.target.value,
                                                       })
                                                  }
                                                  required
                                             />
                                        </div>

                                        <div className="space-y-2">
                                             <label className="text-sm font-semibold opacity-70">
                                                  Category (EN)
                                             </label>
                                             <input
                                                  type="text"
                                                  className="w-full p-3 rounded-xl border-green-400 border bg-transparent"
                                                  value={formData.category_en}
                                                  onChange={(e) =>
                                                       setFormData({
                                                            ...formData,
                                                            category_en:
                                                                 e.target.value,
                                                       })
                                                  }
                                             />
                                        </div>

                                        <div
                                             className="space-y-2 text-right"
                                             dir="rtl"
                                        >
                                             <label className="text-sm font-semibold opacity-70">
                                                  الفئة (AR)
                                             </label>
                                             <input
                                                  type="text"
                                                  className="w-full p-3 rounded-xl border-amber-400 border bg-transparent"
                                                  value={formData.category_ar}
                                                  onChange={(e) =>
                                                       setFormData({
                                                            ...formData,
                                                            category_ar:
                                                                 e.target.value,
                                                       })
                                                  }
                                             />
                                        </div>

                                        <div className="space-y-2">
                                             <label className="text-sm font-semibold opacity-70">
                                                  Category Order
                                             </label>
                                             <input
                                                  type="number"
                                                  className="w-full p-3 rounded-xl border-amber-400 border bg-transparent"
                                                  value={
                                                       formData.category_order
                                                  }
                                                  onChange={(e) =>
                                                       setFormData({
                                                            ...formData,
                                                            category_order:
                                                                 Number(
                                                                      e.target
                                                                           .value ||
                                                                           0,
                                                                 ),
                                                       })
                                                  }
                                             />
                                        </div>

                                        <div className="space-y-2">
                                             <label className="text-sm font-semibold opacity-70">
                                                  Item Order
                                             </label>
                                             <input
                                                  type="number"
                                                  className="w-full p-3 rounded-xl border-amber-400 border bg-transparent"
                                                  value={formData.item_order}
                                                  onChange={(e) =>
                                                       setFormData({
                                                            ...formData,
                                                            item_order: Number(
                                                                 e.target
                                                                      .value ||
                                                                      0,
                                                            ),
                                                       })
                                                  }
                                             />
                                        </div>

                                        <div className="md:col-span-2 space-y-2">
                                             <label className="text-sm font-semibold opacity-70">
                                                  Description (EN)
                                             </label>
                                             <textarea
                                                  className="w-full p-3 rounded-xl border-green-400 border bg-transparent h-24"
                                                  value={
                                                       formData.description_en
                                                  }
                                                  onChange={(e) =>
                                                       setFormData({
                                                            ...formData,
                                                            description_en:
                                                                 e.target.value,
                                                       })
                                                  }
                                             />
                                        </div>

                                        <div
                                             className="md:col-span-2 space-y-2"
                                             dir="rtl"
                                        >
                                             <label className="text-sm font-semibold opacity-70">
                                                  الوصف (AR)
                                             </label>
                                             <textarea
                                                  className="w-full p-3 rounded-xl border-amber-400 border bg-transparent h-24"
                                                  value={
                                                       formData.description_ar
                                                  }
                                                  onChange={(e) =>
                                                       setFormData({
                                                            ...formData,
                                                            description_ar:
                                                                 e.target.value,
                                                       })
                                                  }
                                             />
                                        </div>

                                        <div className="space-y-2">
                                             <label className="text-sm font-semibold opacity-70">
                                                  Before Price ($)
                                             </label>
                                             <input
                                                  type="number"
                                                  className="w-full p-3 rounded-xl border-2 border-red-400 bg-transparent"
                                                  value={formData.before_price}
                                                  onChange={(e) =>
                                                       setFormData({
                                                            ...formData,
                                                            before_price:
                                                                 Number(
                                                                      e.target
                                                                           .value ||
                                                                           0,
                                                                 ),
                                                       })
                                                  }
                                             />
                                        </div>

                                        <div className="space-y-2">
                                             <label className="text-sm font-semibold opacity-70">
                                                  After Price ($)
                                                  <span className="text-xs font-secondary text-red-500">
                                                       {" "}
                                                       Must enable offer to
                                                       display
                                                  </span>
                                             </label>
                                             <input
                                                  type="number"
                                                  className="w-full p-3 rounded-xl border border-green-400 bg-transparent"
                                                  value={formData.after_price}
                                                  onChange={(e) =>
                                                       setFormData({
                                                            ...formData,
                                                            after_price: Number(
                                                                 e.target
                                                                      .value ||
                                                                      0,
                                                            ),
                                                       })
                                                  }
                                             />
                                        </div>

                                        <div className="flex gap-6 items-center md:col-span-2 bg-zinc-50 p-4 rounded-2xl">
                                             <label className="flex items-center gap-2 cursor-pointer">
                                                  <input
                                                       type="checkbox"
                                                       className="w-5 h-5 accent-zinc-900"
                                                       checked={
                                                            formData.is_offer
                                                       }
                                                       onChange={(e) =>
                                                            setFormData({
                                                                 ...formData,
                                                                 is_offer:
                                                                      e.target
                                                                           .checked,
                                                            })
                                                       }
                                                  />
                                                  <span className="font-bold">
                                                       On Offer?
                                                  </span>
                                             </label>

                                             <label className="flex items-center gap-2 cursor-pointer">
                                                  <input
                                                       type="checkbox"
                                                       className="w-5 h-5 accent-zinc-900"
                                                       checked={
                                                            formData.is_popular
                                                       }
                                                       onChange={(e) =>
                                                            setFormData({
                                                                 ...formData,
                                                                 is_popular:
                                                                      e.target
                                                                           .checked,
                                                            })
                                                       }
                                                  />
                                                  <span className="font-bold">
                                                       Popular? 🔥
                                                  </span>
                                             </label>
                                        </div>

                                        <div className="md:col-span-2 space-y-2">
                                             <label className="text-sm font-semibold opacity-70">
                                                  Image URL
                                             </label>
                                             <div className="flex gap-2 items-center">
                                                  <ImageIcon
                                                       className="text-zinc-500"
                                                       size={20}
                                                  />
                                                  <input
                                                       type="text"
                                                       className="grow p-3 rounded-xl border border-zinc-200 bg-transparent"
                                                       placeholder="https://..."
                                                       value={
                                                            formData
                                                                 .images[0] ??
                                                            ""
                                                       }
                                                       onChange={(e) =>
                                                            setFormData({
                                                                 ...formData,
                                                                 images: [
                                                                      e.target
                                                                           .value,
                                                                 ],
                                                            })
                                                       }
                                                  />
                                             </div>
                                        </div>

                                        <button
                                             disabled={loading}
                                             type="submit"
                                             className="md:col-span-2 bg-zinc-900 text-white p-4 rounded-2xl font-black text-lg hover:opacity-90 disabled:opacity-50"
                                        >
                                             {loading
                                                  ? "Processing..."
                                                  : editingId
                                                    ? "Update Product"
                                                    : "Create Product"}
                                        </button>
                                   </form>
                              </div>
                         </div>
                    )}

                    <div className="mt-8">
                         {loading ? (
                              <div className="text-center py-8 text-gray-600">
                                   Loading products...
                              </div>
                         ) : filteredProducts.length === 0 ? (
                              <div className="text-center py-8 text-gray-600">
                                   No products found for this category
                              </div>
                         ) : (
                              <div className="grid gap-1 md:gap-3">
                                   {filteredProducts.map((product) => (
                                        <div
                                             key={product.id}
                                             className="flex items-center gap-4 p-4 bg-white rounded-xl shadow-sm"
                                        >
                                             <div className="w-24 h-24 rounded-lg overflow-hidden bg-gray-100 shrink-0 relative">
                                                  <img
                                                       src={
                                                            product
                                                                 .images?.[0] ||
                                                            "/logo.jpg"
                                                       }
                                                       alt={product.title_en}
                                                       className="w-full h-full object-cover"
                                                  />
                                             </div>

                                             <div className="flex-1">
                                                  <div className="font-bold text-lg">
                                                       {product.title_en}
                                                  </div>
                                                  <div className="text-sm text-gray-500">
                                                       {product.category_en ||
                                                            "Uncategorized"}
                                                  </div>

                                                  <div className="text-sm text-gray-800 mt-1 flex items-center gap-2">
                                                       {product.is_offer &&
                                                       product.after_price >
                                                            0 ? (
                                                            <>
                                                                 <span className="line-through text-gray-500">
                                                                      $
                                                                      {
                                                                           product.before_price
                                                                      }
                                                                 </span>
                                                                 <span className="font-bold text-green-600">
                                                                      $
                                                                      {
                                                                           product.after_price
                                                                      }
                                                                 </span>
                                                            </>
                                                       ) : (
                                                            <span>
                                                                 $
                                                                 {
                                                                      product.before_price
                                                                 }
                                                            </span>
                                                       )}

                                                       {product.is_offer && (
                                                            <span className="bg-red-500 text-white text-xs font-bold px-2 py-1 rounded">
                                                                 Offer
                                                            </span>
                                                       )}

                                                       {product.is_popular && (
                                                            <span className="bg-orange-500 text-white text-xs font-bold px-2 py-1 rounded">
                                                                 Popular
                                                            </span>
                                                       )}

                                                       <span className="p-1 text-xs font-secondary font-bold bg-red-300 rounded-md">
                                                            order-
                                                            {product.item_order}
                                                       </span>
                                                  </div>
                                             </div>

                                             <div className="flex flex-col md:flex-row gap-2">
                                                  <button
                                                       onClick={() =>
                                                            handleEdit(product)
                                                       }
                                                       className="bg-yellow-500 hover:bg-yellow-600 text-white text-xs md:text-md p-1 md:px-3 md:py-2 rounded flex items-center gap-2"
                                                  >
                                                       <Pencil size={16} /> Edit
                                                  </button>

                                                  <button
                                                       onClick={() =>
                                                            handleDelete(
                                                                 product.id,
                                                            )
                                                       }
                                                       className="bg-red-600 hover:bg-red-700 text-white text-xs md:text-md p-1 md:px-3 md:py-2 rounded flex items-center gap-2"
                                                  >
                                                       <Trash2 size={16} />{" "}
                                                       Delete
                                                  </button>
                                             </div>
                                        </div>
                                   ))}
                              </div>
                         )}
                    </div>
               </div>
          </div>
     );
};

export default AdminProducts;
