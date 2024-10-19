import { Pedido } from "@/types/pedido";
import { StockTransaction } from "@/types/stock";
import {
  AuthService,
  FirestoreService,
  initFirebaseTools,
} from "firebase-react-tools";

const firebaseConfig = {
  apiKey: "AIzaSyCLcUg_ClR88E5vtRYgSLVI6iCJ0OrVQVM",
  authDomain: "lanayamor-b666f.firebaseapp.com",
  projectId: "lanayamor-b666f",
  storageBucket: "lanayamor-b666f.appspot.com",
  messagingSenderId: "454765896630",
  appId: "1:454765896630:web:0d829c18003cebabe71717",
};

export const app = initFirebaseTools(firebaseConfig);

export const auth = new AuthService(app);


export const customerService = new FirestoreService(app, "clientes");
export const productService = new FirestoreService(app, "productos");
export const categoryService = new FirestoreService(app, "categorias");
export const pedidosService = new FirestoreService<Pedido>(app, "pedidos");
export const stockService = new FirestoreService<StockTransaction>(app, "stock_transaction");
