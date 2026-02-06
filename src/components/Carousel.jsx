// file: components/BannerCarousel.jsx
import { useEffect, useState, useCallback } from "react";

/* -------------------- Mock API -------------------- */
function fetchMockBanners() {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (false) {
        reject(new Error("Failed to load banners"));
      } else {
        resolve([
          {
            id: 1,
            image:
              "https://images.unsplash.com/photo-1550547660-d9450f859349",
            alt: "Burger offer",
          },
          {
            id: 2,
            image:
              "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38",
            alt: "Fast food deal",
          },
          {
            id: 3,
            image:
              "https://images.unsplash.com/photo-1600891964599-f61ba0e24092",
            alt: "Combo meal",
          },
        ]);
      }
    }, 1000);
  });
}

/* -------------------- Component -------------------- */
export default function Carousel() {
  const [data, setData] = useState([]);
  const [index, setIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetchMockBanners();
      setData(res);
      setIndex(0);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  useEffect(() => {
    if (!data.length) return;
    const id = setInterval(
      () => setIndex((i) => (i + 1) % data.length),
      4000
    );
    return () => clearInterval(id);
  }, [data]);

  /* -------------------- States -------------------- */
  if (loading) {
    return (
      <div className="max-w-3xl mx-auto px-4">
        <div className="h-44 rounded-xl bg-gray-200 animate-pulse" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-3xl mx-auto px-4 text-center">
        <p className="text-red-600 text-sm mb-3">{error}</p>
        <button
          onClick={load}
          className="px-4 py-2 rounded-lg bg-red-600 text-white text-sm"
        >
          Retry
        </button>
      </div>
    );
  }

  /* -------------------- Carousel -------------------- */
  return (
    <div className="max-w-3xl mx-auto px-4" dir="ltr">
      <div className="relative overflow-hidden rounded-xl">
        <div
          className="flex transition-transform duration-500 ease-out"
          style={{ transform: `translateX(-${index * 100}%)` }}
        >
          {data.map((item) => (
            <img
              key={item.id}
              src={item.image}
              alt={item.alt}
              className="w-full h-44 sm:h-52 object-cover shrink-0"
            />
          ))}
        </div>

        {/* Dots */}
        <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-2">
          {data.map((_, i) => (
            <button
              key={i}
              onClick={() => setIndex(i)}
              className={`h-1.5 rounded-full transition-all ${
                i === index
                  ? "w-6 bg-red-600"
                  : "w-3 bg-white/70"
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
