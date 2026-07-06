export function calcNetGains(term) {
  return term.profits - term.losses;
}

export function calcRealisedGains(capitalGains) {
  const netStcg = calcNetGains(capitalGains.stcg);
  const netLtcg = calcNetGains(capitalGains.ltcg);
  return netStcg + netLtcg;
}

export function calcHarvestedGains(originalCapitalGains, selectedHoldings) {
  const harvested = {
    stcg: { ...originalCapitalGains.stcg },
    ltcg: { ...originalCapitalGains.ltcg },
  };

  selectedHoldings.forEach((holding) => {
    applyGainToTerm(harvested.stcg, holding.stcg.gain);
    applyGainToTerm(harvested.ltcg, holding.ltcg.gain);
  });

  return harvested;
}

function applyGainToTerm(term, gain) {
  if (gain > 0) {
    term.profits += gain;
  } else if (gain < 0) {
    term.losses += Math.abs(gain);
  }
}

export function formatINR(value) {
  const cleanValue = Math.abs(value) < 0.005 ? 0 : value;

  const isNegative = cleanValue < 0;
  const formatted = Math.abs(cleanValue).toLocaleString("en-IN", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

  return `${isNegative ? "-" : ""}₹${formatted}`;
}

export function formatNumber(value, maxDecimals = 4) {
  if (!value || Math.abs(value) < 0.0001) return "≈ 0";

  return value.toLocaleString("en-IN", {
    maximumFractionDigits: maxDecimals,
  });
}