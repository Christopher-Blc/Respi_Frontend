import * as Linking from 'expo-linking';

const parseToken = (token?: string) => {
  if (!token) return '';
  return decodeURIComponent(token.replace(/ /g, '+')).trim();
};

export const linking = {
  prefixes: [
    Linking.createURL('/'),
    'respi-app://',
    'https://respi.es',
    'https://www.respi.es',
  ],
  config: {
    screens: {
      '(auth)': {
        screens: {
          'verify-email': {
            path: 'verify-email',
            parse: {
              token: (value: string) => parseToken(value),
            },
          },
        },
      },
    },
  },
};

export { parseToken };
