import { PrismaClient } from '@prisma/client';

const mockPrisma = {
  product: {
    findMany: jest.fn(),
    findUnique: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
    count: jest.fn(),
  },
  category: {
    findMany: jest.fn(),
    create: jest.fn(),
  },
  order: {
    findMany: jest.fn(),
    count: jest.fn(),
  },
  vendor: {
    findMany: jest.fn(),
  },
  user: {
    findMany: jest.fn(),
    findUnique: jest.fn(),
    create: jest.fn(),
  },
  $transaction: jest.fn(),
} as unknown as PrismaClient;

export { mockPrisma as prisma };
