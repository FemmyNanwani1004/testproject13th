const dashboardData = {
  company: "Northstar Studio",
  period: "March 2026 Close",
  subtitle:
    "A quick view of cash position, invoice collections, and operating spend for the current close.",
  updatedOn: "Updated March 13, 2026",
  summary: {
    closingBalance: 128450,
    balanceDelta: "+$14,200 vs previous month",
    taxReserve: 18400,
    pendingPayouts: 6980,
    collectionDays: 23,
    sparkline: [84, 88, 86, 93, 99, 104, 111, 118],
  },
  metrics: [
    {
      label: "Revenue",
      value: 84200,
      delta: "+12.1%",
      tone: "positive",
      note: "Collected this month",
    },
    {
      label: "Expenses",
      value: 48750,
      delta: "3.6% under plan",
      tone: "positive",
      note: "Operating costs",
    },
    {
      label: "Accounts receivable",
      value: 31620,
      delta: "6 invoices open",
      tone: "neutral",
      note: "Awaiting payment",
    },
    {
      label: "Net profit",
      value: 35450,
      delta: "+27.3%",
      tone: "positive",
      note: "42.1% margin",
    },
  ],
  cashFlow: [
    { label: "Oct", inflow: 62000, outflow: 46000 },
    { label: "Nov", inflow: 68000, outflow: 51000 },
    { label: "Dec", inflow: 73500, outflow: 57800 },
    { label: "Jan", inflow: 70800, outflow: 49200 },
    { label: "Feb", inflow: 78200, outflow: 54400 },
    { label: "Mar", inflow: 84200, outflow: 48750 },
  ],
  expenseBreakdown: [
    { label: "Payroll", value: 22000, color: "#1c7c54" },
    { label: "Operations", value: 9800, color: "#0f3d3e" },
    { label: "Software", value: 6200, color: "#d97706" },
    { label: "Marketing", value: 5900, color: "#c55d1f" },
    { label: "Tax & fees", value: 4850, color: "#8f3b3b" },
  ],
  transactions: [
    {
      date: "Mar 12",
      description: "Atlas Co. retainer",
      category: "Consulting income",
      amount: 12500,
      kind: "credit",
      status: "Cleared",
    },
    {
      date: "Mar 11",
      description: "Payroll run",
      category: "Salary expense",
      amount: -16400,
      kind: "debit",
      status: "Cleared",
    },
    {
      date: "Mar 10",
      description: "Cloud licenses",
      category: "Software expense",
      amount: -2150,
      kind: "debit",
      status: "Scheduled",
    },
    {
      date: "Mar 08",
      description: "North Ridge LLC",
      category: "Invoice payment",
      amount: 8200,
      kind: "credit",
      status: "Cleared",
    },
    {
      date: "Mar 06",
      description: "Office lease",
      category: "Facilities",
      amount: -3400,
      kind: "debit",
      status: "Cleared",
    },
    {
      date: "Mar 04",
      description: "Campaign spend",
      category: "Marketing",
      amount: -1800,
      kind: "debit",
      status: "Pending",
    },
  ],
  invoices: [
    { client: "Harbor Freight Labs", due: "Mar 18", amount: 9600, status: "Pending" },
    { client: "Summit Retail", due: "Mar 21", amount: 6800, status: "Pending" },
    { client: "Oakline Foods", due: "Mar 15", amount: 3540, status: "Due soon" },
    { client: "Crescent Health", due: "Mar 09", amount: 3000, status: "Overdue" },
  ],
  budgets: [
    { name: "Payroll", used: 22000, limit: 28000 },
    { name: "Operations", used: 9800, limit: 12000 },
    { name: "Software", used: 6200, limit: 7500 },
    { name: "Marketing", used: 5900, limit: 8000 },
  ],
  deadlines: [
    { title: "Sales tax filing", date: "Mar 20", tone: "urgent" },
    { title: "Contractor payments", date: "Mar 22", tone: "normal" },
    { title: "Bank reconciliation", date: "Mar 25", tone: "normal" },
    { title: "Quarter-close checklist", date: "Mar 29", tone: "upcoming" },
  ],
};

const currencyFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 0,
});

const compactCurrencyFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 0,
  notation: "compact",
});

function formatCurrency(value) {
  return currencyFormatter.format(value);
}

function formatSignedCurrency(value) {
  const formatted = currencyFormatter.format(Math.abs(value));
  return value < 0 ? `-${formatted}` : formatted;
}

function formatCompactCurrency(value) {
  return compactCurrencyFormatter.format(value);
}

function sumValues(items, key) {
  return items.reduce((total, item) => total + item[key], 0);
}

function createLinePath(points) {
  return points
    .map((point, index) => `${index === 0 ? "M" : "L"} ${point.x} ${point.y}`)
    .join(" ");
}

