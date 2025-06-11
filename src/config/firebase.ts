import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getAnalytics } from 'firebase/analytics';

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCBFmap8mCbso4Xvxb3KLKuFOU8QvZLjtQ",
  authDomain: "luxphes-fajas.firebaseapp.com",
  projectId: "luxphes-fajas",
  storageBucket: "luxphes-fajas.firebasestorage.app",
  messagingSenderId: "709697560393",
  appId: "1:709697560393:web:41412a552c9dabf6590498",
  measurementId: "G-C6RFHZC2PS"
};

console.log('Inicializando Firebase con configuración:', {
  ...firebaseConfig,
  apiKey: '***' // No mostramos la API key completa por seguridad
});

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication
export const auth = getAuth(app);

// Initialize Analytics
let analytics = null;
try {
  analytics = getAnalytics(app);
} catch (error) {
  console.warn('Analytics could not be initialized:', error);
}
export { analytics };

// Export the Firebase app instance as default
export default app; 