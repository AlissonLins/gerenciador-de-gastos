"use client";
import React, { useState } from 'react';
import { useFinance } from '../components/FinanceContent';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale/pt-BR';

export default function Relatorios() {
  const { lancamentos, categorias, getGastosPorCategoria } = useFinance();
  const [activeTab, setActiveTab] = useState('categorias');
  const [currentMonth, setCurrentMonth] = useState(format(new Date(), 'yyyy-MM'));

  // Função para mudar o mês
  const handleMonthChange = (direction: number) => {
    // Lógica para avançar ou retroceder o mês
    const newMonth = new Date(currentMonth);
    newMonth.setMonth(newMonth.getMonth() + direction);
    setCurrentMonth(format(newMonth, 'yyyy-MM'));
  };

  // Função para renderizar o conteúdo com base na aba ativa
  const renderContent = () => {
    switch (activeTab) {
      case 'categorias':
        return (
          <div className="space-y-4">
            {categorias.map(cat => {
              const gastos = getGastosPorCategoria(cat.name, currentMonth);
              return (
                <div key={cat.id} className="p-4 bg-gray-50 rounded-lg shadow-sm">
                  <h3 className="font-semibold">{cat.name}</h3>
                  <div className="flex justify-between items-center">
                    <p className='text-sm md:text-base'>
                      Gasto: {gastos.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                    </p>
                    <p className={`font-bold text-sm md:text-base ${gastos > cat.limit ? 'text-red-600' : 'text-green-600'}`}>
                      Limite: {cat.limit.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        );
      case 'entradas-saidas':
        return <div>Conteúdo para Entradas x Saídas</div>;
      case 'contas':
        return <div>Conteúdo para Contas</div>;
      case 'tags':
        return <div>Conteúdo para Tags</div>;
      default:
        return null;
    }
  };

  return (
    <div className="bg-white shadow-lg rounded-lg p-5 w-full md:w-96 mx-auto mt-6 md:mt-12">
      <div className="flex flex-col md:flex-row justify-between items-center mb-6">
        <h1 className="text-2xl font-bold mb-4 md:mb-0">Relatórios</h1>
        <div className="flex justify-center items-center  space-x-2">
          <button onClick={() => handleMonthChange(-1)} className="text-gray-600 hover:text-gray-800">
            &lt;
          </button>
          <span className="font-semibold text-base  md:text-lg ">
            {format(new Date(currentMonth), 'MMMM yyyy', { locale: ptBR })}
          </span>
          <button onClick={() => handleMonthChange(1)} className="text-gray-600 hover:text-gray-800">
            &gt;
          </button>
        </div>
      </div>

      <div className="border-b border-gray-200 mb-6 flex flex-wrap  md:space-x-4">
        <button
          onClick={() => setActiveTab('categorias')}
          className={`pb-2 px-2 md:px-0 ${activeTab === 'categorias' ? 'border-b-2 border-green-500 font-semibold text-green-500' : 'text-gray-500 hover:text-gray-700'}`}
        >
          Categorias
        </button>
        <button
          onClick={() => setActiveTab('entradas-saidas')}
          className={`pb-2 px-2 md:px-0 ${activeTab === 'entradas-saidas' ? 'border-b-2 border-green-500 font-semibold text-green-500' : 'text-gray-500 hover:text-gray-700'}`}
        >
          Entradas x Saídas
        </button>
        <button
          onClick={() => setActiveTab('contas')}
          className={`pb-2 px-2 md:px-0 ${activeTab === 'contas' ? 'border-b-2 border-green-500 font-semibold text-green-500' : 'text-gray-500 hover:text-gray-700'}`}
        >
          Contas
        </button>
        <button
          onClick={() => setActiveTab('tags')}
          className={`pb-2 px-2 md:px-0 ${activeTab === 'tags' ? 'border-b-2 border-green-500 font-semibold text-green-500' : 'text-gray-500 hover:text-gray-700'}`}
        >
          Tags
        </button>
      </div>

      {renderContent()}

      {/* Mensagem de nenhum lançamento */}
      {lancamentos.length === 0 && (
        <div className="text-center text-gray-600 mt-6">
          <p>Nenhum lançamento no período</p>
        </div>
      )}
    </div>
  );
}