// src/app/dashboard-panel/page.jsx
"use client";

import { useState, useEffect, Fragment } from "react";
import Header from "@/components/layout/Header";
import StatCard from "@/components/ui/StatCard";
import SimpleBarChart from "@/components/charts/SimpleBarChart";
import SimplePieChart from "@/components/charts/SimplePieChart";
import SimpleLineChart from "@/components/charts/SimpleLineChart";
import { analyticsApi } from "@/lib/api";
import { Loader2 } from "lucide-react";
import { Transition } from '@headlessui/react';

// Card Genérico (Versão simples, sem flex)
const DashboardCard = ({ title, children, className = "" }) => (
  <div className={`rounded-xl border border-gray-200 bg-white shadow-sm ${className}`}>
    <div className="p-4 sm:p-6">
      <h3 className="text-xl font-bold text-gray-800">{title}</h3>
    </div>
    <div className="border-t border-gray-200 p-4 sm:p-6">{children}</div>
  </div>
);

// Esqueleto de Card (Versão simples, sem flex)
const CardSkeleton = () => (
  <div className="rounded-xl border border-gray-200 bg-white shadow-sm animate-pulse">
    <div className="p-4 sm:p-6">
      <div className="h-6 w-3/5 rounded-md bg-gray-200"></div>
    </div>
    <div className="border-t border-gray-200 p-4 sm:p-6">
      <div className="h-48 w-full rounded-md bg-gray-200"></div>
    </div>
  </div>
);

// --- REVERTIDO: Este é o TopProductsList (antigo LojaList) ---
function formatProductName(value) {
  if (typeof value === 'string' && value.includes(' #')) {
    return value.split(' #')[0];
  }
  return value;
}

const TopProductsList = ({ data }) => (
  <div className="flow-root">
    <ul role="list" className="divide-y divide-gray-200">
      {data.map((item) => (
        <li key={item.produto_nome} className="py-3 sm:py-4">
          <div className="flex items-center space-x-4">
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium text-gray-900">
                {formatProductName(item.produto_nome)}
              </p>
            </div>
            <div className="inline-flex items-center text-base font-semibold text-gray-900">
              {item.total_vendido} vendidos
            </div>
          </div>
        </li>
      ))}
    </ul>
  </div>
);


export default function VisaoGeralPage() {
  const [overview, setOverview] = useState(null);
  const [canalData, setCanalData] = useState([]);
  const [lojaData, setLojaData] = useState([]); // Para o Gráfico de Pizza
  const [topProducts, setTopProducts] = useState([]); // Para a Lista
  const [deliveryData, setDeliveryData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    async function fetchDashboardData() {
      setIsLoading(true);
      
      const [
        overviewRes,
        canalRes,
        lojaRes,     // <-- Gráfico de Pizza
        productsRes, // <-- Lista
        deliveryRes
      ] = await Promise.all([
        analyticsApi.getOverview(),
        analyticsApi.getFaturamentoPorCanal(),
        analyticsApi.getFaturamentoPorLoja({ limit: 10 }), // <-- Top 10 Lojas (para o gráfico)
        analyticsApi.getTopProductsFiltrado({ limit: 5 }), // <-- Top 5 Produtos (para a lista)
        analyticsApi.getDeliveryPerformance({ groupBy: 'hour' })
      ]);

      setOverview(overviewRes);
      setCanalData(canalRes || []);
      setLojaData(lojaRes || []);
      setTopProducts(productsRes || []);
      setDeliveryData(deliveryRes || []);
      
      setIsLoading(false);
    }
    fetchDashboardData();
  }, []);

  return (
    <>
      <Header title="Visão Geral" />

      <div className="p-6">
        {isLoading ? (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
             {/* ... (Esqueletos) ... */}
          </div>
        ) : (
          // --- CORREÇÃO: Adicionado 'lg:items-start' para corrigir o layout "esmagado" ---
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-3 lg:items-start">
            
            {/* Linha 1: KPIs (StatCards) */}
            <div className="lg:col-span-1">
              <StatCard
                title="Faturamento Total"
                value={overview.faturamento_total}
                format="currency"
              />
            </div>
            <div className="lg:col-span-1">
              <StatCard 
                title="Total de Pedidos" 
                value={overview.total_pedidos}
              />
            </div>
            <div className="lg:col-span-1">
              <StatCard
                title="Ticket Médio"
                value={overview.ticket_medio}
                format="currency"
              />
            </div>


            {/* Linha 2: Gráficos Principais */}
            <div className="lg:col-span-2">
              <DashboardCard title="Faturamento por Canal">
                <SimpleBarChart data={canalData} xAxisKey="canal_nome" barKey="faturamento_total" barColor="#1976d2" />
              </DashboardCard>
            </div>
            
            {/* --- REVERTIDO: Faturamento por Loja (GRÁFICO) --- */}
            <div className="lg:col-span-1">
              <DashboardCard title="Faturamento por Loja (Top 10)">
                <SimplePieChart data={lojaData} />
              </DashboardCard>
            </div>

            {/* --- REVERTIDO: Top 5 Produtos (LISTA) --- */}
            <div className="lg:col-span-1">
               <DashboardCard title="Top 5 Produtos">
                <TopProductsList data={topProducts} />
              </DashboardCard>
            </div>

            <div className="lg:col-span-2">
              <DashboardCard title="Tempo Médio de Entrega (por Hora)">
                <SimpleLineChart data={deliveryData} />
              </DashboardCard>
            </div>

          </div>
        )}
      </div>
      
      {/* O Modal foi removido */}
    </>
  );
}