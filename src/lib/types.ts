export type MenuItem = {
  id: number;
  name: string;
  description?: string;
  price: number;
  image: string;
  free?: boolean;
};

export type CartItem = MenuItem & { qty: number; free?: boolean };