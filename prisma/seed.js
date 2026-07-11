const { PrismaClient, UserRole } = require('@prisma/client')
const bcrypt = require('bcryptjs')

const prisma = new PrismaClient()

async function main() {
  console.log('Start seeding...')

  // Créer un admin
  const adminPassword = await bcrypt.hash('admin123', 10)
  const admin = await prisma.user.upsert({
    where: { email: 'admin@autop.tn' },
    update: {},
    create: {
      email: 'admin@autop.tn',
      password: adminPassword,
      firstName: 'Admin',
      lastName: 'AUTOP',
      name: 'Admin AUTOP',
      role: UserRole.ADMIN,
      phone: '+216 00 000 000',
    },
  })
  console.log('Created admin:', admin.email)

  // Créer un client de test
  const clientPassword = await bcrypt.hash('client123', 10)
  const client = await prisma.user.upsert({
    where: { email: 'client@autop.tn' },
    update: {},
    create: {
      email: 'client@autop.tn',
      password: clientPassword,
      firstName: 'Client',
      lastName: 'Test',
      name: 'Client Test',
      role: UserRole.CUSTOMER,
      phone: '+216 11 111 111',
    },
  })
  console.log('Created client:', client.email)

  // Créer un pro de test
  const proPassword = await bcrypt.hash('pro123', 10)
  const pro = await prisma.user.upsert({
    where: { email: 'pro@autop.tn' },
    update: {},
    create: {
      email: 'pro@autop.tn',
      password: proPassword,
      firstName: 'Pro',
      lastName: 'Test',
      name: 'Pro Test',
      role: UserRole.PROFESSIONAL,
      phone: '+216 22 222 222',
    },
  })
  console.log('Created pro:', pro.email)

  // Créer des catégories
  const category1 = await prisma.category.upsert({
    where: { slug: 'moteur' },
    update: {},
    create: {
      name: 'Moteur',
      slug: 'moteur',
      description: 'Pièces de moteur',
      isActive: true,
      sortOrder: 1,
    },
  })
  console.log('Created category:', category1.name)

  const category2 = await prisma.category.upsert({
    where: { slug: 'freinage' },
    update: {},
    create: {
      name: 'Freinage',
      slug: 'freinage',
      description: 'Système de freinage',
      isActive: true,
      sortOrder: 2,
    },
  })
  console.log('Created category:', category2.name)

  // Créer des marques
  const brand1 = await prisma.brand.upsert({
    where: { slug: 'bosch' },
    update: {},
    create: {
      name: 'Bosch',
      slug: 'bosch',
      description: 'Marque allemande',
      country: 'Allemagne',
      isActive: true,
    },
  })
  console.log('Created brand:', brand1.name)

  // Créer des produits
  const product1 = await prisma.product.upsert({
    where: { slug: 'bougie-allumage-bosch' },
    update: {},
    create: {
      name: 'Bougie d\'allumage Bosch',
      slug: 'bougie-allumage-bosch',
      reference: 'BOS-12345',
      description: 'Bougie d\'allumage haute qualité',
      price: 25.99,
      stock: 100,
      images: ['/images/bougie.jpg'],
      isActive: true,
      isFeatured: true,
      categoryId: category1.id,
      brandId: brand1.id,
    },
  })
  console.log('Created product:', product1.name)

  // Créer un banner
  const banner1 = await prisma.banner.upsert({
    where: { id: 'banner-1' },
    update: {},
    create: {
      id: 'banner-1',
      title: 'Bienvenue sur AUTOP',
      subtitle: 'Vos pièces auto au meilleur prix',
      image: '/images/banner1.jpg',
      link: '/pieces',
      position: 'home',
      isActive: true,
      sortOrder: 1,
    },
  })
  console.log('Created banner:', banner1.title)

  console.log('Seeding finished.')
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })