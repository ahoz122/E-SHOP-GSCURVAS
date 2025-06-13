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
      main: '/assets/cinturilla1.jpeg',
      gallery: [
        '/assets/cinturilla1.jpeg',
        '/assets/cinturilla2.jpeg',
        '/assets/cinturilla3.jpeg',
        '/assets/cinturilla4.jpeg',
        '/assets/cinturilla5.jpeg',
        '/assets/cinturilla6.jpeg',
      ]
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
      main: '/assets/cinturilla5.jpeg',
      gallery: [
        '/assets/cinturilla1.jpeg',
        '/assets/cinturilla2.jpeg',
        '/assets/cinturilla3.jpeg',
        '/assets/cinturilla4.jpeg',
        '/assets/cinturilla5.jpeg',
        '/assets/cinturilla6.jpeg',
      ]
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
      main: '/assets/cinturilla3.jpeg',
      gallery: [
        '/assets/cinturilla1.jpeg',
        '/assets/cinturillas-gscurvas/cinturilla2.jpeg',
        '/assets/cinturillas-gscurvas/cinturilla3.jpeg',
        '/assets/cinturillas-gscurvas/cinturilla4.jpeg',
        '/assets/cinturillas-gscurvas/cinturilla5.jpeg',
        '/assets/cinturillas-gscurvas/cinturilla6.jpeg',
      ]
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
      main: '/assets/cinturilla4.jpeg',
      gallery: [
        '/assets/cinturilla1.jpeg',
        '/assets/cinturillas-gscurvas/cinturilla2.jpeg',
        '/assets/cinturillas-gscurvas/cinturilla3.jpeg',
        '/assets/cinturillas-gscurvas/cinturilla4.jpeg',
        '/assets/cinturillas-gscurvas/cinturilla5.jpeg',
        '/assets/cinturillas-gscurvas/cinturilla6.jpeg',
      ]
    },
    stock: 8,
    isNew: true,
    features: ['Cierre frontal', 'Tirantes ajustables', 'Compresión uniforme']
  }
]; 