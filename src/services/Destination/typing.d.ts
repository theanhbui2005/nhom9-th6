export interface Destination {
    id: string;
    name: string;
    image: string;
    location: string;
    rating: number;
    price: number;
    category: 'biển' | 'núi' | 'thành phố';
  }