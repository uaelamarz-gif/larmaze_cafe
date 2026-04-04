import { createContext, useContext, useState } from "react";

type CurrencyContextValue = {
     symbol: string;
     setSymbol: (symbol: string) => void;
};

const CurrencyContext = createContext<CurrencyContextValue | undefined>(
     undefined,
);

type CurrencyProviderProps = {
     children: React.ReactNode;
};

export function CurrencyProvider({ children }: CurrencyProviderProps) {
     const [symbol, setSymbol] = useState<string>("AED");

     return (
          <CurrencyContext.Provider value={{ symbol, setSymbol }}>
               {children}
          </CurrencyContext.Provider>
     );
}

export function useCurrency(): CurrencyContextValue {
     const ctx = useContext(CurrencyContext);
     if (!ctx) {
          throw new Error("useCurrency must be used within CurrencyProvider");
     }

     return ctx;
}

export default CurrencyContext;
