"use client";

import {
  Bar, BarChart, CartesianGrid, Cell, Line, LineChart,
  ResponsiveContainer, Tooltip, XAxis, YAxis,
} from "recharts";
import { CATEGORY_COLORS } from "../lib/categories";
import { money, monthLabel } from "../lib/aggregate";

type Props = {
  categoryData: { category: string; total: number }[];
  trendData: { month: string; total: number }[];
};

const fmt = (v: unknown) => money(Number(v));

export default function Charts({ categoryData, trendData }: Props) {
  return (
    <div className="charts">
      <section className="panel">
        <h2>Spending by category</h2>
        <div className="chart">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={categoryData} layout="vertical" margin={{ left: 16, right: 16 }}>
              <CartesianGrid horizontal={false} stroke="#dde4e6" />
              <XAxis type="number" tickFormatter={(v) => `$${v}`} />
              <YAxis type="category" dataKey="category" width={96} />
              <Tooltip formatter={fmt} />
              <Bar dataKey="total" radius={[0, 4, 4, 0]}>
                {categoryData.map((d) => (
                  <Cell key={d.category} fill={CATEGORY_COLORS[d.category] ?? "#7a8a90"} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </section>

      <section className="panel">
        <h2>Monthly trend</h2>
        <div className="chart">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={trendData} margin={{ left: 8, right: 24 }}>
              <CartesianGrid stroke="#dde4e6" />
              <XAxis dataKey="month" tickFormatter={monthLabel} />
              <YAxis tickFormatter={(v) => `$${v}`} />
              <Tooltip formatter={fmt} labelFormatter={(l) => monthLabel(String(l))} />
              <Line type="monotone" dataKey="total" stroke="#0f6b66" strokeWidth={3} dot={{ r: 4 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </section>
    </div>
  );
}
