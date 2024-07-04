import { initializeApp, cert, ServiceAccount } from "firebase-admin/app";
import { getStorage } from "firebase-admin/storage";
import { FIREBASE_KEY } from "../../config.js";

const serviceAccount = JSON.parse(FIREBASE_KEY ?? "");

export const firebaseApp = initializeApp({
  credential: cert(serviceAccount as ServiceAccount),
  storageBucket: "inventary-app-d3b50.appspot.com",
});

export const bucket = getStorage().bucket();
