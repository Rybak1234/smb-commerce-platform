import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const page = parseInt(searchParams.get("page") || "1");
  const limit = parseInt(searchParams.get("limit") || "12");
  const search = searchParams.get("search") || "";
  const categoryId = searchParams.get("category") || "";
  const minPrice = parseFloat(searchParams.get("minPrice") || "0");
  const maxPrice = parseFloat(searchParams.get("maxPrice") || "999999");
  const sort = searchParams.get("sort") || "createdAt";
  const order = searchParams.get("order") || "desc";
  const featured = searchParams.get("featured");
  const trending = searchParams.get("trending");
  const vendorId = searchParams.get("vendorId");
  const tag = searchParams.get("tag");
  const active = searchParams.get("active");

  const where: any = { price: { gte: minPrice, lte: maxPrice } };
  if (active !== "false") where.active = true;
  if (search) where.OR = [
    { name: { contains: search, mode: "insensitive" } },
    { description: { contains: search, mode: "insensitive" } },
    { brand: { contains: search, mode: "insensitive" } },
  ];
  if (categoryId) where.categoryId = categoryId;
  if (featured === "true") where.featured = true;
  if (trending === "true") where.trending = true;
  if (vendorId) where.vendorId = vendorId;
  if (tag) where.tags = { has: tag };

  const orderBy: any = {};
  if (sort === "price") orderBy.price = order;
  else if (sort === "name") orderBy.name = order;
  else if (sort === "rating") orderBy.avgRating = order;
  else if (sort === "sales") orderBy.salesCount = order;
  else orderBy.createdAt = order;

  const [products, total] = await Promise.all([
    prisma.product.findMany({
      where, orderBy, skip: (page - 1) * limit, take: limit,
      include: { category: { select: { name: true, slug: true } }, vendor: { select: { storeName: true, slug: true } } },
    }),
    prisma.product.count({ where }),
  ]);

  return NextResponse.json({ products, total, pages: Math.ceil(total / limit), page });
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  if (!body.name || typeof body.name !== "string") {
    return NextResponse.json({ error: "Name is required" }, { status: 400 });
  }
  const slug = body.name.toLowerCase().replace(/[^\w\s-]/g, "").replace(/[\s_-]+/g, "-") + "-" + Date.now().toString(36);
  const product = await prisma.product.create({
    data: {
      name: body.name.trim(),
      slug,
      description: body.description || null,
      price: Number(body.price) || 0,
      originalPrice: body.originalPrice ? Number(body.originalPrice) : null,
      comparePrice: body.comparePrice ? Number(body.comparePrice) : null,
      costPrice: body.costPrice ? Number(body.costPrice) : null,
      image: body.image || null,
      images: body.images || [],
      categoryId: body.categoryId || null,
      categoryName: body.categoryName || "General",
      brand: body.brand || null,
      tags: body.tags || [],
      badge: body.badge || null,
      featured: body.featured ?? false,
      trending: body.trending ?? false,
      stock: Math.max(0, parseInt(body.stock) || 0),
      lowStockThreshold: body.lowStockThreshold || 5,
      sku: body.sku || null,
      weight: body.weight ? Number(body.weight) : null,
      dimensions: body.dimensions || null,
      active: body.active ?? true,
      digital: body.digital ?? false,
      downloadUrl: body.downloadUrl || null,
      vendorId: body.vendorId || null,
      seo: body.seo || null,
      publishedAt: body.active ? new Date() : null,
    },
  });
  return NextResponse.json(product, { status: 201 });
}
