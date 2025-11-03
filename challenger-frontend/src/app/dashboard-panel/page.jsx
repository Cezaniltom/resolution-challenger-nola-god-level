"use client";

import { useState, useEffect, Fragment } from "react";
import Header from "@/components/layout/Header";
import StatCard from "@/components/ui/StatCard";
import SimpleBarChart from "@/components/charts/SimpleBarChart";
import SimplePieChart from "@/components/charts/SimplePieChart";
import SimpleLineChart from "@/components/charts/SimpleLineChart";
import { analyticsApi } from "@/lib/api";
import { Sparkles } from "lucide-react"; 
import AiAnalysisModal from "@/components/analytics/AiAnalysisModal";

// Componente genérico de Card
const DashboardCard = ({ title, children, className = "" }) => (
  <div className={`rounded-xl border border-gray-200 bg-white shadow-sm ${className}`}>
    <div className="p-4 sm:p-6">
      <h3 className="text-xl font-bold text-gray-800">{title}</h3>
    </div>
    <div className="border-t border-gray-200 p-4 sm:p-6">{children}</div>
  </div>
);

// Esqueleto de Card
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

// Helper para limpar o nome do produto
function formatProductName(value) {
  if (typeof value === 'string' && value.includes(' #')) {
    return value.split(' #')[0];
  }
  return value;
}

// Componente da Lista de Top Produtos
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
  const [lojaData, setLojaData] = useState([]);
  const [topProducts, setTopProducts] = useState([]);
  const [deliveryData, setDeliveryData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  
  const [isAiModalOpen, setIsAiModalOpen] = useState(false);
  
  useEffect(() => {
    async function fetchDashboardData() {
      setIsLoading(true);
      
      const [
        overviewRes, canalRes, lojaRes, productsRes, deliveryRes
      ] = await Promise.all([
        analyticsApi.getOverview(),
        analyticsApi.getFaturamentoPorCanal(),
        analyticsApi.getFaturamentoPorLoja({ limit: 10 }), 
        analyticsApi.getTopProductsFiltrado({ limit: 5 }), 
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

  // Agrupar os dados para enviar para a IA
  const dashboardData = {
    overview,
    canalData,
    lojaData,
    topProducts,
    deliveryData
  };

  // Criar o componente do botão de Ação
  const aiButton = (
    <button
      onClick={() => setIsAiModalOpen(true)}
      disabled={isLoading} 
      className="flex items-center gap-2 rounded-md bg-blue-700 py-2 px-4 text-sm font-medium text-white shadow-sm transition-all hover:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50"
    >
      <Sparkles size={16} />
      Análise Rápida (IA)
    </button>
  );

  return (
    <>
      <Header title="Visão Geral" actionComponent={aiButton} />

      <div className="p-6">
        {isLoading ? (
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-3 lg:items-start">
            <div className="h-32 w-full rounded-xl bg-white shadow-sm animate-pulse"></div>
            <div className="h-32 w-full rounded-xl bg-white shadow-sm animate-pulse"></div>
            <div className="h-32 w-full rounded-xl bg-white shadow-sm animate-pulse"></div>
            <div className="lg:col-span-2"><CardSkeleton /></div>
            <div className="lg:col-span-1"><CardSkeleton /></div>
            <div className="lg:col-span-1"><CardSkeleton /></div>
            <div className="lg:col-span-2"><CardSkeleton /></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-3 lg:items-start">
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

            <div className="lg:col-span-2">
              <DashboardCard title="Faturamento por Canal">
                <SimpleBarChart data={canalData} xAxisKey="canal_nome" barKey="faturamento_total" barColor="#1976d2" />
              </DashboardCard>
            </div>
            
            <div className="lg:col-span-1">
              <DashboardCard title="Faturamento por Loja (Top 10)">
                <SimplePieChart data={lojaData} />
              </DashboardCard>
            </div>

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
      
      <AiAnalysisModal
        open={isAiModalOpen}
        setOpen={setIsAiModalOpen}
        dashboardData={dashboardData}
        page="overview" 
      />
    </>
  );
}