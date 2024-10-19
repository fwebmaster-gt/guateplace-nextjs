export interface StockTransaction {
    id: string;
    cantidad: number;
    type: "ingreso" | "egreso",
    productId: string;
    pedidoId: string;
    fecha: string | number;
    new_stock_value: string | number;
}