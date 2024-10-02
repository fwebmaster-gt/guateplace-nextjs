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
