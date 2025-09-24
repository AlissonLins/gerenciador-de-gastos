"use client"

import { useFinance } from "../../components/FinanceContent"
import { useState } from "react";
import { format, addMonths, subMonths } from "date-fns";
import { ptBR } from "date-fns/locale";

export default function Limites() {
    const {
        categorias = [],
        addCategoria = () => { },
        getGastosPorCategoria = () => 0,
    } = useFinance() || {};

    const [showForm, setShowForm] = useState(false);
    const [newCategory, setNewCategory] = useState('');
    const [newLimit, setNewLimit] = useState('');
    const [currentDate, setCurrentDate] = useState(new Date());

    const nextMonth = () => {
        setCurrentDate(addMonths(currentDate, 1));
    };

    const prevMonth = () => {
        setCurrentDate(subMonths(currentDate, 1));
    };

    const toggleForm = () => {
        setShowForm(!showForm);
        setNewCategory('');
        setNewLimit('');
    };



    const addCategory = () => {
        try {
            if (!newCategory.trim() || !newLimit.trim()) {
                alert("Por favor, preencha todos os campos");
                return;
            }

            const limitValue = parseFloat(newLimit);
            if (isNaN(limitValue)) {
                alert("Por favor, insira um valor numérico válido para o limite");
                return;
            }

            if (limitValue <= 0) {
                alert("O limite deve ser maior que zero");
                return;
            }

            addCategoria(newCategory.trim(), limitValue);
            setNewCategory('');
            setNewLimit('');
            setShowForm(false);
        } catch (error) {
            console.error("Erro ao adicionar categoria: ", error);
            alert("Ocorreu um erro ao adicionar a categoria")
        }
    };

    const monthYear = format(currentDate, "MMMM yyyy", { locale: ptBR });

    return (
        <div className="bg-white shadow-lg rounded-lg p-5 w-full md:w-96 mx-auto mt-6 md:mt-12">
            <div className="flex justify-center mb-6">
                <h1 className="text-2xl font-bold">Limite de Gastos</h1>
            </div>

            <div className="border-t border-gray-300 mb-6"></div>

            {/* Navegaçao por meses */}

            <div className="flex items-center justify-between mb-6">
                <button onClick={prevMonth} className="text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-100 transition-colors">&lt;</button>
                <span className="text-lg font-medium">{monthYear}</span>
                <button onClick={nextMonth} className="text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-100 transition-colors">&gt;</button>
            </div>

            {/* Lista de categorias */}

            <div className="mb-6">
                <h2 className="text-lg text-center font-semibold mb-3">Categorias</h2>
                {categorias.length > 0 ? (
                    <div className="space-y-4">
                        {categorias.map(category => {
                            const gastoAtual = getGastosPorCategoria(category.name);
                            const percentage = category.limit > 0
                                ? Math.min(Math.round((gastoAtual / category.limit) * 100), 100)
                                : 0;
                            const remaining = category.limit - gastoAtual;
                            const isOverLimit = gastoAtual > category.limit;

                            return (
                                <div key={category.id} className="mb-4 p-4 bg-gray-50 rounded-lg">
                                    <div className="flex justify-between items-center mb-2">
                                        <h3 className="font-semibold">{category.name}</h3>
                                        <div className="text-right">
                                            <p className={isOverLimit ? 'text-red-500 font-semibold' : 'text-gray-700'}>
                                                {gastoAtual.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                                            </p>
                                            <p className="text-sm text-gray-600">
                                                de {category.limit.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                                            </p>
                                        </div>
                                    </div>

                                    {/* Barra de progresso */}

                                    <div className="w-full bg-gray-200 rounded-full h-2.5 mb-1">
                                        <div className={`h-2.5 rounded-full ${percentage < 70 ? 'bg-green-500' :
                                            percentage < 90 ? 'bg-yellow-500' : 'bg-red-500'
                                            }`} style={{ width: `${percentage}%` }} />
                                    </div>

                                    {/* Status do limite */}

                                    <div className="flex justify-between text-xs mt-1">
                                        <span className="text-gray-500">0%</span>
                                        <span className="text-gray-500">{percentage}%</span>
                                        <span className="text-gray-500">100%</span>
                                    </div>

                                    {isOverLimit ? (
                                        <p className="text-red-500 text-xs mt-1">
                                            ❌ Limite excedido em {(gastoAtual - category.limit).toLocaleString('pt-BR', {
                                                style: 'currency',
                                                currency: 'BRL'
                                            })}
                                        </p>
                                    ) : (
                                        <p className="text-green-600 text-xs mt-1">
                                            ✅ Restam {remaining.toLocaleString('pt-BR', {
                                                style: 'currency',
                                                currency: 'BRL'
                                            })}
                                        </p>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                ) : (
                    <div className="text-center py-6">
                        <p className="text-gray-500 mb-4">Nenhuma categoria definida</p>
                        <button onClick={toggleForm}
                            className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transitions-colors">
                            Criar primeira categoria
                        </button>
                    </div>
                )}
            </div>

            {/* Botão para adicionar nova categoria */}
            {categorias.length > 0 && (
                <div className="flex justify-center mt-4">
                    <button onClick={toggleForm}
                        className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transitions-colors">
                        Adicionar nova categoria
                    </button>
                </div>
            )}

            {/* Modal para adicionar nova categoria */}

            {showForm && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white p-6 rounded-lg w-full max-w-md">
                        <h2 className="text-xl font-bold mb-4">Adicionar categoria</h2>

                        <div className="mb-4">
                            <label className="block text-gray-700 mb-1">Nome da Categoria</label>
                            <input type="text"
                                value={newCategory}
                                onChange={(e) => setNewCategory(e.target.value)}
                                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                placeholder="Ex: Investimentos"
                                required />
                        </div>

                        <div className="mb-6">
                            <label className="block text-gray-700 mb-1">Limite Mensal (R$)</label>
                            <input type="number"
                                value={newLimit}
                                onChange={(e) => setNewLimit(e.target.value)}
                                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                placeholder="Ex: 10000"
                                min="0"
                                step="0.01"
                                required />
                        </div>

                        <div className="flex justify-end space-x-3">
                            <button type="button" onClick={toggleForm}
                                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-100 transition-colors">
                                Cancelar
                            </button>

                            <button type="button"
                                onClick={addCategory}
                                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
                                Adicionar
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}