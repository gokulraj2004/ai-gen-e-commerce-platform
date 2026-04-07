export interface CartItem {
  id: string;
  product_id: string;
  product_name: string;
  product_image_url?: string;
  product_price: string;
  quantity: number;
  line_total: string;
}

export interface Cart {
  id: string;
  items: CartItem[];
  item_count: number;
  subtotal: string;
}

export interface CartItemAdd {
  product_id: string;
  quantity: number;
}

export interface CartItemUpdate {
  quantity: number;
}