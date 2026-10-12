"use client";

import { useMemo, useState } from "react";
import Charts from "../components/Charts";
import TransactionTable from "../components/TransactionTable";
import { byCategory, money, monthLabel, monthlyTotals, monthsOf } from "../lib/aggregate";
import { parseCsv } from "../lib/parse";
import type { Transaction } from "../lib/types";

export default function Home() {
  const [rows, setRows] = useState<Transaction[]>([]);
  const [month, setMonth] = useState("");
  const [message, setMessage] = useState("");
  const [isError, setIsError] = useState(false);

  const months = useMemo(() => monthsOf(rows), [rows]);
  const activeMonth = months.includes(month) ? month : months[months.length - 1] ?? "";
  const categoryData = useMemo(() => byCategory(rows, activeMonth), [rows, activeMonth]);
  const trendData = useMemo(() => monthlyTotals(rows), [rows]);
  const monthRows = useMemo(
    () => rows.filter((r) => r.date.startsWith(activeMonth)).sort((a, b) => b.date.localeCompare(a.date)),
    [rows, activeMonth]
  );
  const monthTotal = categoryData.reduce((sum, d) => sum + d.total, 0);

  function load(text: string, source: string) {
    const result = parseCsv(text);
    if (result.error) {
      setIsError(true);
      setMessage(result.error);
      return;
    }
    setIsError(false);
    setRows(result.rows);
    setMessage(
      `Loaded ${result.rows.length} transactions from ${source}.` +
        (result.skipped ? ` Skipped ${result.skipped} rows with a bad date or amount.` : "")
    );
  }

  async function onFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) load(await file.text(), file.name);
    e.target.value = "";
  }

  async function loadSample() {
    const res = await fetch("/sample-transactions.csv");
    load(await res.text(), "the sample data");
  }

  function setCategory(id: string, category: string) {
    setRows((prev) => prev.map((r) => (r.id === id ? { ...r, category } : r)));
  }

  return (
    <main>
      <header className="hero">
        <h1>Tally</h1>
        <p>Upload a CSV of your spending and see where the money goes each month. Everything stays in your browser.</p>
        <div className="actions">
          <label className="button primary">
            Upload CSV
            <input type="file" accept=".csv,text/csv" onChange={onFile} hidden />
          </label>
          <button className="button" onClick={loadSample}>Try sample data</button>
        </div>
        <p className="hint">Columns needed: date (YYYY-MM-DD), description, amount. Use anonymised data only.</p>
        {message && <p className={isError ? "msg error" : "msg"} role="status">{message}</p>}
      </header>

      {rows.length === 0 ? (
        <p className="empty">No transactions yet. Upload a CSV or try the sample data to get started.</p>
      ) : (
        <>
          <div className="summary">
            <label>
              Month
              <select value={activeMonth} onChange={(e) => setMonth(e.target.value)}>
                {months.map((m) => (
                  <option key={m} value={m}>{monthLabel(m)}</option>
                ))}
              </select>
            </label>
            <p className="total">{money(monthTotal)} <span>spent in {monthLabel(activeMonth)}</span></p>
          </div>

          <Charts categoryData={categoryData} trendData={trendData} />

          <section className="panel">
            <h2>Transactions in {monthLabel(activeMonth)}</h2>
            <TransactionTable rows={monthRows} onChange={setCategory} />
          </section>
        </>
      )}
    </main>
  );
}
