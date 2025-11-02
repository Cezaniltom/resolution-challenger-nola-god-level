"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
}
from "recharts";

/**
 * @param {Array<Object>} data
 * @param {string} xAxisKey
 * @param {string} barKey
 * @param {string} [barColor]
 * @param {string} [tooltipUnit]
 */
export default function SimpleBarChart({
  data,
  xAxisKey,
  barKey,
  barColor = "#4ADE80",
  tooltipUnit = "R$",
}) {
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      const value = new Intl.NumberFormat("pt-BR", {
        style: "currency",
        currency: "BRL",
      }).format(payload[0].value);
      return (
        <div className="rounded-lg border border-gray-300 bg-white p-2 shadow-md">
          <p className="font-semibold text-gray-800">{`${label}`}</p>
          <p className="text-gray-600">{`${payload[0].name}: ${value}`}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <ResponsiveContainer width="100%" height={400}>
      <BarChart
        data={data}
        margin={{
          top: 20,
          right: 30,
          left: 20,
          bottom: 5,
        }}
      >

        <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" vertical={false} />

        <XAxis
          dataKey={xAxisKey}
          tickLine={false}
          axisLine={false}
          padding={{ left: 20, right: 20 }}
          className="text-sm text-gray-600"
        />

        <YAxis
          tickFormatter={(value) =>
            new Intl.NumberFormat("pt-BR", {
              style: "currency",
              currency: "BRL",
              notation: "compact",
              maximumFractionDigits: 0,
            }).format(value)
          }
          tickLine={false}
          axisLine={false}
          className="text-sm text-gray-600"
        />

        <Tooltip cursor={{ fill: "rgba(0,0,0,0.05)" }} content={<CustomTooltip />} />

        <Legend
          verticalAlign="top"
          align="right"
          height={36}
          wrapperStyle={{ fontSize: "14px", color: "#6B7280" }}
        />

        <Bar
          dataKey={barKey}
          fill={barColor}
          name="Total"
          radius={[4, 4, 0, 0]}
          barSize={40}
        />
      </BarChart>
    </ResponsiveContainer>
  );
}