import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';

// Route pour créer les comptes admin initiaux
// USAGE: GET /api/setup-admins (une seule fois)
export async function GET(req: NextRequest) {
  // Vérification d'une clé de sécurité dans l'URL
  const { searchParams } = new URL(req.url);
  const secret = searchParams.get('secret');

  if (secret !== 'autop2026setup') {
    return NextResponse.json({ error: 'Accès refusé' }, { status: 403 });
  }

  const admins = [
    {
      name: 'Saif',
      firstName: 'Saif',
      lastName: 'Belhassine',
      email: 'saif@autop.tn',
      phone: '98171411',
      password: 'Autop2026@Saif'
    },
    {
      name: 'Amine',
      firstName: 'Amine',
      lastName: 'AUTOP',
      email: 'amine@autop.tn',
      phone: '98774525',
      password: 'Autop2026@Amine'
    },
    {
      name: 'Saifallah',
      firstName: 'Saifallah',
      lastName: 'AUTOP',
      email: 'saifallah@autop.tn',
      phone: '98171415',
      password: 'Autop2026@Saifallah'
    }
  ];

  const results = [];

  for (const admin of admins) {
    const existing = await prisma.user.findUnique({ where: { email: admin.email } });

    if (existing) {
      // Mettre à jour le téléphone si déjà existant
      await prisma.user.update({
        where: { email: admin.email },
        data: {
          phone: admin.phone,
          role: 'ADMIN',
          name: admin.name,
          firstName: admin.firstName,
          lastName: admin.lastName,
        }
      });
      results.push({ email: admin.email, action: 'mis à jour' });
    } else {
      const hashedPassword = await bcrypt.hash(admin.password, 12);
      await prisma.user.create({
        data: {
          name: admin.name,
          firstName: admin.firstName,
          lastName: admin.lastName,
          email: admin.email,
          phone: admin.phone,
          password: hashedPassword,
          role: 'ADMIN',
          status: 'active',
        }
      });
      results.push({ email: admin.email, action: 'créé', password: admin.password });
    }
  }

  return NextResponse.json({
    success: true,
    message: '3 comptes admin AUTOP configurés avec succès',
    comptes: results.map(r => ({
      ...r,
      note: 'Supprimez cet endpoint après la première utilisation'
    }))
  });
}
