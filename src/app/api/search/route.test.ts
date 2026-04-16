jest.mock('@/lib/prisma');
import { prisma } from '@/lib/prisma';
import { GET } from './route';
import { NextRequest } from 'next/server';

const mockPrisma = prisma as jest.Mocked<typeof prisma>;

function makeRequest(url: string) {
  return new NextRequest(new URL(url, 'http://localhost:3000'));
}

describe('GET /api/search', () => {
  beforeEach(() => jest.clearAllMocks());

  it('devuelve vacío para query corto (<2 chars)', async () => {
    const res = await GET(makeRequest('/api/search?q=a'));
    const data = await res.json();

    expect(data.products).toEqual([]);
    expect(data.categories).toEqual([]);
    expect(data.vendors).toEqual([]);
  });

  it('busca productos, categorías y vendedores', async () => {
    (mockPrisma.product.findMany as jest.Mock).mockResolvedValue([
      { id: '1', name: 'Samsung Galaxy', slug: 'samsung', price: 8999, image: null, categoryName: 'Smartphones' },
    ]);
    (mockPrisma.category.findMany as jest.Mock).mockResolvedValue([
      { id: 'c1', name: 'Smartphones', slug: 'smartphones', image: null },
    ]);
    (mockPrisma.vendor.findMany as jest.Mock).mockResolvedValue([]);

    const res = await GET(makeRequest('/api/search?q=samsung'));
    const data = await res.json();

    expect(data.products).toHaveLength(1);
    expect(data.products[0].name).toContain('Samsung');
    expect(data.categories).toHaveLength(1);
  });

  it('limita resultados a 8 productos y 4 categorías', async () => {
    (mockPrisma.product.findMany as jest.Mock).mockResolvedValue([]);
    (mockPrisma.category.findMany as jest.Mock).mockResolvedValue([]);
    (mockPrisma.vendor.findMany as jest.Mock).mockResolvedValue([]);

    await GET(makeRequest('/api/search?q=test'));

    expect(mockPrisma.product.findMany).toHaveBeenCalledWith(
      expect.objectContaining({ take: 8 })
    );
    expect(mockPrisma.category.findMany).toHaveBeenCalledWith(
      expect.objectContaining({ take: 4 })
    );
  });
});
