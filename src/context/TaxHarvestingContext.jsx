import { createContext, useContext } from "react";
import { useTaxHarvesting } from "../hooks/useTaxHarvesting";

const TaxHarvestingContext = createContext(null);

export function TaxHarvestingProvider({ children }) {
  const value = useTaxHarvesting();
  return (
    <TaxHarvestingContext.Provider value={value}>
      {children}
    </TaxHarvestingContext.Provider>
  );
}

export function useTaxHarvestingContext() {
  const context = useContext(TaxHarvestingContext);
  if (!context) {
    throw new Error(
      "useTaxHarvestingContext must be used within a TaxHarvestingProvider"
    );
  }
  return context;
}