"use client"; 

import { useState, useEffect, Fragment } from "react";
import Header from "@/components/layout/Header";
import Table from "@/components/ui/Table";
import PaginationControls from "@/components/ui/PaginationControls";
import { analyticsApi } from "@/lib/api";
import { BarChart2, CalendarOff, X, Loader2, Sparkles } from 'lucide-react';
import { Transition } from '@headlessui/react'; 
import AiAnalysisModal from "@/components/analytics/AiAnalysisModal";

// Constantes para os Dropdowns
const frequenciaOptions = [ { label: '3+ vezes', value: 3 }, { label: '5+ vezes', value: 5 }, { label: '10+ vezes', value: 10 }, { label: '20+ vezes', value: 20 }, { label: '30+ vezes', value: 30 }, { label: '40+ vezes', value: 40 } ];
const recenciaOptions = [ { label: 'Últimos 30 dias', value: 30 }, { label: 'Últimos 60 dias', value: 60 }, { label: 'Últimos 90 dias', value: 90 } ];

// Função Helper de Data
function formatDate(dateString) {
  if (!dateString) return 'N/A';
  try {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR', {
      day: '2-digit', month: '2-digit', year: 'numeric', timeZone: 'UTC'
    });
  } catch {
    return dateString; 
  }
}

// Função Helper de Delay
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

export default function CustomersPage() {
  // Estados dos Filtros, Paginação, etc.
  const [frequencia, setFrequencia] = useState(3); 
  const [recencia, setRecencia] = useState(30); 
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [sortConfig, setSortConfig] = useState({ key: 'ultima_compra_data', direction: 'asc' });
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Estado para o modal de IA
  const [isAiModalOpen, setIsAiModalOpen] = useState(false);

  // Efeito que busca os dados
  useEffect(() => {
    async function fetchData() {
      setIsLoading(true); 
      const filters = { 
        frequency: frequencia, 
        recencyDays: recencia,
        page: page,
        limit: 10,
        sortKey: sortConfig.key,
        sortDirection: sortConfig.direction
      };
      
      const apiCallPromise = analyticsApi.getCustomersChurnRisk(filters);
      const minDelayPromise = sleep(500); 
      
      const [apiResponse] = await Promise.all([
        apiCallPromise,
        minDelayPromise
      ]);
      
      if (apiResponse) {
        setData(apiResponse.customers || []); 
        setTotalPages(apiResponse.totalPages || 1);
      } else {
        setData([]);
        setTotalPages(1);
      }
      setIsLoading(false); 
    }
    fetchData();
  }, [frequencia, recencia, page, sortConfig]); 

  // Definições da Tabela
  const headers = ["Cliente", "Frequência (Pedidos)", "Última Compra"];
  const keys = ["customer_name", "frequencia", "ultima_compra_data"]; 
  const formatters = {
    ultima_compra_data: (value) => formatDate(value)
  };

  const clearFilters = () => {
    setFrequencia(3);
    setRecencia(30);
    setPage(1); 
    setSortConfig({ key: 'ultima_compra_data', direction: 'asc' }); 
  };

  const handleSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
    setPage(1); 
  };

  // Botão da IA
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
      <Header title="Clientes" actionComponent={aiButton} />

      <div className="p-6">
        <div className="rounded-xl border border-gray-200 bg-white shadow-sm">
          <div className="p-4 sm:p-6">
            <h2 className="text-xl font-bold text-gray-800">Clientes em Risco de Churn</h2>
            <p className="text-sm text-gray-500">
              Veja clientes que compraram mais de 3 vezes e não voltam há vários dias.
            </p>
          </div>

          <div className="border-t border-gray-200 p-4 sm:p-6">
            <div className="grid grid-cols-1 items-end gap-x-4 gap-y-5 md:grid-cols-2 lg:grid-cols-3">
              <div className="lg:col-span-1">
                <label htmlFor="frequencia-filter" className="block text-sm font-medium text-gray-700">Compraram no mínimo</label>
                <div className="relative mt-1">
                  <BarChart2 size={16} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <select
                    id="frequencia-filter"
                    value={frequencia}
                    onChange={(e) => { setFrequencia(e.target.value); setPage(1); }}
                    className="block w-full rounded-md border-gray-300 py-2 pl-10 pr-10 text-base transition-all duration-150 focus:border-blue-500 focus:outline-none focus:ring-blue-500 sm:text-sm"
                  >
                    {frequenciaOptions.map((opt) => (<option key={opt.value} value={opt.value}>{opt.label}</option>))}
                  </select>
                </div>
              </div>

              <div className="lg:col-span-1">
                <label htmlFor="recencia-filter" className="block text-sm font-medium text-gray-700">Sem comprar há</label>
                <div className="relative mt-1">
                  <CalendarOff size={16} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <select
                    id="recencia-filter"
                    value={recencia}
                    onChange={(e) => { setRecencia(e.target.value); setPage(1); }}
                    className="block w-full rounded-md border-gray-300 py-2 pl-10 pr-10 text-base transition-all duration-150 focus:border-blue-500 focus:outline-none focus:ring-blue-500 sm:text-sm"
                  >
                    {recenciaOptions.map((opt) => (<option key={opt.value} value={opt.value}>{opt.label}</option>))}
                  </select>
                </div>
              </div>

              <div className="lg:col-span-1 flex items-end">
                <button
                  onClick={clearFilters}
                  className="mt-1 flex w-full items-center justify-center gap-2 rounded-md border border-blue-200 bg-blue-50 py-2 px-4 text-sm font-medium text-blue-700 shadow-sm transition-all duration-150 hover:bg-blue-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                >
                  <X size={16} />
                  Resetar
                </button>
              </div>
            </div>
          </div>

          <div className="relative border-t border-gray-200">
            <Transition
              show={isLoading}
              as={Fragment}
              enter="transition-opacity duration-200"
              enterFrom="opacity-0"
              enterTo="opacity-100"
              leave="transition-opacity duration-300"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <div className="absolute inset-0 z-10 flex items-center justify-center bg-white/70 backdrop-blur-sm">
                <Loader2 size={32} className="animate-spin text-blue-700" />
                <span className="sr-only">Carregando...</span>
              </div>
            </Transition>

            <div className={`transition-opacity duration-300 ${isLoading ? 'opacity-50' : 'opacity-100'}`}>
              {data.length > 0 ? (
                <Table
                  headers={headers}
                  data={data}
                  keys={keys}
                  formatters={formatters}
                  onSort={handleSort} 
                  sortConfig={sortConfig} 
                />
              ) : (
                !isLoading && (
                  <p className="py-20 text-center text-gray-500">
                    Nenhum cliente encontrado para estes filtros.
                  </p>
                )
              )}
              {isLoading && data.length === 0 && (
                <p className="py-20 text-center text-gray-500">
                  Carregando...
                </p>
              )}
            </div>

            <PaginationControls
              currentPage={page}
              totalPages={totalPages}
              onPageChange={setPage}
            />
          </div>
        </div>
      </div>

      <AiAnalysisModal
        open={isAiModalOpen}
        setOpen={setIsAiModalOpen}
        dashboardData={data} 
        page="customers"
      />
    </>
  );
}