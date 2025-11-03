"use client";

import { useState, useEffect } from "react";
import Modal from "@/components/ui/Modal";
import { Loader2, AlertTriangle, CheckCircle, ShoppingBag, Users } from "lucide-react"; 

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

function runAiAnalysis(data, page) {
    const insights = [];

    if (page === 'overview') {
        if (data && data.overview) {
        const faturamento = parseFloat(data.overview.faturamento_total);
        if (faturamento > 100_000_000) {
            insights.push({
            icon: CheckCircle,
            color: "text-green-600",
            title: "Performance de Faturamento Excepcional",
            text: `Seu faturamento total de R$ ${Math.round(faturamento / 1_000_000)}M é robusto.`
            });
        }
        }
        if (data && data.canalData && data.canalData.length > 0) {
        const appProprio = data.canalData.find(c => c.canal_nome === 'App Próprio')?.faturamento_total || 0;
        const ifood = data.canalData.find(c => c.canal_nome === 'iFood')?.faturamento_total || 0;
        if (ifood > appProprio) {
            insights.push({
            icon: AlertTriangle,
            color: "text-yellow-600",
            title: "Oportunidade de Migração de Canal",
            text: `Seu canal 'App Próprio' (R$ ${Math.round(appProprio / 1_000_000)}M) fatura significativamente menos que o 'iFood' (R$ ${Math.round(ifood / 1_000_000)}M). Considere criar promoções para migrar clientes.`
            });
        }
        }
    }

    // Analisador da página de Produtos
    else if (page === 'products') {
        if (data && data.length > 0) {
        const totalItens = data.reduce((acc, item) => acc + parseInt(item.total_vendido), 0);
        insights.push({
            icon: ShoppingBag,
            color: "text-blue-600",
            title: "Análise de Produtos",
            text: `Esta filtragem resultou em ${data.length} produtos únicos, somando ${totalItens} unidades vendidas. O produto de maior destaque é "${data[0].produto_nome}".`
        });
        } else {
        insights.push({
            icon: AlertTriangle,
            color: "text-yellow-600",
            title: "Nenhum dado encontrado",
            text: `A sua filtragem atual não retornou nenhum produto. Tente filtros mais abrangentes.`
        });
        }
    }

    // Analisador da página de Clientes
    else if (page === 'customers') {
        if (data && data.length > 0) {
        insights.push({
            icon: Users,
            color: "text-red-600",
            title: "Clientes em Risco Imediato",
            text: `Você identificou ${data.length} clientes que se encaixam neste perfil de risco. O cliente com a compra mais antiga neste grupo é "${data[0].customer_name}".`
        });
        insights.push({
            icon: AlertTriangle,
            color: "text-yellow-600",
            title: "Ação Recomendada",
            text: `Considere criar uma campanha de reengajamento (ex: cupom de desconto) para este grupo antes que eles se percam totalmente.`
        });
        }
    }

    // Se nenhum insight foi gerado
    if (insights.length === 0) {
        insights.push({
        icon: AlertTriangle,
        color: "text-gray-500",
        title: "Análise Inconclusiva",
        text: "Não foi possível gerar insights com os dados atuais. Tente outros filtros ou verifique a fonte de dados."
        });
    }

    return insights;
}

export default function AiAnalysisModal({ open, setOpen, dashboardData, page }) {
    const [isLoading, setIsLoading] = useState(true);
    const [analysis, setAnalysis] = useState([]);

    useEffect(() => {
        if (open) {
        async function fetchAnalysis() {
            setIsLoading(true);
            await sleep(2000); 
            const insights = runAiAnalysis(dashboardData, page);
            setAnalysis(insights);
            setIsLoading(false);
        }
        fetchAnalysis();
        }
    }, [open, dashboardData, page]);

    return (
        <Modal open={open} setOpen={setOpen} title="Análise da IA">
        {isLoading ? (
            <div className="flex flex-col items-center justify-center h-48 gap-4">
            <Loader2 size={40} className="animate-spin text-blue-700" />
            <p className="text-lg font-medium text-gray-600">Analisando seus dados...</p>
            </div>
        ) : (
            <div className="space-y-6">
            {analysis.map((insight, index) => {
                const Icon = insight.icon;
                return (
                <div key={index} className="flex gap-4">
                    <div className="shrink-0">
                    <Icon size={24} className={insight.color} />
                    </div>
                    <div>
                    <h4 className="text-lg font-semibold text-gray-900">{insight.title}</h4>
                    <p className="text-gray-600">{insight.text}</p>
                    </div>
                </div>
                );
            })}
            </div>
        )}
        </Modal>
    );
}