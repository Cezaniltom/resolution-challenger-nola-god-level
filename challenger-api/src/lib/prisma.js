const { PrismaClient, Prisma } = require('../../generated/prisma/client');

const prisma = new PrismaClient();

module.exports = { prisma, Prisma };