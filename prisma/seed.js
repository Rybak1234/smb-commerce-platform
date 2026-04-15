const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcryptjs");

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding NovaTech Marketplace...");

  // ─── USERS ─────────────────────────
  const hash = await bcrypt.hash("Password123!", 10);

  const admin = await prisma.user.upsert({
    where: { email: "admin@novatech.bo" },
    update: {},
    create: { email: "admin@novatech.bo", password: hash, name: "Admin NovaTech", role: "admin", loyaltyPoints: 0, referralCode: "NTADMIN" },
  });
  const vendor1User = await prisma.user.upsert({
    where: { email: "vendedor@novatech.bo" },
    update: {},
    create: { email: "vendedor@novatech.bo", password: hash, name: "Carlos Mendoza", role: "vendor", loyaltyPoints: 150, referralCode: "CARLOS1" },
  });
  const vendor2User = await prisma.user.upsert({
    where: { email: "tienda@novatech.bo" },
    update: {},
    create: { email: "tienda@novatech.bo", password: hash, name: "María Quispe", role: "vendor", loyaltyPoints: 200, referralCode: "MARIA1" },
  });
  const customer = await prisma.user.upsert({
    where: { email: "cliente@novatech.bo" },
    update: {},
    create: { email: "cliente@novatech.bo", password: hash, name: "Pedro López", role: "customer", loyaltyPoints: 320, referralCode: "PEDRO1" },
  });
  const customer2 = await prisma.user.upsert({
    where: { email: "ana@novatech.bo" },
    update: {},
    create: { email: "ana@novatech.bo", password: hash, name: "Ana Torres", role: "customer", loyaltyPoints: 85, referralCode: "ANA1" },
  });

  // ─── VENDORS ───────────────────────
  const vendor1 = await prisma.vendor.upsert({
    where: { userId: vendor1User.id },
    update: {},
    create: {
      userId: vendor1User.id,
      storeName: "TechPlus Bolivia",
      slug: "techplus-bolivia",
      description: "Los mejores productos de tecnología a precios accesibles",
      logo: "https://ui-avatars.com/api/?name=TP&background=7c3aed&color=fff&size=128",
      banner: "https://images.unsplash.com/photo-1518770660439-4636190af475?w=1200&h=400&fit=crop",
      phone: "+591 71234567",
      email: "ventas@techplus.bo",
      commissionRate: 8,
      status: "approved",
      subscriptionTier: "pro",
      verified: true,
      totalSales: 156,
      totalRevenue: 45600,
    },
  });
  const vendor2 = await prisma.vendor.upsert({
    where: { userId: vendor2User.id },
    update: {},
    create: {
      userId: vendor2User.id,
      storeName: "ModaStyle",
      slug: "modastyle",
      description: "Moda y accesorios para toda la familia",
      logo: "https://ui-avatars.com/api/?name=MS&background=ec4899&color=fff&size=128",
      phone: "+591 76543210",
      email: "info@modastyle.bo",
      commissionRate: 10,
      status: "approved",
      subscriptionTier: "free",
      verified: true,
      totalSales: 89,
      totalRevenue: 23400,
    },
  });

  // ─── CATEGORIES ────────────────────
  const cats = {};
  const catData = [
    { name: "Electrónica", slug: "electronica", description: "Dispositivos y gadgets electrónicos", image: "https://images.unsplash.com/photo-1498049794561-7780e7231661?w=400&h=300&fit=crop" },
    { name: "Computadoras", slug: "computadoras", description: "Laptops, PCs y accesorios", image: "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=400&h=300&fit=crop" },
    { name: "Smartphones", slug: "smartphones", description: "Teléfonos y tablets", image: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400&h=300&fit=crop" },
    { name: "Audio", slug: "audio", description: "Auriculares, parlantes y más", image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=300&fit=crop" },
    { name: "Gaming", slug: "gaming", description: "Consolas, juegos y accesorios", image: "https://images.unsplash.com/photo-1612287230202-1ff1d85d1bdf?w=400&h=300&fit=crop" },
    { name: "Ropa", slug: "ropa", description: "Moda para hombres y mujeres", image: "https://images.unsplash.com/photo-1445205170230-053b83016050?w=400&h=300&fit=crop" },
    { name: "Hogar", slug: "hogar", description: "Decoración y artículos para el hogar", image: "https://images.unsplash.com/photo-1484101403633-562f891dc89a?w=400&h=300&fit=crop" },
    { name: "Deportes", slug: "deportes", description: "Equipamiento deportivo", image: "https://images.unsplash.com/photo-1461896836934-bd45ba7b4b94?w=400&h=300&fit=crop" },
  ];
  for (const c of catData) {
    cats[c.slug] = await prisma.category.upsert({ where: { slug: c.slug }, update: {}, create: c });
  }

  // ─── PRODUCTS ──────────────────────
  const products = [];
  const productData = [
    {
      name: "Laptop Ultrabook Pro 15",
      slug: "laptop-ultrabook-pro-15",
      description: "Laptop ultraligera con procesador Intel i7 de 13ª generación, 16GB RAM, 512GB SSD, pantalla Full HD IPS de 15.6 pulgadas. Ideal para profesionales y estudiantes que necesitan rendimiento y portabilidad.",
      price: 6999,
      originalPrice: 8500,
      comparePrice: 8500,
      costPrice: 4500,
      images: ["https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=800", "https://images.unsplash.com/photo-1525547719571-a2d4ac8945e2?w=800"],
      categoryId: cats["computadoras"].id,
      vendorId: vendor1.id,
      brand: "TechPlus",
      tags: ["laptop", "ultrabook", "intel", "i7"],
      badge: "Más vendido",
      featured: true,
      trending: true,
      stock: 25,
      sku: "LP-UBP-15",
      weight: 1.8,
      avgRating: 4.7,
      reviewCount: 34,
      salesCount: 89,
      views: 1560,
    },
    {
      name: "Smartphone Galaxy Nova X",
      slug: "smartphone-galaxy-nova-x",
      description: "Smartphone de última generación con cámara de 108MP, pantalla AMOLED de 6.7 pulgadas, 256GB de almacenamiento y batería de 5000mAh con carga rápida de 65W.",
      price: 4599,
      originalPrice: 5200,
      comparePrice: 5200,
      costPrice: 3000,
      images: ["https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=800", "https://images.unsplash.com/photo-1592899677977-9c10ca588bbd?w=800"],
      categoryId: cats["smartphones"].id,
      vendorId: vendor1.id,
      brand: "Galaxy",
      tags: ["smartphone", "android", "5g", "cámara"],
      badge: "Nuevo",
      featured: true,
      trending: true,
      stock: 40,
      sku: "SP-GNX-256",
      weight: 0.21,
      avgRating: 4.5,
      reviewCount: 67,
      salesCount: 156,
      views: 3240,
    },
    {
      name: "Auriculares Wireless Pro",
      slug: "auriculares-wireless-pro",
      description: "Auriculares inalámbricos con cancelación activa de ruido, 40 horas de batería, Bluetooth 5.3, micrófono incorporado y estuche de carga premium.",
      price: 899,
      originalPrice: 1200,
      comparePrice: 1200,
      costPrice: 450,
      images: ["https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800", "https://images.unsplash.com/photo-1583394838336-acd977736f90?w=800"],
      categoryId: cats["audio"].id,
      vendorId: vendor1.id,
      brand: "SoundMax",
      tags: ["auriculares", "bluetooth", "inalámbrico", "anc"],
      badge: "Oferta",
      featured: true,
      stock: 80,
      sku: "AU-WP-BT53",
      weight: 0.28,
      avgRating: 4.8,
      reviewCount: 112,
      salesCount: 340,
      views: 5670,
    },
    {
      name: "Monitor Gaming 27\" 144Hz",
      slug: "monitor-gaming-27-144hz",
      description: "Monitor gaming QHD de 27 pulgadas, 144Hz, 1ms de respuesta, panel IPS, HDR400, compatible con G-Sync y FreeSync. Colores vibrantes para gaming competitivo.",
      price: 2499,
      originalPrice: 3200,
      comparePrice: 3200,
      costPrice: 1600,
      images: ["https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=800"],
      categoryId: cats["gaming"].id,
      vendorId: vendor1.id,
      brand: "ViewMaster",
      tags: ["monitor", "gaming", "144hz", "qhd"],
      featured: true,
      trending: true,
      stock: 15,
      sku: "MO-G27-144",
      weight: 6.2,
      avgRating: 4.6,
      reviewCount: 28,
      salesCount: 45,
      views: 2100,
    },
    {
      name: "Teclado Mecánico RGB",
      slug: "teclado-mecanico-rgb",
      description: "Teclado mecánico con switches Cherry MX, iluminación RGB por tecla, marco de aluminio, reposamuñecas magnético y modo gaming dedicado.",
      price: 599,
      originalPrice: 750,
      costPrice: 300,
      images: ["https://images.unsplash.com/photo-1541140532154-b024d705b90a?w=800"],
      categoryId: cats["gaming"].id,
      vendorId: vendor1.id,
      brand: "KeyPro",
      tags: ["teclado", "mecánico", "rgb", "cherry"],
      stock: 45,
      sku: "KB-MEC-RGB",
      weight: 1.1,
      avgRating: 4.4,
      reviewCount: 56,
      salesCount: 120,
      views: 1890,
    },
    {
      name: "Tablet Creative 10\"",
      slug: "tablet-creative-10",
      description: "Tablet para creativos con pantalla de 10.5 pulgadas, lápiz incluido, 128GB, procesador octa-core. Perfecta para dibujo, diseño y entretenimiento.",
      price: 2999,
      originalPrice: 3500,
      costPrice: 1800,
      images: ["https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=800"],
      categoryId: cats["electronica"].id,
      vendorId: vendor1.id,
      brand: "CreativeTab",
      tags: ["tablet", "dibujo", "diseño"],
      badge: "Popular",
      trending: true,
      stock: 20,
      sku: "TB-CR-10",
      weight: 0.48,
      avgRating: 4.3,
      reviewCount: 19,
      salesCount: 35,
      views: 980,
    },
    {
      name: "Parlante Bluetooth Premium",
      slug: "parlante-bluetooth-premium",
      description: "Parlante portátil con sonido 360°, resistente al agua IPX7, 20 horas de batería, Bass Boost, y conexión multi-dispositivo.",
      price: 449,
      originalPrice: 600,
      costPrice: 200,
      images: ["https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=800"],
      categoryId: cats["audio"].id,
      vendorId: vendor1.id,
      brand: "BoomBox",
      tags: ["parlante", "bluetooth", "portátil", "ipx7"],
      stock: 60,
      sku: "PL-BT-PM",
      weight: 0.72,
      avgRating: 4.2,
      reviewCount: 45,
      salesCount: 89,
      views: 1340,
    },
    {
      name: "Camiseta Premium Algodón",
      slug: "camiseta-premium-algodon",
      description: "Camiseta de algodón orgánico 100%, corte regular, disponible en múltiples colores. Suave, transpirable y duradera.",
      price: 149,
      originalPrice: 200,
      costPrice: 50,
      images: ["https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800", "https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=800"],
      categoryId: cats["ropa"].id,
      vendorId: vendor2.id,
      brand: "ModaStyle",
      tags: ["camiseta", "algodón", "orgánico"],
      featured: true,
      stock: 200,
      sku: "CM-PA-REG",
      weight: 0.2,
      avgRating: 4.1,
      reviewCount: 78,
      salesCount: 234,
      views: 3450,
    },
    {
      name: "Zapatillas Running Pro",
      slug: "zapatillas-running-pro",
      description: "Zapatillas deportivas con amortiguación de gel, suela antideslizante, malla transpirable y soporte de arco. Ideales para correr y entrenar.",
      price: 699,
      originalPrice: 900,
      costPrice: 350,
      images: ["https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800"],
      categoryId: cats["deportes"].id,
      vendorId: vendor2.id,
      brand: "RunMax",
      tags: ["zapatillas", "running", "deporte"],
      badge: "Más vendido",
      trending: true,
      stock: 55,
      sku: "ZP-RUN-PRO",
      weight: 0.35,
      avgRating: 4.6,
      reviewCount: 92,
      salesCount: 178,
      views: 2890,
    },
    {
      name: "Mochila Urban 30L",
      slug: "mochila-urban-30l",
      description: "Mochila urbana de 30 litros con compartimiento para laptop de 15.6\", bolsillo antirrobo, puerto USB integrado y material resistente al agua.",
      price: 349,
      originalPrice: 450,
      costPrice: 150,
      images: ["https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800"],
      categoryId: cats["deportes"].id,
      vendorId: vendor2.id,
      brand: "UrbanPack",
      tags: ["mochila", "urban", "laptop", "antirrobo"],
      stock: 70,
      sku: "MC-URB-30",
      weight: 0.9,
      avgRating: 4.3,
      reviewCount: 41,
      salesCount: 67,
      views: 1120,
    },
    {
      name: "Lámpara LED Inteligente",
      slug: "lampara-led-inteligente",
      description: "Lámpara LED WiFi con 16 millones de colores, compatible con Alexa y Google Home, programable por app, ahorro de energía del 80%.",
      price: 199,
      originalPrice: 280,
      costPrice: 80,
      images: ["https://images.unsplash.com/photo-1507473885765-e6ed057ab6fe?w=800"],
      categoryId: cats["hogar"].id,
      vendorId: vendor2.id,
      brand: "SmartHome",
      tags: ["lámpara", "led", "smart", "wifi"],
      stock: 100,
      sku: "LM-LED-SM",
      weight: 0.15,
      avgRating: 4.0,
      reviewCount: 23,
      salesCount: 56,
      views: 870,
    },
    {
      name: "Webcam 4K Pro Stream",
      slug: "webcam-4k-pro-stream",
      description: "Webcam 4K con micrófono dual, corrección de luz automática, autofoco, campo de visión de 90°. Perfecta para streaming y videoconferencias.",
      price: 799,
      originalPrice: 950,
      costPrice: 400,
      images: ["https://images.unsplash.com/photo-1587826080692-f439cd0b70da?w=800"],
      categoryId: cats["computadoras"].id,
      vendorId: vendor1.id,
      brand: "StreamVision",
      tags: ["webcam", "4k", "streaming"],
      stock: 30,
      sku: "WC-4K-PS",
      weight: 0.16,
      avgRating: 4.5,
      reviewCount: 15,
      salesCount: 42,
      views: 650,
    },
    {
      name: "Mouse Ergonómico Wireless",
      slug: "mouse-ergonomico-wireless",
      description: "Mouse ergonómico inalámbrico con DPI ajustable (800-4000), 6 botones programables, receptor nano USB y batería recargable de 60 días.",
      price: 249,
      originalPrice: 320,
      costPrice: 100,
      images: ["https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=800"],
      categoryId: cats["computadoras"].id,
      vendorId: vendor1.id,
      brand: "ErgoPro",
      tags: ["mouse", "ergonómico", "wireless"],
      stock: 90,
      sku: "MS-ERG-WL",
      weight: 0.12,
      avgRating: 4.3,
      reviewCount: 37,
      salesCount: 98,
      views: 1450,
    },
    {
      name: "Chaqueta Invierno Térmica",
      slug: "chaqueta-invierno-termica",
      description: "Chaqueta térmica resistente al viento y agua, relleno de fibra sintética, capucha desmontable, múltiples bolsillos. Ideal para climas fríos.",
      price: 899,
      originalPrice: 1200,
      costPrice: 450,
      images: ["https://images.unsplash.com/photo-1551028719-00167b16eac5?w=800"],
      categoryId: cats["ropa"].id,
      vendorId: vendor2.id,
      brand: "ModaStyle",
      tags: ["chaqueta", "invierno", "térmica"],
      badge: "Temporada",
      stock: 35,
      sku: "CH-INV-TRM",
      weight: 0.85,
      avgRating: 4.7,
      reviewCount: 29,
      salesCount: 52,
      views: 1670,
    },
    {
      name: "Hub USB-C 8 en 1",
      slug: "hub-usb-c-8-en-1",
      description: "Hub USB-C con HDMI 4K, 3x USB 3.0, lector SD/TF, Ethernet Gigabit y carga PD de 100W. Compatible con MacBook, laptops y tablets.",
      price: 349,
      originalPrice: 450,
      costPrice: 150,
      images: ["https://images.unsplash.com/photo-1625842268584-8f3296236761?w=800"],
      categoryId: cats["electronica"].id,
      vendorId: vendor1.id,
      brand: "ConnectPro",
      tags: ["hub", "usb-c", "adaptador", "hdmi"],
      stock: 55,
      sku: "HB-UC-8N1",
      weight: 0.08,
      avgRating: 4.4,
      reviewCount: 21,
      salesCount: 73,
      views: 920,
    },
  ];

  for (const p of productData) {
    const product = await prisma.product.upsert({
      where: { slug: p.slug },
      update: {},
      create: p,
    });
    products.push(product);
  }

  // ─── VARIANTS ──────────────────────
  await prisma.productVariant.deleteMany({});
  const shirt = products.find((p) => p.slug === "camiseta-premium-algodon");
  if (shirt) {
    const variants = [
      { productId: shirt.id, name: "Talla", value: "S", sku: "CM-PA-S", stock: 50, price: 149 },
      { productId: shirt.id, name: "Talla", value: "M", sku: "CM-PA-M", stock: 60, price: 149 },
      { productId: shirt.id, name: "Talla", value: "L", sku: "CM-PA-L", stock: 50, price: 149 },
      { productId: shirt.id, name: "Talla", value: "XL", sku: "CM-PA-XL", stock: 40, price: 159 },
      { productId: shirt.id, name: "Color", value: "Negro", sku: "CM-PA-BLK", stock: 80 },
      { productId: shirt.id, name: "Color", value: "Blanco", sku: "CM-PA-WHT", stock: 70 },
      { productId: shirt.id, name: "Color", value: "Azul", sku: "CM-PA-BLU", stock: 50 },
    ];
    for (const v of variants) {
      await prisma.productVariant.create({ data: v });
    }
  }

  const shoes = products.find((p) => p.slug === "zapatillas-running-pro");
  if (shoes) {
    const sizes = ["38", "39", "40", "41", "42", "43", "44"];
    for (const s of sizes) {
      await prisma.productVariant.create({ data: { productId: shoes.id, name: "Talla", value: s, stock: 8 } });
    }
  }

  // ─── BANNERS ───────────────────────
  await prisma.banner.deleteMany({});
  await prisma.banner.createMany({
    data: [
      { title: "¡Mega Ofertas de Temporada!", subtitle: "Hasta 50% de descuento en electrónica", image: "https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=1200&h=400&fit=crop", link: "/?category=electronica", position: "hero", active: true, order: 1 },
      { title: "Nueva Colección de Moda", subtitle: "Descubre las últimas tendencias", image: "https://images.unsplash.com/photo-1483985988355-763728e1935b?w=1200&h=400&fit=crop", link: "/?category=ropa", position: "hero", active: true, order: 2 },
      { title: "Gaming Week", subtitle: "Todo para gamers con precios increíbles", image: "https://images.unsplash.com/photo-1612287230202-1ff1d85d1bdf?w=400&h=300&fit=crop", link: "/?category=gaming", position: "sidebar", active: true, order: 1 },
    ],
  });

  // ─── COLLECTIONS ───────────────────
  const bestSellers = await prisma.collection.upsert({
    where: { slug: "mas-vendidos" },
    update: {},
    create: {
      name: "Los Más Vendidos",
      slug: "mas-vendidos",
      description: "Nuestros productos más populares",
    },
  });
  const topProducts = products.filter((p) => p.salesCount > 80);
  for (let i = 0; i < topProducts.length; i++) {
    await prisma.collectionProduct.upsert({
      where: { collectionId_productId: { collectionId: bestSellers.id, productId: topProducts[i].id } },
      update: {},
      create: { collectionId: bestSellers.id, productId: topProducts[i].id, order: i },
    });
  }

  // ─── COUPONS ───────────────────────
  await prisma.coupon.deleteMany({});
  await prisma.coupon.createMany({
    data: [
      { code: "BIENVENIDO20", type: "percentage", discount: 20, maxDiscount: 200, minAmount: 500, maxUses: 1000, usedCount: 156, expiresAt: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000), active: true },
      { code: "ENVIOGRATIS", type: "fixed", discount: 50, minAmount: 200, maxUses: 500, usedCount: 89, expiresAt: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000), active: true },
      { code: "TECH30", type: "percentage", discount: 30, maxDiscount: 500, minAmount: 1000, maxUses: 200, usedCount: 34, expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), active: true },
      { code: "FLASH50", type: "percentage", discount: 50, maxDiscount: 300, minAmount: 600, maxUses: 50, usedCount: 12, perUser: 1, expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), active: true },
    ],
  });

  // ─── FLASH DEALS ───────────────────
  await prisma.flashDeal.deleteMany({});
  const flashProducts = products.slice(0, 4);
  for (const fp of flashProducts) {
    await prisma.flashDeal.create({
      data: {
        title: `Flash: ${fp.name}`,
        productId: fp.id,
        discount: Math.floor(Math.random() * 30) + 20,
        startDate: new Date(),
        endDate: new Date(Date.now() + 48 * 60 * 60 * 1000),
      },
    });
  }

  // ─── REVIEWS ───────────────────────
  await prisma.review.deleteMany({});
  const reviewTexts = [
    { title: "Excelente producto", comment: "Superó mis expectativas, la calidad es increíble y llegó rápido.", rating: 5 },
    { title: "Muy bueno", comment: "Buen producto, cumple con lo prometido. Lo recomiendo.", rating: 4 },
    { title: "Buena compra", comment: "Relación calidad-precio muy buena. El envío fue rápido.", rating: 4 },
    { title: "Increíble calidad", comment: "No esperaba tanta calidad por este precio. Definitivamente compraré de nuevo.", rating: 5 },
    { title: "Cumple su función", comment: "Es un producto decente, nada extraordinario pero cumple.", rating: 3 },
  ];
  const reviewUsers = [customer, customer2];
  for (const product of products.slice(0, 8)) {
    for (let i = 0; i < Math.min(reviewUsers.length, 2); i++) {
      const r = reviewTexts[Math.floor(Math.random() * reviewTexts.length)];
      await prisma.review.create({
        data: {
          productId: product.id,
          userId: reviewUsers[i].id,
          rating: r.rating,
          title: r.title,
          comment: r.comment,
          verified: Math.random() > 0.3,
        },
      });
    }
  }

  // ─── ORDERS ────────────────────────
  await prisma.orderItem.deleteMany({});
  await prisma.order.deleteMany({});
  const orderStatuses = ["pending", "confirmed", "processing", "shipped", "delivered"];
  const paymentStatuses = ["pending", "paid", "paid", "paid", "paid"];
  for (let i = 0; i < 12; i++) {
    const user = [customer, customer2][i % 2];
    const statusIdx = Math.floor(Math.random() * orderStatuses.length);
    const randomProducts = products.sort(() => Math.random() - 0.5).slice(0, Math.floor(Math.random() * 3) + 1);
    const items = randomProducts.map((p) => ({
      productId: p.id,
      quantity: Math.floor(Math.random() * 3) + 1,
      price: p.price,
    }));
    const subtotal = items.reduce((s, it) => s + it.price * it.quantity, 0);
    const shippingCost = subtotal > 200 ? 0 : 25;
    await prisma.order.create({
      data: {
        userId: user.id,
        customerEmail: user.email,
        customerName: user.name,
        orderNumber: `NT-${String(2024000 + i).padStart(7, "0")}`,
        status: orderStatuses[statusIdx],
        paymentStatus: paymentStatuses[statusIdx],
        subtotal,
        shippingCost,
        discountAmount: 0,
        tax: 0,
        total: subtotal + shippingCost,
        items: { create: items },
        createdAt: new Date(Date.now() - Math.floor(Math.random() * 30) * 24 * 60 * 60 * 1000),
      },
    });
  }

  // ─── ADDRESSES ─────────────────────
  await prisma.address.deleteMany({});
  await prisma.address.createMany({
    data: [
      { userId: customer.id, name: "Pedro López", phone: "+591 71234567", street: "Av. Arce #1234", city: "La Paz", state: "La Paz", zipCode: "0000", country: "Bolivia", isDefault: true },
      { userId: customer.id, name: "Pedro López", phone: "+591 71234567", street: "Calle Sucre #567, Edificio Central, Piso 3", city: "Cochabamba", state: "Cochabamba", country: "Bolivia" },
      { userId: customer2.id, name: "Ana Torres", phone: "+591 76543210", street: "Av. Banzer #890", city: "Santa Cruz", state: "Santa Cruz", zipCode: "0000", country: "Bolivia", isDefault: true },
    ],
  });

  // ─── NOTIFICATIONS ─────────────────
  await prisma.notification.deleteMany({});
  await prisma.notification.createMany({
    data: [
      { userId: customer.id, type: "order", title: "Pedido enviado", message: "Tu pedido NT-2024000 ha sido enviado. Tracking: BOL123456", read: false },
      { userId: customer.id, type: "promo", title: "¡Flash Sale!", message: "50% de descuento en auriculares por las próximas 24 horas", read: false },
      { userId: customer.id, type: "system", title: "Bienvenido a NovaTech", message: "¡Gracias por registrarte! Usa el código BIENVENIDO20 en tu primera compra.", read: true },
      { userId: vendor1User.id, type: "order", title: "Nueva venta", message: "Has recibido un nuevo pedido por Bs. 6,999", read: false },
    ],
  });

  // ─── QUESTIONS ─────────────────────
  await prisma.productAnswer.deleteMany({});
  await prisma.productQuestion.deleteMany({});
  const laptop = products.find((p) => p.slug === "laptop-ultrabook-pro-15");
  if (laptop) {
    const q = await prisma.productQuestion.create({
      data: { productId: laptop.id, userId: customer.id, question: "¿Tiene garantía internacional o solo en Bolivia?" },
    });
    await prisma.productAnswer.create({
      data: { questionId: q.id, userId: vendor1User.id, answer: "La garantía es de 1 año válida en todo Latinoamérica. Contáctanos para más detalles." },
    });
  }

  // ─── SETTINGS ──────────────────────
  const settings = [
    { key: "store_name", value: "NovaTech Marketplace", category: "general" },
    { key: "store_email", value: "contacto@novatech.bo", category: "general" },
    { key: "store_phone", value: "+591 2 1234567", category: "general" },
    { key: "store_address", value: "Av. 16 de Julio #1500, La Paz, Bolivia", category: "general" },
    { key: "free_shipping_min", value: "200", category: "shipping" },
    { key: "default_commission", value: "10", category: "vendors" },
    { key: "loyalty_points_rate", value: "10", category: "loyalty" },
    { key: "referral_reward", value: "50", category: "loyalty" },
  ];
  for (const s of settings) {
    await prisma.setting.upsert({ where: { key: s.key }, update: {}, create: s });
  }

  console.log("✅ Seed completed!");
  console.log(`   ${products.length} products, ${Object.keys(cats).length} categories`);
  console.log("   Credentials: admin@novatech.bo / Password123!");
  console.log("   Vendor: vendedor@novatech.bo / Password123!");
  console.log("   Customer: cliente@novatech.bo / Password123!");
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(async () => { await prisma.$disconnect(); });
