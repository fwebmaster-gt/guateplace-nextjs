export function calcularDescuento(
  precioOriginal: number,
  precioConDescuento: number
): number {
  if (precioOriginal <= 0) {
    throw new Error("El precio original debe ser mayor que 0");
  }
  const descuento =
    ((precioOriginal - precioConDescuento) / precioOriginal) * 100;
  return Math.floor(descuento);
}

export function calcularSubtotal(
  precio_normal: number,
  precio_especial: number | null,
  cantidad: number
): number {
  // Si hay un precio especial válido, se usa, de lo contrario, se usa el precio normal
  const precio = precio_especial ? precio_especial : precio_normal;

  // Calcular el subtotal multiplicando el precio por la cantidad
  const subtotal = precio * cantidad;

  return subtotal;
}
