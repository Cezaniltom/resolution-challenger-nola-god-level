// src/components/charts/SimplePieChart.jsx
"use client";

import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
} from "recharts";
import { formatCurrencyBRL } from "@/lib/utils";

const COLORS = [ "#0d47a1", "#1976d2", "#2196f3", "#64b5f6", "#bbdefb" ];

export default function SimplePieChart({ data }) {
  
  // --- REVERTIDO PARA 'loja_nome' ---
  const chartData = data.map((item) => ({
    name: item.loja_nome || "N/A",
    value: parseFloat(item.faturamento_total),
  }));

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const { name, value } = payload[0];
      return (
        <div className="rounded-lg border border-gray-300 bg-white p-2 shadow-md">
          <p className="font-semibold text-gray-800">{name}</p>
          <p className="text-blue-700">{formatCurrencyBRL(value)}</p>
        </div>
      );
    }
    return null;
  };

  return (
    // Altura fixa para garantir que renderize
    <ResponsiveContainer width="100%" height={300}>
      <PieChart>
        <Tooltip content={<CustomTooltip />} />
        <Pie
          data={chartData}
          cx="50%"
          cy="50%"
          innerRadius={60}
          outerRadius={90}
          fill="#8884d8"
          dataKey="value"
          labelLine={false}
          // Removemos os 'labels' (percentuais) para evitar o bug visual
          paddingAngle={5}
        >
          {chartData.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        {/* A legenda foi removida para evitar o bug de overflow */}
      </PieChart>
    </ResponsiveContainer>
  );
}