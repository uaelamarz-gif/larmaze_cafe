import { useCallback, useState } from "react";
import {
     createProduct,
     listProducts,
     removeProduct,
     updateCategoryOrder,
     updateProduct,
} from "../services/products.service";
import { ProductFormValues, ProductRow } from "../types/product";

export function useProducts() {
     const [products, setProducts] = useState<ProductRow[]>([]);
     const [loading, setLoading] = useState<boolean>(false);
     const [error, setError] = useState<string | null>(null);

     const fetchProducts = useCallback(async () => {
          setLoading(true);
          setError(null);

          try {
               const rows = await listProducts();
               setProducts(rows);
               return rows;
          } catch (err) {
               const message =
                    err instanceof Error
                         ? err.message
                         : "Failed to fetch products";
               setError(message);
               throw err;
          } finally {
               setLoading(false);
          }
     }, []);

     const addProduct = useCallback(async (form: ProductFormValues) => {
          setLoading(true);
          setError(null);

          try {
               const created = await createProduct(form);
               setProducts((prev) => [created, ...prev]);
               return created;
          } catch (err) {
               const message =
                    err instanceof Error
                         ? err.message
                         : "Failed to create product";
               setError(message);
               throw err;
          } finally {
               setLoading(false);
          }
     }, []);

     const editProduct = useCallback(
          async (id: string, form: ProductFormValues) => {
               setLoading(true);
               setError(null);

               try {
                    const updated = await updateProduct(id, form);
                    setProducts((prev) =>
                         prev.map((item) => (item.id === id ? updated : item)),
                    );
                    return updated;
               } catch (err) {
                    const message =
                         err instanceof Error
                              ? err.message
                              : "Failed to update product";
                    setError(message);
                    throw err;
               } finally {
                    setLoading(false);
               }
          },
          [],
     );

     const deleteProduct = useCallback(async (id: string) => {
          setLoading(true);
          setError(null);

          try {
               await removeProduct(id);
               setProducts((prev) => prev.filter((item) => item.id !== id));
          } catch (err) {
               const message =
                    err instanceof Error
                         ? err.message
                         : "Failed to delete product";
               setError(message);
               throw err;
          } finally {
               setLoading(false);
          }
     }, []);

     const setCategoryOrder = useCallback(
          async (categoryEn: string, newOrder: number) => {
               setLoading(true);
               setError(null);

               try {
                    await updateCategoryOrder(categoryEn, newOrder);
               } catch (err) {
                    const message =
                         err instanceof Error
                              ? err.message
                              : "Failed to update category order";
                    setError(message);
                    throw err;
               } finally {
                    setLoading(false);
               }
          },
          [],
     );

     return {
          products,
          loading,
          error,
          fetchProducts,
          addProduct,
          editProduct,
          deleteProduct,
          setCategoryOrder,
     };
}
