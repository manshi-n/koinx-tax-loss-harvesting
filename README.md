# Tax Loss Harvesting Tool

A React app that helps users see how selling specific crypto holdings at a loss could reduce their capital gains tax — built for the KoinX Frontend Intern assignment.

## Live Demo

🔗 **[Add your deployed Vercel link here]**

## Screenshots

_Add 2–3 screenshots here after deploying: the main dashboard, a few holdings selected, and the mobile view._

## Features

- **Pre-Harvesting card** — shows current short-term and long-term capital gains, losses, net gains, and total realised gains.
- **After Harvesting card** — updates live as you select/deselect holdings, recalculating profits, losses, and net gains per the harvesting rule (positive gains → profits, negative gains → losses).
- **Savings message** — appears automatically when your selections would reduce your realised capital gains, with near-zero savings correctly suppressed to avoid a misleading "save ₹0.00" message.
- **Holdings table** — sorted by biggest loss first by default, so the coins most worth harvesting surface immediately.
- **Search** — filter holdings by coin symbol or name, without breaking selection state for already-checked rows.
- **Select all / individual selection** — checkboxes with a proper indeterminate state when some (not all) rows are selected, plus a live "X of Y selected" counter.
- **"View all" / "Show less"** toggle for long holding lists, aware of the current search filter.
- **Loading and error states** for the (mocked) API calls.
- **Fully responsive** — cards stack on mobile, table scrolls horizontally on small screens.
- **Clean number formatting** — tiny values (e.g. `3.47e-17`) display as `≈ 0`, and near-zero negative values display as `₹0.00` instead of a confusing `-₹0.00`.

## Tech Stack

- React (Vite)
- Tailwind CSS v4
- Plain JavaScript (JSX) — no TypeScript, to keep the codebase simple to read, extend, and discuss live
- React Context for shared state (`TaxHarvestingProvider`), avoiding prop drilling across components
- Mock APIs implemented as Promise-based functions with a simulated network delay (`src/api/mockApi.js`)
- Vitest for unit testing the core tax calculation logic

## Project Structure
src/
├── api/
│   ├── holdingsData.js       # Dummy data from the assignment spec
│   └── mockApi.js             # Promise-based mock API functions
├── components/
│   ├── CapitalGainsCard.jsx   # Shared component for both summary cards
│   ├── HoldingsTable.jsx      # Table with search, checkboxes, select-all, view-all
│   └── StatusStates.jsx       # Loading and error UI
├── context/
│   └── TaxHarvestingContext.jsx  # Shared state provider, consumed via useContext
├── hooks/
│   └── useTaxHarvesting.js    # All state + derived calculations, one source of truth
├── utils/
│   ├── taxCalculations.js     # Pure functions for the tax math
│   └── taxCalculations.test.js  # Unit tests verifying the math against the spec
├── App.jsx
└── main.jsx

## Setup Instructions

```bash
# Install dependencies
npm install

# Run locally
npm run dev

# Run the test suite
npm run test

# Build for production
npm run build

# Preview the production build
npm run preview
```

## How the Core Logic Works

The harvesting calculation lives in `src/utils/taxCalculations.js`, isolated from all UI code:

1. `calcNetGains(term)` — `profits - losses` for one term (short or long).
2. `calcRealisedGains(capitalGains)` — sum of net short-term and net long-term gains.
3. `calcHarvestedGains(original, selectedHoldings)` — for each selected holding, adds its short-term and long-term gain to profits (if positive) or losses (if negative), for each term independently.

This is verified with an automated test suite (`npm run test`) that checks the exact worked example from the assignment spec (₹700 → ₹200 realised gains after selecting ETH), plus edge cases like zero-gain holdings, multiple simultaneous selections, and immutability of the original data.

## State Management

All shared state (holdings, selections, capital gains, loading/error status) lives in a single custom hook (`useTaxHarvesting`), exposed app-wide through a React Context provider (`TaxHarvestingProvider`). Components like `HoldingsTable` consume this directly via `useTaxHarvestingContext()` instead of receiving it through props, keeping the component tree simple as the app grows.

## Assumptions

- Holdings with identical coin symbols but different chains (e.g. two "USDC" entries) are treated as distinct rows, keyed by original array index rather than coin symbol, since the symbol alone isn't a unique identifier in the provided dataset. This indexing is preserved correctly even when the search filter narrows down what's visible.
- A gain of exactly `0` doesn't affect either profits or losses when a holding is selected.
- The "Amount to Sell" column is populated with the holding's full `totalHolding` when selected (partial-sell quantities weren't specified in the spec).
- The mock API includes an artificial ~700ms delay to make the loading state visible and demonstrate real async handling, rather than resolving instantly.
- Holdings are sorted by combined (short-term + long-term) gain, ascending, so the biggest loss-harvesting opportunities appear first by default.