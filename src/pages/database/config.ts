import { FirestoreService, initFirebaseTools } from "firebase-react-tools";

const firebaseConfig = {
  apiKey: "AIzaSyCLcUg_ClR88E5vtRYgSLVI6iCJ0OrVQVM",
  authDomain: "lanayamor-b666f.firebaseapp.com",
  projectId: "lanayamor-b666f",
  storageBucket: "lanayamor-b666f.appspot.com",
  messagingSenderId: "454765896630",
  appId: "1:454765896630:web:0d829c18003cebabe71717",
};

export const app = initFirebaseTools(firebaseConfig);

export const productService = new FirestoreService(app, "productos");
