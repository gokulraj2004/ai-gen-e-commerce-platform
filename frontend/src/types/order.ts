export interface OrderItem {
  id: string;
  product_id: string;
  product_name: string;
  product_image_url?: string;
  quantity: number;
  unit_price: string;
  line_total: string;
}

export interface ShippingAddress {
  address_line1: string;
  address_line2?: string;
  city: string;
  state: string;
  zip_code: string;
  country: string;
}

export interface Order {
  id: string;
  order_number: string;
  status: 'pending' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled';
  items: OrderItem[];
  shipping_address_line1: string;
  shipping_address_line2?: string;
  shipping_city: string;
  shipping_state: string;
  shipping_zip: string;
  shipping_country: string;
  subtotal: string;
  tax: string;
  total: string;
  created_at: string;
  updated_at: string;
}

export interface OrderListResponse {
  items: Order[];
  total: number;
  page: number;
  page_size: number;
  total_pages: number;
}

export interface OrderCreate {
  shipping_address_line1: string;
  shipping_address_line2?: string;
  shipping_city: string;
  shipping_state: string;
  shipping_zip: string;
  shipping_country: string;
}

export interface OrderStatusUpdate {
  status: string;
}