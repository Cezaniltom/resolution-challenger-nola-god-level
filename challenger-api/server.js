BigInt.prototype.toJSON = function() {
  return this.toString();
}

require('dotenv').config();

const fastify = require('fastify')({ logger: true });
const { prisma } = require('./src/lib/prisma');
const gracefulShutdown = async () => {
  fastify.log.info('Desconectando do banco de dados...');
  await prisma.$disconnect();
  process.exit(0);
};

fastify.register(require('./src/routes/index'));

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

process.on('SIGINT', gracefulShutdown);
process.on('SIGTERM', gracefulShutdown);

start();