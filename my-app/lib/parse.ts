import Papa from "papaparse";
import { guessCategory } from "./categories";
import type { Transaction } from "./types";

export type ParseResult = { rows: Transaction[]; skipped: number; error?: string };

export function parseCsv(text: string): ParseResult {
  const parsed = Papa.parse<Record<string, string>>(text, {
    header: true,
    skipEmptyLines: true,
    transformHeader: (h) => h.trim().toLowerCase(),
  });

  const fields = parsed.meta.fields ?? [];
  const missing = ["date", "description", "amount"].filter((f) => !fields.includes(f));
  if (missing.length > 0) {
    return {
      rows: [],
      skipped: 0,
      error: `Missing column${missing.length > 1 ? "s" : ""}: ${missing.join(", ")}. Your CSV needs date, description and amount.`,
    };
  }

  const rows: Transaction[] = [];
  let skipped = 0;

  parsed.data.forEach((r, i) => {
    const date = (r.date ?? "").trim();
    const amount = Number((r.amount ?? "").replace(/[$,\s]/g, ""));
    if (!/^\d{4}-\d{2}-\d{2}$/.test(date) || !Number.isFinite(amount)) {
      skipped++;
      return;
    }
    const description = (r.description ?? "").trim();
    rows.push({
      id: `${i}-${date}`,
      date,
      description,
      amount,
      category: guessCategory(description),
    });
  });

  return { rows, skipped };
}
