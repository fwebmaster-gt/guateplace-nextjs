import { create } from "zustand";
import { persist } from "zustand/middleware";

// Definir una constante para el nombre de la clave en localStorage
const CUSTOMER_CART = "CUSTOMER_CART";

export interface ProductInCart {
  productId: string;
  qty: number;
}

// Definir la estructura del estado del carrito
interface CartState {
  productsInCart: ProductInCart[];
  addProduct: (product: ProductInCart) => void;
  removeProduct: (productId: string) => void;
  clearCart: () => void;
  incrementItem: (productId: string) => void;
  decrementItem: (productId: string) => void;
}

// Crear la tienda (store) usando Zustand y el middleware de persistencia
export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      productsInCart: [],

      // Agregar un producto al carrito (si existe, actualiza la cantidad)
      addProduct: (newProduct: ProductInCart) => {
        const { productsInCart } = get();
        const existingProduct = productsInCart.find(
          (p) => p.productId === newProduct.productId
        );

        if (existingProduct) {
          // Si el producto ya existe, actualizamos la cantidad
          set({
            productsInCart: productsInCart.map((p) =>
              p.productId === newProduct.productId
                ? { ...p, qty: p.qty + newProduct.qty }
                : p
            ),
          });
        } else {
          // Si no existe, lo agregamos al carrito
          set({
            productsInCart: [...productsInCart, newProduct],
          });
        }
      },

      // Remover un producto del carrito por su productId
      removeProduct: (productId: string) => {
        set((state) => ({
          productsInCart: state.productsInCart.filter(
            (p) => p.productId !== productId
          ),
        }));
      },

      // Limpiar el carrito
      clearCart: () => set({ productsInCart: [] }),

      // Incrementar la cantidad de un producto específico
      incrementItem: (productId: string) => {
        const { productsInCart } = get();
        const product = productsInCart.find((p) => p.productId === productId);

        if (product) {
          set({
            productsInCart: productsInCart.map((p) =>
              p.productId === productId ? { ...p, qty: p.qty + 1 } : p
            ),
          });
        }
      },

      // Decrementar la cantidad de un producto específico
      decrementItem: (productId: string) => {
        const { productsInCart } = get();
        const product = productsInCart.find((p) => p.productId === productId);

        if (product && product.qty > 1) {
          set({
            productsInCart: productsInCart.map((p) =>
              p.productId === productId ? { ...p, qty: p.qty - 1 } : p
            ),
          });
        } else {
          // Si el producto tiene 1 de cantidad, lo eliminamos del carrito
          set({
            productsInCart: productsInCart.filter(
              (p) => p.productId !== productId
            ),
          });
        }
      },
    }),
    {
      name: CUSTOMER_CART, // Nombre del storage (clave en localStorage)
    }
  )
);