function renderSparkline(values) {
  const svg = document.getElementById("balance-sparkline");
  const width = 220;
  const height = 84;
  const padding = 6;
  const max = Math.max(...values);
  const min = Math.min(...values);
  const range = max - min || 1;
  const usableWidth = width - padding * 2;
  const usableHeight = height - padding * 2;

  const points = values.map((value, index) => {
    const x = padding + (usableWidth / (values.length - 1 || 1)) * index;
    const y = height - padding - ((value - min) / range) * usableHeight;
    return { x: Number(x.toFixed(2)), y: Number(y.toFixed(2)) };
  });

  const linePath = createLinePath(points);
  const areaPath = `${linePath} L ${points[points.length - 1].x} ${height - padding} L ${points[0].x} ${height - padding} Z`;

  svg.innerHTML = `
    <defs>
      <linearGradient id="spark-fill" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stop-color="#1c7c54" stop-opacity="0.42"></stop>
        <stop offset="100%" stop-color="#1c7c54" stop-opacity="0"></stop>
      </linearGradient>
    </defs>
    <path d="${areaPath}" fill="url(#spark-fill)"></path>
    <path
      d="${linePath}"
      fill="none"
      stroke="#1c7c54"
      stroke-width="3"
      stroke-linecap="round"
      stroke-linejoin="round"
    ></path>
    <circle cx="${points[points.length - 1].x}" cy="${points[points.length - 1].y}" r="5" fill="#1c7c54"></circle>
    <circle
      cx="${points[points.length - 1].x}"
      cy="${points[points.length - 1].y}"
      r="9"
      fill="#1c7c54"
      fill-opacity="0.18"
    ></circle>
  `;
}

function renderMetrics(metrics) {
  const metricsGrid = document.getElementById("metrics-grid");

  metricsGrid.innerHTML = metrics
    .map(
      (metric, index) => `
        <article class="metric-card" style="--delay: ${index * 90}ms">
          <span class="metric-label">${metric.label}</span>
          <strong class="metric-value">${formatCurrency(metric.value)}</strong>
          <span class="delta ${metric.tone}">${metric.delta}</span>
          <p class="metric-note">${metric.note}</p>
        </article>
      `,
    )
    .join("");
}

function renderCashFlow(cashFlow) {
  const chart = document.getElementById("cashflow-chart");
  const cashflowNote = document.getElementById("cashflow-note");
  const maxValue = Math.max(...cashFlow.flatMap((entry) => [entry.inflow, entry.outflow]));
  const totalInflow = sumValues(cashFlow, "inflow");
  const totalOutflow = sumValues(cashFlow, "outflow");
  const net = totalInflow - totalOutflow;

  chart.innerHTML = cashFlow
    .map(
      (entry, index) => `
        <article class="bar-cluster">
          <div class="bars">
            <div
              class="bar bar-income"
              style="--size: ${(entry.inflow / maxValue) * 100}%; --delay: ${index * 85}ms"
              title="${entry.label} inflow ${formatCurrency(entry.inflow)}"
            ></div>
            <div
              class="bar bar-expense"
              style="--size: ${(entry.outflow / maxValue) * 100}%; --delay: ${index * 85 + 60}ms"
              title="${entry.label} outflow ${formatCurrency(entry.outflow)}"
            ></div>
          </div>
          <strong class="cluster-label">${entry.label}</strong>
          <div class="cluster-meta">
            <span>${formatCompactCurrency(entry.inflow)}</span>
            <span>${formatCompactCurrency(entry.outflow)}</span>
          </div>
        </article>
      `,
    )
    .join("");

  cashflowNote.textContent =
    net >= 0
      ? `Inflow exceeded outflow by ${formatCurrency(net)} across the six-month window.`
      : `Outflow exceeded inflow by ${formatCurrency(Math.abs(net))} across the six-month window.`;
}

function renderExpenseBreakdown(expenses) {
  const expenseRing = document.getElementById("expense-ring");
  const expenseList = document.getElementById("expense-list");
  const expenseTotal = document.getElementById("expense-total");
  const total = sumValues(expenses, "value");
  let cursor = 0;

  const gradientStops = expenses
    .map((expense) => {
      const start = (cursor / total) * 360;
      cursor += expense.value;
      const end = (cursor / total) * 360;
      return `${expense.color} ${start}deg ${end}deg`;
    })
    .join(", ");

  expenseRing.style.background = `conic-gradient(${gradientStops})`;
  expenseTotal.textContent = formatCurrency(total);

  expenseList.innerHTML = expenses
    .map((expense) => {
      const share = Math.round((expense.value / total) * 100);
      return `
        <li class="expense-item">
          <span class="swatch" style="background: ${expense.color}"></span>
          <div>
            <strong>${expense.label}</strong>
            <p class="expense-meta">${share}% of spend</p>
          </div>
          <span>${formatCurrency(expense.value)}</span>
        </li>
      `;
    })
    .join("");
}

