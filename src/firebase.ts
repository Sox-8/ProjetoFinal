import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore"; // Importa a base de dados

const firebaseConfig = {
  apiKey: "AIzaSyD2mJjiZjJMnpNmysxtEIICBdny_aY7t7g",
  authDomain: "ordemadvogados-67cd1.firebaseapp.com",
  projectId: "ordemadvogados-67cd1",
  storageBucket: "ordemadvogados-67cd1.firebasestorage.app",
  messagingSenderId: "924826314686",
  appId: "1:924826314686:web:a73a00b240ddf1a954fbef",
  measurementId: "G-81TS54BG5J"
};

const app = initializeApp(firebaseConfig);

// Exporta o 'db' para usarmos nos formulários
export const db = getFirestore(app);