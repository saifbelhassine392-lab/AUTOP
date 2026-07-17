import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

async function main() {
  try {
    const user = await prisma.user.findFirst();
    if (!user) {
      console.log("No user found.");
      return;
    }
    
    console.log("Found user:", user.email);

    const msg = await prisma.chatMessage.create({
      data: {
        userId: user.id,
        senderId: user.id,
        senderName: user.name || 'Test',
        content: "Test message"
      }
    });
    console.log("Created message:", msg);
    
    // cleanup
    await prisma.chatMessage.delete({ where: { id: msg.id } });
  } catch (e) {
    console.error("Error creating chat message:", e);
  }
}
main()

async function main2() {
    try {
        const suppliers = await prisma.supplier.findMany({
            select: { id: true, name: true }
        });
        console.log("Suppliers in DB:", suppliers);
    } catch (e) {
        console.error("DB Error:", e);
    } finally {
        await prisma.$disconnect();
    }
}

main2();
