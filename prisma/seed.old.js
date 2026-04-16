const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcryptjs");

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding NovaTech Marketplace con datos reales...");

  const hash = await bcrypt.hash("Password123!", 10);

  // ─── USERS (con avatares reales) ──────────────────────
  const admin = await prisma.user.upsert({
    where: { email: "admin@novatech.bo" },
    update: {},
    create: { email: "admin@novatech.bo", password: hash, name: "Rodrigo Huanca", role: "admin", avatar: "https://i.pravatar.cc/150?u=admin@novatech.bo", loyaltyPoints: 0, referralCode: "NTADMIN" },
  });
  const vendor1User = await prisma.user.upsert({
    where: { email: "vendedor@novatech.bo" },
    update: {},
    create: { email: "vendedor@novatech.bo", password: hash, name: "Carlos Mendoza", role: "vendor", avatar: "https://i.pravatar.cc/150?u=vendedor@novatech.bo", loyaltyPoints: 150, referralCode: "CARLOS1" },
  });
  const vendor2User = await prisma.user.upsert({
    where: { email: "tienda@novatech.bo" },
    update: {},
    create: { email: "tienda@novatech.bo", password: hash, name: "María Quispe", role: "vendor", avatar: "https://i.pravatar.cc/150?u=tienda@novatech.bo", loyaltyPoints: 200, referralCode: "MARIA1" },
  });
  const customer = await prisma.user.upsert({
    where: { email: "cliente@novatech.bo" },
    update: {},
    create: { email: "cliente@novatech.bo", password: hash, name: "Pedro López", role: "customer", avatar: "https://i.pravatar.cc/150?u=cliente@novatech.bo", loyaltyPoints: 320, referralCode: "PEDRO1" },
  });
  const customer2 = await prisma.user.upsert({
    where: { email: "ana@novatech.bo" },
    update: {},
    create: { email: "ana@novatech.bo", password: hash, name: "Ana Torres", role: "customer", avatar: "https://i.pravatar.cc/150?u=ana@novatech.bo", loyaltyPoints: 85, referralCode: "ANA1" },
  });

  // ─── VENDORS ───────────────────────
  const vendor1 = await prisma.vendor.upsert({
    where: { userId: vendor1User.id },
    update: {},
    create: {
      userId: vendor1User.id,
      storeName: "TecnoBolivia",
      slug: "tecnobolivia",
      description: "Distribuidora autorizada de Samsung, Xiaomi, Apple y Lenovo en Bolivia. Productos originales con garantía oficial.",
      logo: "https://ui-avatars.com/api/?name=TB&background=059669&color=fff&size=128",
      banner: "https://images.unsplash.com/photo-1518770660439-4636190af475?w=1200&h=400&fit=crop",
      phone: "+591 2 2444567",
      email: "ventas@tecnobolivia.bo",
      commissionRate: 8,
      status: "approved",
      subscriptionTier: "pro",
      verified: true,
      totalSales: 234,
      totalRevenue: 189500,
    },
  });
  const vendor2 = await prisma.vendor.upsert({
    where: { userId: vendor2User.id },
    update: {},
    create: {
      userId: vendor2User.id,
      storeName: "Casa Moda Bolivia",
      slug: "casa-moda-bolivia",
      description: "Moda, calzado y accesorios importados. Tendencias internacionales adaptadas al estilo boliviano.",
      logo: "https://ui-avatars.com/api/?name=CM&background=d97706&color=fff&size=128",
      phone: "+591 3 3567890",
      email: "info@casamoda.bo",
      commissionRate: 10,
      status: "approved",
      subscriptionTier: "pro",
      verified: true,
      totalSales: 178,
      totalRevenue: 98700,
    },
  });

  // ─── CATEGORIES ────────────────────
  const cats = {};
  const catData = [
    { name: "Smartphones", slug: "smartphones", description: "Teléfonos celulares y tablets de las mejores marcas", image: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400&h=300&fit=crop" },
    { name: "Laptops y PCs", slug: "laptops-pcs", description: "Computadoras portátiles y de escritorio", image: "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=400&h=300&fit=crop" },
    { name: "Audio y Sonido", slug: "audio-sonido", description: "Auriculares, parlantes y equipos de audio", image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=300&fit=crop" },
    { name: "Gaming", slug: "gaming", description: "Consolas, periféricos y accesorios gamer", image: "https://images.unsplash.com/photo-1612287230202-1ff1d85d1bdf?w=400&h=300&fit=crop" },
    { name: "Televisores", slug: "televisores", description: "Smart TVs, monitores y pantallas", image: "https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=400&h=300&fit=crop" },
    { name: "Ropa y Moda", slug: "ropa-moda", description: "Vestimenta, calzado y accesorios de moda", image: "https://images.unsplash.com/photo-1445205170230-053b83016050?w=400&h=300&fit=crop" },
    { name: "Hogar Inteligente", slug: "hogar-inteligente", description: "Domótica, iluminación smart y electrodomésticos", image: "https://images.unsplash.com/photo-1558002038-1055907df827?w=400&h=300&fit=crop" },
    { name: "Deportes", slug: "deportes", description: "Equipamiento deportivo y fitness", image: "https://images.unsplash.com/photo-1461896836934-bd45ba7b4b94?w=400&h=300&fit=crop" },
  ];
  for (const c of catData) {
    cats[c.slug] = await prisma.category.upsert({ where: { slug: c.slug }, update: {}, create: c });
  }

  // ─── PRODUCTOS REALES ──────────────────────
  const products = [];
  const productData = [
    // === SMARTPHONES ===
    {
      name: "Samsung Galaxy S24 Ultra 256GB",
      slug: "samsung-galaxy-s24-ultra-256gb",
      description: "El Samsung Galaxy S24 Ultra cuenta con pantalla Dynamic AMOLED 2X de 6.8\", procesador Snapdragon 8 Gen 3, cámara principal de 200MP con zoom óptico 5x, S Pen integrado, 12GB RAM, 256GB almacenamiento, batería de 5000mAh con carga rápida de 45W. Resistencia IP68. Galaxy AI integrado.",
      price: 8999,
      originalPrice: 9999,
      comparePrice: 9999,
      costPrice: 6500,
      images: ["https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=800", "https://images.unsplash.com/photo-1678685888221-cda773a3dcdb?w=800"],
      categoryId: cats["smartphones"].id,
      vendorId: vendor1.id,
      brand: "Samsung",
      tags: ["samsung", "galaxy", "s24", "ultra", "5g", "ai"],
      badge: "Más vendido",
      featured: true,
      trending: true,
      stock: 18,
      sku: "SAM-S24U-256",
      weight: 0.233,
      avgRating: 4.8,
      reviewCount: 89,
      salesCount: 156,
      views: 4500,
    },
    {
      name: "iPhone 15 Pro Max 256GB",
      slug: "iphone-15-pro-max-256gb",
      description: "iPhone 15 Pro Max con chip A17 Pro, pantalla Super Retina XDR de 6.7\" con ProMotion, cámara de 48MP con zoom óptico 5x, titanio de grado aeroespacial, USB-C con USB 3, Action Button. Grabación de video ProRes y Spatial Video.",
      price: 9499,
      originalPrice: 10500,
      comparePrice: 10500,
      costPrice: 7200,
      images: ["https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=800", "https://images.unsplash.com/photo-1592899677977-9c10ca588bbd?w=800"],
      categoryId: cats["smartphones"].id,
      vendorId: vendor1.id,
      brand: "Apple",
      tags: ["apple", "iphone", "15", "pro-max", "titanio"],
      badge: "Premium",
      featured: true,
      trending: true,
      stock: 12,
      sku: "APL-IP15PM-256",
      weight: 0.221,
      avgRating: 4.9,
      reviewCount: 67,
      salesCount: 98,
      views: 6200,
    },
    {
      name: "Xiaomi Redmi Note 13 Pro 5G 256GB",
      slug: "xiaomi-redmi-note-13-pro-5g",
      description: "Xiaomi Redmi Note 13 Pro 5G con pantalla AMOLED de 6.67\" 120Hz, cámara de 200MP, Snapdragon 7s Gen 2, 8GB RAM, 256GB, batería de 5100mAh con carga turbo 67W. Diseño en vidrio con certificación IP54.",
      price: 2499,
      originalPrice: 2999,
      comparePrice: 2999,
      costPrice: 1600,
      images: ["https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=800"],
      categoryId: cats["smartphones"].id,
      vendorId: vendor1.id,
      brand: "Xiaomi",
      tags: ["xiaomi", "redmi", "note-13", "5g", "200mp"],
      badge: "Mejor precio",
      featured: true,
      stock: 65,
      sku: "XIA-RN13P-256",
      weight: 0.187,
      avgRating: 4.5,
      reviewCount: 134,
      salesCount: 287,
      views: 8900,
    },
    // === LAPTOPS ===
    {
      name: "Lenovo ThinkPad X1 Carbon Gen 11",
      slug: "lenovo-thinkpad-x1-carbon-gen11",
      description: "Laptop empresarial ultraligera con Intel Core i7-1365U de 13ª gen, 16GB LPDDR5 RAM, SSD 512GB NVMe, pantalla IPS 14\" 2.8K OLED, teclado retroiluminado, lector de huellas, Windows 11 Pro. Solo 1.12 kg. Certificación MIL-STD-810H.",
      price: 12999,
      originalPrice: 14500,
      comparePrice: 14500,
      costPrice: 9500,
      images: ["https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=800", "https://images.unsplash.com/photo-1525547719571-a2d4ac8945e2?w=800"],
      categoryId: cats["laptops-pcs"].id,
      vendorId: vendor1.id,
      brand: "Lenovo",
      tags: ["lenovo", "thinkpad", "x1-carbon", "empresarial", "ultrabook"],
      badge: "Profesional",
      featured: true,
      trending: true,
      stock: 8,
      sku: "LEN-X1C-G11",
      weight: 1.12,
      avgRating: 4.7,
      reviewCount: 23,
      salesCount: 34,
      views: 2100,
    },
    {
      name: "ASUS ROG Strix G16 Gaming",
      slug: "asus-rog-strix-g16-gaming",
      description: "Laptop gaming ASUS ROG Strix G16 con Intel Core i9-13980HX, NVIDIA RTX 4070 8GB, 16GB DDR5, SSD 1TB, pantalla 16\" QHD+ 240Hz, teclado RGB, ROG Intelligent Cooling, Windows 11. Diseño agresivo con iluminación Aura Sync.",
      price: 13499,
      originalPrice: 15000,
      comparePrice: 15000,
      costPrice: 10000,
      images: ["https://images.unsplash.com/photo-1603302576837-37561b2e2302?w=800"],
      categoryId: cats["laptops-pcs"].id,
      vendorId: vendor1.id,
      brand: "ASUS",
      tags: ["asus", "rog", "gaming", "rtx-4070", "i9"],
      badge: "Gaming",
      trending: true,
      stock: 6,
      sku: "ASUS-ROG-G16",
      weight: 2.5,
      avgRating: 4.6,
      reviewCount: 18,
      salesCount: 22,
      views: 3400,
    },
    // === AUDIO ===
    {
      name: "Sony WH-1000XM5 Wireless",
      slug: "sony-wh-1000xm5-wireless",
      description: "Los auriculares premium de Sony con cancelación de ruido líder en la industria, procesador V1, 30 horas de batería, audio de alta resolución LDAC, multipoint Bluetooth 5.2, diseño ultra-cómodo plegable. Speak-to-Chat y Adaptive Sound Control.",
      price: 2799,
      originalPrice: 3200,
      comparePrice: 3200,
      costPrice: 1800,
      images: ["https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800", "https://images.unsplash.com/photo-1583394838336-acd977736f90?w=800"],
      categoryId: cats["audio-sonido"].id,
      vendorId: vendor1.id,
      brand: "Sony",
      tags: ["sony", "wh-1000xm5", "anc", "bluetooth", "wireless"],
      badge: "N°1 en ANC",
      featured: true,
      stock: 35,
      sku: "SONY-WH1000XM5",
      weight: 0.25,
      avgRating: 4.9,
      reviewCount: 156,
      salesCount: 312,
      views: 7800,
    },
    {
      name: "JBL Charge 5 Parlante Bluetooth",
      slug: "jbl-charge-5-bluetooth",
      description: "Parlante portátil JBL Charge 5 con sonido JBL Pro, drivers duales, bass radiator, resistente al agua y polvo IP67, 20 horas de batería, Powerbank integrado, Bluetooth 5.1, JBL PartyBoost para conectar múltiples parlantes.",
      price: 999,
      originalPrice: 1200,
      comparePrice: 1200,
      costPrice: 550,
      images: ["https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=800"],
      categoryId: cats["audio-sonido"].id,
      vendorId: vendor1.id,
      brand: "JBL",
      tags: ["jbl", "charge-5", "bluetooth", "portátil", "ip67"],
      stock: 48,
      sku: "JBL-CHG5-BLK",
      weight: 0.96,
      avgRating: 4.6,
      reviewCount: 89,
      salesCount: 178,
      views: 3200,
    },
    {
      name: "Apple AirPods Pro 2da Gen USB-C",
      slug: "apple-airpods-pro-2-usbc",
      description: "AirPods Pro con chip H2 de Apple, cancelación activa de ruido 2x más potente, audio adaptativo, modo transparencia, audio espacial personalizado, USB-C, hasta 6h de batería (30h con estuche), resistencia al agua IPX4.",
      price: 1899,
      originalPrice: 2100,
      comparePrice: 2100,
      costPrice: 1200,
      images: ["https://images.unsplash.com/photo-1606220945770-b5b6c2c55bf1?w=800"],
      categoryId: cats["audio-sonido"].id,
      vendorId: vendor1.id,
      brand: "Apple",
      tags: ["apple", "airpods", "pro", "anc", "usb-c"],
      badge: "Bestseller",
      featured: true,
      trending: true,
      stock: 42,
      sku: "APL-APP2-USBC",
      weight: 0.051,
      avgRating: 4.8,
      reviewCount: 203,
      salesCount: 445,
      views: 9100,
    },
    // === GAMING ===
    {
      name: "PlayStation 5 Slim Digital Edition",
      slug: "ps5-slim-digital-edition",
      description: "Consola PlayStation 5 Slim edición digital, 1TB SSD, procesador AMD Zen 2 a 3.5 GHz, GPU RDNA 2 a 10.28 TFLOPS, ray tracing, salida 4K 120fps, audio 3D Tempest, DualSense, WiFi 6. 30% más compacta que la PS5 original.",
      price: 3999,
      originalPrice: 4500,
      comparePrice: 4500,
      costPrice: 3200,
      images: ["https://images.unsplash.com/photo-1606813907291-d86efa9b94db?w=800"],
      categoryId: cats["gaming"].id,
      vendorId: vendor1.id,
      brand: "Sony",
      tags: ["ps5", "playstation", "gaming", "consola", "slim"],
      badge: "Hot",
      featured: true,
      trending: true,
      stock: 10,
      sku: "SONY-PS5S-DIG",
      weight: 3.2,
      avgRating: 4.9,
      reviewCount: 45,
      salesCount: 67,
      views: 5600,
    },
    {
      name: "Logitech G Pro X Superlight 2",
      slug: "logitech-g-pro-x-superlight-2",
      description: "Mouse gaming inalámbrico ultraligero de solo 60g, sensor HERO 2 de 44K DPI, switches óptico-mecánicos LIGHTFORCE, tasa de sondeo 2000Hz con LIGHTSPEED, batería de 95 horas, pies PTFE de baja fricción.",
      price: 1199,
      originalPrice: 1400,
      comparePrice: 1400,
      costPrice: 750,
      images: ["https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=800"],
      categoryId: cats["gaming"].id,
      vendorId: vendor1.id,
      brand: "Logitech",
      tags: ["logitech", "mouse", "gaming", "wireless", "superlight"],
      stock: 30,
      sku: "LOG-GPXSL2",
      weight: 0.06,
      avgRating: 4.7,
      reviewCount: 78,
      salesCount: 134,
      views: 2800,
    },
    // === TELEVISORES ===
    {
      name: "Samsung Crystal UHD 55\" 4K Smart TV",
      slug: "samsung-crystal-uhd-55-4k",
      description: "Smart TV Samsung de 55\" con resolución Crystal UHD 4K, procesador Crystal 4K, HDR10+, PurColor, Motion Xcelerator, Samsung Tizen OS con apps de streaming integradas (Netflix, Disney+, HBO Max), Game Mode, Alexa integrado.",
      price: 3499,
      originalPrice: 4200,
      comparePrice: 4200,
      costPrice: 2400,
      images: ["https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=800"],
      categoryId: cats["televisores"].id,
      vendorId: vendor1.id,
      brand: "Samsung",
      tags: ["samsung", "smart-tv", "4k", "55-pulgadas", "hdr"],
      badge: "Precio especial",
      featured: true,
      stock: 14,
      sku: "SAM-CU55-4K",
      weight: 14.5,
      avgRating: 4.5,
      reviewCount: 56,
      salesCount: 89,
      views: 3900,
    },
    // === ROPA Y MODA ===
    {
      name: "Nike Air Max 270 React",
      slug: "nike-air-max-270-react",
      description: "Zapatillas Nike Air Max 270 React con tecnología React para amortiguación suave y ligera, unidad Air Max de 270° visible en el talón, parte superior de malla transpirable, suela de goma para tracción multisuperficie. Diseño urbano deportivo.",
      price: 1299,
      originalPrice: 1599,
      comparePrice: 1599,
      costPrice: 750,
      images: ["https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800", "https://images.unsplash.com/photo-1600185365926-3a2ce3cdb9eb?w=800"],
      categoryId: cats["ropa-moda"].id,
      vendorId: vendor2.id,
      brand: "Nike",
      tags: ["nike", "air-max", "270", "zapatillas", "running"],
      badge: "Tendencia",
      featured: true,
      trending: true,
      stock: 45,
      sku: "NIK-AM270R",
      weight: 0.35,
      avgRating: 4.6,
      reviewCount: 92,
      salesCount: 234,
      views: 5400,
    },
    {
      name: "The North Face Thermoball Eco Jacket",
      slug: "north-face-thermoball-eco-jacket",
      description: "Chaqueta The North Face Thermoball Eco con aislamiento PrimaLoft ThermoBall Eco fabricado con materiales reciclados, resistente al agua DWR, capucha ajustable, bolsillos con cremallera, empaquetable en su propio bolsillo. Ideal para el frío de La Paz y Oruro.",
      price: 1899,
      originalPrice: 2300,
      comparePrice: 2300,
      costPrice: 1100,
      images: ["https://images.unsplash.com/photo-1551028719-00167b16eac5?w=800"],
      categoryId: cats["ropa-moda"].id,
      vendorId: vendor2.id,
      brand: "The North Face",
      tags: ["north-face", "chaqueta", "thermoball", "invierno", "eco"],
      badge: "Temporada",
      stock: 28,
      sku: "TNF-THRM-ECO",
      weight: 0.42,
      avgRating: 4.8,
      reviewCount: 34,
      salesCount: 67,
      views: 2300,
    },
    {
      name: "Levi's 501 Original Fit Jeans",
      slug: "levis-501-original-fit",
      description: "El icónico Jean Levi's 501 Original Fit en denim premium de 12.5 oz, corte recto clásico, botones de bronce, parche de cuero, tiro medio. 100% algodón. El jean que inició todo, ahora con fit actualizado.",
      price: 599,
      originalPrice: 750,
      comparePrice: 750,
      costPrice: 300,
      images: ["https://images.unsplash.com/photo-1542272604-787c3835535d?w=800"],
      categoryId: cats["ropa-moda"].id,
      vendorId: vendor2.id,
      brand: "Levi's",
      tags: ["levis", "501", "jeans", "denim", "clásico"],
      stock: 80,
      sku: "LEV-501-OG",
      weight: 0.85,
      avgRating: 4.4,
      reviewCount: 112,
      salesCount: 345,
      views: 4700,
    },
    {
      name: "Adidas Ultraboost Light Running",
      slug: "adidas-ultraboost-light-running",
      description: "Zapatillas Adidas Ultraboost Light con BOOST de nueva generación, 30% más ligeras, Primeknit+ transpirable, soporte Continental Rubber, diseño para running de larga distancia. Certificado de materiales reciclados.",
      price: 1499,
      originalPrice: 1800,
      comparePrice: 1800,
      costPrice: 850,
      images: ["https://images.unsplash.com/photo-1560769629-975ec94e6a86?w=800"],
      categoryId: cats["ropa-moda"].id,
      vendorId: vendor2.id,
      brand: "Adidas",
      tags: ["adidas", "ultraboost", "running", "boost"],
      featured: true,
      stock: 38,
      sku: "ADI-UBL-BLK",
      weight: 0.28,
      avgRating: 4.7,
      reviewCount: 78,
      salesCount: 156,
      views: 3800,
    },
    // === HOGAR INTELIGENTE ===
    {
      name: "Amazon Echo Dot 5ta Gen con Alexa",
      slug: "amazon-echo-dot-5-alexa",
      description: "Parlante inteligente Amazon Echo Dot de 5ta generación con Alexa, sonido mejorado con graves más profundos, sensor de temperatura ambiente, controlador de hogar inteligente (luces, cerraduras, enchufes), rutinas, música, noticias y más.",
      price: 449,
      originalPrice: 550,
      comparePrice: 550,
      costPrice: 250,
      images: ["https://images.unsplash.com/photo-1543512214-318228f876f2?w=800"],
      categoryId: cats["hogar-inteligente"].id,
      vendorId: vendor1.id,
      brand: "Amazon",
      tags: ["alexa", "echo", "smart-home", "parlante-inteligente"],
      stock: 55,
      sku: "AMZ-ED5-BLK",
      weight: 0.304,
      avgRating: 4.4,
      reviewCount: 67,
      salesCount: 189,
      views: 2600,
    },
    {
      name: "Xiaomi Mi Robot Vacuum S10+",
      slug: "xiaomi-robot-vacuum-s10-plus",
      description: "Robot aspirador y trapeador Xiaomi con navegación LDS láser, succión de 4000Pa, trapeado inteligente con tanque de agua controlado, app Mi Home, mapeo multi-piso, 130 min de autonomía, compatible con Alexa y Google Home.",
      price: 2999,
      originalPrice: 3500,
      comparePrice: 3500,
      costPrice: 1900,
      images: ["https://images.unsplash.com/photo-1558618666-fcd25c85f82e?w=800"],
      categoryId: cats["hogar-inteligente"].id,
      vendorId: vendor1.id,
      brand: "Xiaomi",
      tags: ["xiaomi", "robot", "aspiradora", "smart-home", "trapeador"],
      badge: "Innovador",
      trending: true,
      stock: 15,
      sku: "XIA-RVS10P",
      weight: 3.6,
      avgRating: 4.5,
      reviewCount: 34,
      salesCount: 45,
      views: 1900,
    },
    // === DEPORTES ===
    {
      name: "Garmin Venu 3 GPS Smartwatch",
      slug: "garmin-venu-3-gps-smartwatch",
      description: "Smartwatch Garmin Venu 3 con GPS integrado, pantalla AMOLED brillante, monitoreo avanzado de salud (sueño, estrés, Body Battery, SpO2), +30 modos deportivos, pagos contactless Garmin Pay, llamadas Bluetooth, 14 días de batería.",
      price: 3499,
      originalPrice: 3999,
      comparePrice: 3999,
      costPrice: 2500,
      images: ["https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800"],
      categoryId: cats["deportes"].id,
      vendorId: vendor2.id,
      brand: "Garmin",
      tags: ["garmin", "smartwatch", "gps", "fitness", "salud"],
      badge: "Premium",
      featured: true,
      stock: 20,
      sku: "GAR-VN3-BLK",
      weight: 0.047,
      avgRating: 4.8,
      reviewCount: 23,
      salesCount: 34,
      views: 1500,
    },
    {
      name: "Mochila Under Armour Hustle 5.0",
      slug: "under-armour-hustle-5-mochila",
      description: "Mochila Under Armour Hustle 5.0 con tecnología Storm para resistencia al agua, compartimiento acolchado para laptop de 15\", bolsillo organizador frontal, correas acolchadas UA, panel trasero de malla HeatGear, 29L de capacidad.",
      price: 549,
      originalPrice: 699,
      comparePrice: 699,
      costPrice: 280,
      images: ["https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800"],
      categoryId: cats["deportes"].id,
      vendorId: vendor2.id,
      brand: "Under Armour",
      tags: ["under-armour", "mochila", "deporte", "laptop", "storm"],
      stock: 42,
      sku: "UA-H50-BLK",
      weight: 0.57,
      avgRating: 4.5,
      reviewCount: 56,
      salesCount: 123,
      views: 1800,
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
  const nike = products.find((p) => p.slug === "nike-air-max-270-react");
  if (nike) {
    const sizes = ["38", "39", "40", "41", "42", "43", "44"];
    for (const s of sizes) {
      await prisma.productVariant.create({ data: { productId: nike.id, name: "Talla", value: s, stock: 6 } });
    }
    for (const c of ["Negro/Blanco", "Blanco/Rojo", "Gris/Azul"]) {
      await prisma.productVariant.create({ data: { productId: nike.id, name: "Color", value: c, stock: 15 } });
    }
  }
  const jeans = products.find((p) => p.slug === "levis-501-original-fit");
  if (jeans) {
    for (const s of ["28", "30", "32", "34", "36", "38"]) {
      await prisma.productVariant.create({ data: { productId: jeans.id, name: "Talla", value: s, stock: 12 } });
    }
    for (const c of ["Indigo Oscuro", "Stonewash", "Negro"]) {
      await prisma.productVariant.create({ data: { productId: jeans.id, name: "Color", value: c, stock: 25 } });
    }
  }
  const adidas = products.find((p) => p.slug === "adidas-ultraboost-light-running");
  if (adidas) {
    for (const s of ["39", "40", "41", "42", "43", "44"]) {
      await prisma.productVariant.create({ data: { productId: adidas.id, name: "Talla", value: s, stock: 6 } });
    }
  }
  const galaxy = products.find((p) => p.slug === "samsung-galaxy-s24-ultra-256gb");
  if (galaxy) {
    for (const c of ["Titanium Gray", "Titanium Black", "Titanium Violet"]) {
      await prisma.productVariant.create({ data: { productId: galaxy.id, name: "Color", value: c, stock: 6 } });
    }
  }

  // ─── BANNERS ───────────────────────
  await prisma.banner.deleteMany({});
  await prisma.banner.createMany({
    data: [
      { title: "Galaxy S24 Ultra — Inteligencia Galaxy AI", subtitle: "El smartphone más inteligente. Hasta 15% de descuento", image: "https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=1200&h=400&fit=crop", link: "/?category=smartphones", position: "hero", active: true, order: 1 },
      { title: "Nike & Adidas — Nueva Temporada 2025", subtitle: "Zapatillas running con hasta 25% OFF", image: "https://images.unsplash.com/photo-1556906781-9a412961c28c?w=1200&h=400&fit=crop", link: "/?category=ropa-moda", position: "hero", active: true, order: 2 },
      { title: "PlayStation 5 Slim disponible", subtitle: "La consola más deseada ya en Bolivia", image: "https://images.unsplash.com/photo-1606813907291-d86efa9b94db?w=1200&h=400&fit=crop", link: "/?category=gaming", position: "sidebar", active: true, order: 1 },
    ],
  });

  // ─── COLLECTIONS ───────────────────
  const bestSellers = await prisma.collection.upsert({
    where: { slug: "mas-vendidos" },
    update: {},
    create: { name: "Los Más Vendidos", slug: "mas-vendidos", description: "Nuestros productos más populares en Bolivia" },
  });
  const topProducts = products.filter((p) => p.salesCount > 100);
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
      { code: "BIENVENIDO20", type: "percentage", discount: 20, maxDiscount: 500, minAmount: 500, maxUses: 1000, usedCount: 234, expiresAt: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000), active: true },
      { code: "ENVIOGRATIS", type: "fixed", discount: 50, minAmount: 200, maxUses: 500, usedCount: 167, expiresAt: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000), active: true },
      { code: "TECH30", type: "percentage", discount: 30, maxDiscount: 1000, minAmount: 2000, maxUses: 200, usedCount: 78, expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), active: true },
      { code: "FLASH50", type: "percentage", discount: 50, maxDiscount: 500, minAmount: 1000, maxUses: 50, usedCount: 23, perUser: 1, expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), active: true },
    ],
  });

  // ─── FLASH DEALS ───────────────────
  await prisma.flashDeal.deleteMany({});
  const flashItems = products.filter(p => ["sony-wh-1000xm5-wireless", "ps5-slim-digital-edition", "xiaomi-redmi-note-13-pro-5g", "nike-air-max-270-react"].includes(p.slug));
  for (const fp of flashItems) {
    await prisma.flashDeal.create({
      data: {
        title: `⚡ ${fp.name}`,
        productId: fp.id,
        discount: Math.floor(Math.random() * 20) + 15,
        startDate: new Date(),
        endDate: new Date(Date.now() + 72 * 60 * 60 * 1000),
      },
    });
  }

  // ─── REVIEWS REALES ────────────────
  await prisma.review.deleteMany({});
  const realReviews = [
    { title: "Excelente compra", comment: "Lo compré para usar en La Paz y funciona perfectamente. La entrega fue rápida a mi domicilio en la Zona Sur. 100% recomendado.", rating: 5 },
    { title: "Muy satisfecho", comment: "Producto original como lo describe. Llegó bien empaquetado. El vendedor respondió todas mis dudas por WhatsApp.", rating: 5 },
    { title: "Buena relación calidad-precio", comment: "Para el precio que tiene en Bolivia es una excelente opción. Mejor que importar directamente.", rating: 4 },
    { title: "Cumple expectativas", comment: "Es exactamente lo que muestra la foto. Lo uso todos los días y no he tenido ningún problema.", rating: 4 },
    { title: "Recomendado para Bolivia", comment: "Funciona con las bandas de Entel y Tigo sin problema. La batería dura todo el día incluso en El Alto.", rating: 5 },
    { title: "Buen producto, envío lento", comment: "El producto es de calidad pero tardó 5 días en llegar a Cochabamba. Por lo demás todo bien.", rating: 3 },
  ];
  const reviewUsers = [customer, customer2];
  for (const product of products.slice(0, 12)) {
    for (let i = 0; i < Math.min(reviewUsers.length, 2); i++) {
      const r = realReviews[Math.floor(Math.random() * realReviews.length)];
      await prisma.review.create({
        data: { productId: product.id, userId: reviewUsers[i].id, rating: r.rating, title: r.title, comment: r.comment, verified: Math.random() > 0.2 },
      });
    }
  }

  // ─── ORDERS ────────────────────────
  await prisma.orderItem.deleteMany({});
  await prisma.order.deleteMany({});
  const orderStatuses = ["pending", "confirmed", "processing", "shipped", "delivered", "delivered"];
  const paymentStatuses = ["pending", "paid", "paid", "paid", "paid", "paid"];
  for (let i = 0; i < 15; i++) {
    const user = [customer, customer2][i % 2];
    const statusIdx = Math.floor(Math.random() * orderStatuses.length);
    const randomProducts = products.sort(() => Math.random() - 0.5).slice(0, Math.floor(Math.random() * 3) + 1);
    const items = randomProducts.map((p) => ({
      productId: p.id,
      quantity: Math.floor(Math.random() * 2) + 1,
      price: p.price,
    }));
    const subtotal = items.reduce((s, it) => s + it.price * it.quantity, 0);
    const shippingCost = subtotal > 200 ? 0 : 25;
    await prisma.order.create({
      data: {
        userId: user.id,
        customerEmail: user.email,
        customerName: user.name,
        orderNumber: `NT-${String(2025000 + i).padStart(7, "0")}`,
        status: orderStatuses[statusIdx],
        paymentStatus: paymentStatuses[statusIdx],
        subtotal,
        shippingCost,
        discountAmount: 0,
        tax: 0,
        total: subtotal + shippingCost,
        items: { create: items },
        createdAt: new Date(Date.now() - Math.floor(Math.random() * 45) * 24 * 60 * 60 * 1000),
      },
    });
  }

  // ─── ADDRESSES ─────────────────────
  await prisma.address.deleteMany({});
  await prisma.address.createMany({
    data: [
      { userId: customer.id, name: "Pedro López", phone: "+591 71234567", street: "Av. Arce #2135, Edificio Multicentro, Piso 4", city: "La Paz", state: "La Paz", zipCode: "0000", country: "Bolivia", isDefault: true },
      { userId: customer.id, name: "Pedro López", phone: "+591 71234567", street: "Av. América #567, Zona Queru Queru", city: "Cochabamba", state: "Cochabamba", country: "Bolivia" },
      { userId: customer2.id, name: "Ana Torres", phone: "+591 76543210", street: "Av. Monseñor Rivero #300, 3er Anillo", city: "Santa Cruz de la Sierra", state: "Santa Cruz", zipCode: "0000", country: "Bolivia", isDefault: true },
    ],
  });

  // ─── NOTIFICATIONS ─────────────────
  await prisma.notification.deleteMany({});
  await prisma.notification.createMany({
    data: [
      { userId: customer.id, type: "order", title: "Pedido enviado", message: "Tu pedido NT-2025003 con tu Samsung Galaxy S24 Ultra ha sido enviado. Tracking: BOLCR-78542", read: false },
      { userId: customer.id, type: "promo", title: "Flash Sale en Audio!", message: "Sony WH-1000XM5 con 20% OFF por 72 horas. ¡No te lo pierdas!", read: false },
      { userId: customer.id, type: "system", title: "Bienvenido a NovaTech", message: "¡Gracias por registrarte! Usa el código BIENVENIDO20 para un 20% en tu primera compra.", read: true },
      { userId: vendor1User.id, type: "order", title: "Nueva venta realizada", message: "Has vendido 1x Lenovo ThinkPad X1 Carbon por Bs. 12,999. ¡Prepara el envío!", read: false },
    ],
  });

  // ─── QUESTIONS ─────────────────────
  await prisma.productAnswer.deleteMany({});
  await prisma.productQuestion.deleteMany({});
  const samsung = products.find((p) => p.slug === "samsung-galaxy-s24-ultra-256gb");
  if (samsung) {
    const q1 = await prisma.productQuestion.create({
      data: { productId: samsung.id, userId: customer.id, question: "¿Tiene garantía oficial de Samsung en Bolivia o es importado?" },
    });
    await prisma.productAnswer.create({
      data: { questionId: q1.id, userId: vendor1User.id, answer: "Es producto con garantía oficial Samsung Bolivia de 1 año. Somos distribuidores autorizados. El servicio técnico está en La Paz y Santa Cruz." },
    });
    const q2 = await prisma.productQuestion.create({
      data: { productId: samsung.id, userId: customer2.id, question: "¿Funciona con las bandas 5G de Entel?" },
    });
    await prisma.productAnswer.create({
      data: { questionId: q2.id, userId: vendor1User.id, answer: "Sí, es la versión latinoamericana (SM-S928E) que es compatible con las bandas 5G de Entel (n78) y también 4G LTE de Tigo y Viva." },
    });
  }

  // ─── SETTINGS ──────────────────────
  const settings = [
    { key: "store_name", value: "NovaTech Marketplace", category: "general" },
    { key: "store_email", value: "contacto@novatech.bo", category: "general" },
    { key: "store_phone", value: "+591 2 2444567", category: "general" },
    { key: "store_address", value: "Av. 16 de Julio #1500, Edificio Cosmos, La Paz, Bolivia", category: "general" },
    { key: "store_currency", value: "BOB", category: "general" },
    { key: "store_locale", value: "es-BO", category: "general" },
    { key: "free_shipping_min", value: "200", category: "shipping" },
    { key: "default_commission", value: "10", category: "vendors" },
    { key: "loyalty_points_rate", value: "10", category: "loyalty" },
    { key: "referral_reward", value: "50", category: "loyalty" },
  ];
  for (const s of settings) {
    await prisma.setting.upsert({ where: { key: s.key }, update: {}, create: s });
  }

  console.log("✅ Seed completado con datos reales!");
  console.log(`   ${products.length} productos reales (Samsung, Apple, Sony, Nike, Adidas, etc.)`);
  console.log(`   ${Object.keys(cats).length} categorías`);
  console.log("   Credenciales:");
  console.log("   Admin:    admin@novatech.bo / Password123!");
  console.log("   Vendedor: vendedor@novatech.bo / Password123!");
  console.log("   Cliente:  cliente@novatech.bo / Password123!");
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(async () => { await prisma.$disconnect(); });
