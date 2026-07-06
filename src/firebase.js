import { initializeApp } from 'firebase/app'
import { getDatabase } from 'firebase/database'

const firebaseConfig = {
  apiKey:            "AIzaSyBuIYszjN_Lua4XX0CuKrQ9w8kfmQTTSSo",
  authDomain:        "anlegn.firebaseapp.com",
  databaseURL:       "https://anlegn-default-rtdb.europe-west1.firebasedatabase.app",
  projectId:         "anlegn",
  storageBucket:     "anlegn.firebasestorage.app",
  messagingSenderId: "114770298326",
  appId:             "1:114770298326:web:8270ee8eff7a6805dbd077",
}

const app = initializeApp(firebaseConfig)
export const db = getDatabase(app)
