import React, { createContext, useContext, useState, useEffect } from "react";

const LangContext = createContext(null);

export function LangProvider({ children }) {
     const [lang, setLang] = useState(() => {
          // Initialize from localStorage or default to "ar"
          if (typeof window !== "undefined") {
               return localStorage.getItem("language") || "ar";
          }
          return "ar";
     });

     // Update localStorage whenever language changes
     useEffect(() => {
          localStorage.setItem("language", lang);
          // Update document direction
          document.documentElement.dir = lang === "ar" ? "rtl" : "ltr";
     }, [lang]);

     const toggleLang = () => {
          setLang((prevLang) => (prevLang === "ar" ? "en" : "ar"));
     };

     return (
          <LangContext.Provider value={{ lang, toggleLang }}>
               {children}
          </LangContext.Provider>
     );
}

export function useLang() {
     const ctx = useContext(LangContext);
     if (!ctx) throw new Error("useLang must be used within LangProvider");
     return ctx;
}

export default LangContext;
