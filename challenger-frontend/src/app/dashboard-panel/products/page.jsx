// src/app/dashboard-panel/products/page.jsx
"use client"; 

import { useState, useEffect, Fragment } from "react"; 
import Header from "@/components/layout/Header";
import Table from "@/components/ui/Table";
import { analyticsApi } from "@/lib/api";
import { ListFilter, CalendarDays, Calendar, X, Loader2 } from 'lucide-react';
import { Transition } from '@headlessui/react'; 

// --- Constantes para os Dropdowns ---
const canaisDisponiveis = [ "Presencial", "iFood", "Rappi", "Uber Eats", "WhatsApp", "App Próprio" ];
const diasDaSemana = [
  { label: 'Segunda', value: 1 }, { label: 'Terça', value: 2 },
  { label: 'Quarta', value: 3 }, { label: 'Quinta', value: 4 },
  { label: 'Sexta', value: 5 }, { label: 'Sábado', value: 6 },
  { label: 'Domingo', value: 7 },
];

// (Função formatProductName como antes)
function formatProductName(value) {
  if (typeof value === 'string' && value.includes(' #')) {
    return value.split(' #')[0];
  }
  return value;
}

// --- 👇 1. FUNÇÃO HELPER PARA O DELAY 👇 ---
/**
 * Cria uma pausa (delay) em milissegundos.
 */
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

