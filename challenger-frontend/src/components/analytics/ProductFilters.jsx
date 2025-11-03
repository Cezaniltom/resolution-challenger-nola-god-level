"use client";

import { useState, useEffect } from 'react';

const canaisDisponiveis = [
  "Presencial", "iFood", "Rappi", "Uber Eats", "WhatsApp", "App Próprio"
];

const diasDaSemana = [
  { label: 'Segunda-feira', value: 1 },
  { label: 'Terça-feira', value: 2 },
  { label: 'Quarta-feira', value: 3 },
  { label: 'Quinta-feira', value: 4 },
  { label: 'Sexta-feira', value: 5 },
  { label: 'Sábado', value: 6 },
  { label: 'Domingo', value: 7 },
];

/**
 * @param {function} onFilterChange - Função que será chamada com os filtros.
 */
export default function ProductFilters({ onFilterChange }) {
  const [canal, setCanal] = useState('');
  const [diaSemana, setDiaSemana] = useState('');
  const [dataInicio, setDataInicio] = useState('');
  const [dataFim, setDataFim] = useState('');

  useEffect(() => {
    const filters = {};

    if (canal) filters.channel = canal;
    if (diaSemana) filters.dayOfWeek = diaSemana;
    if (dataInicio) filters.startDate = dataInicio;
    if (dataFim) filters.endDate = dataFim;

    onFilterChange(filters);
    
  }, [canal, diaSemana, dataInicio, dataFim, onFilterChange]);

  const clearFilters = () => {
    setCanal('');
    setDiaSemana('');
    setDataInicio('');
    setDataFim('');
  };

  return (
    <div className="mb-6 rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-5">
        <div className="lg:col-span-1">
          <label htmlFor="canal-filter" className="block text-sm font-medium text-gray-700">
            Canal
          </label>
          <select
            id="canal-filter"
            value={canal}
            onChange={(e) => setCanal(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 py-2 pl-3 pr-10 text-base focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
          >
            <option value="">Todos</option>
            {canaisDisponiveis.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>

        <div className="lg:col-span-1">
          <label htmlFor="dia-filter" className="block text-sm font-medium text-gray-700">
            Dia da Semana
          </label>
          <select
            id="dia-filter"
            value={diaSemana}
            onChange={(e) => setDiaSemana(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 py-2 pl-3 pr-10 text-base focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
          >
            <option value="">Todos</option>
            {diasDaSemana.map((dia) => (
              <option key={dia.value} value={dia.value}>{dia.label}</option>
            ))}
          </select>
        </div>

        <div className="lg:col-span-1">
          <label htmlFor="start-date" className="block text-sm font-medium text-gray-700">
            Data Início
          </label>
          <input
            type="date"
            id="start-date"
            value={dataInicio}
            onChange={(e) => setDataInicio(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 py-2 px-3 text-base focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
          />
        </div>

        <div className="lg:col-span-1">
          <label htmlFor="end-date" className="block text-sm font-medium text-gray-700">
            Data Fim
          </label>
          <input
            type="date"
            id="end-date"
            value={dataFim}
            onChange={(e) => setDataFim(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 py-2 px-3 text-base focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
          />
        </div>
        
        <div className="lg:col-span-1 flex items-end">
          <button
            onClick={clearFilters}
            className="mt-1 w-full rounded-md border border-gray-300 bg-white py-2 px-4 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
          >
            Limpar
          </button>
        </div>
        
      </div>
    </div>
  );
}