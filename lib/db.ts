// Instance Prisma unique pour toute l'application.
import { PrismaClient } from '@prisma/client';
const globalAny: any = global;
export const prisma = globalAny.prisma || new PrismaClient();
if (process.env.NODE_ENV !== 'production') globalAny.prisma = prisma;
