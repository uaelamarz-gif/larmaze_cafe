import React, { createContext, useContext, useState } from "react";

const CurrencyContext = createContext(null);

export function CurrencyProvider({ children }) {
     const [symbol, setSymbol] = useState("AED");

     return (
          <CurrencyContext.Provider value={{ symbol, setSymbol }}>
               {children}
          </CurrencyContext.Provider>
     );
}

export function useCurrency() {
     const ctx = useContext(CurrencyContext);
     if (!ctx)
          throw new Error("useCurrency must be used within CurrencyProvider");
     return ctx;
}

export default CurrencyContext;
