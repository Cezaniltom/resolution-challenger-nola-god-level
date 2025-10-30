const analyticsController = require('../controllers/analytics.controller');

async function routes(fastify, options) {
  // Rota de teste API
    fastify.get('/', async (request, reply) => {
        return { hello: 'Bem-vindo à API de Analytics com Prisma!' };
    });

    // Rotas de Analytics
    fastify.get('/analytics/overview', analyticsController.handleGetOverview);
    fastify.get('/analytics/faturamento-por-canal', analyticsController.handleGetFaturamentoPorCanal);
    fastify.get('/analytics/faturamento-por-loja', analyticsController.handleGetFaturamentoPorLoja);
    fastify.get('/analytics/top-products-filtrado', analyticsController.handleGetTopProductsFiltrado);
    fastify.get('/analytics/delivery-performance', analyticsController.handleGetDeliveryPerformance);
    fastify.get('/analytics/customers-churn-risk', analyticsController.handleGetCustomersChurnRisk);
    fastify.get('/analytics/products-by-margin-proxy', analyticsController.handleGetProductsByMarginProxy);
}

module.exports = routes;