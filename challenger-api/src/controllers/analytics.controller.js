const analyticsService = require('../services/analytics.service');

// Função para lidar com erro 500
async function handleRequest(request, reply, serviceFn, params) {
  try {
    const result = await serviceFn(params);
    return result;
  } catch (err) {
    request.log.error(err);
    reply.code(500).send({ error: 'Erro ao consultar o banco de dados', details: err.message });
  }
}

async function handleGetOverview(request, reply) {
  const result = await handleRequest(request, reply, analyticsService.getOverview, request.query);
  return result[0];
}

async function handleGetFaturamentoPorCanal(request, reply) {
  return handleRequest(request, reply, analyticsService.getFaturamentoPorCanal, request.query);
}

async function handleGetFaturamentoPorLoja(request, reply) {
  return handleRequest(request, reply, analyticsService.getFaturamentoPorLoja, request.query);
}

async function handleGetTopProductsFiltrado(request, reply) {
  return handleRequest(request, reply, analyticsService.getTopProductsFiltrado, request.query);
}

async function handleGetDeliveryPerformance(request, reply) {
  return handleRequest(request, reply, analyticsService.getDeliveryPerformance, request.query);
}

async function handleGetCustomersChurnRisk(request, reply) {
  return handleRequest(request, reply, analyticsService.getCustomersChurnRisk, request.query);
}

async function handleGetProductsByMarginProxy(request, reply) {
  return handleRequest(request, reply, analyticsService.getProductsByMarginProxy, request.query);
}

module.exports = {
  handleGetOverview,
  handleGetFaturamentoPorCanal,
  handleGetFaturamentoPorLoja,
  handleGetTopProductsFiltrado,
  handleGetDeliveryPerformance,
  handleGetCustomersChurnRisk,
  handleGetProductsByMarginProxy,
};