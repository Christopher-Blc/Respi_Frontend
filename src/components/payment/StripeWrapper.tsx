import React from 'react';

interface StripeWrapperProps {
  children: React.ReactNode;
  publishableKey: string;
}

export default function StripeWrapper({ children }: StripeWrapperProps) {
  // En la Web se salta el proveedor y devuelve los componentes hijos directamente
  return <>{children}</>;
}
