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