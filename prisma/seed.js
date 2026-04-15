const { PrismaClient } = require("@prisma/client");
const { hash } = require("bcryptjs");
const prisma = new PrismaClient();

const products = [
  // Audio
  { name: "Audífonos Bluetooth Pro ANC", description: "Audífonos inalámbricos con cancelación de ruido activa, 30h de batería, micrófono HD y estuche de carga. El sonido premium que mereces.", price: 249.00, originalPrice: 289.00, image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=400&fit=crop", images: ["https://images.unsplash.com/photo-1583394838336-acd977736f90?w=400&h=400&fit=crop", "https://images.unsplash.com/photo-1487215078519-e21cc028cb29?w=400&h=400&fit=crop"], category: "Audio", stock: 25, active: true, featured: true, badge: "Más vendido" },
  { name: "Earbuds TWS Sport", description: "Auriculares true wireless deportivos, resistentes al agua IPX5, sonido bass potente y 24h de batería total.", price: 149.00, image: "https://images.unsplash.com/photo-1590658268037-6bf12f032f55?w=400&h=400&fit=crop", images: [], category: "Audio", stock: 40, active: true, badge: "Nuevo" },
  { name: "Parlante Bluetooth Portátil", description: "Altavoz portátil 20W, resistente al agua IPX7, 12h de batería, perfecto para exteriores.", price: 169.00, originalPrice: 199.00, image: "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=400&h=400&fit=crop", images: [], category: "Audio", stock: 30, active: true },

  // Energía
  { name: "Cargador Rápido 65W GaN", description: "Cargador compacto GaN de 65W con 2 puertos USB-C y 1 USB-A. Carga tu laptop y celular al mismo tiempo.", price: 139.00, originalPrice: 179.00, image: "https://images.unsplash.com/photo-1583863788434-e58a36330cf0?w=400&h=400&fit=crop", images: [], category: "Energía", stock: 35, active: true, featured: true, badge: "Oferta" },
  { name: "Power Bank 20000mAh", description: "Batería externa de 20000mAh con carga rápida PD 22.5W, pantalla LED y 3 puertos de salida.", price: 159.00, image: "https://images.unsplash.com/photo-1609091839311-d5365f9ff1c5?w=400&h=400&fit=crop", images: [], category: "Energía", stock: 28, active: true },
  { name: "Base Carga Inalámbrica 15W", description: "Cargador inalámbrico Qi de 15W, compatible con iPhone y Samsung, diseño ultra delgado.", price: 89.00, image: "https://images.unsplash.com/photo-1586816879360-004f5b0c51e3?w=400&h=400&fit=crop", images: [], category: "Energía", stock: 45, active: true },

  // Accesorios PC
  { name: "Hub USB-C 7 en 1", description: "Hub multipuerto premium: HDMI 4K, 3x USB 3.0, lector SD/microSD, USB-C PD 100W.", price: 189.00, image: "https://images.unsplash.com/photo-1625723044792-44de16ccb4e9?w=400&h=400&fit=crop", images: [], category: "Accesorios PC", stock: 22, active: true },
  { name: "Teclado Mecánico RGB Compacto", description: "Teclado mecánico 65%, switches intercambiables, retroiluminación RGB y cuerpo de aluminio. Diseñado para gamers y programadores.", price: 299.00, originalPrice: 349.00, image: "https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=400&h=400&fit=crop", images: ["https://images.unsplash.com/photo-1595225476474-87563907a212?w=400&h=400&fit=crop"], category: "Accesorios PC", stock: 15, active: true, featured: true, badge: "Premium" },
  { name: "Mouse Ergonómico Vertical", description: "Mouse vertical inalámbrico 2.4GHz + Bluetooth, sensor óptico 2400 DPI, reduce fatiga.", price: 129.00, image: "https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=400&h=400&fit=crop", images: [], category: "Accesorios PC", stock: 38, active: true },
  { name: "Soporte Laptop Aluminio", description: "Soporte ergonómico ajustable de aluminio premium, compatible con laptops de 10 a 17 pulgadas.", price: 139.00, image: "https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?w=400&h=400&fit=crop", images: [], category: "Accesorios PC", stock: 20, active: true },

  // Cables
  { name: "Cable USB-C Trenzado 2m", description: "Cable USB-C a USB-C de nailon trenzado, carga rápida 100W y transferencia de datos 480Mbps.", price: 45.00, image: "https://images.unsplash.com/photo-1558618666-fcd25c85f82e?w=400&h=400&fit=crop", images: [], category: "Cables", stock: 80, active: true },
  { name: "Cable HDMI 2.1 4K 2m", description: "Cable HDMI 2.1 ultra alta velocidad, soporta 4K@120Hz y 8K@60Hz, ideal para gaming.", price: 69.00, image: "https://images.unsplash.com/photo-1616400619175-5beda3a17896?w=400&h=400&fit=crop", images: [], category: "Cables", stock: 50, active: true },

  // Streaming
  { name: "Ring Light LED 10\"", description: "Aro de luz LED de 10 pulgadas con trípode ajustable y soporte para celular, 3 modos de luz.", price: 99.00, originalPrice: 119.00, image: "https://images.unsplash.com/photo-1507473885765-e6ed057ab872?w=400&h=400&fit=crop", images: [], category: "Streaming", stock: 18, active: true, badge: "Oferta" },
  { name: "Webcam Full HD 1080p", description: "Cámara web 1080p con autofoco, micrófono dual y corrección de luz automática.", price: 199.00, image: "https://images.unsplash.com/photo-1587826080692-f439cd0b70da?w=400&h=400&fit=crop", images: [], category: "Streaming", stock: 12, active: true },

  // Protección
  { name: "Funda Laptop Neopreno 15.6\"", description: "Funda protectora de neopreno resistente al agua con bolsillo exterior y cierre premium.", price: 79.00, image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400&h=400&fit=crop", images: [], category: "Protección", stock: 33, active: true },
  { name: "Mochila Tech Antirrobo", description: "Mochila resistente al agua con compartimento laptop 15.6\", puerto USB externo y cierre oculto. La compañera perfecta para tu día a día.", price: 199.00, originalPrice: 249.00, image: "https://images.unsplash.com/photo-1622560480605-d83c853bc5c3?w=400&h=400&fit=crop", images: ["https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400&h=400&fit=crop"], category: "Protección", stock: 15, active: true, featured: true, badge: "Popular" },
];

const reviews = [
  { productName: "Audífonos Bluetooth Pro ANC", rating: 5, comment: "Increíble la cancelación de ruido. Mejor compra del año, totalmente recomendados." },
  { productName: "Audífonos Bluetooth Pro ANC", rating: 4, comment: "Muy buen sonido, la batería dura bastante. Solo le falta un poco más de graves." },
  { productName: "Audífonos Bluetooth Pro ANC", rating: 5, comment: "Excelente calidad de audio y muy cómodos para largo uso." },
  { productName: "Teclado Mecánico RGB Compacto", rating: 5, comment: "Los switches son geniales. RGB increíble y el aluminio se siente premium." },
  { productName: "Teclado Mecánico RGB Compacto", rating: 4, comment: "Muy bueno para programar, las teclas responden perfecto." },
  { productName: "Mochila Tech Antirrobo", rating: 5, comment: "Espaciosa, resistente y el cierre oculto es genial. Perfecta para la laptop." },
  { productName: "Mochila Tech Antirrobo", rating: 5, comment: "La mejor mochila que he comprado. El puerto USB es muy práctico." },
  { productName: "Mochila Tech Antirrobo", rating: 4, comment: "Muy buena calidad, solo el material interior podría ser mejor." },
  { productName: "Cargador Rápido 65W GaN", rating: 5, comment: "Carga mi laptop super rápido. Muy compacto para viajar." },
  { productName: "Cargador Rápido 65W GaN", rating: 4, comment: "Funciona genial, carga rápida real. Vale la pena el precio." },
  { productName: "Power Bank 20000mAh", rating: 4, comment: "Gran capacidad y carga rápida. La pantalla LED es útil." },
  { productName: "Earbuds TWS Sport", rating: 4, comment: "Perfectos para el gimnasio. No se caen y el sonido es potente." },
  { productName: "Earbuds TWS Sport", rating: 5, comment: "Los uso para correr y son excelentes. La resistencia al agua es real." },
  { productName: "Parlante Bluetooth Portátil", rating: 5, comment: "Sonido potente para su tamaño. Lo uso en la ducha sin problemas." },
  { productName: "Hub USB-C 7 en 1", rating: 4, comment: "Funciona perfecto con mi MacBook. HDMI 4K sin lag." },
  { productName: "Mouse Ergonómico Vertical", rating: 4, comment: "Me alivió el dolor de muñeca. La batería dura mucho." },
  { productName: "Ring Light LED 10\"", rating: 5, comment: "Perfecta para videollamadas y contenido. Tres modos de luz geniales." },
  { productName: "Webcam Full HD 1080p", rating: 4, comment: "Mucho mejor que la cámara de mi laptop. El autofoco es rápido." },
  { productName: "Cable USB-C Trenzado 2m", rating: 5, comment: "Muy resistente y carga rápido. El trenzado de nailon es de calidad." },
  { productName: "Funda Laptop Neopreno 15.6\"", rating: 4, comment: "Protege bien mi laptop. El bolsillo exterior es práctico." },
];

const coupons = [
  { code: "NOVA10", discount: 10, active: true, minAmount: 100, maxUses: 100 },
  { code: "BIENVENIDO", discount: 15, active: true, minAmount: 200, maxUses: 50 },
  { code: "TECH20", discount: 20, active: true, minAmount: 400, maxUses: 30 },
  { code: "FREESHIP", discount: 5, active: true, minAmount: null, maxUses: 200 },
];

async function main() {
  console.log("🌱 Seeding database...");

  // Clear existing data
  await prisma.wishlist.deleteMany();
  await prisma.review.deleteMany();
  await prisma.orderItem.deleteMany();
  await prisma.order.deleteMany();
  await prisma.product.deleteMany();
  await prisma.user.deleteMany();
  await prisma.coupon.deleteMany();

  // Create admin user
  const adminPass = await hash("admin123", 12);
  const admin = await prisma.user.create({
    data: { name: "Administrador", email: "admin@novatech.bo", password: adminPass, role: "admin" },
  });
  console.log("✅ Created admin user: admin@novatech.bo / admin123");

  // Create demo customers
  const customerPass = await hash("customer123", 12);
  const customer = await prisma.user.create({
    data: { name: "Cliente Demo", email: "demo@example.com", password: customerPass, role: "customer" },
  });

  const customer2Pass = await hash("maria123", 12);
  const customer2 = await prisma.user.create({
    data: { name: "María García", email: "maria@example.com", password: customer2Pass, role: "customer" },
  });

  const customer3Pass = await hash("carlos123", 12);
  const customer3 = await prisma.user.create({
    data: { name: "Carlos López", email: "carlos@example.com", password: customer3Pass, role: "customer" },
  });

  console.log("✅ Created 3 demo customers");

  // Create products
  const createdProducts = [];
  for (const product of products) {
    const p = await prisma.product.create({ data: product });
    createdProducts.push(p);
  }
  console.log(`✅ Created ${createdProducts.length} products`);

  // Create reviews
  const reviewUsers = [customer, customer2, customer3];
  let reviewCount = 0;
  for (const review of reviews) {
    const product = createdProducts.find((p) => p.name === review.productName);
    if (product) {
      const user = reviewUsers[reviewCount % reviewUsers.length];
      try {
        await prisma.review.create({
          data: {
            rating: review.rating,
            comment: review.comment,
            userId: user.id,
            productId: product.id,
          },
        });
        reviewCount++;
      } catch {
        // Skip duplicate reviews (same user + product)
      }
    }
  }
  console.log(`✅ Created ${reviewCount} reviews`);

  // Create coupons
  for (const coupon of coupons) {
    await prisma.coupon.create({ data: coupon });
  }
  console.log(`✅ Created ${coupons.length} coupons`);

  // Create demo orders
  const p1 = createdProducts.find((p) => p.name.includes("Bluetooth Pro"));
  const p2 = createdProducts.find((p) => p.name.includes("Power Bank"));
  const p3 = createdProducts.find((p) => p.name.includes("Teclado Mecánico"));
  const p4 = createdProducts.find((p) => p.name.includes("Mochila"));

  if (p1 && p2) {
    await prisma.order.create({
      data: {
        customerEmail: "demo@example.com",
        customerName: "Cliente Demo",
        status: "paid",
        total: p1.price + p2.price * 2,
        userId: customer.id,
        items: {
          create: [
            { productId: p1.id, quantity: 1, price: p1.price },
            { productId: p2.id, quantity: 2, price: p2.price },
          ],
        },
      },
    });
  }

  if (p3 && p4) {
    await prisma.order.create({
      data: {
        customerEmail: "maria@example.com",
        customerName: "María García",
        status: "shipped",
        total: p3.price + p4.price,
        couponCode: "NOVA10",
        discountAmount: (p3.price + p4.price) * 0.1,
        userId: customer2.id,
        items: {
          create: [
            { productId: p3.id, quantity: 1, price: p3.price },
            { productId: p4.id, quantity: 1, price: p4.price },
          ],
        },
      },
    });
  }

  if (p1) {
    await prisma.order.create({
      data: {
        customerEmail: "carlos@example.com",
        customerName: "Carlos López",
        status: "pending",
        total: p1.price,
        userId: customer3.id,
        items: {
          create: [
            { productId: p1.id, quantity: 1, price: p1.price },
          ],
        },
      },
    });
  }

  console.log("✅ Created 3 demo orders");

  // Create wishlists
  if (p1 && p3) {
    await prisma.wishlist.create({ data: { userId: customer.id, productId: p1.id } });
    await prisma.wishlist.create({ data: { userId: customer.id, productId: p3.id } });
  }
  console.log("✅ Created demo wishlists");

  console.log("🎉 Seed completed!");
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
