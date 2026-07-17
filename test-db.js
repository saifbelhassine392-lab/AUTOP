const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  try {
    const users = await prisma.user.findMany();
    console.log('Users in DB:');
    users.forEach(u => console.log(`- ID: ${u.id}, Email: ${u.email}, Role: ${u.role}, Name: ${u.name}`));

    if (users.length === 0) {
      console.log('No users in database. Cannot simulate.');
      return;
    }

    const adminUser = users.find(u => u.role === 'ADMIN') || users[0];
    const clientUser = users.find(u => u.role === 'CLIENT' || u.role === 'PRO') || users[0];
    
    console.log(`Using admin user: ${adminUser.email}`);
    console.log(`Using client user: ${clientUser.email}`);

    // Let's try to simulate devis creation
    const body = {
      clientEmail: clientUser.email,
      vehicleBrand: 'PEUGEOT',
      vehicleModel: '208',
      vehicleYear: 2024,
      vehicleVin: 'VF3...',
      notes: 'Test notes',
      totalPrice: 339.15,
      responseNote: 'Test response note',
      items: [
        {
          designation: 'PLAQUETTE AV',
          reference: 'M00001',
          qty: 1,
          puHT: 150,
          discount: 3,
          offres: [
            {
              type: 'ADAPTABLE',
              supplierId: '', // Empty supplierId
              purchasePrice: 120,
              sellingPrice: 142.5
            }
          ]
        }
      ],
      quoteId: null,
      managedByName: 'SAIF'
    };

    console.log('Simulating creation...');

    // We will replicate the logic of app/api/devis/route.ts POST
    const { vehicleBrand, vehicleModel, vehicleYear, vehicleVin, notes: devisNotes, items, clientEmail, quoteId, managedByName } = body;

    let targetUserId = clientUser.id;

    // Chercher le profil admin actif
    let managedById = null;
    if (managedByName) {
      let profile = await prisma.adminProfile.findUnique({
        where: { name: managedByName }
      });
      if (!profile) {
        profile = await prisma.adminProfile.create({
          data: { name: managedByName }
        });
      }
      managedById = profile.id;
    }

    // Auto-enregistrement des nouveaux articles et association aux produits
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
          let category = await prisma.category.findFirst();
          if (!category) {
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
        }
        productId = product.id;
      }

      devisItems.push({
        name,
        price: parseFloat(item.price || item.puHT) || 0,
        quantity: parseInt(item.quantity || item.qty) || 1,
        discount: parseFloat(item.discount) || 0,
        productId
      });
    }

    console.log('Creating devis...');
    const devis = await prisma.devis.create({
      data: {
        userId: targetUserId,
        vehicleBrand,
        vehicleModel,
        vehicleYear: parseInt(vehicleYear) || null,
        vehicleVin,
        notes: devisNotes,
        status: 'completed',
        totalPrice: parseFloat(body.totalPrice) || 0,
        responseNote: body.responseNote || 'Proposition commerciale...',
        items: {
          create: devisItems
        },
        managedById
      },
      include: { items: true },
    });

    console.log('Devis created successfully:', devis.id);

    // Insérer l'historique des prix via PartPriceHistory pour chaque offre
    const priceHistoryData = [];
    for (let i = 0; i < items.length; i++) {
      const sourceItem = items[i];
      if (sourceItem.reference && sourceItem.offres && Array.isArray(sourceItem.offres)) {
        for (const offre of sourceItem.offres) {
          if (offre.supplierId || offre.purchasePrice || offre.sellingPrice) {
            priceHistoryData.push({
              reference: sourceItem.reference.trim().toUpperCase(),
              isConcessionnaire: offre.type === 'ORIGINE',
              supplierId: offre.supplierId || null,
              purchasePrice: parseFloat(offre.purchasePrice) || null,
              sellingPrice: parseFloat(offre.sellingPrice) || null,
            });
          }
        }
      }
    }
    
    if (priceHistoryData.length > 0) {
      console.log('Creating PartPriceHistory:', priceHistoryData);
      await prisma.partPriceHistory.createMany({
        data: priceHistoryData
      });
      console.log('PartPriceHistory created successfully!');
    }

  } catch (error) {
    console.error('Error during simulation:', error);
  } finally {
    await prisma.$disconnect();
  }
}

main();
