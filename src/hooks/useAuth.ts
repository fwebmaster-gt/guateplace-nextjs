import { customerService } from "@/database/config";
import { create } from "zustand";

export interface Direccion {
  id: string;
  departamento: string;
  municipio: string;
  direccion_exacta: string;
  indicaciones: string;
  nombre_receptor: string;
  tel1: string;
  tel2: string;
}

export interface Nit {
  numero: string;
  nombre: string;
}

export interface Producto {
  id: string;
  nombre: string;
  precio: string;
  precio_especial: string;
  imagenes: string;
  detalles: string;
  rating: string;
  out_stock: string;
  tags: string;

  //refs
  categorias: string[];

  label: string;
  label_color: string;
}

export interface Customer {
  id: string;
  nombre: string;
  apellido: string;
  email: string;
  direcciones: Direccion[];
  nits: Nit[];
  favoritos: string[];
  pedidos: [];
  avatar: string;
  xp: number;
  lanacoins: number;
}

interface ProfileState {
  user: Customer | null;
  setUser: (user: Customer | null) => void;
  addOrRemoveWishList: (productId: string) => void;
}

export const useAuthStore = create<ProfileState>()((set) => ({
  user: null,
  setUser: (user) => {
    return set(() => ({ user }));
  },
  addOrRemoveWishList: (productId) => {
    return set((state) => {
      if (!state.user) return state;
      const exist = state.user.favoritos.find((fId) => fId === productId);
      if (exist) {
        customerService.deleteInArray(state.user.id, "favoritos", productId);
        return {
          user: {
            ...state.user,
            favoritos: state.user.favoritos.filter((fId) => fId !== productId),
          },
        };
      } else {
        customerService.addInArray(state.user.id, "favoritos", productId);
        return {
          user: {
            ...state.user,
            favoritos: [...state.user.favoritos, productId],
          },
        };
      }
    });
  },
}));
