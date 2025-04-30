import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyCglhcblm6UcwSVPH81jyhlVac_OfOQCs8",
  authDomain: "masstrip-6770b.firebaseapp.com",
  projectId: "masstrip-6770b",
  storageBucket: "masstrip-6770b.firebasestorage.app",
  messagingSenderId: "9598142108",
  appId: "1:9598142108:web:4abcb42bd576736b8bcf59",
  measurementId: "G-9CKJRDF6C1"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();
export { auth, googleProvider };