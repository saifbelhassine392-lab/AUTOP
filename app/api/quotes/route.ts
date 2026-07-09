import { NextResponse } from "next/server"
import bcrypt from "bcryptjs"

// TODO: Remplace par ta vraie base de données (Prisma, Mongoose, etc.)
const users: any[] = []

export async function POST(req: Request) {
  try {
    const { nom, email, password } = await req.json()

    // Validation
    if (!nom || !email || !password) {
      return NextResponse.json(
        { message: "Tous les champs sont requis" },
        { status: 400 }
      )
    }

    // Vérifier si l'email existe déjà
    const existingUser = users.find(u => u.email === email)
    if (existingUser) {
      return NextResponse.json(
        { message: "Cet email est déjà utilisé" },
        { status: 409 }
      )
    }

    // Hasher le mot de passe
    const hashedPassword = await bcrypt.hash(password, 10)

    // Créer l'utilisateur
    const newUser = {
      id: String(users.length + 1),
      nom,
      email,
      password: hashedPassword,
      role: "user",
      createdAt: new Date()
    }

    users.push(newUser)

    return NextResponse.json(
      { message: "Utilisateur créé avec succès", user: { id: newUser.id, nom, email } },
      { status: 201 }
    )
  } catch (error) {
    return NextResponse.json(
      { message: "Erreur serveur" },
      { status: 500 }
    )
  }
}