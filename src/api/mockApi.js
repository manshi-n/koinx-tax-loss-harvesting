import { holdingsData, capitalGainsData } from "./holdingsData";

function simulateRequest(data, delay = 700) {
  return new Promise((resolve) => {
    setTimeout(() => resolve(data), delay);
  });
}

export function fetchHoldings() {
  return simulateRequest(holdingsData);
}

export function fetchCapitalGains() {
  return simulateRequest(capitalGainsData);
}
