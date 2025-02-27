// Supermarket interface
export interface Supermarket {
  id: string;
  name: string;
  chain: string;
  location: {
    address: string;
    city: string;
    coordinates: {
      latitude: number;
      longitude: number;
    };
  };
  operatingHours: {
    [day: string]: {
      open: string;
      close: string;
    };
  };
}

// Item interface
export interface Item {
  id: string;
  name: string;
  category: string;
  manufacturer: string;
  basePrice: number;
  unit: string;
}

// Price interface
export interface Price {
  itemId: string;
  supermarketId: string;
  price: number;
  effectiveDate: string;
}

// Discount interface
export interface Discount {
  id: string;
  itemId: string;
  supermarketId: string;
  type: 'percentage' | 'fixed' | 'buyXgetY';
  value: number;
  startDate: string;
  endDate: string;
  conditions?: string;
} 
