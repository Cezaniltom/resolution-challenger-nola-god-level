// src/lib/api.js
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

async function fetcher(url, params) {
  let fullUrl = `${API_URL}${url}`;

  if (params) {
    const cleanParams = Object.fromEntries(
      Object.entries(params).filter(([, v]) => v != null && v !== '') // Melhorado: também remove strings vazias
    );
    const query = new URLSearchParams(cleanParams).toString();
    if (query) {
      fullUrl += `?${query}`;
    }
  }

  try {
    // --- 👇 A CORREÇÃO ESTÁ AQUI 👇 ---
    // Diz ao Next.js para NÃO fazer cache desta chamada.
    // Vá sempre buscar os dados mais recentes no backend.
    const response = await fetch(fullUrl, { cache: 'no-store' });
    // --- FIM DA CORREÇÃO ---

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Erro ao buscar dados da API');
    }
    return response.json();
  } catch (err) {
    console.error(`Falha no fetch para ${fullUrl}:`, err);
    // Retorna nulo para não quebrar a UI
    return null; 
  }
}

export const analyticsApi = {
  getOverview: (params) =>
    fetcher(`/analytics/overview`, params),

  getFaturamentoPorCanal: (params) =>
    fetcher(`/analytics/faturamento-por-canal`, params),

  getFaturamentoPorLoja: (params) =>
    fetcher(`/analytics/faturamento-por-loja`, params),

  getTopProductsFiltrado: (params) =>
    fetcher(`/analytics/top-products-filtrado`, params),

  getDeliveryPerformance: (params) =>
    fetcher(`/analytics/delivery-performance`, params),

  getCustomersChurnRisk: (params) =>
    fetcher(`/analytics/customers-churn-risk`, params),

  getProductsByMarginProxy: (params) =>
    fetcher(`/analytics/products-by-margin-proxy`, params),

  // Corrigido o bug da barra que mencionei antes
  getMonthlyRevenue(params) {
    return fetcher('/analytics/revenue/monthly', params) 
  }
};