export type AppLanguage = "en" | "ar";

export interface ProductRow {
     id: string;
     title_en: string;
     title_ar: string;
     description_en: string | null;
     description_ar: string | null;
     images: string[] | null;
     after_price: number;
     before_price: number;
     category_order: number;
     item_order: number;
     is_offer: boolean;
     is_popular: boolean;
     category_en: string | null;
     category_ar: string | null;
     created_at: string;
     edited_at: string;
}

export interface ProductFormValues {
     title_en: string;
     title_ar: string;
     description_en: string;
     description_ar: string;
     images: string[];
     after_price: number;
     before_price: number;
     category_order: number;
     item_order: number;
     is_offer: boolean;
     is_popular: boolean;
     category_en: string;
     category_ar: string;
}

export interface ProductCardView {
     id: string;
     title: string;
     description: string;
     category: string;
     images: string[];
     price: number;
     offerPrice: number;
     isOffer: boolean;
     isPopular: boolean;
     itemOrder: number;
     categoryOrder: number;
}

export const emptyProductForm: ProductFormValues = {
     title_en: "",
     title_ar: "",
     description_en: "",
     description_ar: "",
     images: [""],
     after_price: 0,
     before_price: 0,
     category_order: 0,
     item_order: 0,
     is_offer: false,
     is_popular: false,
     category_en: "",
     category_ar: "",
};

export function mapRowToProductView(
     row: ProductRow,
     lang: AppLanguage,
): ProductCardView {
     return {
          id: row.id,
          title: lang === "ar" ? row.title_ar : row.title_en,
          description:
               lang === "ar"
                    ? (row.description_ar ?? "")
                    : (row.description_en ?? ""),
          category:
               lang === "ar"
                    ? (row.category_ar ?? "Uncategorized")
                    : (row.category_en ?? "Uncategorized"),
          images: row.images ?? [],
          price: Number(row.before_price ?? 0),
          offerPrice: Number(row.after_price ?? 0),
          isOffer: Boolean(row.is_offer),
          isPopular: Boolean(row.is_popular),
          itemOrder: Number(row.item_order ?? 0),
          categoryOrder: Number(row.category_order ?? 0),
     };
}

export function toProductPayload(
     form: ProductFormValues,
): Omit<ProductRow, "id" | "created_at" | "edited_at"> {
     return {
          title_en: form.title_en.trim(),
          title_ar: form.title_ar.trim(),
          description_en: form.description_en.trim() || null,
          description_ar: form.description_ar.trim() || null,
          images: form.images.filter(Boolean),
          after_price: Number(form.after_price ?? 0),
          before_price: Number(form.before_price ?? 0),
          category_order: Number(form.category_order ?? 0),
          item_order: Number(form.item_order ?? 0),
          is_offer: Boolean(form.is_offer),
          is_popular: Boolean(form.is_popular),
          category_en: form.category_en.trim() || null,
          category_ar: form.category_ar.trim() || null,
     };
}
