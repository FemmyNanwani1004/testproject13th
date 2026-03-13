# Accounting Dashboard

A simple accounting dashboard built as a static HTML, CSS, and JavaScript site.

## What it includes

- Closing balance summary with a balance sparkline
- Revenue, expense, receivable, and profit KPI cards
- Six-month cash flow comparison
- Expense breakdown ring chart
- Recent transactions table
- Open invoices, budget health, and key deadline panels

## Project structure

- `index.html` - page structure
- `styles.css` - dashboard styling and responsive layout
- `script.js` - demo accounting data and rendering logic
- `server.js` - optional local static server

## Run locally

Open `index.html` directly in a browser, or run the local server:

```bash
node server.js
```

Then open `http://127.0.0.1:4173`.

## Update the dashboard data

Edit the `dashboardData` object in `script.js` to replace the sample values with your own accounting data.

## GitHub Pages

This repository includes a GitHub Actions workflow that deploys the static site to GitHub Pages whenever `main` is updated.
