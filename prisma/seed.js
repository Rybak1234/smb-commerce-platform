const { PrismaClient } = require("@prisma/client");
const { hash } = require("bcryptjs");
const prisma = new PrismaClient();

const products = [
  // Electrónica
  { name: "Auriculares Bluetooth Pro", description: "Auriculares inalámbricos con cancelación de ruido activa, 30h de batería y micrófono integrado.", price: 899.99, image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=400&fit=crop", category: "Electrónica", stock: 25, active: true },
  { name: "Teclado Mecánico RGB", description: "Teclado mecánico con switches Cherry MX, retroiluminación RGB y reposamuñecas.", price: 1299.50, image: "https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=400&h=400&fit=crop", category: "Electrónica", stock: 15, active: true },
  { name: "Monitor 4K 27\"", description: "Monitor IPS 4K UHD de 27 pulgadas, HDR400, 60Hz, ideal para diseño y productividad.", price: 5999.00, image: "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=400&h=400&fit=crop", category: "Electrónica", stock: 8, active: true },
  { name: "Mouse Ergonómico Vertical", description: "Mouse vertical inalámbrico, reduce fatiga, sensor óptico 2400 DPI.", price: 549.00, image: "https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=400&h=400&fit=crop", category: "Electrónica", stock: 40, active: true },
  // Accesorios
  { name: "Mochila Laptop 15.6\"", description: "Mochila resistente al agua con compartimento acolchado para laptop, puerto USB externo.", price: 699.00, image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400&h=400&fit=crop", category: "Accesorios", stock: 20, active: true },
  { name: "Hub USB-C 7 en 1", description: "Hub multipuerto: HDMI 4K, 3x USB 3.0, SD/microSD, USB-C PD 100W.", price: 449.99, image: "https://images.unsplash.com/photo-1625723044792-44de16ccb4e9?w=400&h=400&fit=crop", category: "Accesorios", stock: 30, active: true },
  { name: "Soporte para Laptop", description: "Soporte de aluminio ajustable, mejora la ergonomía y ventilación.", price: 399.00, image: "https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?w=400&h=400&fit=crop", category: "Accesorios", stock: 18, active: true },
  // Hogar
  { name: "Lámpara LED de Escritorio", description: "Lámpara LED regulable con 5 niveles de brillo, temperatura de color ajustable y puerto USB.", price: 349.50, image: "https://images.unsplash.com/photo-1507473885765-e6ed057ab872?w=400&h=400&fit=crop", category: "Hogar", stock: 35, active: true },
  { name: "Organizador de Cables", description: "Kit completo para organizar cables del escritorio. Incluye clips, velcro y canaletas.", price: 159.00, image: "https://images.unsplash.com/photo-1558618666-fcd25c85f82e?w=400&h=400&fit=crop", category: "Hogar", stock: 50, active: true },
  { name: "Alfombrilla XL para Escritorio", description: "Alfombrilla de escritorio extendida 80x30cm, superficie suave, base antideslizante.", price: 249.00, image: "https://images.unsplash.com/photo-1616400619175-5beda3a17896?w=400&h=400&fit=crop", category: "Hogar", stock: 3, active: true },
  // Software
  { name: "Licencia Antivirus Premium", description: "Protección completa por 1 año, hasta 3 dispositivos. Incluye VPN y gestor de contraseñas.", price: 599.00, image: "https://images.unsplash.com/photo-1563206767-5b18f218e8de?w=400&h=400&fit=crop", category: "Software", stock: 100, active: true },
  { name: "Suite Ofimática Cloud", description: "Suscripción anual: procesador de texto, hojas de cálculo, presentaciones y 1TB en la nube.", price: 999.00, image: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=400&h=400&fit=crop", category: "Software", stock: 100, active: true },
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
    data: { name: "Administrador", email: "admin@smbcommerce.com", password: adminPass, role: "admin" },
  });
  console.log("✅ Created admin user: admin@smbcommerce.com / admin123");

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
  const p1 = await prisma.product.findFirst({ where: { name: { contains: "Auriculares" } } });
  const p2 = await prisma.product.findFirst({ where: { name: { contains: "Mochila" } } });

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
