import { useState } from "react";
import { useTaxHarvestingContext } from "../context/TaxHarvestingContext";
import { formatINR, formatNumber } from "../utils/taxCalculations";

const INITIAL_VISIBLE_ROWS = 8;

export default function HoldingsTable() {
  const { holdings, selectedCoins, toggleCoin, toggleAll } = useTaxHarvestingContext();

  const [showAll, setShowAll] = useState(false);
  const [search, setSearch] = useState("");

  const indexedHoldings = holdings.map((holding, originalIndex) => ({
    holding,
    originalIndex,
  }));

  const filteredHoldings = indexedHoldings.filter(({ holding }) =>
    `${holding.coin} ${holding.coinName}`
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  const visibleHoldings = showAll
    ? filteredHoldings
    : filteredHoldings.slice(0, INITIAL_VISIBLE_ROWS);
  const allSelected = holdings.length > 0 && selectedCoins.size === holdings.length;
  const someSelected = selectedCoins.size > 0 && !allSelected;

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
      <div className="p-4 border-b border-gray-100 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search holdings by coin or name..."
          className="w-full sm:w-80 px-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <span className="text-sm text-gray-500 whitespace-nowrap">
          {selectedCoins.size} of {holdings.length} selected
        </span>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[900px] text-sm">
          <thead>
            <tr className="bg-gray-50 text-gray-500 text-xs uppercase tracking-wide">
              <th className="px-4 py-3 text-left w-10">
                <input
                  type="checkbox"
                  checked={allSelected}
                  ref={(el) => {
                    if (el) el.indeterminate = someSelected;
                  }}
                  onChange={toggleAll}
                  className="w-4 h-4 rounded border-gray-300 text-blue-600 cursor-pointer"
                  aria-label="Select all holdings"
                />
              </th>
              <th className="px-4 py-3 text-left">Asset</th>
              <th className="px-4 py-3 text-right">Holdings / Avg Buy Price</th>
              <th className="px-4 py-3 text-right">Current Price</th>
              <th className="px-4 py-3 text-right">Short-Term Gain</th>
              <th className="px-4 py-3 text-right">Long-Term Gain</th>
              <th className="px-4 py-3 text-right">Amount to Sell</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {visibleHoldings.map(({ holding, originalIndex }) => (
              <HoldingRow
                key={originalIndex}
                holding={holding}
                isSelected={selectedCoins.has(originalIndex)}
                onToggle={() => toggleCoin(originalIndex)}
              />
            ))}
          </tbody>
        </table>

        {filteredHoldings.length === 0 && (
          <div className="py-12 text-center text-sm text-gray-400">
            No holdings match "{search}".
          </div>
        )}
      </div>

      {filteredHoldings.length > INITIAL_VISIBLE_ROWS && (
        <div className="border-t border-gray-100 px-4 py-3 text-center">
          <button
            onClick={() => setShowAll((prev) => !prev)}
            className="text-sm font-medium text-blue-600 hover:text-blue-700"
          >
            {showAll ? "Show less" : `View all ${filteredHoldings.length} holdings`}
          </button>
        </div>
      )}
    </div>
  );
}

function HoldingRow({ holding, isSelected, onToggle }) {
  return (
    <tr
      className={`transition-colors cursor-pointer ${
        isSelected ? "bg-blue-100 ring-1 ring-blue-200" : "hover:bg-gray-50"
      }`}
      onClick={onToggle}
    >
      <td className="px-4 py-3" onClick={(e) => e.stopPropagation()}>
        <input
          type="checkbox"
          checked={isSelected}
          onChange={onToggle}
          className="w-4 h-4 rounded border-gray-300 text-blue-600 cursor-pointer"
          aria-label={`Select ${holding.coin}`}
        />
      </td>
      <td className="px-4 py-3">
        <div className="flex items-center gap-2">
          <img
            src={holding.logo}
            alt={holding.coin}
            className="w-6 h-6 rounded-full bg-gray-100 object-contain"
            onError={(e) => {
              e.currentTarget.style.visibility = "hidden";
            }}
          />
          <div>
            <p className="font-medium text-gray-900">{holding.coin}</p>
            <p className="text-xs text-gray-400 truncate max-w-[160px]">
              {holding.coinName}
            </p>
          </div>
        </div>
      </td>
      <td className="px-4 py-3 text-right text-gray-700">
        <p>{formatNumber(holding.totalHolding)}</p>
        <p className="text-xs text-gray-400">
          Avg {formatINR(holding.averageBuyPrice)}
        </p>
      </td>
      <td className="px-4 py-3 text-right text-gray-700">
        {formatINR(holding.currentPrice)}
      </td>
      <GainCell gain={holding.stcg.gain} balance={holding.stcg.balance} />
      <GainCell gain={holding.ltcg.gain} balance={holding.ltcg.balance} />
      <td className="px-4 py-3 text-right text-gray-700">
        {isSelected ? formatNumber(holding.totalHolding) : "—"}
      </td>
    </tr>
  );
}

function GainCell({ gain, balance }) {
  const isPositive = gain > 0;
  const isNegative = gain < 0;
  return (
    <td className="px-4 py-3 text-right">
      <p
        className={
          isPositive
            ? "text-emerald-600 font-medium"
            : isNegative
            ? "text-rose-600 font-medium"
            : "text-gray-400"
        }
      >
        {formatINR(gain)}
      </p>
      <p className="text-xs text-gray-400">{formatNumber(balance)}</p>
    </td>
  );
}