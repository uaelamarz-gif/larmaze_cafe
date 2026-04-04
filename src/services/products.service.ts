import { supabase } from "../lib/supabase";
import {
     ProductFormValues,
     ProductRow,
     toProductPayload,
} from "../types/product";

const TABLE = "lamarze_menu";

export async function listProducts(): Promise<ProductRow[]> {
     const { data, error } = await supabase
          .from(TABLE)
          .select("*")
          .order("category_order", { ascending: true })
          .order("item_order", { ascending: true })
          .order("created_at", { ascending: false });

     if (error) {
          throw new Error(error.message);
     }

     return (data as ProductRow[]) ?? [];
}

export async function createProduct(
     form: ProductFormValues,
): Promise<ProductRow> {
     const payload = toProductPayload(form);

     const { data, error } = await supabase
          .from(TABLE)
          .insert(payload)
          .select("*")
          .single();

     if (error) {
          throw new Error(error.message);
     }

     return data as ProductRow;
}

export async function updateProduct(
     id: string,
     form: ProductFormValues,
): Promise<ProductRow> {
     const payload = {
          ...toProductPayload(form),
          edited_at: new Date().toISOString(),
     };

     const { data, error } = await supabase
          .from(TABLE)
          .update(payload)
          .eq("id", id)
          .select("*")
          .single();

     if (error) {
          throw new Error(error.message);
     }

     return data as ProductRow;
}

export async function removeProduct(id: string): Promise<void> {
     const { error } = await supabase.from(TABLE).delete().eq("id", id);

     if (error) {
          throw new Error(error.message);
     }
}

export async function updateCategoryOrder(
     categoryEn: string,
     newOrder: number,
): Promise<void> {
     const { error } = await supabase
          .from(TABLE)
          .update({
               category_order: Number(newOrder),
               edited_at: new Date().toISOString(),
          })
          .eq("category_en", categoryEn.trim());

     if (error) {
          throw new Error(error.message);
     }
}
