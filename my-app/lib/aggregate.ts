import type { Transaction } from "./types";

const round = (n: number) => Math.round(n * 100) / 100;

// Only positive amounts count as spending.
const spending = (rows: Transaction[]) => rows.filter((r) => r.amount > 0);

export function monthsOf(rows: Transaction[]): string[] {
  return [...new Set(spending(rows).map((r) => r.date.slice(0, 7)))].sort();
}

export function byCategory(rows: Transaction[], month: string) {
  const totals = new Map<string, number>();
  for (const r of spending(rows)) {
    if (r.date.startsWith(month)) {
      totals.set(r.category, (totals.get(r.category) ?? 0) + r.amount);
    }
  }
  return [...totals]
    .map(([category, total]) => ({ category, total: round(total) }))
    .sort((a, b) => b.total - a.total);
}

export function monthlyTotals(rows: Transaction[]) {
  return monthsOf(rows).map((month) => ({
    month,
    total: round(
      spending(rows)
        .filter((r) => r.date.startsWith(month))
        .reduce((sum, r) => sum + r.amount, 0)
    ),
  }));
}

export const money = (n: number) =>
  n.toLocaleString("en-SG", { style: "currency", currency: "SGD" });

export function monthLabel(month: string) {
  const [y, m] = month.split("-").map(Number);
  return new Date(y, m - 1, 1).toLocaleDateString("en-SG", { month: "short", year: "numeric" });
}
