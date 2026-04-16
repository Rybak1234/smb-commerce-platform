jest.mock('@/lib/prisma');
import { prisma } from '@/lib/prisma';
import { GET, POST } from './route';
import { NextRequest } from 'next/server';

const mockPrisma = prisma as jest.Mocked<typeof prisma>;

function makeRequest(url: string, init?: RequestInit) {
  return new NextRequest(new URL(url, 'http://localhost:3000'), init);
}

describe('GET /api/products', () => {
  beforeEach(() => jest.clearAllMocks());

  it('devuelve productos paginados', async () => {
    const mockProducts = [
      { id: '1', name: 'Samsung Galaxy S24 Ultra', slug: 'samsung-galaxy-s24', price: 8999, active: true, category: { name: 'Smartphones', slug: 'smartphones' }, vendor: null },
      { id: '2', name: 'iPhone 15 Pro Max', slug: 'iphone-15-pro', price: 9499, active: true, category: { name: 'Smartphones', slug: 'smartphones' }, vendor: null },
    ];
    (mockPrisma.product.findMany as jest.Mock).mockResolvedValue(mockProducts);
    (mockPrisma.product.count as jest.Mock).mockResolvedValue(2);

    const res = await GET(makeRequest('/api/products'));
    const data = await res.json();

    expect(res.status).toBe(200);
    expect(data.products).toHaveLength(2);
    expect(data.total).toBe(2);
    expect(data.page).toBe(1);
  });

  it('aplica filtro de búsqueda', async () => {
    (mockPrisma.product.findMany as jest.Mock).mockResolvedValue([]);
    (mockPrisma.product.count as jest.Mock).mockResolvedValue(0);

    await GET(makeRequest('/api/products?search=samsung'));

    expect(mockPrisma.product.findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: expect.objectContaining({
          OR: expect.arrayContaining([
            expect.objectContaining({ name: { contains: 'samsung', mode: 'insensitive' } }),
          ]),
        }),
      })
    );
  });

  it('filtra por rango de precio', async () => {
    (mockPrisma.product.findMany as jest.Mock).mockResolvedValue([]);
    (mockPrisma.product.count as jest.Mock).mockResolvedValue(0);

    await GET(makeRequest('/api/products?minPrice=1000&maxPrice=5000'));

    expect(mockPrisma.product.findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: expect.objectContaining({
          price: { gte: 1000, lte: 5000 },
        }),
      })
    );
  });

  it('filtra productos destacados', async () => {
    (mockPrisma.product.findMany as jest.Mock).mockResolvedValue([]);
    (mockPrisma.product.count as jest.Mock).mockResolvedValue(0);

    await GET(makeRequest('/api/products?featured=true'));

    expect(mockPrisma.product.findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: expect.objectContaining({ featured: true }),
      })
    );
  });

  it('pagina correctamente', async () => {
    (mockPrisma.product.findMany as jest.Mock).mockResolvedValue([]);
    (mockPrisma.product.count as jest.Mock).mockResolvedValue(50);

    const res = await GET(makeRequest('/api/products?page=3&limit=10'));
    const data = await res.json();

    expect(data.pages).toBe(5);
    expect(mockPrisma.product.findMany).toHaveBeenCalledWith(
      expect.objectContaining({ skip: 20, take: 10 })
    );
  });
});

describe('POST /api/products', () => {
  beforeEach(() => jest.clearAllMocks());

  it('crea un producto con datos completos', async () => {
    const created = { id: 'new-1', name: 'Test Product', slug: 'test-product-abc', price: 999, stock: 10 };
    (mockPrisma.product.create as jest.Mock).mockResolvedValue(created);

    const res = await POST(makeRequest('/api/products', {
      method: 'POST',
      body: JSON.stringify({ name: 'Test Product', price: 999, stock: 10, categoryName: 'Test' }),
    }));
    const data = await res.json();

    expect(res.status).toBe(201);
    expect(data.name).toBe('Test Product');
  });

  it('rechaza producto sin nombre', async () => {
    const res = await POST(makeRequest('/api/products', {
      method: 'POST',
      body: JSON.stringify({ price: 100 }),
    }));
    const data = await res.json();

    expect(res.status).toBe(400);
    expect(data.error).toContain('Name');
  });

  it('genera slug automáticamente', async () => {
    (mockPrisma.product.create as jest.Mock).mockImplementation(({ data }) => {
      return Promise.resolve({ ...data, id: 'new-2' });
    });

    const res = await POST(makeRequest('/api/products', {
      method: 'POST',
      body: JSON.stringify({ name: 'Mi Producto Nuevo' }),
    }));
    const data = await res.json();

    expect(data.slug).toMatch(/^mi-producto-nuevo-/);
  });
});
