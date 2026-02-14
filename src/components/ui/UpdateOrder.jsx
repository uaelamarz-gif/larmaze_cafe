import React from "react";
import { useState } from "react";
import { useAuth } from "../../contexts/AuthContext";
import Swal from "sweetalert2";

export default function CategoryOrderUpdate({fetchProducts}) {
  const [data ,setData ] = useState({
    category:"",
    newOrder:0
  })
     const { token, logout } = useAuth();
     const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:3000/api";

     const handleSave = async (e) => {
          e.preventDefault();
          try {
               const url = `${apiUrl}/products/update-order`

               const res = await fetch(url, {
                    method:"PATCH",
                    headers: {
                         "Content-Type": "application/json",
                         ...(token ? { Authorization: `Bearer ${token}` } : {}),
                    },
                    body: JSON.stringify(data),
               });

               if (!res.ok) {
                    const errText = await res.text();
                    throw new Error(errText || "Failed to save product");
               }
               Swal.fire({
                    icon: "success",
                    title:"تم التحديث!",
                    text: "تمت العملية بنجاح",
                    timer: 1500,
                    showConfirmButton: false,
                    background: "#18181b",
                    color: "#fff",
               });
              setData({
                  category:"",
                  newOrder:0
                })
               await fetchProducts();
          } catch (error) {
            console.log(error);
            Swal.fire(
                "خطأ!",
                error.message || "فشل في حفظ البيانات",
                "error",
            );
          }
     };

  return (
    <div className="flex">
      <div className="flex gap-1">
      <input
        type="text"
        placeholder="Category Name English"
        value={data.category}
        className="input border"
        onChange={(e) => setData({...data,category:e.target.value})}
      />

      <input
        type="number"
        placeholder="newOrder"
        value={data.newOrder}
        className="input border"
        onChange={(e) =>setData({...data,newOrder:e.target.value})}
      />
    </div>
      <button className="btn" onClick={handleSave}>Save</button>
    </div>
  );
}
