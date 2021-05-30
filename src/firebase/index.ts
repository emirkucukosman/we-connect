import firebase from "firebase/app";
import "firebase/auth";
import "firebase/firestore";
import "firebase/storage";
import { firebaseConfig } from "src/config";

firebase.initializeApp(firebaseConfig);

export const firestore = firebase.firestore();

export default firebase;
