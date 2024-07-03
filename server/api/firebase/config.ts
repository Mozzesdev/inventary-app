import { initializeApp, cert, ServiceAccount } from "firebase-admin/app";
import { getStorage } from "firebase-admin/storage";
import { readJSON } from "../utils.js";

const serviceAccount = readJSON("./firebase/serviceAccountKey.json");

export const firebaseApp = initializeApp({
  credential: cert(serviceAccount as ServiceAccount),
  storageBucket: "inventary-app-d3b50.appspot.com",
});

export const bucket = getStorage().bucket();