"use client";

import { CATEGORIES } from "@/lib/categories";
import { money } from "@/lib/aggregate";
import type { Transaction } from "@/lib/types";

type Props = {
  rows: Transaction[];
  onChange: (id: string, category: string) => void;
};

export default function TransactionTable({ rows, onChange }: Props) {
  return (
    <div className="table-wrap">
      <table>
        <thead>
          <tr>
            <th>Date</th>
            <th>Description</th>
            <th className="num">Amount</th>
            <th>Category</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r) => (
            <tr key={r.id}>
              <td>{r.date}</td>
              <td>{r.description}</td>
              <td className="num">{money(r.amount)}</td>
              <td>
                <select
                  value={r.category}
                  aria-label={`Category for ${r.description}`}
                  onChange={(e) => onChange(r.id, e.target.value)}
                >
                  {CATEGORIES.map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