export default function ProductsPage() {
  // --- Estados dos Filtros ---
  const [canal, setCanal] = useState('');
  const [diaSemana, setDiaSemana] = useState('');
  const [dataInicio, setDataInicio] = useState('');
  const [dataFim, setDataFim] = useState('');
  const [tipoDataInicio, setTipoDataInicio] = useState('text');
  const [tipoDataFim, setTipoDataFim] = useState('text');
  
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // --- 👇 2. useEffect ATUALIZADO COM DELAY MÍNIMO 👇 ---
  useEffect(() => {
    async function fetchData() {
      setIsLoading(true); 
      const filters = {};
      if (canal) filters.channel = canal;
      if (diaSemana) filters.dayOfWeek = diaSemana;
      if (dataInicio) filters.startDate = dataInicio;
      if (dataFim) filters.endDate = dataFim;
      
      // Inicia a chamada da API E o timer do delay mínimo ao mesmo tempo
      const apiCallPromise = analyticsApi.getTopProductsFiltrado(filters);
      const minDelayPromise = sleep(500); // 500ms = 0.5 segundos de delay MÍNIMO
      
      // Espera os DOIS terminarem
      const [productData] = await Promise.all([
        apiCallPromise,
        minDelayPromise
      ]);
      
      setData(productData || []); 
      setIsLoading(false); 
    }
    fetchData();
  }, [canal, diaSemana, dataInicio, dataFim]); 

  // --- Definições da Tabela (como antes) ---
  const headers = ["Produto", "Total Vendido (Qtd)"];
  const keys = ["produto_nome", "total_vendido"]; 
  const formatters = {
    produto_nome: (value) => formatProductName(value)
  };

  const clearFilters = () => {
    setCanal('');
    setDiaSemana('');
    setDataInicio('');
    setDataFim('');
  };

  return (
    <>
      <Header title="Produtos" />

      <div className="p-6">
        {/* O CARD BRANCO PRINCIPAL */}
        <div className="rounded-xl border border-gray-200 bg-white shadow-sm">
          
          {/* CABEÇALHO DO CARD (Título) */}
          <div className="p-4 sm:p-6">
            <h2 className="text-xl font-bold text-gray-800">Produtos Mais Vendidos</h2>
            <p className="text-sm text-gray-500">Filtre produtos por canal, dia e período.</p>
          </div>
          
          {/* O PAINEL DE FILTROS (como antes) */}
          <div className="border-t border-gray-200 p-4 sm:p-6">
             <div className="grid grid-cols-1 items-end gap-x-4 gap-y-5 md:grid-cols-2 lg:grid-cols-5">
              
              {/* Filtro de Canal (com classes completas) */}
              <div className="lg:col-span-1">
                <label htmlFor="canal-filter" className="block text-sm font-medium text-gray-700">Canal</label>
                <div className="relative mt-1">
                  <ListFilter size={16} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <select
                    id="canal-filter"
                    value={canal}
                    onChange={(e) => setCanal(e.target.value)}
                    className="block w-full rounded-md border-gray-300 py-2 pl-10 pr-10 text-base transition-all duration-150 focus:border-blue-500 focus:outline-none focus:ring-blue-500 sm:text-sm"
                  >
                    <option value="">Todos os Canais</option>
                    {canaisDisponiveis.map((c) => (<option key={c} value={c}>{c}</option>))}
                  </select>
                </div>
              </div>

              {/* Filtro de Dia da Semana (com classes completas) */}
              <div className="lg:col-span-1">
                <label htmlFor="dia-filter" className="block text-sm font-medium text-gray-700">Dia da Semana</label>
                <div className="relative mt-1">
                  <CalendarDays size={16} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <select
                    id="dia-filter"
                    value={diaSemana}
                    onChange={(e) => setDiaSemana(e.target.value)}
                    className="block w-full rounded-md border-gray-300 py-2 pl-10 pr-10 text-base transition-all duration-150 focus:border-blue-500 focus:outline-none focus:ring-blue-500 sm:text-sm"
                  >
                    <option value="">Todos os Dias</option>
                    {diasDaSemana.map((dia) => (<option key={dia.value} value={dia.value}>{dia.label}</option>))}
                  </select>
                </div>
              </div>

              {/* Filtro de Data Início (com classes completas) */}
              <div className="lg:col-span-1">
                <label htmlFor="start-date" className="block text-sm font-medium text-gray-700">Data Início</label>
                <div className="relative mt-1">
                  <Calendar size={16} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type={tipoDataInicio}
                    id="start-date"
                    placeholder="dd/mm/aaaa"
                    value={dataInicio}
                    onChange={(e) => setDataInicio(e.target.value)}
                    onFocus={() => setTipoDataInicio('date')}
                    onBlur={() => !dataInicio && setTipoDataInicio('text')}
                    className="block w-full rounded-md border-gray-300 py-2 pl-10 pr-3 text-base transition-all duration-150 focus:border-blue-500 focus:outline-none focus:ring-blue-500 sm:text-sm"
                  />
                </div>
              </div>

              {/* Filtro de Data Fim (com classes completas) */}
              <div className="lg:col-span-1">
                <label htmlFor="end-date" className="block text-sm font-medium text-gray-700">Data Fim</label>
                <div className="relative mt-1">
                  <Calendar size={16} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type={tipoDataFim}
                    id="end-date"
                    placeholder="dd/mm/aaaa"
                    value={dataFim}
                    onChange={(e) => setDataFim(e.target.value)}
                    onFocus={() => setTipoDataFim('date')}
                    onBlur={() => !dataFim && setTipoDataFim('text')}
                    className="block w-full rounded-md border-gray-300 py-2 pl-10 pr-3 text-base transition-all duration-150 focus:border-blue-500 focus:outline-none focus:ring-blue-500 sm:text-sm"
                  />
                </div>
              </div>
              
              {/* Botão de Limpar Filtros (com classes completas) */}
              <div className="lg:col-span-1 flex items-end">
                <button
                  onClick={clearFilters}
                  className="mt-1 flex w-full items-center justify-center gap-2 rounded-md border border-blue-200 bg-blue-50 py-2 px-4 text-sm font-medium text-blue-700 shadow-sm transition-all duration-150 hover:bg-blue-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                >
                  <X size={16} />
                  Limpar
                </button>
              </div>
            </div>
          </div>
          
          {/* A TABELA (com transição de carregamento) */}
          <div className="relative border-t border-gray-200">
            {/* Overlay de Loading */}
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
            
            {/* O conteúdo da tabela */}
            <div className={`transition-opacity duration-300 ${isLoading ? 'opacity-50' : 'opacity-100'}`}>
              {data.length > 0 ? (
                <Table
                  headers={headers}
                  data={data}
                  keys={keys}
                  formatters={formatters}
                />
              ) : (
                // Mostra esta mensagem apenas se NÃO estiver carregando E não houver dados
                !isLoading && (
                  <p className="py-20 text-center text-gray-500">
                    Nenhum produto encontrado para os filtros selecionados.
                  </p>
                )
              )}
              
              {/* Se estiver carregando mas AINDA não houver dados (primeiro load) */}
              {isLoading && data.length === 0 && (
                <p className="py-20 text-center text-gray-500">
                  Carregando...
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}