export type Modelo = {
  id: string;
  title: string;
  img: any;
  price: number;
};

export const MODELOS: Modelo[] = [
  {
    id: '1',
    title: 'Tenis',
    img: require('../../assets/fondo-tennis.png'),
    price: 12,
  },
  {
    id: '2',
    title: 'Pádel',
    img: require('../../assets/fondo-padel.png'),
    price: 15,
  },
  {
    id: '3',
    title: 'Fútbol',
    img: require('../../assets/fondo-futbol.png'),
    price: 20,
  },
  {
    id: '4',
    title: 'Baloncesto',
    img: require('../../assets/fondo-basket.png'),
    price: 10,
  },
];
