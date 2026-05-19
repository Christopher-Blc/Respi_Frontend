import React from 'react';
import { StripeProvider } from '@stripe/stripe-react-native';

interface StripeWrapperProps {
  children: any; // Cambiado a any para que acepte múltiples componentes hijos sin quejarse
  publishableKey: string;
}

export default function StripeWrapper({
  children,
  publishableKey,
}: StripeWrapperProps) {
  return (
    <StripeProvider
      publishableKey={publishableKey}
      merchantIdentifier="merchant.es.respi"
    >
      {children}
    </StripeProvider>
  );
}
