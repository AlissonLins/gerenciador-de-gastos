"use client";
import { useFinance } from "./FinanceContent"; // Importa os dados do contexto
import { useState } from "react";
import { format, isThisMonth } from "date-fns";
import { ptBR } from "date-fns/locale";

export default function Home() {
  const {
    totalReceitas,
    totalDespesas,
    lancamentos,
    categorias,
    getGastosPorCategoria,
  } = useFinance();

  // Filtra as despesas do mês atual e ordena por valor
  const maioresGastos = lancamentos
    .filter((lancamento) => lancamento.tipo === "despesa" && isThisMonth(lancamento.data))
    .sort((a, b) => b.valor - a.valor)
    .slice(0, 5); 


  return (
    <section className="bg-white shadow-lg rounded-lg p-5 w-full max-w-5xl mx-auto mt-6 md:mt-12 grid grid-cols-1 md:grid-cols-2 gap-4">
      <div className="md:col-span-2 p-4  rounded-lg">
        <div className="flex-1 pr-4 mb-4 md:mb-0">
          <div className="flex flex-col md:flex-row items-center justify-center">
            {/* RECEITA MENSAL */}
            <div className="flex-1 p-2 rounded-lg text-center">
              <h2 className="text-lg font-medium text-gray-800">Receita Mensal</h2>
              <p className="text-2xl font-bold text-green-400">
                {totalReceitas.toLocaleString('pt-br', {
                  style: 'currency',
                  currency: 'BRL'
                })}
              </p>
            </div>

            {/* DIVISORIA */}
            <div className="hidden md:block border-l-2 border-gray-300 h-16 mx-4"></div>
            <div className="block md:hidden border-b-2 border-gray-300 w-full my-4"></div>

            {/* DESPESAS MENSAL */}
            <div className="flex-1 p-2 rounded-lg text-center">
              <h2 className="text-lg  font-medium text-gray-800">Despesa Mensal</h2>
              <p className="text-2xl font-bold text-red-400">
                {totalDespesas.toLocaleString('pt-br', {
                  style: 'currency',
                  currency: 'BRL'
                })}
              </p>
            </div>
          </div>
        </div>
 {/* Maiores Gastos do Mês Atual */}
      <div className="p-4  rounded-lg">
        <h2 className="text-lg font-bold mb-2">Maiores Gastos</h2>
        {maioresGastos.length > 0 ? (
          <ul className="space-y-2">
            {maioresGastos.map((gasto) => (
              <li key={gasto.id} className="flex justify-between items-center text-sm">
                <span className="truncate">{gasto.descricao}</span>
                <span className="font-medium text-red-500">
                  {gasto.valor.toLocaleString('pt-br', { style: 'currency', currency: 'BRL' })}
                </span>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-center text-gray-500 text-sm">Sem gastos no período</p>
        )}
      </div>

      {/* Limites de Gastos do Mês Atual */}
      <div className="p-4 bg-gray-50 rounded-lg">
        <h2 className="text-lg font-bold mb-2">Limites de Gastos</h2>
        {categorias.length > 0 ? (
          <ul className="space-y-4">
            {categorias.map((cat) => {
              const gastos = getGastosPorCategoria(cat.name);
              const percentage = cat.limit > 0 ? Math.min((gastos / cat.limit) * 100, 100) : 0;
              return (
                <li key={cat.id}>
                  <div className="flex justify-between items-center mb-1 text-sm">
                    <span className="font-semibold">{cat.name}</span>
                    <span className={`font-medium ${gastos > cat.limit ? 'text-red-500' : 'text-gray-700'}`}>
                      {gastos.toLocaleString('pt-br', { style: 'currency', currency: 'BRL' })}
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className={`h-full rounded-full ${percentage < 70 ? 'bg-green-500' : percentage < 90 ? 'bg-yellow-500' : 'bg-red-500'}`}
                      style={{ width: `${percentage}%` }}
                    ></div>
                  </div>
                </li>
              );
            })}
          </ul>
        ) : (
          <p className="text-center text-gray-500 text-sm">Nenhum limite definido.</p>
        )}
      </div>
      </div>
      
     
    </section>
  );
}
