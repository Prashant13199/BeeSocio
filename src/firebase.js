import firebase from "firebase/compat/app";
import "firebase/compat/auth";
import "firebase/compat/firestore";
import "firebase/compat/storage";
import "firebase/compat/database";

const firebaseConfig = {

};

const firebaseApp = firebase.initializeApp(firebaseConfig);
const db = firebaseApp.firestore();
const auth = firebaseApp.auth();
const storage = firebaseApp.storage();
const provider = new firebase.auth.GoogleAuthProvider();
const database = firebaseApp.database();

export { db, auth, provider, storage, database };
