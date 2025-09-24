import { createContext, useContext, useState, ReactNode, useEffect } from "react";
import { format } from "date-fns";

export interface Lancamento {
    descricao: string;
    valor: number;
    tipo: "receita" | "despesa";
    data: Date;
    id: string;
    categoria?: string;
}

interface CategoriaLimite {
    id: number;
    name: string;
    limit: number;
}

interface FinanceContextType {
    lancamentos: Lancamento[];
    addLancamento: (lancamento: Omit<Lancamento, 'id'>) => void;
    removeLancamento: (id: string) => void;
    categorias: CategoriaLimite[];
    addCategoria: (name: string, limit: number) => void;
    getGastosPorCategoria: (categoria: string, month?: string) => number;
    totalReceitas: number;
    totalDespesas: number;
    saldo: number;
}

const FinanceContext = createContext<FinanceContextType | undefined>(undefined);

export function FinanceProvider({ children }: { children: ReactNode }) {
    // Função auxiliar para carregar dados do localStorage
    const getSavedData = (key: string) => {
        if (typeof window !== 'undefined') {
            const saved = localStorage.getItem(key);
            if (saved) {
                // Se os dados forem de lançamentos, parse as datas corretamente
                if (key === 'lancamentos') {
                    const parsedData: Lancamento[] = JSON.parse(saved);
                    return parsedData.map(item => ({
                        ...item,
                        data: new Date(item.data) // Converte a string de volta para objeto Date
                    }));
                }
                return JSON.parse(saved);
            }
        }
        return null;
    };

    // 1. Carrega os dados do localStorage na inicialização
    const [lancamentos, setLancamentos] = useState<Lancamento[]>(() => {
        const savedLancamentos = getSavedData('lancamentos');
        return savedLancamentos || [];
    });

    const [categorias, setCategorias] = useState<CategoriaLimite[]>(() => {
        const savedCategorias = getSavedData('categorias');
        return savedCategorias || [];
    });

    // 2. Salva os dados no localStorage sempre que eles mudam
    useEffect(() => {
        localStorage.setItem('lancamentos', JSON.stringify(lancamentos));
    }, [lancamentos]);

    useEffect(() => {
        localStorage.setItem('categorias', JSON.stringify(categorias));
    }, [categorias]);

    const totalReceitas = lancamentos
        .filter((l) => l.tipo === "receita")
        .reduce((total, l) => total + l.valor, 0);

    const totalDespesas = lancamentos
        .filter((l) => l.tipo === "despesa")
        .reduce((total, l) => total + l.valor, 0);

    const saldo = totalReceitas - totalDespesas;

    const addLancamento = (lancamento: Omit<Lancamento, 'id'>) => {
        setLancamentos([
            ...lancamentos,
            {
                ...lancamento,
                id: Math.random().toString(36).substring(2, 9),
            },
        ]);
    };

    const removeLancamento = (id: string) => {
        setLancamentos(lancamentos.filter((l) => l.id !== id));
    };

    const addCategoria = (name: string, limit: number) => {
        setCategorias([
            ...categorias,
            {
                id: Date.now(),
                name,
                limit
            },
        ]);
    };

    const getGastosPorCategoria = (categoria: string, month?: string): number => {
        const total = lancamentos
            .filter(
                (l) =>
                    l.tipo === "despesa" &&
                    l.categoria === categoria &&
                    (month ? format(l.data, 'yyyy-MM') === month : true)
            )
            .reduce((total, l) => total + l.valor, 0);

        return total;
    };

    return (
        <FinanceContext.Provider
            value={{
                lancamentos,
                addLancamento,
                removeLancamento,
                categorias,
                addCategoria,
                getGastosPorCategoria,
                totalReceitas,
                totalDespesas,
                saldo,
            }}
        >
            {children}
        </FinanceContext.Provider>
    );
}

export const useFinance = () => {
    const context = useContext(FinanceContext);
    if (context === undefined) {
        throw new Error("useFinance deve ser usado dentro de um FinanceProvider");
    }
    return context;
};