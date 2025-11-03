"use client"; 

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const CustomTooltip = ({ active, payload, label, barColor }) => {
  if (active && payload && payload.length) {
    const value = new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(payload[0].value);
    return (
      <div className="rounded-lg border border-gray-300 bg-white p-2 shadow-md">
        <p className="font-semibold text-gray-800">{`${label}`}</p>
        <p style={{ color: barColor || "#1976d2" }}>{`Total: ${value}`}</p>
      </div>
    );
  }
  return null;
};

export default function SimpleBarChart({ data, xAxisKey, barKey, barColor }) {
  
  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart
        data={data}
        margin={{
          top: 5,
          right: 30,
          left: 0, 
          bottom: 5,
        }}
      >
        <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" vertical={false} />

        <XAxis
          dataKey={xAxisKey}
          tickLine={false}
          axisLine={false}
          padding={{ left: 10, right: 10 }}
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

        <Tooltip 
          cursor={{ fill: "rgba(0,0,0,0.05)" }} 
          content={<CustomTooltip barColor={barColor} />}
        />

        <Bar
          dataKey={barKey}
          fill={barColor || "#1976d2"} 
          name="Total"
          radius={[4, 4, 0, 0]}
          barSize={40}
        />
      </BarChart>
    </ResponsiveContainer>
  );
}