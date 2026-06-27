export interface Transaction {
  order_id: string;
  user_id: string;
  order_date: string;
  time: string;
  order_hour_of_day: number;
  product_name: string;
  quantity: number;
  price: number;
  category: string;
  product_id: string;
}

export interface AssociationRule {
  antecedent: string[];
  consequent: string[];
  support: number;
  confidence: number;
  lift: number;
}

export interface ProductStock {
  id: string;
  product_id: string;
  product_name: string;
  category: string;
  stock: number;
  min_stock: number;
  price: number;
  last_updated: string;
}
