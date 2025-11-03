// src/components/charts/SimpleLineChart.jsx
"use client";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";

export default function SimpleLineChart({ data }) {
  // Formata os dados
  const chartData = data.map((item) => ({
    name: `${item.grupo}h`, // ex: 18 -> "18h"
    "Tempo (min)": parseFloat(item.tempo_medio_segundos / 60).toFixed(1), // Segundos para Minutos
  }));

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="rounded-lg border border-gray-300 bg-white p-2 shadow-md">
          <p className="font-semibold text-gray-800">{label}</p>
          <p className="text-blue-700">
            {`Tempo Médio: ${payload[0].value} min`}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart data={chartData} margin={{ top: 5, right: 20, left: -20, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
        <XAxis 
          dataKey="name" 
          tickLine={false} 
          axisLine={false} 
          className="text-xs text-gray-600"
        />
        <YAxis 
          tickLine={false} 
          axisLine={false} 
          className="text-xs text-gray-600"
          tickFormatter={(value) => `${value} min`}
        />
        <Tooltip content={<CustomTooltip />} />
        <Line
          type="monotone"
          dataKey="Tempo (min)"
          stroke="#1976d2" // Tom de azul
          strokeWidth={3}
          dot={{ r: 4 }}
          activeDot={{ r: 6 }}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}