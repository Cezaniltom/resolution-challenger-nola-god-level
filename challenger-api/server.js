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

// Filtro de produto mais vendido por dia
fastify.get('/analytics/top-products-filtrado', async (request, reply) => {
  const { 
    channel,
    dayOfWeek,
    startDate,
    endDate,
    limit = 10 
  } = request.query;

  const limitNum = parseInt(limit);
  const whereClauses = [Prisma.sql`s.sale_status_desc <> 'CANCELLED'`];

  if (channel) {
    whereClauses.push(Prisma.sql`c.name = ${channel}`);
  }
  if (dayOfWeek) {
    whereClauses.push(Prisma.sql`EXTRACT(ISODOW FROM s.created_at) = ${parseInt(dayOfWeek)}`);
  }
  if (startDate) {
    whereClauses.push(Prisma.sql`s.created_at >= ${new Date(startDate)}`);
  }
  if (endDate) {
    const inclusiveEndDate = new Date(endDate);
    inclusiveEndDate.setDate(inclusiveEndDate.getDate() + 1);
    
    whereClauses.push(Prisma.sql`s.created_at < ${inclusiveEndDate}`);
  }
  
  const where = Prisma.join(whereClauses, ' AND ');

  try {
    const result = await fastify.prisma.$queryRaw`
      SELECT 
        p.name AS produto_nome,
        SUM(ps.quantity) AS total_vendido
      FROM products p
      JOIN product_sales ps ON p.id = ps.product_id
      JOIN sales s ON ps.sale_id = s.id
      JOIN channels c ON s.channel_id = c.id
      WHERE ${where}
      GROUP BY p.id, p.name
      ORDER BY total_vendido DESC
      LIMIT ${limitNum};
    `;
    return result;
  } catch (err) {
    fastify.log.error(err);
    reply.code(500).send({ error: 'Erro ao consultar o banco de dados', details: err.message });
  }
});

// Filtro de tempo de entrega dia/horário
fastify.get('/analytics/delivery-performance', async (request, reply) => {
  const { groupBy = 'hour' } = request.query;
  const groupingSql = groupBy === 'day' 
    ? Prisma.sql`EXTRACT(ISODOW FROM created_at)` 
    : Prisma.sql`EXTRACT(HOUR FROM created_at)`;

  try {
    const result = await fastify.prisma.$queryRaw`
      SELECT 
        ${groupingSql} AS grupo,
        AVG(delivery_seconds) AS tempo_medio_segundos,
        COUNT(id) AS total_entregas
      FROM sales
      WHERE 
        delivery_seconds IS NOT NULL 
        AND sale_status_desc <> 'CANCELLED'
      GROUP BY grupo
      ORDER BY grupo ASC;
    `;
    return result;
  } catch (err) {
    fastify.log.error(err);
    reply.code(500).send({ error: 'Erro ao consultar o banco de dados', details: err.message });
  }
});

// clientes que compraram 3+ vezes mas não voltam há 30 dias?
fastify.get('/analytics/customers-churn-risk', async (request, reply) => {
  const frequency = parseInt(request.query.frequency) || 3;
  const recencyDays = parseInt(request.query.recencyDays) || 30;

  try {
    const result = await fastify.prisma.$queryRaw`
      WITH CustomerStats AS (
        SELECT
          customer_id,
          COUNT(id) AS frequencia,
          MAX(created_at::date) AS ultima_compra_data
        FROM sales
        WHERE customer_id IS NOT NULL AND sale_status_desc <> 'CANCELLED'
        GROUP BY customer_id
      )
      SELECT
        c.customer_name,
        c.phone_number,
        c.email,
        cs.frequencia,
        cs.ultima_compra_data
      FROM CustomerStats cs
      JOIN customers c ON cs.customer_id = c.id
      WHERE
        cs.frequencia >= ${frequency}
        AND cs.ultima_compra_data <= (CURRENT_DATE - ${recencyDays})
      ORDER BY
        cs.ultima_compra_data ASC;
    `;
    return result;
  } catch (err) {
    fastify.log.error(err);
    reply.code(500).send({ error: 'Erro ao consultar o banco de dados', details: err.message });
  }
});

// Produtos com menor margem
fastify.get('/analytics/products-by-margin-proxy', async (request, reply) => {
  const limit = parseInt(request.query.limit) || 20;

  try {
    const result = await fastify.prisma.$queryRaw`
      SELECT
        p.name AS produto_nome,
        p.id AS product_id,
        AVG(ps.base_price) as preco_base_medio,
        AVG(ps.total_price) as preco_vendido_medio,
        AVG(ps.total_price / NULLIF(ps.base_price, 0)) * 100 AS percentual_preco_base
      FROM product_sales ps
      JOIN products p ON ps.product_id = p.id
      WHERE 
        ps.base_price > 0
      GROUP BY p.id, p.name
      ORDER BY
        percentual_preco_base ASC
      LIMIT ${limit};
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