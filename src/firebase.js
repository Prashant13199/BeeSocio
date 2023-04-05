import firebase from "firebase/compat/app";
import "firebase/compat/auth";
import "firebase/compat/firestore";
import "firebase/compat/storage";
import "firebase/compat/database";

const firebaseConfig = {
    apiKey: "AIzaSyDvrpCu3reRq-9OHZadRtwDYVVjRycxxwo",
    authDomain: "beesocio-d8d8e.firebaseapp.com",
    databaseURL: "https://beesocio-d8d8e-default-rtdb.firebaseio.com",
    projectId: "beesocio-d8d8e",
    storageBucket: "beesocio-d8d8e.appspot.com",
    messagingSenderId: "495957649851",
    appId: "1:495957649851:web:eff45da4283ad2284fbc9e"
};

const firebaseApp = firebase.initializeApp(firebaseConfig);
const db = firebaseApp.firestore();
const auth = firebaseApp.auth();
const storage = firebaseApp.storage();
const provider = new firebase.auth.GoogleAuthProvider();
const database = firebaseApp.database();

export { db, auth, provider, storage, database };
