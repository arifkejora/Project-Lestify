// firebase.js

import firebase from 'firebase/compat/app'; // Gunakan 'compat' untuk Firebase v9
import 'firebase/compat/storage'; // Penyimpanan Firebase
import 'firebase/compat/database'; // Basis Data Firebase

// Konfigurasi Firebase Anda
const firebaseConfig = {
    apiKey: "AIzaSyCXKYr-MgD1LcsS8oWYDiJIb3spNtNhync",
    authDomain: "kejoramusic-a31db.firebaseapp.com",
    projectId: "kejoramusic-a31db",
    storageBucket: "kejoramusic-a31db.appspot.com",
    messagingSenderId: "222458289784",
    appId: "1:222458289784:web:9d070fbd0c6a7225ead78d",
    measurementId: "G-8KZEE5G176"
  };

// Inisialisasi Firebase
const app = firebase.initializeApp(firebaseConfig);

const storage = firebase.storage(app);
const database = firebase.database(app);

export { storage, database, firebase as default };
