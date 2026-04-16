jest.mock('@/lib/prisma');
import { prisma } from '@/lib/prisma';
import { GET, POST } from './route';
import { NextRequest } from 'next/server';

const mockPrisma = prisma as jest.Mocked<typeof prisma>;

function makeRequest(url: string, init?: RequestInit) {
  return new NextRequest(new URL(url, 'http://localhost:3000'), init);
}

describe('GET /api/categories', () => {
  beforeEach(() => jest.clearAllMocks());

  it('devuelve categorías activas ordenadas', async () => {
    const mockCategories = [
      { id: '1', name: 'Smartphones', slug: 'smartphones', active: true, order: 0, children: [], _count: { products: 3 } },
      { id: '2', name: 'Laptops y PCs', slug: 'laptops', active: true, order: 1, children: [], _count: { products: 2 } },
    ];
    (mockPrisma.category.findMany as jest.Mock).mockResolvedValue(mockCategories);

    const res = await GET();
    const data = await res.json();

    expect(res.status).toBe(200);
    expect(data).toHaveLength(2);
    expect(data[0].name).toBe('Smartphones');
  });

  it('incluye conteo de productos', async () => {
    const mockCategories = [
      { id: '1', name: 'Audio', slug: 'audio', active: true, order: 0, children: [], _count: { products: 5 } },
    ];
    (mockPrisma.category.findMany as jest.Mock).mockResolvedValue(mockCategories);

    const res = await GET();
    const data = await res.json();

    expect(data[0]._count.products).toBe(5);
  });
});

describe('POST /api/categories', () => {
  beforeEach(() => jest.clearAllMocks());

  it('crea una categoría nueva', async () => {
    const created = { id: 'cat-1', name: 'Nueva Categoría', slug: 'nueva-categoria' };
    (mockPrisma.category.create as jest.Mock).mockResolvedValue(created);

    const res = await POST(makeRequest('/api/categories', {
      method: 'POST',
      body: JSON.stringify({ name: 'Nueva Categoría' }),
    }));
    const data = await res.json();

    expect(res.status).toBe(201);
    expect(data.name).toBe('Nueva Categoría');
    expect(data.slug).toBe('nueva-categoria');
  });

  it('rechaza categoría sin nombre', async () => {
    const res = await POST(makeRequest('/api/categories', {
      method: 'POST',
      body: JSON.stringify({}),
    }));
    const data = await res.json();

    expect(res.status).toBe(400);
    expect(data.error).toContain('Name');
  });
});
