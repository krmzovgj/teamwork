import { PrismaClient } from '@prisma/client';

declare global {
  // Extend global for TypeScript to avoid multiple instances in dev
  var prisma: PrismaClient | undefined;
}

// Create PrismaClient
const prisma = global.prisma || new PrismaClient({
  log: ['query', 'info', 'warn', 'error'], // optional logging
});

// Assign to global in dev mode to avoid multiple instances during hot reload
if (process.env.NODE_ENV !== 'production') global.prisma = prisma;

export default prisma;
