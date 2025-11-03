const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

async function fetcher(url, params) {
  let fullUrl = `${API_URL}${url}`;

  if (params) {
    const cleanParams = Object.fromEntries(
      Object.entries(params).filter(([, v]) => v != null && v !== '')
    );
    const query = new URLSearchParams(cleanParams).toString();
    if (query) {
      fullUrl += `?${query}`;
    }
  }

  try {
    const response = await fetch(fullUrl, { cache: 'no-store' });
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Erro ao buscar dados da API');
    }
    return response.json();
  } catch (err) {
    console.error(`Falha no fetch para ${fullUrl}:`, err);
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

  getMonthlyRevenue(params) {
    return fetcher('/analytics/revenue/monthly', params) 
  }
};