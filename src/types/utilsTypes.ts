
//Tipo y mock para paises que se usa para el prefijo del tel
export type Country = {
  code: string;
  flag: string;
  name: string;
};

export const EUROPEAN_COUNTRIES: Country[] = [
  { code: '+43', flag: '🇦🇹', name: 'Austria' },
  { code: '+32', flag: '🇧🇪', name: 'Bélgica' },
  { code: '+359', flag: '🇧🇬', name: 'Bulgaria' },
  { code: '+385', flag: '🇭🇷', name: 'Croacia' },
  { code: '+357', flag: '🇨🇾', name: 'Chipre' },
  { code: '+420', flag: '🇨🇿', name: 'Chequia' },
  { code: '+45', flag: '🇩🇰', name: 'Dinamarca' },
  { code: '+372', flag: '🇪🇪', name: 'Estonia' },
  { code: '+358', flag: '🇫🇮', name: 'Finlandia' },
  { code: '+33', flag: '🇫🇷', name: 'Francia' },
  { code: '+49', flag: '🇩🇪', name: 'Alemania' },
  { code: '+30', flag: '🇬🇷', name: 'Grecia' },
  { code: '+36', flag: '🇭🇺', name: 'Hungría' },
  { code: '+353', flag: '🇮🇪', name: 'Irlanda' },
  { code: '+39', flag: '🇮🇹', name: 'Italia' },
  { code: '+371', flag: '🇱🇻', name: 'Letonia' },
  { code: '+370', flag: '🇱🇹', name: 'Lituania' },
  { code: '+352', flag: '🇱🇺', name: 'Luxemburgo' },
  { code: '+356', flag: '🇲🇹', name: 'Malta' },
  { code: '+31', flag: '🇳🇱', name: 'Países Bajos' },
  { code: '+47', flag: '🇳🇴', name: 'Noruega' },
  { code: '+48', flag: '🇵🇱', name: 'Polonia' },
  { code: '+351', flag: '🇵🇹', name: 'Portugal' },
  { code: '+40', flag: '🇷🇴', name: 'Rumanía' },
  { code: '+421', flag: '🇸🇰', name: 'Eslovaquia' },
  { code: '+386', flag: '🇸🇮', name: 'Eslovenia' },
  { code: '+34', flag: '🇪🇸', name: 'España' },
  { code: '+46', flag: '🇸🇪', name: 'Suecia' },
  { code: '+41', flag: '🇨🇭', name: 'Suiza' },
  { code: '+44', flag: '🇬🇧', name: 'Reino Unido' },
];