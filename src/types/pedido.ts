export interface Pedido {
  fecha: number;
  cliente_id: string;
  productos_pedidos: ProductosPedido[];
  info_envio: InfoEnvio;
  info_factura: InfoFactura;
  sub_total: number;
  total_envio: number;
  total: string;
  estado: string;
  guia: string | null;
  tipo_pago: string;
  pago_esta_listo: boolean;
  id: string;
  recompensas: {
    lanacoins: number;
    xp: number;
  };
}

export interface ProductosPedido {
  producto_id: string;
  cantidad: number;
  precio_final_unitario: string;
  subtotal: number;
}

export interface InfoEnvio {
  direccion_exacta: string;
  id: string;
  indicaciones: string;
  nombre_receptor: string;
  departamento: string;
  tel2: string;
  tel1: string;
  municipio: string;
}

export interface InfoFactura {
  tel1: string;
  numero: string;
  nombre: string;
}
