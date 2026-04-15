const { PrismaClient } = require("@prisma/client");
const { hash } = require("bcryptjs");
const prisma = new PrismaClient();

const products = [
  // Audífonos & Audio
  { name: "Audífonos Bluetooth Pro ANC", description: "Audífonos inalámbricos con cancelación de ruido activa, 30h de batería, micrófono HD y estuche de carga.", price: 289.00, image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=400&fit=crop", category: "Audio", stock: 25, active: true },
  { name: "Earbuds TWS Sport", description: "Auriculares true wireless deportivos, resistentes al agua IPX5, sonido bass potente y 24h de batería total.", price: 149.00, image: "https://images.unsplash.com/photo-1590658268037-6bf12f032f55?w=400&h=400&fit=crop", category: "Audio", stock: 40, active: true },
  { name: "Parlante Bluetooth Portátil", description: "Altavoz portátil 20W, resistente al agua IPX7, 12h de batería, perfecto para exteriores.", price: 199.00, image: "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=400&h=400&fit=crop", category: "Audio", stock: 30, active: true },
  // Cargadores & Energía
  { name: "Cargador Rápido 65W GaN", description: "Cargador compacto GaN de 65W con 2 puertos USB-C y 1 USB-A. Carga tu laptop y celular al mismo tiempo.", price: 179.00, image: "https://images.unsplash.com/photo-1583863788434-e58a36330cf0?w=400&h=400&fit=crop", category: "Energía", stock: 35, active: true },
  { name: "Power Bank 20000mAh", description: "Batería externa de 20000mAh con carga rápida PD 22.5W, pantalla LED y 3 puertos de salida.", price: 159.00, image: "https://images.unsplash.com/photo-1609091839311-d5365f9ff1c5?w=400&h=400&fit=crop", category: "Energía", stock: 28, active: true },
  { name: "Base Carga Inalámbrica 15W", description: "Cargador inalámbrico Qi de 15W, compatible con iPhone y Samsung, diseño ultra delgado.", price: 89.00, image: "https://images.unsplash.com/photo-1586816879360-004f5b0c51e3?w=400&h=400&fit=crop", category: "Energía", stock: 45, active: true },
  // Accesorios PC & Laptop
  { name: "Hub USB-C 7 en 1", description: "Hub multipuerto premium: HDMI 4K, 3x USB 3.0, lector SD/microSD, USB-C PD 100W.", price: 189.00, image: "https://images.unsplash.com/photo-1625723044792-44de16ccb4e9?w=400&h=400&fit=crop", category: "Accesorios PC", stock: 22, active: true },
  { name: "Teclado Mecánico RGB Compacto", description: "Teclado mecánico 65%, switches intercambiables, retroiluminación RGB y cuerpo de aluminio.", price: 349.00, image: "https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=400&h=400&fit=crop", category: "Accesorios PC", stock: 15, active: true },
  { name: "Mouse Ergonómico Vertical", description: "Mouse vertical inalámbrico 2.4GHz + Bluetooth, sensor óptico 2400 DPI, reduce fatiga.", price: 129.00, image: "https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=400&h=400&fit=crop", category: "Accesorios PC", stock: 38, active: true },
  { name: "Soporte Laptop Aluminio", description: "Soporte ergonómico ajustable de aluminio premium, compatible con laptops de 10 a 17 pulgadas.", price: 139.00, image: "https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?w=400&h=400&fit=crop", category: "Accesorios PC", stock: 20, active: true },
  // Cables & Conectividad
  { name: "Cable USB-C Trenzado 2m", description: "Cable USB-C a USB-C de nailon trenzado, carga rápida 100W y transferencia de datos 480Mbps.", price: 45.00, image: "https://images.unsplash.com/photo-1558618666-fcd25c85f82e?w=400&h=400&fit=crop", category: "Cables", stock: 80, active: true },
  { name: "Cable HDMI 2.1 4K 2m", description: "Cable HDMI 2.1 ultra alta velocidad, soporta 4K@120Hz y 8K@60Hz, ideal para gaming.", price: 69.00, image: "https://images.unsplash.com/photo-1616400619175-5beda3a17896?w=400&h=400&fit=crop", category: "Cables", stock: 50, active: true },
  // Iluminación & Streaming
  { name: "Ring Light LED 10\"", description: "Aro de luz LED de 10 pulgadas con trípode ajustable y soporte para celular, 3 modos de luz.", price: 119.00, image: "https://images.unsplash.com/photo-1507473885765-e6ed057ab872?w=400&h=400&fit=crop", category: "Streaming", stock: 18, active: true },
  { name: "Webcam Full HD 1080p", description: "Cámara web 1080p con autofoco, micrófono dual y corrección de luz automática.", price: 199.00, image: "https://images.unsplash.com/photo-1587826080692-f439cd0b70da?w=400&h=400&fit=crop", category: "Streaming", stock: 12, active: true },
  // Protección & Fundas
  { name: "Funda Laptop Neopreno 15.6\"", description: "Funda protectora de neopreno resistente al agua con bolsillo exterior y cierre premium.", price: 79.00, image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400&h=400&fit=crop", category: "Protección", stock: 33, active: true },
  { name: "Mochila Tech Antirrobo", description: "Mochila resistente al agua con compartimento laptop 15.6\", puerto USB externo y cierre oculto.", price: 249.00, image: "https://images.unsplash.com/photo-1622560480605-d83c853bc5c3?w=400&h=400&fit=crop", category: "Protección", stock: 15, active: true },
];

async function main() {
  console.log("🌱 Seeding database...");

  // Clear existing data
  await prisma.orderItem.deleteMany();
  await prisma.order.deleteMany();
  await prisma.product.deleteMany();
  await prisma.user.deleteMany();

  // Create admin user
  const adminPass = await hash("admin123", 12);
  const admin = await prisma.user.create({
    data: { name: "Administrador", email: "admin@novatech.bo", password: adminPass, role: "admin" },
  });
  console.log("\u2705 Created admin user: admin@novatech.bo / admin123");

  // Create demo customer
  const customerPass = await hash("customer123", 12);
  const customer = await prisma.user.create({
    data: { name: "Cliente Demo", email: "demo@example.com", password: customerPass, role: "customer" },
  });
  console.log("✅ Created demo customer: demo@example.com / customer123");

  for (const product of products) {
    await prisma.product.create({ data: product });
  }

  console.log(`✅ Created ${products.length} products`);

  // Create a demo order
  const p1 = await prisma.product.findFirst({ where: { name: { contains: "Bluetooth Pro" } } });
  const p2 = await prisma.product.findFirst({ where: { name: { contains: "Power Bank" } } });

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
    console.log("✅ Created demo order");
  }

  console.log("🎉 Seed completed!");
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
