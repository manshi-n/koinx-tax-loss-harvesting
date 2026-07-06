import { formatINR } from "../utils/taxCalculations";


export default function CapitalGainsCard({
  variant, // "dark" | "blue"
  title,
  capitalGains,
  realisedGains,
  savingsMessage,
}) {
  const isDark = variant === "dark";

  const netStcg = capitalGains.stcg.profits - capitalGains.stcg.losses;
  const netLtcg = capitalGains.ltcg.profits - capitalGains.ltcg.losses;

  return (
    <div
      className={`rounded-2xl p-6 flex-1 min-w-[280px] transition-colors duration-300 ${
        isDark
          ? "bg-[#1B1B23] text-white"
          : "bg-gradient-to-br from-[#3B5BFF] to-[#2C3FE0] text-white"
      }`}
    >
      <h3 className="text-sm font-medium text-white/70 mb-4">{title}</h3>

      <div className="grid grid-cols-2 gap-4 mb-5">
        <GainTerm
          label="Short-term"
          profits={capitalGains.stcg.profits}
          losses={capitalGains.stcg.losses}
          net={netStcg}
        />
        <GainTerm
          label="Long-term"
          profits={capitalGains.ltcg.profits}
          losses={capitalGains.ltcg.losses}
          net={netLtcg}
        />
      </div>

      <div className="border-t border-white/15 pt-4 flex items-center justify-between">
        <span className="text-sm text-white/70">Realised Capital Gains</span>
        <span className="text-lg font-semibold">{formatINR(realisedGains)}</span>
      </div>

      {savingsMessage && (
        <div className="mt-4 rounded-lg bg-emerald-500/15 border border-emerald-400/30 px-3 py-2 text-sm text-emerald-300 font-medium">
          🎉 {savingsMessage}
        </div>
      )}
    </div>
  );
}

function GainTerm({ label, profits, losses, net }) {
  return (
    <div className="bg-white/5 rounded-xl p-3">
      <p className="text-xs text-white/60 mb-2">{label}</p>
      <Row label="Profits" value={profits} />
      <Row label="Losses" value={losses} />
      <div className="mt-1 pt-1 border-t border-white/10 flex justify-between text-xs">
        <span className="text-white/60">Net</span>
        <span className={net >= 0 ? "text-emerald-300" : "text-rose-300"}>
          {formatINR(net)}
        </span>
      </div>
    </div>
  );
}

function Row({ label, value }) {
  return (
    <div className="flex justify-between text-xs text-white/80 py-0.5">
      <span>{label}</span>
      <span>{formatINR(value)}</span>
    </div>
  );
}
