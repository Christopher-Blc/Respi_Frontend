import React from 'react';
import { StripeProvider } from '@stripe/stripe-react-native';

interface StripeWrapperProps {
  children: any;
  publishableKey: string;
}

export default function StripeWrapper({
  children,
  publishableKey,
}: StripeWrapperProps) {
  return (
    <StripeProvider
      publishableKey={publishableKey}
      merchantIdentifier="merchant.com.respiteam.ResPi"
    >
      {children}
    </StripeProvider>
  );
}
