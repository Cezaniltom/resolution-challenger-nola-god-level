BigInt.prototype.toJSON = function() {
  return this.toString();
}

require('dotenv').config();

const fastify = require('fastify')({ logger: true });
const { PrismaClient, Prisma } = require('./generated/prisma/client');
const prisma = new PrismaClient();

fastify.decorate('prisma', prisma);

// Teste da API
fastify.get('/', async (request, reply) => {
  return { hello: 'Bem-vindo à API de Analytics com Prisma!' };
});

// Visão Geral (Faturamento, Pedidos, Ticket Médio)
fastify.get('/analytics/overview', async (request, reply) => {
  const { startDate, endDate } = request.query;
  const filters = [Prisma.sql`sale_status_desc <> 'CANCELLED'`];
  if (startDate) {
    filters.push(Prisma.sql`created_at >= ${new Date(startDate)}`);
  }
  if (endDate) {
    filters.push(Prisma.sql`created_at <= ${new Date(endDate)}`);
  }
  const whereClause = Prisma.join(filters, ' AND ');

  try {
    const result = await fastify.prisma.$queryRaw`
      SELECT 
        SUM(total_amount) AS faturamento_total,
        COUNT(id) AS total_pedidos,
        AVG(total_amount) AS ticket_medio
      FROM sales
      WHERE ${whereClause};
    `;
    return result[0];
  } catch (err) {
    fastify.log.error(err);
    reply.code(500).send({ error: 'Erro ao consultar o banco de dados', details: err.message });
  }
});

// Faturamento por canal
fastify.get('/analytics/faturamento-por-canal', async (request, reply) => {
  const { startDate, endDate } = request.query;
  const filters = [Prisma.sql`s.sale_status_desc <> 'CANCELLED'`];
  if (startDate) {
    filters.push(Prisma.sql`s.created_at >= ${new Date(startDate)}`);
  }
  if (endDate) {
    filters.push(Prisma.sql`s.created_at <= ${new Date(endDate)}`);
  }
  const whereClause = Prisma.join(filters, ' AND ');

  try {
    const result = await fastify.prisma.$queryRaw`
      SELECT 
        c.name AS canal_nome,
        SUM(s.total_amount) AS faturamento_total,
        COUNT(s.id) AS total_pedidos,
        AVG(s.total_amount) AS ticket_medio
      FROM sales s
      JOIN channels c ON s.channel_id = c.id
      WHERE ${whereClause}
      GROUP BY c.name
      ORDER BY faturamento_total DESC;
    `;
    return result;
  } catch (err) {
    fastify.log.error(err);
    reply.code(500).send({ error: 'Erro ao consultar o banco de dados', details: err.message });
  }
});

// Faturamento por loja
fastify.get('/analytics/faturamento-por-loja', async (request, reply) => {
  const { startDate, endDate } = request.query;
  const filters = [Prisma.sql`s.sale_status_desc <> 'CANCELLED'`];
  if (startDate) {
    filters.push(Prisma.sql`s.created_at >= ${new Date(startDate)}`);
  }
  if (endDate) {
    filters.push(Prisma.sql`s.created_at <= ${new Date(endDate)}`);
  }
  const whereClause = Prisma.join(filters, ' AND ');

  try {
    const result = await fastify.prisma.$queryRaw`
      SELECT 
        st.name AS loja_nome,
        SUM(s.total_amount) AS faturamento_total,
        COUNT(s.id) AS total_pedidos,
        AVG(s.total_amount) AS ticket_medio
      FROM sales s
      JOIN stores st ON s.store_id = st.id
      WHERE ${whereClause}
      GROUP BY st.name
      ORDER BY faturamento_total DESC;
    `;
    return result;
  } catch (err) {
    fastify.log.error(err);
    reply.code(500).send({ error: 'Erro ao consultar o banco de dados', details: err.message });
  }
});

// Iniciação do servidor
const start = async () => {
  try {
    await prisma.$connect();
    fastify.log.info('Conectado ao banco de dados com Prisma');   
    await fastify.listen({ port: process.env.API_PORT || 3001 });
    fastify.log.info(`Servidor rodando na porta ${fastify.server.address().port}`);
  } catch (err) {
    fastify.log.error(err);
    await prisma.$disconnect();
    process.exit(1);
  }
};

const gracefulShutdown = async () => {
  fastify.log.info('Desconectando do banco de dados...');
  await prisma.$disconnect();
  process.exit(0);
};

process.on('SIGINT', gracefulShutdown);
process.on('SIGTERM', gracefulShutdown);

start();