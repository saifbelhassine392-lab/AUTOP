import { NextResponse } from 'next/server';

export async function POST() {
  const response = NextResponse.json({ success: true, message: 'Deconnexion reussie' });
  response.cookies.delete('autop_session');
  return response;
}