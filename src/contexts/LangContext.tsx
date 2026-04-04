import { createContext, useContext, useEffect, useState } from "react";

type Lang = "en" | "ar";

type LangContextValue = {
     lang: Lang;
     toggleLang: () => void;
};

const LangContext = createContext<LangContextValue | undefined>(undefined);

type LangProviderProps = {
     children: React.ReactNode;
};

export function LangProvider({ children }: LangProviderProps) {
     const [lang, setLang] = useState<Lang>(() => {
          if (typeof window !== "undefined") {
               return (localStorage.getItem("language") as Lang) || "ar";
          }

          return "ar";
     });

     useEffect(() => {
          localStorage.setItem("language", lang);
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

export function useLang(): LangContextValue {
     const ctx = useContext(LangContext);
     if (!ctx) {
          throw new Error("useLang must be used within LangProvider");
     }

     return ctx;
}

export default LangContext;
