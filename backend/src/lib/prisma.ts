import { PrismaClient } from '@prisma/client';

// Declare a global variable for Prisma to avoid multiple instances in development
declare global {
  var prisma: PrismaClient | undefined;
}

// Use the existing Prisma instance if it exists, otherwise create a new one
const prisma = global.prisma || new PrismaClient();

// Save the Prisma instance on the global object in development to prevent multiple instances
if (process.env.NODE_ENV === 'development') {
  global.prisma = prisma;
}

export default prisma;
