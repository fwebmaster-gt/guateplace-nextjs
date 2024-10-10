import { create } from "zustand";

export interface Direccion {
  id: string;
  departamento: string;
  municipio: string;
  direccion_exacta: string;
  indicaciones: string;
  nombre_receptor: string;
  nombre_direccion: string;
  tel1: string;
  tel2: string;
}

export interface Nit {
  numero: string;
  nombre: string;
}

interface Producto {
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

export interface Pedido {
  fecha: string;
  productos: Producto[];
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
}

interface ProfileState {
  user: Customer | null;
  setUser: (user: Customer | null) => void;
}

export const useAuthStore = create<ProfileState>()((set) => ({
  user: null,
  setUser: (user) => {
    return set(() => ({ user }));
  },
}));
