// src/app/dashboard-panel/page.jsx
import Header from "@/components/layout/Header";
import StatCard from "@/components/ui/StatCard";
import { analyticsApi } from "@/lib/api";

function StatCardSkeleton() {
  return (
    <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm animate-pulse">
      <div className="h-4 bg-gray-200 rounded w-1/3 mb-3"></div>
      <div className="h-8 bg-gray-300 rounded w-1/2"></div>
    </div>
  );
}

export default async function VisaoGeralPage() {
  
  const overviewData = await analyticsApi.getOverview();
  
  console.log("DADOS RECEBIDOS (OVERVIEW):", overviewData);

  if (!overviewData) {
    return (
      <>
        <Header title="Visão Geral" />
        <div className="p-6">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            <StatCardSkeleton />
            <StatCardSkeleton />
            <StatCardSkeleton />
          </div>
          <p className="mt-6 text-center text-gray-500">
            Não foi possível carregar os dados. Verifique a conexão com a API.
          </p>
        </div>
      </>
    );
  }

  return (
    <>
      <Header title="Visão Geral" />
      <div className="p-6">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          <StatCard
            title="Faturamento Total"
            value={overviewData.faturamento_total}
            format="currency"
          />
          <StatCard 
            title="Total de Pedidos" 
            value={overviewData.total_pedidos}
          />
          <StatCard
            title="Ticket Médio"
            value={overviewData.ticket_medio}
            format="currency"
          />
        </div>
      </div>
    </>
  );
}