function renderTransactions(transactions) {
  const tbody = document.getElementById("transactions-body");
  const transactionSummary = document.getElementById("transaction-summary");

  tbody.innerHTML = transactions
    .map(
      (transaction) => `
        <tr>
          <td>${transaction.date}</td>
          <td class="description-cell">
            <strong>${transaction.description}</strong>
            <span>${transaction.category}</span>
          </td>
          <td class="transaction-category">${transaction.category}</td>
          <td>
            <span class="badge ${statusTone(transaction.status)}">${transaction.status}</span>
          </td>
          <td class="amount ${transaction.kind}">${formatSignedCurrency(transaction.amount)}</td>
        </tr>
      `,
    )
    .join("");

  transactionSummary.textContent = `${transactions.length} entries posted this month.`;
}

function renderInvoices(invoices) {
  const invoiceList = document.getElementById("invoice-list");
  const invoiceSummary = document.getElementById("invoice-summary");
  const outstanding = sumValues(invoices, "amount");

  invoiceList.innerHTML = invoices
    .map(
      (invoice) => `
        <li class="stack-item">
          <div class="stack-item-head">
            <strong>${invoice.client}</strong>
            <span class="badge ${statusTone(invoice.status)}">${invoice.status}</span>
          </div>
          <div class="stack-item-meta">
            <span>Due ${invoice.due}</span>
            <strong>${formatCurrency(invoice.amount)}</strong>
          </div>
        </li>
      `,
    )
    .join("");

  invoiceSummary.textContent = `${formatCurrency(outstanding)} outstanding`;
}

function renderBudgets(budgets) {
  const budgetList = document.getElementById("budget-list");

  budgetList.innerHTML = budgets
    .map((budget) => {
      const ratio = budget.used / budget.limit;
      const percent = Math.round(ratio * 100);
      const tone = ratio >= 1 ? "danger" : ratio >= 0.85 ? "warning" : "positive";

      return `
        <li class="budget-item">
          <div class="budget-head">
            <strong>${budget.name}</strong>
            <span>${percent}% used</span>
          </div>
          <div class="progress ${tone}" style="--width: ${Math.min(percent, 100)}%"><span></span></div>
          <div class="budget-foot">
            <span>${formatCurrency(budget.used)} spent</span>
            <span>${formatCurrency(budget.limit)} budget</span>
          </div>
        </li>
      `;
    })
    .join("");
}

function renderDeadlines(deadlines) {
  const deadlineList = document.getElementById("deadline-list");

  deadlineList.innerHTML = deadlines
    .map(
      (deadline) => `
        <li class="stack-item deadline-item ${deadline.tone}">
          <div class="stack-item-head">
            <strong>${deadline.title}</strong>
            <span class="badge ${deadline.tone === "urgent" ? "danger" : deadline.tone === "upcoming" ? "warning" : "positive"}">${deadline.date}</span>
          </div>
        </li>
      `,
    )
    .join("");
}

function statusTone(status) {
  if (status === "Cleared") {
    return "positive";
  }

  if (status === "Due soon" || status === "Scheduled") {
    return "warning";
  }

  if (status === "Overdue") {
    return "danger";
  }

  return "neutral";
}

function populateHeader(data) {
  document.getElementById("hero-title").textContent = data.company;
  document.getElementById("hero-period").textContent = data.period;
  document.getElementById("hero-subtitle").textContent = data.subtitle;
  document.getElementById("hero-updated").textContent = data.updatedOn;
  document.getElementById("closing-balance").textContent = formatCurrency(data.summary.closingBalance);
  document.getElementById("balance-delta").textContent = data.summary.balanceDelta;
  document.getElementById("tax-reserve").textContent = formatCurrency(data.summary.taxReserve);
  document.getElementById("pending-payouts").textContent = formatCurrency(data.summary.pendingPayouts);
  document.getElementById("collection-days").textContent = `${data.summary.collectionDays} days`;
}

function renderDashboard(data) {
  populateHeader(data);
  renderSparkline(data.summary.sparkline);
  renderMetrics(data.metrics);
  renderCashFlow(data.cashFlow);
  renderExpenseBreakdown(data.expenseBreakdown);
  renderTransactions(data.transactions);
  renderInvoices(data.invoices);
  renderBudgets(data.budgets);
  renderDeadlines(data.deadlines);
}

document.addEventListener("DOMContentLoaded", () => {
  renderDashboard(dashboardData);
});
