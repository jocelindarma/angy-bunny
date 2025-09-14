export type MenuItem = {
id: number;
name: string;
price: number;
image: string;
};


export type CartItem = MenuItem & { qty: number };