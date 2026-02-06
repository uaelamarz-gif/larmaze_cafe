import React, { useState, useEffect } from "react";
import Swal from "sweetalert2";
import { Pencil, Trash2, Plus, X, Image as ImageIcon } from "lucide-react";
import { useAuth } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";

const AdminProducts = () => {
     const [products, setProducts] = useState([]);
     const [loading, setLoading] = useState(false);
     const [isModalOpen, setIsModalOpen] = useState(false);
     const [editingId, setEditingId] = useState(null);
     const { token, logout } = useAuth();
     const navigate = useNavigate();

     const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:3000/api";

     // الحالة الابتدائية بناءً على الكائن الخاص بك
     const initialState = {
          name_en: "",
          name_ar: "",
          description_en: "",
          description_ar: "",
          images: [""], // يدعم مصفوفة صور
          price: 0,
          offerPrice: 0,
          isOffer: false,
          isPopular: false,
          category_ar: "",
          category_en: "",
     };

     const [formData, setFormData] = useState(initialState);

     // --- دالة الحفظ (Add or Edit) ---
     const handleSave = async (e) => {
          e.preventDefault();
          setLoading(true);

          try {
               const url = editingId
                    ? `${apiUrl}/products/${editingId}`
                    : `${apiUrl}/products`;
               const method = editingId ? "PATCH" : "POST";

               const res = await fetch(url, {
                    method,
                    headers: {
                         "Content-Type": "application/json",
                         ...(token ? { Authorization: `Bearer ${token}` } : {}),
                    },
                    body: JSON.stringify(formData),
               });

               if (!res.ok) {
                    const errText = await res.text();
                    throw new Error(errText || "Failed to save product");
               }

               Swal.fire({
                    icon: "success",
                    title: editingId ? "تم التحديث!" : "تمت الإضافة!",
                    text: "تمت العملية بنجاح",
                    timer: 1500,
                    showConfirmButton: false,
                    background: "#18181b",
                    color: "#fff",
               });

               setIsModalOpen(false);
               setEditingId(null);
               setFormData(initialState);
               await fetchProducts();
          } catch (error) {
               Swal.fire(
                    "خطأ!",
                    error.message || "فشل في حفظ البيانات",
                    "error",
               );
          } finally {
               setLoading(false);
          }
     };

     // --- دالة المسح ---
     const confirmDelete = (id) => {
          Swal.fire({
               title: "هل أنت متأكد؟",
               text: "لن تتمكن من التراجع عن هذا!",
               icon: "warning",
               showCancelButton: true,
               confirmButtonColor: "#d33",
               cancelButtonColor: "#3085d6",
               confirmButtonText: "نعم، امسح!",
               cancelButtonText: "إلغاء",
               background: "#18181b",
               color: "#fff",
          }).then(async (result) => {
               if (result.isConfirmed) {
                    try {
                         const res = await fetch(`${apiUrl}/products/${id}`, {
                              method: "DELETE",
                              headers: {
                                   "Content-Type": "application/json",
                                   ...(token
                                        ? { Authorization: `Bearer ${token}` }
                                        : {}),
                              },
                         });
                         if (!res.ok) throw new Error("Delete failed");
                         await fetchProducts();
                         Swal.fire(
                              "تم المسح!",
                              "تم حذف المنتج بنجاح.",
                              "success",
                         );
                    } catch (err) {
                         Swal.fire(
                              "خطأ!",
                              err.message || "فشل في الحذف",
                              "error",
                         );
                    }
               }
          });
     };

     // Fetch products from API
     const fetchProducts = async () => {
          setLoading(true);
          try {
               const res = await fetch(`${apiUrl}/products`, {
                    headers: {
                         "Content-Type": "application/json",
                         ...(token ? { Authorization: `Bearer ${token}` } : {}),
                    },
               });
               if (!res.ok) throw new Error("Failed to fetch products");
               const data = await res.json();
               const arr = Array.isArray(data) ? data : data.products || data;
               setProducts(arr);
          } catch (err) {
               Swal.fire("خطأ!", err.message || "فشل في جلب المنتجات", "error");
          } finally {
               setLoading(false);
          }
     };

     useEffect(() => {
          fetchProducts();
          // eslint-disable-next-line react-hooks/exhaustive-deps
     }, []);

     const handleEdit = (product) => {
          setFormData({
               name_en: product.name_en || product.title || "",
               name_ar: product.name_ar || "",
               description_en:
                    product.description_en || product.description || "",
               description_ar:
                    product.description_ar || product.description || "",
               images:
                    product.images && product.images.length
                         ? product.images
                         : [""],
               price: product.price || 0,
               offerPrice: product.offerPrice || 0,
               isOffer: !!product.isOffer,
               isPopular: !!product.isPopular,
               category_en:
                    product.category_en ||
                    (product.category &&
                         (typeof product.category === "string"
                              ? product.category
                              : product.category.name)) ||
                    "",
               category_ar: product.category_ar || "",
          });
          setEditingId(product._id || product.id);
          setIsModalOpen(true);
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
                                   onClick={() => {
                                        setFormData(initialState);
                                        setEditingId(null);
                                        setIsModalOpen(true);
                                   }}
                                   className="bg-zinc-900  text-white px-6 py-3 rounded-xl font-bold flex items-center gap-2 hover:scale-105 transition-transform"
                              >
                                   <Plus size={20} /> Add Product
                              </button>

                              <button
                                   onClick={() => {
                                        logout();
                                        navigate("/admin/login");
                                   }}
                                   className="bg-red-600 hover:bg-red-700 text-white px-4 py-3 rounded-xl font-bold flex items-center gap-2 transition"
                              >
                                   Sign Out
                              </button>
                         </div>
                    </header>

                    {/* Modal Form */}
                    {isModalOpen && (
                         <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md">
                              <div className="bg-white  w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-3xl shadow-2xl no-scrollbar">
                                   <div className="sticky top-0 bg-white  p-6 border-b border-zinc-100  flex justify-between items-center">
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
                                        {/* Names */}
                                        <div className="space-y-2">
                                             <label className="text-sm font-semibold opacity-70">
                                                  Name (EN)
                                             </label>
                                             <input
                                                  type="text"
                                                  className="w-full p-3 rounded-xl border border-zinc-200 bg-transparent"
                                                  value={formData.name_en}
                                                  onChange={(e) =>
                                                       setFormData({
                                                            ...formData,
                                                            name_en: e.target
                                                                 .value,
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
                                                  الاسم (AR)
                                             </label>
                                             <input
                                                  type="text"
                                                  className="w-full p-3 rounded-xl border border-zinc-200 bg-transparent"
                                                  value={formData.name_ar}
                                                  onChange={(e) =>
                                                       setFormData({
                                                            ...formData,
                                                            name_ar: e.target
                                                                 .value,
                                                       })
                                                  }
                                                  required
                                             />
                                        </div>

                                        {/* Categories */}
                                        <div className="space-y-2">
                                             <label className="text-sm font-semibold opacity-70">
                                                  Category (EN)
                                             </label>
                                             <input
                                                  type="text"
                                                  className="w-full p-3 rounded-xl border border-zinc-200 bg-transparent"
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
                                                  className="w-full p-3 rounded-xl border border-zinc-200 bg-transparent"
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

                                        {/* Descriptions */}
                                        <div className="md:col-span-2 space-y-2">
                                             <label className="text-sm font-semibold opacity-70">
                                                  Description (EN)
                                             </label>
                                             <textarea
                                                  className="w-full p-3 rounded-xl border border-zinc-200 bg-transparent h-24"
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
                                        <div className="md:col-span-2 space-y-2">
                                             <label className="text-sm font-semibold opacity-70">
                                                  Description (AR)
                                             </label>
                                             <textarea
                                                  className="w-full p-3 rounded-xl border border-zinc-200 bg-transparent h-24"
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
                                        {/* Prices */}
                                        <div className="space-y-2">
                                             <label className="text-sm font-semibold opacity-70">
                                                  Base Price ($)
                                             </label>
                                             <input
                                                  type="number"
                                                  className="w-full p-3 rounded-xl border border-zinc-200 bg-transparent"
                                                  value={formData.price}
                                                  onChange={(e) =>
                                                       setFormData({
                                                            ...formData,
                                                            price: e.target
                                                                 .value,
                                                       })
                                                  }
                                             />
                                        </div>
                                        <div className="space-y-2">
                                             <label className="text-sm font-semibold opacity-70">
                                                  Offer Price ($)
                                             </label>
                                             <input
                                                  type="number"
                                                  className="w-full p-3 rounded-xl border border-zinc-200 bg-transparent"
                                                  value={formData.offerPrice}
                                                  onChange={(e) =>
                                                       setFormData({
                                                            ...formData,
                                                            offerPrice:
                                                                 e.target.value,
                                                       })
                                                  }
                                             />
                                        </div>

                                        {/* Toggles */}
                                        <div className="flex gap-6 items-center md:col-span-2 bg-zinc-50 p-4 rounded-2xl">
                                             <label className="flex items-center gap-2 cursor-pointer">
                                                  <input
                                                       type="checkbox"
                                                       className="w-5 h-5 accent-zinc-900"
                                                       checked={
                                                            formData.isOffer
                                                       }
                                                       onChange={(e) =>
                                                            setFormData({
                                                                 ...formData,
                                                                 isOffer: e
                                                                      .target
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
                                                            formData.isPopular
                                                       }
                                                       onChange={(e) =>
                                                            setFormData({
                                                                 ...formData,
                                                                 isPopular:
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

                                        {/* Image URL Input (Simplest way for integration) */}
                                        <div className="md:col-span-2 space-y-2">
                                             <label className="text-sm font-semibold opacity-70">
                                                  Image URL
                                             </label>
                                             <div className="flex gap-2">
                                                  <input
                                                       type="text"
                                                       className="grow p-3 rounded-xl border border-zinc-200 bg-transparent"
                                                       placeholder="https://..."
                                                       value={
                                                            formData.images[0]
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

                    {/* Products List */}
                    <div className="mt-8">
                         {loading ? (
                              <div className="text-center py-8 text-gray-600">
                                   Loading products...
                              </div>
                         ) : products.length === 0 ? (
                              <div className="text-center py-8 text-gray-600">
                                   No products found
                              </div>
                         ) : (
                              <div className="grid gap-1 md:gap-3">
                                   {products.map((product) => {
                                        const id = product._id || product.id;
                                        return (
                                             <div
                                                  key={id}
                                                  className="flex items-center gap-4 p-4 bg-white rounded-xl shadow-sm"
                                             >
                                                  <div className="w-24 h-24 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0 relative">
                                                       <img
                                                            src={
                                                                 product.images &&
                                                                 product
                                                                      .images[0]
                                                                      ? product
                                                                             .images[0]
                                                                      : "/logo.jpg"
                                                            }
                                                            alt=""
                                                            className="w-full h-full object-cover"
                                                       />
                                                  </div>
                                                  <div className="flex-1">
                                                       <div className="flex items-center gap-2 mb-1">
                                                            <div className="font-bold text-lg">
                                                                 {product.name_en ||
                                                                      product.title}
                                                            </div>
                                                       </div>
                                                       <div className="text-sm text-gray-500">
                                                            {product.category_en ||
                                                                 (product.category &&
                                                                      (typeof product.category ===
                                                                      "string"
                                                                           ? product.category
                                                                           : product
                                                                                  .category
                                                                                  .name)) ||
                                                                 "Uncategorized"}
                                                       </div>
                                                       <div className="text-sm text-gray-800 mt-1 flex items-center gap-2">
                                                            {product.offerPrice &&
                                                            product.offerPrice >
                                                                 0 ? (
                                                                 <>
                                                                      <span className="line-through text-gray-500">
                                                                           $
                                                                           {
                                                                                product.price
                                                                           }
                                                                      </span>
                                                                      <span className="font-bold text-green-600">
                                                                           $
                                                                           {
                                                                                product.offerPrice
                                                                           }
                                                                      </span>
                                                                 </>
                                                            ) : (
                                                                 <span>
                                                                      $
                                                                      {
                                                                           product.price
                                                                      }
                                                                 </span>
                                                            )}
                                                            {product.isOffer && (
                                                                 <span className="bg-red-500 text-white text-xs font-bold px-2 py-1 rounded">
                                                                      Offer
                                                                 </span>
                                                            )}
                                                            {product.isPopular && (
                                                                 <span className="bg-orange-500 text-white text-xs font-bold px-2 py-1 rounded">
                                                                      Popular
                                                                 </span>
                                                            )}
                                                       </div>
                                                  </div>
                                                  <div className="flex flex-col md:flex-row gap-2">
                                                       <button
                                                            onClick={() =>
                                                                 handleEdit(
                                                                      product,
                                                                 )
                                                            }
                                                            className="bg-yellow-500 hover:bg-yellow-600 text-white text-xs md:text-md p-1 md:px-3 md:py-2 rounded flex items-center gap-2"
                                                       >
                                                            <Pencil size={16} />{" "}
                                                            Edit
                                                       </button>
                                                       <button
                                                            onClick={() =>
                                                                 confirmDelete(
                                                                      id,
                                                                 )
                                                            }
                                                            className="bg-red-600 hover:bg-red-700 text-white text-xs md:text-md p-1 md:px-3 md:py-2 rounded flex items-center gap-2"
                                                       >
                                                            <Trash2 size={16} />{" "}
                                                            Delete
                                                       </button>
                                                  </div>
                                             </div>
                                        );
                                   })}
                              </div>
                         )}
                    </div>
               </div>
          </div>
     );
};

export default AdminProducts;
