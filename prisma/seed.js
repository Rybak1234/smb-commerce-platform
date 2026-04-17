const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcryptjs");

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding SurtiBolivia -- Supermercado en Linea...");

  const hash = await bcrypt.hash("Password123!", 10);

  // â”€â”€â”€ USERS â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  const admin = await prisma.user.upsert({
    where: { email: "admin@surtibolivia.bo" },
    update: {},
    create: { email: "admin@surtibolivia.bo", password: hash, name: "Rodrigo Huanca", role: "admin", avatar: "https://i.pravatar.cc/150?u=admin@surtibolivia.bo", loyaltyPoints: 0, referralCode: "SBADM1" },
  });
  const vendor1User = await prisma.user.upsert({
    where: { email: "mercado@surtibolivia.bo" },
    update: {},
    create: { email: "mercado@surtibolivia.bo", password: hash, name: "Carlos Mendoza", role: "vendor", avatar: "https://i.pravatar.cc/150?u=mercado@surtibolivia.bo", loyaltyPoints: 150, referralCode: "CARL0S" },
  });
  const vendor2User = await prisma.user.upsert({
    where: { email: "moda@surtibolivia.bo" },
    update: {},
    create: { email: "moda@surtibolivia.bo", password: hash, name: "MarÃ­a Quispe", role: "vendor", avatar: "https://i.pravatar.cc/150?u=moda@surtibolivia.bo", loyaltyPoints: 200, referralCode: "MAR1A1" },
  });
  const customer = await prisma.user.upsert({
    where: { email: "cliente@surtibolivia.bo" },
    update: {},
    create: { email: "cliente@surtibolivia.bo", password: hash, name: "Pedro López", role: "customer", avatar: "https://i.pravatar.cc/150?u=cliente@surtibolivia.bo", loyaltyPoints: 320, referralCode: "PEDR01" },
  });
  const customer2 = await prisma.user.upsert({
    where: { email: "ana@surtibolivia.bo" },
    update: {},
    create: { email: "ana@surtibolivia.bo", password: hash, name: "Ana Torres", role: "customer", avatar: "https://i.pravatar.cc/150?u=ana@surtibolivia.bo", loyaltyPoints: 85, referralCode: "ANA001" },
  });

  // Quick-access avatar users
  const quickHash = await bcrypt.hash("user123", 10);
  await prisma.user.upsert({
    where: { email: "maria@surtibolivia.bo" },
    update: {},
    create: { email: "maria@surtibolivia.bo", password: quickHash, name: "Maria Quispe", role: "customer", avatar: "https://i.pravatar.cc/80?img=1", loyaltyPoints: 150 },
  });
  await prisma.user.upsert({
    where: { email: "carlos@surtibolivia.bo" },
    update: {},
    create: { email: "carlos@surtibolivia.bo", password: quickHash, name: "Carlos Mamani", role: "customer", avatar: "https://i.pravatar.cc/80?img=5", loyaltyPoints: 230 },
  });
  await prisma.user.upsert({
    where: { email: "lucia@surtibolivia.bo" },
    update: {},
    create: { email: "lucia@surtibolivia.bo", password: quickHash, name: "Lucia Flores", role: "customer", avatar: "https://i.pravatar.cc/80?img=8", loyaltyPoints: 90 },
  });

  // â”€â”€â”€ VENDORS â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  const vendor1 = await prisma.vendor.upsert({
    where: { userId: vendor1User.id },
    update: {},
    create: {
      userId: vendor1User.id,
      storeName: "Mercado Central SB",
      slug: "mercado-central-sb",
      description: "Productos frescos del Mercado Central de La Paz. Frutas, verduras, carnes, abarrotes y productos tÃ­picos bolivianos.",
      logo: "https://ui-avatars.com/api/?name=MC&background=166534&color=fff&size=128",
      banner: "https://images.unsplash.com/photo-1542838132-92c53300491e?w=1200&h=400&fit=crop",
      phone: "+591 2 2444567",
      email: "mercado@surtibolivia.bo",
      commissionRate: 8,
      status: "approved",
      subscriptionTier: "pro",
      verified: true,
      totalSales: 450,
      totalRevenue: 89500,
    },
  });
  const vendor2 = await prisma.vendor.upsert({
    where: { userId: vendor2User.id },
    update: {},
    create: {
      userId: vendor2User.id,
      storeName: "Ropa 9 Departamentos",
      slug: "ropa-9-departamentos",
      description: "Ropa y accesorios bolivianos inspirados en los 9 departamentos. Aguayos, tejidos, polleras modernas y diseno contemporaneo con identidad boliviana.",
      logo: "https://ui-avatars.com/api/?name=M9&background=d97706&color=fff&size=128",
      phone: "+591 3 3567890",
      email: "moda@surtibolivia.bo",
      commissionRate: 10,
      status: "approved",
      subscriptionTier: "pro",
      verified: true,
      totalSales: 278,
      totalRevenue: 156700,
    },
  });

  // â”€â”€â”€ CATEGORIES â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  const cats = {};
  const catData = [
    { name: "Abarrotes", slug: "abarrotes", description: "Arroz, azÃºcar, aceite, fideos, enlatados y productos de despensa", image: "https://images.unsplash.com/photo-1604719312566-8912e9227c6a?w=400&h=300&fit=crop", order: 1 },
    { name: "LÃ¡cteos y Huevos", slug: "lacteos-huevos", description: "Leche, yogur, queso, mantequilla y huevos frescos", image: "https://images.unsplash.com/photo-1628088062854-d1870b4553da?w=400&h=300&fit=crop", order: 2 },
    { name: "Carnes y Embutidos", slug: "carnes-embutidos", description: "Res, pollo, cerdo, embutidos y carnes preparadas", image: "https://images.unsplash.com/photo-1607623814075-e51df1bdc82f?w=400&h=300&fit=crop", order: 3 },
    { name: "Frutas y Verduras", slug: "frutas-verduras", description: "Frutas y verduras frescas de los valles y yungas", image: "https://images.unsplash.com/photo-1610832958506-aa56368176cf?w=400&h=300&fit=crop", order: 4 },
    { name: "PanaderÃ­a", slug: "panaderia", description: "Pan fresco, marraquetas, galletas y reposterÃ­a artesanal", image: "https://images.unsplash.com/photo-1509440159596-0249088772ff?w=400&h=300&fit=crop", order: 5 },
    { name: "Bebidas", slug: "bebidas", description: "Aguas, jugos, refrescos, cervezas y bebidas bolivianas", image: "https://images.unsplash.com/photo-1534353473418-4cfa6c56fd38?w=400&h=300&fit=crop", order: 6 },
    { name: "Limpieza y Hogar", slug: "limpieza-hogar", description: "Detergentes, desinfectantes, limpiadores y artÃ­culos del hogar", image: "https://images.unsplash.com/photo-1585421514284-efb74c2b69ba?w=400&h=300&fit=crop", order: 7 },
    { name: "Cuidado Personal", slug: "cuidado-personal", description: "Shampoo, jabÃ³n, cremas, higiene y cuidado personal", image: "https://images.unsplash.com/photo-1556228578-0d85b1a4d571?w=400&h=300&fit=crop", order: 8 },
    { name: "Ropa y Accesorios", slug: "ropa-y-accesorios", description: "Ropa y accesorios bolivianos inspirados en los 9 departamentos. Aguayos, tejidos y diseno contemporaneo", image: "https://images.unsplash.com/photo-1558171813-4c088753af8f?w=400&h=300&fit=crop", order: 9 },
    { name: "ElectrÃ³nica", slug: "electronica", description: "ElectrodomÃ©sticos, celulares y tecnologÃ­a para el hogar", image: "https://images.unsplash.com/photo-1518770660439-4636190af475?w=400&h=300&fit=crop", order: 10 },
  ];
  for (const c of catData) {
    cats[c.slug] = await prisma.category.upsert({ where: { slug: c.slug }, update: {}, create: c });
  }

  // â”€â”€â”€ PRODUCTOS â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  const products = [];
  const productData = [
    // === ABARROTES ===
    { name: "Arroz Grano de Oro 5kg", slug: "arroz-grano-de-oro-5kg", description: "Arroz grano largo de primera calidad, cultivado en los llanos orientales de Bolivia. Ideal para el almuerzo familiar.", price: 45, images: ["https://images.unsplash.com/photo-1586201375761-83865001e31c?w=600&h=600&fit=crop"], categoryId: cats["abarrotes"].id, vendorId: vendor1.id, brand: "Grano de Oro", tags: ["arroz", "abarrotes", "bÃ¡sico"], badge: "Mas vendido", featured: true, stock: 200, sku: "ABR-ARR-5KG", weight: 5, avgRating: 4.7, reviewCount: 45, salesCount: 320 },
    { name: "Aceite de Soya Fino 900ml", slug: "aceite-soya-fino-900ml", description: "Aceite de soya refinado, ideal para cocinar y freÃ­r. Producto boliviano de alta calidad.", price: 18, images: ["https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=600&h=600&fit=crop"], categoryId: cats["abarrotes"].id, vendorId: vendor1.id, brand: "Fino", tags: ["aceite", "cocina", "abarrotes"], stock: 150, sku: "ABR-ACE-900", weight: 0.9, avgRating: 4.5, reviewCount: 32, salesCount: 210 },
    { name: "AzÃºcar Bermejo 1kg", slug: "azucar-bermejo-1kg", description: "AzÃºcar blanca refinada de los ingenios de Bermejo, Tarija.", price: 8, images: ["https://images.unsplash.com/photo-1558642452-9d2a7deb7f62?w=600&h=600&fit=crop"], categoryId: cats["abarrotes"].id, vendorId: vendor1.id, brand: "Bermejo", tags: ["azÃºcar", "bÃ¡sico", "tarija"], stock: 300, sku: "ABR-AZU-1KG", weight: 1, avgRating: 4.3, reviewCount: 18, salesCount: 280 },
    { name: "Fideos Don Vittorio Spaghetti 500g", slug: "fideos-don-vittorio-500g", description: "Fideos de sÃ©mola de trigo duro. Textura firme al dente.", price: 12, images: ["https://images.unsplash.com/photo-1551462147-ff29053bfc14?w=600&h=600&fit=crop"], categoryId: cats["abarrotes"].id, vendorId: vendor1.id, brand: "Don Vittorio", tags: ["fideos", "pasta", "abarrotes"], stock: 180, sku: "ABR-FID-500", weight: 0.5, avgRating: 4.6, reviewCount: 25, salesCount: 190 },
    { name: "AtÃºn Real en Aceite 170g", slug: "atun-real-aceite-170g", description: "AtÃºn en trozos en aceite vegetal. PrÃ¡ctico para ensaladas y sÃ¡ndwiches.", price: 15, images: ["https://images.unsplash.com/photo-1597733336794-12d05021d510?w=600&h=600&fit=crop"], categoryId: cats["abarrotes"].id, vendorId: vendor1.id, brand: "Real", tags: ["atÃºn", "enlatado", "proteÃ­na"], stock: 120, sku: "ABR-ATU-170", weight: 0.17, avgRating: 4.4, reviewCount: 20, salesCount: 145 },

    // === LÃCTEOS Y HUEVOS ===
    { name: "Leche PIL Entera 1L", slug: "leche-pil-entera-1l", description: "Leche entera pasteurizada PIL. La leche de la familia boliviana.", price: 9, originalPrice: 11, images: ["https://images.unsplash.com/photo-1563636619-e9143da7973b?w=600&h=600&fit=crop"], categoryId: cats["lacteos-huevos"].id, vendorId: vendor1.id, brand: "PIL", tags: ["leche", "lÃ¡cteo", "pil"], badge: "Popular", featured: true, trending: true, stock: 100, sku: "LAC-PIL-1L", weight: 1, avgRating: 4.8, reviewCount: 67, salesCount: 450 },
    { name: "Yogur Delizia Frutilla 1L", slug: "yogur-delizia-frutilla-1l", description: "Yogur bebible sabor frutilla. Delicioso y nutritivo.", price: 14, images: ["https://images.unsplash.com/photo-1488477181946-6428a0291777?w=600&h=600&fit=crop"], categoryId: cats["lacteos-huevos"].id, vendorId: vendor1.id, brand: "Delizia", tags: ["yogur", "frutilla", "lÃ¡cteo"], stock: 80, sku: "LAC-YOG-FRU", weight: 1, avgRating: 4.6, reviewCount: 35, salesCount: 180 },
    { name: "Queso Criollo Tarija 500g", slug: "queso-criollo-tarija-500g", description: "Queso criollo artesanal de Tarija. Sabor intenso, ideal para picotear con pan.", price: 35, images: ["https://images.unsplash.com/photo-1486297678162-eb2a19b0a32d?w=600&h=600&fit=crop"], categoryId: cats["lacteos-huevos"].id, vendorId: vendor1.id, brand: "Artesanal", tags: ["queso", "tarija", "artesanal"], featured: true, stock: 40, sku: "LAC-QUE-TAR", weight: 0.5, avgRating: 4.9, reviewCount: 42, salesCount: 95 },
    { name: "Huevos de Campo x30", slug: "huevos-campo-x30", description: "Huevos frescos de gallinas de campo. 30 unidades en bandeja.", price: 42, images: ["https://images.unsplash.com/photo-1582722872445-44dc5f7e3c8f?w=600&h=600&fit=crop"], categoryId: cats["lacteos-huevos"].id, vendorId: vendor1.id, brand: "Del Campo", tags: ["huevos", "fresco", "campo"], stock: 50, sku: "LAC-HUE-30", weight: 1.8, avgRating: 4.7, reviewCount: 28, salesCount: 160 },

    // === CARNES Y EMBUTIDOS ===
    { name: "Pechuga de Pollo SofÃ­a 1kg", slug: "pechuga-pollo-sofia-1kg", description: "Pechuga de pollo sin hueso SofÃ­a. Fresca y lista para cocinar.", price: 38, originalPrice: 44, images: ["https://images.unsplash.com/photo-1604503468506-a8da13d82571?w=600&h=600&fit=crop"], categoryId: cats["carnes-embutidos"].id, vendorId: vendor1.id, brand: "SofÃ­a", tags: ["pollo", "carne", "sofÃ­a"], badge: "Fresco", featured: true, stock: 60, sku: "CAR-POL-1KG", weight: 1, avgRating: 4.6, reviewCount: 38, salesCount: 220 },
    { name: "Lomo de Res Premium 1kg", slug: "lomo-res-premium-1kg", description: "Lomo fino de res boliviana. Corte premium para parrilla o plancha.", price: 85, images: ["https://images.unsplash.com/photo-1588168333986-5078d3ae3976?w=600&h=600&fit=crop"], categoryId: cats["carnes-embutidos"].id, vendorId: vendor1.id, brand: "Premium", tags: ["res", "lomo", "parrilla"], trending: true, stock: 30, sku: "CAR-LOM-1KG", weight: 1, avgRating: 4.8, reviewCount: 22, salesCount: 78 },
    { name: "Chorizo Stege Parrillero x6", slug: "chorizo-stege-parrillero-x6", description: "Chorizos parrilleros Stege. Ideales para asados bolivianos.", price: 32, images: ["https://images.unsplash.com/photo-1529692236671-f1f6cf9683ba?w=600&h=600&fit=crop"], categoryId: cats["carnes-embutidos"].id, vendorId: vendor1.id, brand: "Stege", tags: ["chorizo", "parrilla", "embutido"], stock: 45, sku: "CAR-CHO-6", weight: 0.6, avgRating: 4.5, reviewCount: 30, salesCount: 135 },

    // === FRUTAS Y VERDURAS ===
    { name: "PlÃ¡tano de los Yungas 1kg", slug: "platano-yungas-1kg", description: "PlÃ¡tanos frescos de los Yungas de La Paz. Dulces y maduros.", price: 8, images: ["https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?w=600&h=600&fit=crop"], categoryId: cats["frutas-verduras"].id, vendorId: vendor1.id, brand: "Yungas", tags: ["plÃ¡tano", "fruta", "yungas", "la paz"], badge: "Del dÃ­a", featured: true, stock: 100, sku: "FRU-PLA-1KG", weight: 1, avgRating: 4.7, reviewCount: 55, salesCount: 380 },
    { name: "Tomate Cherry de Cochabamba 500g", slug: "tomate-cherry-cochabamba-500g", description: "Tomates cherry frescos del Valle de Cochabamba. Perfectos para ensaladas.", price: 12, images: ["https://images.unsplash.com/photo-1546470427-0d4db154ceb8?w=600&h=600&fit=crop"], categoryId: cats["frutas-verduras"].id, vendorId: vendor1.id, brand: "Valle", tags: ["tomate", "verdura", "cochabamba"], stock: 70, sku: "FRU-TOM-500", weight: 0.5, avgRating: 4.5, reviewCount: 20, salesCount: 160 },
    { name: "Mango de los Llanos 1kg", slug: "mango-llanos-1kg", description: "Mangos jugosos del oriente boliviano. Variedad Tommy Atkins.", price: 15, images: ["https://images.unsplash.com/photo-1553279768-865429fa0078?w=600&h=600&fit=crop"], categoryId: cats["frutas-verduras"].id, vendorId: vendor1.id, brand: "Llanos", tags: ["mango", "fruta", "santa cruz"], stock: 60, sku: "FRU-MAN-1KG", weight: 1, avgRating: 4.8, reviewCount: 30, salesCount: 120 },
    { name: "Papa Huaycha 5kg", slug: "papa-huaycha-5kg", description: "Papa Huaycha de las tierras altas. La papa mÃ¡s popular de Bolivia.", price: 25, images: ["https://images.unsplash.com/photo-1518977676601-b53f82ber40f?w=600&h=600&fit=crop"], categoryId: cats["frutas-verduras"].id, vendorId: vendor1.id, brand: "Altiplano", tags: ["papa", "tubÃ©rculo", "huaycha"], stock: 80, sku: "FRU-PAP-5KG", weight: 5, avgRating: 4.6, reviewCount: 40, salesCount: 250 },

    // === PANADERÃA ===
    { name: "Marraqueta PaceÃ±a x10", slug: "marraqueta-pacena-x10", description: "Marraquetas crujientes reciÃ©n horneadas. El pan favorito de La Paz.", price: 10, images: ["https://images.unsplash.com/photo-1509440159596-0249088772ff?w=600&h=600&fit=crop"], categoryId: cats["panaderia"].id, vendorId: vendor1.id, brand: "PanaderÃ­a SB", tags: ["marraqueta", "pan", "la paz"], badge: "ReciÃ©n horneado", featured: true, stock: 200, sku: "PAN-MAR-10", weight: 0.6, avgRating: 4.9, reviewCount: 90, salesCount: 500 },
    { name: "Empanadas SalteÃ±as x6", slug: "empanadas-saltenas-x6", description: "SalteÃ±as jugosas con relleno de carne, papa y ajÃ­. TradiciÃ³n boliviana.", price: 30, images: ["https://images.unsplash.com/photo-1601924582970-9238bcb495d9?w=600&h=600&fit=crop"], categoryId: cats["panaderia"].id, vendorId: vendor1.id, brand: "PanaderÃ­a SB", tags: ["salteÃ±a", "empanada", "tradiciÃ³n"], trending: true, stock: 50, sku: "PAN-SAL-6", weight: 0.8, avgRating: 4.9, reviewCount: 75, salesCount: 340 },

    // === BEBIDAS ===
    { name: "Api Morado en Polvo 500g", slug: "api-morado-polvo-500g", description: "Mezcla para preparar Api morado, la bebida caliente tradicional boliviana a base de maÃ­z morado.", price: 18, images: ["https://images.unsplash.com/photo-1577003811926-53b288a6e5d0?w=600&h=600&fit=crop"], categoryId: cats["bebidas"].id, vendorId: vendor1.id, brand: "TradiciÃ³n", tags: ["api", "maÃ­z", "tradiciÃ³n", "boliviana"], badge: "TradiciÃ³n", featured: true, stock: 90, sku: "BEB-API-500", weight: 0.5, avgRating: 4.8, reviewCount: 60, salesCount: 280 },
    { name: "Cerveza PaceÃ±a Six Pack", slug: "cerveza-pacena-six-pack", description: "La cerveza boliviana mÃ¡s popular. 6 botellas de 330ml.", price: 48, originalPrice: 55, images: ["https://images.unsplash.com/photo-1608270586620-248524c67de9?w=600&h=600&fit=crop"], categoryId: cats["bebidas"].id, vendorId: vendor1.id, brand: "PaceÃ±a", tags: ["cerveza", "paceÃ±a", "bebida"], trending: true, stock: 120, sku: "BEB-PAC-6PK", weight: 2.5, avgRating: 4.7, reviewCount: 48, salesCount: 300 },
    { name: "Agua Mineral Viscachani 2L", slug: "agua-viscachani-2l", description: "Agua mineral natural de los manantiales de Viscachani. Sin gas.", price: 6, images: ["https://images.unsplash.com/photo-1548839140-29a749e1cf4d?w=600&h=600&fit=crop"], categoryId: cats["bebidas"].id, vendorId: vendor1.id, brand: "Viscachani", tags: ["agua", "mineral", "natural"], stock: 200, sku: "BEB-AGU-2L", weight: 2, avgRating: 4.4, reviewCount: 15, salesCount: 400 },

    // === LIMPIEZA Y HOGAR ===
    { name: "Detergente Omo Matic 3kg", slug: "detergente-omo-matic-3kg", description: "Detergente en polvo para lavadora automÃ¡tica. Limpieza profunda.", price: 55, images: ["https://images.unsplash.com/photo-1585441695325-21557ef66366?w=600&h=600&fit=crop"], categoryId: cats["limpieza-hogar"].id, vendorId: vendor1.id, brand: "Omo", tags: ["detergente", "limpieza", "lavanderÃ­a"], stock: 80, sku: "LIM-OMO-3KG", weight: 3, avgRating: 4.5, reviewCount: 22, salesCount: 130 },
    { name: "Lavandina Clorox 1L", slug: "lavandina-clorox-1l", description: "Desinfectante multiusos. Elimina 99.9% de gÃ©rmenes.", price: 12, images: ["https://images.unsplash.com/photo-1622394205098-eda3c9566115?w=600&h=600&fit=crop"], categoryId: cats["limpieza-hogar"].id, vendorId: vendor1.id, brand: "Clorox", tags: ["lavandina", "desinfectante", "limpieza"], stock: 100, sku: "LIM-CLO-1L", weight: 1, avgRating: 4.4, reviewCount: 18, salesCount: 110 },

    // === CUIDADO PERSONAL ===
    { name: "Shampoo Head & Shoulders 375ml", slug: "shampoo-hs-375ml", description: "Shampoo anticaspa. Limpieza profunda y frescura duradera.", price: 38, images: ["https://images.unsplash.com/photo-1631729371254-42c2892f0e6e?w=600&h=600&fit=crop"], categoryId: cats["cuidado-personal"].id, vendorId: vendor1.id, brand: "Head & Shoulders", tags: ["shampoo", "cabello", "personal"], stock: 70, sku: "CUI-HS-375", weight: 0.4, avgRating: 4.5, reviewCount: 25, salesCount: 90 },
    { name: "Crema Nivea Lata 250ml", slug: "crema-nivea-250ml", description: "Crema hidratante multiusos. ProtecciÃ³n para la piel seca del altiplano.", price: 42, images: ["https://images.unsplash.com/photo-1611930022073-b7a4ba5fcccd?w=600&h=600&fit=crop"], categoryId: cats["cuidado-personal"].id, vendorId: vendor1.id, brand: "Nivea", tags: ["crema", "hidratante", "piel"], stock: 60, sku: "CUI-NIV-250", weight: 0.3, avgRating: 4.7, reviewCount: 35, salesCount: 120 },

    // === MODA BOLIVIANA â€” 9 DEPARTAMENTOS ===
    { name: "Aguayo Moderno", slug: "aguayo-moderno-la-paz", description: "Aguayo tejido a mano con diseÃ±os contemporÃ¡neos inspirados en los textiles paceÃ±os. Colores azul y blanco representando el cielo del Illimani.", price: 180, originalPrice: 220, images: ["https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=600&h=600&fit=crop"], categoryId: cats["ropa-y-accesorios"].id, vendorId: vendor2.id, brand: "Moda 9D", tags: ["aguayo", "la paz", "textil", "artesanal"], badge: "La Paz", featured: true, trending: true, stock: 25, sku: "MOD-LP-001", weight: 0.3, avgRating: 4.9, reviewCount: 45, salesCount: 89 },
    { name: "Chaleco Tejido", slug: "chaleco-tejido-cochabamba", description: "Chaleco de alpaca con bordados florales del Valle de Cochabamba. Colores cÃ¡lidos tierra y naranja.", price: 250, images: ["https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=600&h=600&fit=crop"], categoryId: cats["ropa-y-accesorios"].id, vendorId: vendor2.id, brand: "Moda 9D", tags: ["chaleco", "cochabamba", "alpaca", "tejido"], badge: "Cochabamba", featured: true, stock: 20, sku: "MOD-CB-001", weight: 0.4, avgRating: 4.8, reviewCount: 32, salesCount: 56 },
    { name: "Camisa Tropical", slug: "camisa-tropical-santa-cruz", description: "Camisa ligera con estampado de flora y fauna del oriente boliviano. DiseÃ±o moderno con motivos de la ChiquitanÃ­a.", price: 150, images: ["https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=600&h=600&fit=crop"], categoryId: cats["ropa-y-accesorios"].id, vendorId: vendor2.id, brand: "Moda 9D", tags: ["camisa", "santa cruz", "tropical", "oriente"], badge: "Santa Cruz", featured: true, stock: 30, sku: "MOD-SC-001", weight: 0.2, avgRating: 4.7, reviewCount: 28, salesCount: 72 },
    { name: "Poncho Diablada", slug: "poncho-diablada-oruro", description: "Poncho inspirado en los colores vibrantes del Carnaval de Oruro. DiseÃ±o con motivos de la Diablada en tonos rojo, pÃºrpura y dorado.", price: 320, originalPrice: 380, images: ["https://images.unsplash.com/photo-1544022613-e87ca75a784a?w=600&h=600&fit=crop"], categoryId: cats["ropa-y-accesorios"].id, vendorId: vendor2.id, brand: "Moda 9D", tags: ["poncho", "oruro", "diablada", "carnaval"], badge: "Oruro", featured: true, stock: 15, sku: "MOD-OR-001", weight: 0.5, avgRating: 4.9, reviewCount: 50, salesCount: 45 },
    { name: "Bolso Minero", slug: "bolso-minero-potosi", description: "Bolso de cuero artesanal con acabados metÃ¡licos inspirados en la tradiciÃ³n minera del Cerro Rico de PotosÃ­.", price: 200, images: ["https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=600&h=600&fit=crop"], categoryId: cats["ropa-y-accesorios"].id, vendorId: vendor2.id, brand: "Moda 9D", tags: ["bolso", "potosÃ­", "cuero", "minero"], badge: "Potosi", stock: 18, sku: "MOD-PO-001", weight: 0.6, avgRating: 4.7, reviewCount: 22, salesCount: 38 },
    { name: "Vestido Vendimia", slug: "vestido-vendimia-tarija", description: "Vestido floral inspirado en la Fiesta de la Vendimia de Tarija. Tela ligera con estampados de viÃ±edos en tonos rosa y pÃºrpura.", price: 280, images: ["https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=600&h=600&fit=crop"], categoryId: cats["ropa-y-accesorios"].id, vendorId: vendor2.id, brand: "Moda 9D", tags: ["vestido", "tarija", "vendimia", "floral"], badge: "Tarija", featured: true, stock: 12, sku: "MOD-TJ-001", weight: 0.3, avgRating: 4.8, reviewCount: 35, salesCount: 42 },
    { name: "Sombrero Colonial", slug: "sombrero-colonial-chuquisaca", description: "Sombrero artesanal inspirado en la arquitectura colonial de Sucre. DiseÃ±o elegante en tonos marfil y dorado.", price: 160, images: ["https://images.unsplash.com/photo-1521369909029-2afed882baee?w=600&h=600&fit=crop"], categoryId: cats["ropa-y-accesorios"].id, vendorId: vendor2.id, brand: "Moda 9D", tags: ["sombrero", "chuquisaca", "sucre", "colonial"], badge: "Chuquisaca", stock: 22, sku: "MOD-CH-001", weight: 0.2, avgRating: 4.6, reviewCount: 18, salesCount: 30 },
    { name: "Hamaca Artesanal", slug: "hamaca-artesanal-beni", description: "Hamaca tejida a mano por artesanas del Beni. Colores turquesa y verde que evocan los rÃ­os y la selva amazÃ³nica.", price: 350, images: ["https://images.unsplash.com/photo-1519643381401-22c77e60520e?w=600&h=600&fit=crop"], categoryId: cats["ropa-y-accesorios"].id, vendorId: vendor2.id, brand: "Moda 9D", tags: ["hamaca", "beni", "artesanal", "amazÃ³nico"], badge: "Beni", stock: 10, sku: "MOD-BN-001", weight: 1.2, avgRating: 4.9, reviewCount: 15, salesCount: 22 },
    { name: "Mochila AmazÃ³nica", slug: "mochila-amazonica-pando", description: "Mochila ecolÃ³gica con materiales sostenibles de la AmazonÃ­a. DiseÃ±o verde con motivos de la selva pandina.", price: 220, images: ["https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=600&h=600&fit=crop"], categoryId: cats["ropa-y-accesorios"].id, vendorId: vendor2.id, brand: "Moda 9D", tags: ["mochila", "pando", "amazÃ³nica", "ecolÃ³gica"], badge: "Pando", stock: 16, sku: "MOD-PA-001", weight: 0.4, avgRating: 4.7, reviewCount: 12, salesCount: 28 },

    // === ELECTRÃ“NICA ===
    { name: "Licuadora Oster 3 Velocidades", slug: "licuadora-oster-3vel", description: "Licuadora Oster clÃ¡sica con vaso de vidrio y 3 velocidades. Ideal para jugos y licuados.", price: 280, images: ["https://images.unsplash.com/photo-1570222094114-d054a817e56b?w=600&h=600&fit=crop"], categoryId: cats["electronica"].id, vendorId: vendor1.id, brand: "Oster", tags: ["licuadora", "cocina", "electrodomÃ©stico"], stock: 35, sku: "ELE-OST-LIC", weight: 3.5, avgRating: 4.5, reviewCount: 20, salesCount: 65 },
    { name: "Celular Xiaomi Redmi Note 13", slug: "xiaomi-redmi-note-13", description: "Smartphone Xiaomi Redmi Note 13 128GB. Pantalla AMOLED 6.67\", cÃ¡mara 108MP, baterÃ­a 5000mAh. Compatible con Entel, Tigo y Viva.", price: 1450, originalPrice: 1700, images: ["https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=600&h=600&fit=crop"], categoryId: cats["electronica"].id, vendorId: vendor1.id, brand: "Xiaomi", tags: ["celular", "xiaomi", "smartphone", "5g"], badge: "TecnologÃ­a", featured: true, trending: true, stock: 25, sku: "ELE-XIA-RN13", weight: 0.2, avgRating: 4.7, reviewCount: 55, salesCount: 120 },
  ];

  for (const p of productData) {
    const catSlug = Object.keys(cats).find(k => cats[k].id === p.categoryId);
    const catName = catData.find(c => c.slug === catSlug)?.name || "";
    const product = await prisma.product.upsert({
      where: { slug: p.slug },
      update: { name: p.name },
      create: {
        name: p.name, slug: p.slug, description: p.description,
        price: p.price, originalPrice: p.originalPrice || null, comparePrice: p.originalPrice || null, costPrice: Math.floor(p.price * 0.6),
        images: p.images, categoryId: p.categoryId, categoryName: catName, vendorId: p.vendorId,
        brand: p.brand || null, tags: p.tags || [], badge: p.badge || null,
        featured: p.featured || false, trending: p.trending || false,
        stock: p.stock, lowStockThreshold: 10, sku: p.sku, weight: p.weight || null,
        avgRating: p.avgRating || 0, reviewCount: p.reviewCount || 0, salesCount: p.salesCount || 0, active: true,
      },
    });
    products.push(product);
  }
  console.log(`  âœ… ${products.length} productos creados`);

  // â”€â”€â”€ BANNERS â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  await prisma.banner.deleteMany({});
  await prisma.banner.createMany({
    data: [
      { title: "SurtiBolivia â€” Tu Supermercado en LÃ­nea", subtitle: "Productos frescos y moda boliviana con envÃ­o a todo el paÃ­s", image: "https://images.unsplash.com/photo-1542838132-92c53300491e?w=1400&h=500&fit=crop", link: "/", position: "hero", order: 0 },
      { title: "Ropa de los 9 Departamentos", subtitle: "Descubre nuestra coleccion exclusiva inspirada en toda Bolivia", image: "https://images.unsplash.com/photo-1558171813-4c088753af8f?w=1400&h=500&fit=crop", link: "/?category=ropa-y-accesorios", position: "hero", order: 1 },
      { title: "Frutas y Verduras Frescas", subtitle: "Directas de los valles y yungas a tu mesa", image: "https://images.unsplash.com/photo-1610832958506-aa56368176cf?w=1400&h=500&fit=crop", link: "/?category=frutas-verduras", position: "hero", order: 2 },
    ],
  });

  // â”€â”€â”€ COLLECTIONS â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  await prisma.collectionProduct.deleteMany({});
  await prisma.collection.deleteMany({});
  const modaCol = await prisma.collection.create({
    data: { name: "Ropa y Accesorios -- 9 Departamentos", slug: "ropa-9-departamentos", description: "Prendas y accesorios unicos inspirados en cada departamento de Bolivia" },
  });
  const modaProducts = products.filter(p => ["aguayo-moderno-la-paz", "chaleco-tejido-cochabamba", "camisa-tropical-santa-cruz", "poncho-diablada-oruro", "bolso-minero-potosi", "vestido-vendimia-tarija", "sombrero-colonial-chuquisaca", "hamaca-artesanal-beni", "mochila-amazonica-pando"].includes(p.slug));
  for (let i = 0; i < modaProducts.length; i++) {
    await prisma.collectionProduct.upsert({
      where: { collectionId_productId: { collectionId: modaCol.id, productId: modaProducts[i].id } },
      update: {},
      create: { collectionId: modaCol.id, productId: modaProducts[i].id, order: i },
    });
  }
  const bestSellers = await prisma.collection.create({
    data: { name: "Los MÃ¡s Vendidos", slug: "mas-vendidos", description: "Los productos favoritos de la familia boliviana" },
  });
  const topProducts = [...products].sort((a, b) => (b.salesCount || 0) - (a.salesCount || 0)).slice(0, 8);
  for (let i = 0; i < topProducts.length; i++) {
    await prisma.collectionProduct.upsert({
      where: { collectionId_productId: { collectionId: bestSellers.id, productId: topProducts[i].id } },
      update: {},
      create: { collectionId: bestSellers.id, productId: topProducts[i].id, order: i },
    });
  }

  // â”€â”€â”€ COUPONS â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  await prisma.coupon.deleteMany({});
  await prisma.coupon.createMany({
    data: [
      { code: "BIENVENIDO20", type: "percentage", discount: 20, maxDiscount: 100, minAmount: 100, maxUses: 1000, usedCount: 234, expiresAt: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000), active: true },
      { code: "SURTI10", type: "percentage", discount: 10, maxDiscount: 50, minAmount: 50, maxUses: 500, usedCount: 167, expiresAt: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000), active: true },
      { code: "ENVIOGRATIS", type: "fixed", discount: 25, minAmount: 200, maxUses: 500, usedCount: 78, expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), active: true },
      { code: "MODA30", type: "percentage", discount: 30, maxDiscount: 200, minAmount: 300, maxUses: 100, usedCount: 23, perUser: 1, expiresAt: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000), active: true },
    ],
  });

  // â”€â”€â”€ FLASH DEALS â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  await prisma.flashDeal.deleteMany({});
  const flashSlugs = ["leche-pil-entera-1l", "aguayo-moderno-la-paz", "cerveza-pacena-six-pack", "pechuga-pollo-sofia-1kg"];
  const flashItems = products.filter(p => flashSlugs.includes(p.slug));
  for (const fp of flashItems) {
    await prisma.flashDeal.create({
      data: { title: fp.name, productId: fp.id, discount: Math.floor(Math.random() * 15) + 10, startDate: new Date(), endDate: new Date(Date.now() + 72 * 60 * 60 * 1000) },
    });
  }

  // â”€â”€â”€ REVIEWS â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  await prisma.review.deleteMany({});
  const realReviews = [
    { title: "Excelente calidad", comment: "Producto fresco y bien empaquetado. LlegÃ³ a mi casa en La Paz en perfecto estado.", rating: 5 },
    { title: "Muy bueno", comment: "La calidad es excelente para el precio. En el supermercado cuesta mÃ¡s.", rating: 5 },
    { title: "Buena relaciÃ³n calidad-precio", comment: "Para ser delivery estÃ¡ muy bien. Mejor precio que en los supermercados.", rating: 4 },
    { title: "Me encantÃ³", comment: "Primera vez que compro online y la experiencia fue genial. Todo llegÃ³ completo.", rating: 5 },
    { title: "Recomendado", comment: "Compro cada semana por SurtiBolivia. Es mÃ¡s cÃ³modo que ir al mercado.", rating: 4 },
    { title: "Buen producto", comment: "Cumple con lo descrito. El envÃ­o a Cochabamba fue rÃ¡pido.", rating: 4 },
  ];
  const reviewUsers = [customer, customer2];
  for (const product of products.slice(0, 16)) {
    for (let i = 0; i < reviewUsers.length; i++) {
      const r = realReviews[Math.floor(Math.random() * realReviews.length)];
      await prisma.review.create({ data: { productId: product.id, userId: reviewUsers[i].id, rating: r.rating, title: r.title, comment: r.comment, verified: Math.random() > 0.2 } });
    }
  }

  // â”€â”€â”€ ORDERS â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  await prisma.orderItem.deleteMany({});
  await prisma.order.deleteMany({});
  const orderStatuses = ["pending", "confirmed", "processing", "shipped", "delivered", "delivered"];
  const paymentStatuses = ["pending", "paid", "paid", "paid", "paid", "paid"];
  for (let i = 0; i < 15; i++) {
    const user = [customer, customer2][i % 2];
    const statusIdx = Math.floor(Math.random() * orderStatuses.length);
    const randomProducts = [...products].sort(() => Math.random() - 0.5).slice(0, Math.floor(Math.random() * 4) + 1);
    const items = randomProducts.map((p) => ({ productId: p.id, quantity: Math.floor(Math.random() * 3) + 1, price: p.price }));
    const subtotal = items.reduce((s, it) => s + it.price * it.quantity, 0);
    const shippingCost = subtotal > 200 ? 0 : 25;
    await prisma.order.create({
      data: {
        userId: user.id, customerEmail: user.email, customerName: user.name,
        orderNumber: `SB-${String(2025000 + i).padStart(7, "0")}`,
        status: orderStatuses[statusIdx], paymentStatus: paymentStatuses[statusIdx],
        subtotal, shippingCost, discountAmount: 0, tax: 0, total: subtotal + shippingCost,
        items: { create: items },
        createdAt: new Date(Date.now() - Math.floor(Math.random() * 45) * 24 * 60 * 60 * 1000),
      },
    });
  }

  // â”€â”€â”€ ADDRESSES â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  await prisma.address.deleteMany({});
  await prisma.address.createMany({
    data: [
      { userId: customer.id, name: "Pedro LÃ³pez", phone: "+591 71234567", street: "Av. Arce #2135, Edificio Multicentro, Piso 4", city: "La Paz", state: "La Paz", zipCode: "0000", country: "Bolivia", isDefault: true },
      { userId: customer.id, name: "Pedro LÃ³pez", phone: "+591 71234567", street: "Av. AmÃ©rica #567, Zona Queru Queru", city: "Cochabamba", state: "Cochabamba", country: "Bolivia" },
      { userId: customer2.id, name: "Ana Torres", phone: "+591 76543210", street: "Av. MonseÃ±or Rivero #300, 3er Anillo", city: "Santa Cruz de la Sierra", state: "Santa Cruz", zipCode: "0000", country: "Bolivia", isDefault: true },
    ],
  });

  // â”€â”€â”€ NOTIFICATIONS â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  await prisma.notification.deleteMany({});
  await prisma.notification.createMany({
    data: [
      { userId: customer.id, type: "order", title: "Pedido enviado", message: "Tu pedido SB-2025003 ha sido enviado. RecibirÃ¡s tus productos frescos hoy.", read: false },
      { userId: customer.id, type: "promo", title: "Nueva coleccion Ropa y Accesorios!", message: "Descubre las prendas inspiradas en los 9 departamentos. Usa MODA30 para 30% OFF.", read: false },
      { userId: customer.id, type: "system", title: "Bienvenido a SurtiBolivia", message: "Â¡Gracias por registrarte! Usa BIENVENIDO20 para un 20% en tu primera compra.", read: true },
      { userId: vendor1User.id, type: "order", title: "Nueva venta", message: "Has vendido 3x Arroz Grano de Oro 5kg y 2x Leche PIL. Â¡Prepara el envÃ­o!", read: false },
    ],
  });

  // â”€â”€â”€ QUESTIONS â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  await prisma.productAnswer.deleteMany({});
  await prisma.productQuestion.deleteMany({});
  const aguayo = products.find((p) => p.slug === "aguayo-moderno-la-paz");
  if (aguayo) {
    const q1 = await prisma.productQuestion.create({ data: { productId: aguayo.id, userId: customer.id, question: "Â¿Es tejido a mano o industrial?" } });
    await prisma.productAnswer.create({ data: { questionId: q1.id, userId: vendor2User.id, answer: "Es 100% tejido a mano por artesanas de El Alto. Cada pieza es Ãºnica." } });
    const q2 = await prisma.productQuestion.create({ data: { productId: aguayo.id, userId: customer2.id, question: "Â¿Se puede lavar en lavadora?" } });
    await prisma.productAnswer.create({ data: { questionId: q2.id, userId: vendor2User.id, answer: "Recomendamos lavado a mano con agua frÃ­a para preservar los colores." } });
  }

  // â”€â”€â”€ SETTINGS â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  const settings = [
    { key: "store_name", value: "SurtiBolivia", category: "general" },
    { key: "store_email", value: "hola@surtibolivia.bo", category: "general" },
    { key: "store_phone", value: "+591 2 2444567", category: "general" },
    { key: "store_address", value: "Av. 16 de Julio #1500, La Paz, Bolivia", category: "general" },
    { key: "store_currency", value: "BOB", category: "general" },
    { key: "store_locale", value: "es-BO", category: "general" },
    { key: "free_shipping_min", value: "200", category: "shipping" },
    { key: "default_shipping_cost", value: "25", category: "shipping" },
    { key: "vendor_commission", value: "10", category: "vendors" },
    { key: "loyalty_points_rate", value: "1", category: "loyalty" },
    { key: "referral_reward", value: "20", category: "loyalty" },
  ];
  for (const s of settings) {
    await prisma.setting.upsert({ where: { key: s.key }, update: { value: s.value }, create: s });
  }

  // â”€â”€â”€ ACTIVITY LOG â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  await prisma.activityLog.deleteMany({});
  await prisma.activityLog.createMany({
    data: [
      { userId: admin.id, action: "seed", entity: "system", entityId: "init", details: "Base de datos inicializada con datos de SurtiBolivia" },
      { userId: vendor1User.id, action: "product_create", entity: "product", entityId: products[0]?.id || "0", details: "Producto de abarrotes creado" },
      { userId: vendor2User.id, action: "product_create", entity: "product", entityId: products[products.length - 1]?.id || "0", details: "Producto de ropa y accesorios creado" },
    ],
  });

  console.log("SurtiBolivia seeded successfully!");
  console.log(`  Users: 5 | Vendors: 2 | Categories: ${catData.length} | Products: ${products.length}`);
  console.log(`  Ropa y Accesorios: 9 (one per department)`);
  console.log(`  Login: admin@surtibolivia.bo / Password123!`);
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());





