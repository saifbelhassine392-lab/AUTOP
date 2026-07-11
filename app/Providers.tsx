'use client';

import { SessionProvider } from 'next-auth/react';
import { CartProvider } from '@/contexts/CartContext';
import { AppProvider } from '@/lib/context';
import { ReactNode } from 'react';

interface ProvidersProps {
  children: ReactNode;
}

export default function Providers({ children }: ProvidersProps) {
  return (
    <SessionProvider>
      <AppProvider>
        <CartProvider>
          {children}
        </CartProvider>
      </AppProvider>
    </SessionProvider>
  );
}