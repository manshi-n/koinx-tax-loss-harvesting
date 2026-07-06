import { describe, it, expect } from "vitest";
import {
  calcNetGains,
  calcRealisedGains,
  calcHarvestedGains,
} from "./taxCalculations";

describe("calcNetGains", () => {
  it("computes profits minus losses", () => {
    expect(calcNetGains({ profits: 100, losses: 40 })).toBe(60);
  });

  it("returns a negative number when losses exceed profits", () => {
    expect(calcNetGains({ profits: 10, losses: 50 })).toBe(-40);
  });
});

describe("calcRealisedGains", () => {
  it("sums net short-term and net long-term gains", () => {
    const capitalGains = {
      stcg: { profits: 100, losses: 500 },
      ltcg: { profits: 1200, losses: 100 },
    };
    expect(calcRealisedGains(capitalGains)).toBe(700);
  });
});

describe("calcHarvestedGains", () => {
  it("matches the assignment spec's worked example exactly", () => {
    const capitalGains = {
      stcg: { profits: 100, losses: 500 },
      ltcg: { profits: 1200, losses: 100 },
    };
    const eth = {
      stcg: { gain: 500, balance: 1 },
      ltcg: { gain: -1000, balance: 1 },
    };

    const harvested = calcHarvestedGains(capitalGains, [eth]);

    expect(harvested.stcg).toEqual({ profits: 600, losses: 500 });
    expect(harvested.ltcg).toEqual({ profits: 1200, losses: 1100 });
    expect(calcRealisedGains(harvested)).toBe(200);
  });

  it("does not change profits or losses for a zero gain", () => {
    const capitalGains = {
      stcg: { profits: 100, losses: 50 },
      ltcg: { profits: 0, losses: 0 },
    };
    const zeroGainCoin = {
      stcg: { gain: 0, balance: 1 },
      ltcg: { gain: 0, balance: 1 },
    };

    const result = calcHarvestedGains(capitalGains, [zeroGainCoin]);

    expect(result.stcg).toEqual({ profits: 100, losses: 50 });
    expect(result.ltcg).toEqual({ profits: 0, losses: 0 });
  });

  it("applies multiple selected holdings independently", () => {
    const capitalGains = {
      stcg: { profits: 0, losses: 0 },
      ltcg: { profits: 0, losses: 0 },
    };
    const coinA = { stcg: { gain: 100, balance: 1 }, ltcg: { gain: -50, balance: 1 } };
    const coinB = { stcg: { gain: -20, balance: 1 }, ltcg: { gain: 30, balance: 1 } };

    const result = calcHarvestedGains(capitalGains, [coinA, coinB]);

    expect(result.stcg).toEqual({ profits: 100, losses: 20 });
    expect(result.ltcg).toEqual({ profits: 30, losses: 50 });
  });

  it("does not mutate the original capitalGains object", () => {
    const capitalGains = {
      stcg: { profits: 100, losses: 0 },
      ltcg: { profits: 0, losses: 0 },
    };
    const coin = { stcg: { gain: 50, balance: 1 }, ltcg: { gain: 0, balance: 1 } };

    calcHarvestedGains(capitalGains, [coin]);

    expect(capitalGains.stcg.profits).toBe(100);
  });
});