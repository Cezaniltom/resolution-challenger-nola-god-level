"use client";

import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
} from "recharts";
import { formatCurrencyBRL } from "@/lib/utils";

const COLORS = [ 
  "#0d47a1", "#1976d2", "#2196f3", "#64b5f6", "#bbdefb", 
  "#01579b", "#0288d1", "#03a9f4", "#4fc3f7", "#b3e5fc" 
];

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

export default function SimplePieChart({ data }) {
  
  const chartData = data.map((item) => ({
    name: item.loja_nome || "N/A",
    value: parseFloat(item.faturamento_total),
  }));

  return (
    <div className="flex w-full justify-center" style={{ height: '300px' }}>
      <PieChart width={300} height={300}> 
        <Tooltip content={<CustomTooltip />} />
        <Pie
          data={chartData}
          cx="50%"
          cy="45%"
          innerRadius={60}
          outerRadius={90}
          fill="#8884d8"
          dataKey="value"
          labelLine={false}
          paddingAngle={5}
        >
          {chartData.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        
        <Legend 
          verticalAlign="bottom"
          layout="horizontal"   
          align="center"        
          iconType="circle"
          wrapperStyle={{
            fontSize: '12px',
            width: '100%',
            overflowX: 'auto', 
            whiteSpace: 'nowrap',
            bottom: 0,
          }}
        />
      </PieChart>
    </div>
  );
}