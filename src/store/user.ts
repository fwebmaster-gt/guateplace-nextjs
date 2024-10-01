export const DELIVERY_METHOD = ["a_domicilio", "recoger_en_tienda"];
export const PAYMENT_METHOD = ["pago_contra_entrega", "deposito_bancario"];

export interface User {
  id: string;
  name: string;
  lastname: string;
  address: {
    departamento: string;
    municipio: string;
    lineOne: string;
    lineTwo: string;
    phone: string;
    phone_secondary: string;
  }[];
  default_address: string;
  cart: {
    products: { product: Product; qyt: number }[];
    cupon_code: string;
    nit: string;
  };
  wishlist: string[];
}

export interface Product {
  id: string;
  name: string;
  short_description: string;
  images: string[];
  details: string;
}
