import { useState, useEffect, useMemo, useCallback } from "react";
import { fetchHoldings, fetchCapitalGains } from "../api/mockApi";
import {
  calcRealisedGains,
  calcHarvestedGains,
} from "../utils/taxCalculations";

/**
 * Central state + logic for the whole Tax Loss Harvesting tool.
 * Keeping this in one hook (rather than scattering state across components)
 * makes the data flow easy to trace: one source of truth, components just
 * read derived values and call the exposed actions.
 */
export function useTaxHarvesting() {
  const [holdings, setHoldings] = useState([]);
  const [capitalGains, setCapitalGains] = useState(null);
  const [selectedCoins, setSelectedCoins] = useState(new Set());
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch both "APIs" on mount.
  useEffect(() => {
    let isMounted = true;

    async function loadData() {
      setIsLoading(true);
      setError(null);
      try {
        const [holdingsRes, gainsRes] = await Promise.all([
          fetchHoldings(),
          fetchCapitalGains(),
        ]);
        if (!isMounted) return;
        const sortedHoldings = [...holdingsRes].sort(
  (a, b) => (a.stcg.gain + a.ltcg.gain) - (b.stcg.gain + b.ltcg.gain)
);
setHoldings(sortedHoldings);
        setCapitalGains(gainsRes.capitalGains);
      } catch (err) {
        if (!isMounted) return;
        setError("Something went wrong while loading your portfolio. Please try again.");
      } finally {
        if (isMounted) setIsLoading(false);
      }
    }

    loadData();
    return () => {
      isMounted = false;
    };
  }, []);


  const toggleCoin = useCallback((index) => {
    setSelectedCoins((prev) => {
      const next = new Set(prev);
      if (next.has(index)) {
        next.delete(index);
      } else {
        next.add(index);
      }
      return next;
    });
  }, []);

  const toggleAll = useCallback(() => {
    setSelectedCoins((prev) => {
      if (prev.size === holdings.length) {
        return new Set(); // all were selected -> deselect all
      }
      return new Set(holdings.map((_, i) => i));
    });
  }, [holdings]);

  const selectedHoldings = useMemo(
    () => holdings.filter((_, i) => selectedCoins.has(i)),
    [holdings, selectedCoins]
  );

  const harvestedGains = useMemo(() => {
    if (!capitalGains) return null;
    return calcHarvestedGains(capitalGains, selectedHoldings);
  }, [capitalGains, selectedHoldings]);

  const realisedBefore = useMemo(
    () => (capitalGains ? calcRealisedGains(capitalGains) : 0),
    [capitalGains]
  );

  const realisedAfter = useMemo(
    () => (harvestedGains ? calcRealisedGains(harvestedGains) : 0),
    [harvestedGains]
  );

const savings = realisedBefore - realisedAfter;
const roundedSavings = Math.round(savings * 100) / 100;
const showSavingsMessage = roundedSavings > 0;

  return {
    holdings,
    capitalGains,
    harvestedGains,
    selectedCoins,
    toggleCoin,
    toggleAll,
    realisedBefore,
    realisedAfter,
    savings,
    showSavingsMessage,
    isLoading,
    error,
  };
}
