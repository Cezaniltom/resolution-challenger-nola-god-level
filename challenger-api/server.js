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