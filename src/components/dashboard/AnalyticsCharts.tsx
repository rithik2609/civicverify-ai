"use client";

import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  ResponsiveContainer,
} from "recharts";

export default function AnalyticsCharts({
  analytics,
}: {
  analytics: any;
}) {

  const pieData = [
    {
      name: "TRUE",
      value: analytics?.true || 0,
    },
    {
      name: "FALSE",
      value: analytics?.false || 0,
    },
    {
      name: "PARTIAL",
      value: analytics?.partial || 0,
    },
    {
      name: "MISLEADING",
      value: analytics?.partial || 0,
    },
  ];

  const barData = [
    {
      name: "TRUE",
      value: analytics?.true || 0,
    },
    {
      name: "FALSE",
      value: analytics?.false || 0,
    },
    {
      name: "PARTIAL",
      value: analytics?.partial || 0,
    },
    {
      name: "MISLEADING",
      value: analytics?.partial || 0,
    },
  ];

  return (
    <div className="grid md:grid-cols-2 gap-6">

      {/* Pie Chart */}
      <div className="bg-white border rounded-xl p-6">

        <h2 className="text-xl font-semibold mb-4">
          Verdict Distribution
        </h2>

        <ResponsiveContainer
          width="100%"
          height={300}
        >
          <PieChart>

            <Pie
              data={pieData}
              dataKey="value"
              outerRadius={100}
              label
            >
              <Cell fill="#22c55e" />
              <Cell fill="#ef4444" />
              <Cell fill="#f59e0b" />
                <Cell fill="#8b5cf6" />
            </Pie>

            <Tooltip />

          </PieChart>
        </ResponsiveContainer>

      </div>

      {/* Bar Chart */}
      <div className="bg-white border rounded-xl p-6">

        <h2 className="text-xl font-semibold mb-4">
          Investigation Results
        </h2>

        <ResponsiveContainer
          width="100%"
          height={300}
        >

          <BarChart data={barData}>

            <XAxis dataKey="name" />

            <YAxis />

            <Tooltip />

            <Bar dataKey="value" />

          </BarChart>

        </ResponsiveContainer>

      </div>

    </div>
  );
}