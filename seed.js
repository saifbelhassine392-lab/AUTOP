const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  const hashedPassword = await bcrypt.hash('admin123', 10);
  
  const admin = await prisma.user.upsert({
    where: { email: 'admin@autop.tn' },
    update: {},
    create: {
      email: 'admin@autop.tn',
      name: 'Admin AUTOP',
      password: hashedPassword,
      role: 'admin',
    },
  });
  
  console.log('Admin créé:', admin.email);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());