"use client";

import { useState, useEffect } from "react"; 
import Header from "@/components/layout/Header";
import SimpleBarChart from "@/components/charts/SimpleBarChart";
import { analyticsApi } from "@/lib/api"; 

export default function ExplorerPage() {
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      setIsLoading(true);
      const chartData = await analyticsApi.getFaturamentoPorCanal(); 

      if (chartData && chartData.length > 0) {
        const formattedData = chartData.map(item => ({
          ...item,
          canal_nome: item.canal_nome, 
          faturamento_total: parseFloat(item.faturamento_total) 
        }));
        
        setData(formattedData);

      } else {
        setData([]); 
      }
      setIsLoading(false);
    }

    fetchData();
  }, []); 

  return (
    <>
      <Header title="Explorar Dados" />

      <div className="p-6">
        <div className="rounded-xl border border-gray-200 bg-white p-8 shadow-sm">
          <h3 className="mb-6 text-2xl font-bold text-gray-800">
            Faturamento por Canal
          </h3>
          
          {data.length > 0 ? (
            <SimpleBarChart
              data={data}
              xAxisKey="canal_nome"
              barKey="faturamento_total"
              
              barColor="#4ADE80"
            />
          ) : (
            <p className="text-center text-gray-500 h-[400px] flex items-center justify-center">
              {isLoading ? 'Carregando gráfico...' : 'Nenhum dado encontrado.'}
            </p>
          )}
        </div>
      </div>
    </>
  );
}