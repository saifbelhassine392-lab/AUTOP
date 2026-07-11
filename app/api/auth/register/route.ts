import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, email, password } = body;

    // Vérification des 3 champs réels de ton interface
    if (!name || !email || !password) {
      return NextResponse.json({ message: "Tous les champs sont obligatoires" }, { status: 400 });
    }

    const existingUser = await prisma.user.findUnique({
      where: { email: email.toLowerCase() },
    });

    if (existingUser) {
      return NextResponse.json({ message: "Cet email est déjà utilisé" }, { status: 400 });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    
    await prisma.user.create({
      data: {
        name,
        email: email.toLowerCase(),
        password: hashedPassword,
      },
    });

    return NextResponse.json({ message: "Utilisateur créé avec succès" }, { status: 201 });
  } catch (error) {
    console.error("DÉTAIL ERREUR INSCRIPTION :", error);
    return NextResponse.json({ message: "Erreur serveur" }, { status: 500 });
  }
}