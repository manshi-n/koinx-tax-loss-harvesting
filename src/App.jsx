import { TaxHarvestingProvider, useTaxHarvestingContext } from "./context/TaxHarvestingContext";
import CapitalGainsCard from "./components/CapitalGainsCard";
import HoldingsTable from "./components/HoldingsTable";
import { LoadingState, ErrorState } from "./components/StatusStates";
import { formatINR } from "./utils/taxCalculations";

export default function App() {
  return (
    <TaxHarvestingProvider>
      <AppContent />
    </TaxHarvestingProvider>
  );
}

function AppContent() {
  const {
    capitalGains,
    harvestedGains,
    realisedBefore,
    realisedAfter,
    savings,
    showSavingsMessage,
    isLoading,
    error,
  } = useTaxHarvestingContext();

  return (
    <div className="min-h-screen bg-[#F5F6FA]">
      <header className="border-b border-gray-200 bg-white">
        <div className="max-w-6xl mx-auto px-6 py-5">
          <h1 className="text-2xl font-bold text-gray-900">
            Tax Loss Harvesting
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Select loss-making holdings and instantly preview your post-harvesting capital gains.
          </p>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 py-8">
        {isLoading && <LoadingState />}

        {error && !isLoading && (
          <ErrorState message={error} onRetry={() => window.location.reload()} />
        )}

        {!isLoading && !error && capitalGains && (
          <>
            <div className="flex flex-col md:flex-row gap-5 mb-8">
              <CapitalGainsCard
                variant="dark"
                title="Pre-Harvesting"
                capitalGains={capitalGains}
                realisedGains={realisedBefore}
              />
              <CapitalGainsCard
                variant="blue"
                title="After Harvesting"
                capitalGains={harvestedGains}
                realisedGains={realisedAfter}
                savingsMessage={
                  showSavingsMessage
                    ? `You're going to save ${formatINR(savings)}`
                    : null
                }
              />
            </div>

            <h2 className="text-lg font-semibold text-gray-900 mb-3">
              Your Holdings
            </h2>
            <HoldingsTable />
          </>
        )}
      </main>
    </div>
  );
}