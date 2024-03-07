import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";

const firebaseApp = initializeApp({
	storageBucket: process.env.FIREBASE_STORAGE_URI,
});

const firebaseStorage = getStorage(firebaseApp);

export { firebaseStorage };
