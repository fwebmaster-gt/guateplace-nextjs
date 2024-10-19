export type PedidoStatus =
  | "pendiente" // se genera al crear la orden
  | "pago pendiente" // si es transferencia en lugar de pendiente
  | "verificando pago" // se genera al subir una evidencia de pago
  | "confirmado" // se genera en  ADMIN al confirmar el pedido con el cliente
  | "enviado" // se pone en enviado cuando se sube una guia (ADMIN);

export type EstadoPago = "aceptado" | "rechazado" | "verificando" | "anulado por usuario";

export interface Pago {
  id: string;
  fecha: string | number;
  imagen: string;
  estado: EstadoPago;
  nota_rechazo: string;
}

export interface Pedido {
  fecha: number;
  cliente_id: string;
  productos_pedidos: ProductosPedido[];
  info_envio: InfoEnvio;
  info_factura: InfoFactura;
  sub_total: number;
  total_envio: number;
  total: string;
  estado: string | PedidoStatus;
  guia: string | null;
  tipo_pago: string;
  pagos: Pago[];
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
  imagen: string;
  nombre: string;
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
