import { Product } from '../types/product';

export const mockProducts: Product[] = [
  {
    id: '1',
    name: 'Cinturilla Látex Premium',
    price: 42.00,
    description: 'Cinturilla de látex con doble ajuste para máxima compresión y definición de cintura.',
    details: {
      stretch: true,
      compression: 'maximum',
      material: ['Látex', 'Algodón hipoalergénico'],
      careInstructions: ['Lavar a mano', 'No usar secadora', 'No planchar']
    },
    sizes: ['S', 'M', 'L', 'XL'],
    colors: [
      { name: 'Negro', code: '#000000' },
      { name: 'Beige', code: '#F5DEB3' }
    ],
    category: 'cinturilla',
    images: {
      main: '',
      gallery: []
    },
    stock: 15,
    isNew: true,
    discount: {
      percentage: 25,
      endDate: '2024-05-01'
    },
    features: ['Doble ajuste', 'Material transpirable', 'Efecto reductor']
  },
  {
    id: '2',
    name: 'Body Shaper Control Total',
    price: 65.00,
    description: 'Body completo con efecto push-up y control abdominal.',
    details: {
      stretch: true,
      compression: 'medium',
      material: ['Nylon', 'Spandex'],
      careInstructions: ['Lavar a mano', 'Secar en sombra']
    },
    sizes: ['S', 'M', 'L', 'XL'],
    colors: [
      { name: 'Negro', code: '#000000' },
      { name: 'Nude', code: '#E6BEA5' }
    ],
    category: 'body-shaper',
    images: {
      main: '',
      gallery: []
    },
    stock: 10,
    isNew: true,
    features: ['Push-up natural', 'Control abdominal', 'Tirantes ajustables']
  },
  {
    id: '3',
    name: 'Short Control Abdomen',
    price: 38.00,
    description: 'Short de control con alta compresión para moldear cadera y abdomen.',
    details: {
      stretch: true,
      compression: 'maximum',
      material: ['Powernet', 'Algodón'],
      careInstructions: ['Lavar a mano', 'No usar cloro']
    },
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    colors: [
      { name: 'Negro', code: '#000000' },
      { name: 'Beige', code: '#F5DEB3' }
    ],
    category: 'short-control',
    images: {
      main: '',
      gallery: []
    },
    stock: 20,
    isNew: false,
    discount: {
      percentage: 15,
      endDate: '2024-05-01'
    },
    features: ['Sin costuras', 'Efecto levanta glúteos', 'Control de abdomen']
  },
  {
    id: '4',
    name: 'Faja Completa Postquirúrgica',
    price: 89.00,
    description: 'Faja completa ideal para uso postquirúrgico con cierre frontal.',
    details: {
      stretch: true,
      compression: 'maximum',
      material: ['Powernet', 'Látex', 'Algodón hipoalergénico'],
      careInstructions: ['Lavar a mano', 'No retorcer', 'Secar en sombra']
    },
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    colors: [
      { name: 'Negro', code: '#000000' },
      { name: 'Beige', code: '#F5DEB3' }
    ],
    category: 'faja-completa',
    images: {
      main: '',
      gallery: []
    },
    stock: 8,
    isNew: true,
    features: ['Cierre frontal', 'Tirantes ajustables', 'Compresión uniforme']
  }
]; 