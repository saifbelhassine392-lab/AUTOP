async function test() {
  const payload = {
    clientEmail: "admin@autop.fr",
    vehicleBrand: "Générique",
    vehicleModel: "N/A",
    vehicleYear: 2024,
    vehicleVin: "",
    notes: "",
    totalPrice: 124.355,
    responseNote: "Proposition commerciale...",
    items: [
      {
        designation: "(ORIGINE) PARE CHOC AV",
        reference: "450214",
        qty: "1",
        puHT: 110,
        discount: 5,
        offres: []
      }
    ],
    quoteId: null,
    managedByName: "SAIF"
  };

  try {
    const { PrismaClient } = require('@prisma/client');
    const prisma = new PrismaClient();

    // Mock the exact logic of the API
    console.log("Testing creation logic directly...");
    const items = payload.items;
    
    const devisItems = [];
    for (const item of items) {
      const name = item.name || item.designation || 'Nouvel Article';
      const reference = item.reference ? item.reference.trim().toUpperCase() : null;
      let productId = null;

      if (reference) {
        let product = await prisma.product.findFirst({
          where: { OR: [{ reference }, { sku: reference }] }
        });

        if (!product) {
          console.log("Product not found, creating it:", reference);
          let category = await prisma.category.findFirst();
          if (!category) {
            console.log("Creating category...");
            category = await prisma.category.create({
              data: { name: 'Général', slug: 'general' }
            });
          }

          product = await prisma.product.create({
            data: {
              sku: reference,
              reference: reference,
              name: name,
              slug: `${name.toLowerCase().replace(/[^a-z0-9]+/g, '-')}-${reference.toLowerCase()}`,
              price: parseFloat(item.price || item.puHT) || 0,
              costPrice: (parseFloat(item.price || item.puHT) || 0) * 0.8,
              stock: 0,
              categoryId: category.id,
              status: 'ACTIVE'
            }
          });
          console.log("Product created with ID:", product.id);
        } else {
          console.log("Product found:", product.id);
          productId = product.id;
        }
      }

      devisItems.push({
        name,
        reference,
        price: parseFloat(item.price || item.puHT) || 0,
        quantity: parseInt(item.quantity || item.qty) || 1,
        discount: parseFloat(item.discount) || 0,
        productId
      });
    }
    
    console.log("Creating devis with items", devisItems);

    const dbUser = await prisma.user.findFirst();
    if (!dbUser) {
      throw new Error("No user found in the database. Please seed the database first.");
    }
    const targetUserId = dbUser.id;
    const user = { role: 'ADMIN' };
    const body = payload;

    const devis = await prisma.devis.create({
      data: {
        userId: targetUserId,
        vehicleBrand: payload.vehicleBrand,
        vehicleModel: payload.vehicleModel,
        vehicleYear: parseInt(payload.vehicleYear) || null,
        vehicleVin: payload.vehicleVin,
        notes: payload.notes,
        status: user.role === 'ADMIN' ? 'completed' : 'pending',
        totalPrice: user.role === 'ADMIN' ? parseFloat(body.totalPrice) || 0 : 0,
        responseNote: user.role === 'ADMIN' ? body.responseNote || 'Proposition commerciale établie par l\'administrateur.' : null,
        items: {
          create: devisItems
        },
        managedById: null
      },
      include: { items: true },
    })

    console.log("Devis created successfully:", devis.id);

    console.log("Success!");
    process.exit(0);
  } catch(e) {
    console.error("FAILED:", e);
    process.exit(1);
  }
}

test();
