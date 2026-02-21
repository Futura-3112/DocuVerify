// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyBiKzhT9MJcPNJgykV_DDb2HBrZLHSboV0",
    authDomain: "docuverify-ba4eb.firebaseapp.com",
    projectId: "docuverify-ba4eb",
    storageBucket: "docuverify-ba4eb.firebasestorage.app",
    messagingSenderId: "46412590924",
    appId: "1:46412590924:web:7f1fedc99e765ba40429e9"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
