import { create } from 'zustand';
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  User,
  signInWithPopup,
  GoogleAuthProvider
} from 'firebase/auth';
import { FirebaseError } from 'firebase/app';
import { auth } from '../config/firebase';

interface AuthStore {
  user: User | null;
  loading: boolean;
  error: string | null;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string) => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  logout: () => Promise<void>;
  clearError: () => void;
}

export const useAuthStore = create<AuthStore>((set) => ({
  user: null,
  loading: true,
  error: null,

  signIn: async (email: string, password: string) => {
    try {
      set({ loading: true, error: null });
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      set({ user: userCredential.user, loading: false });
    } catch (error) {
      console.error('Error en signIn:', error);
      set({ error: (error as Error).message, loading: false });
    }
  },

  signUp: async (email: string, password: string) => {
    try {
      set({ loading: true, error: null });
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      set({ user: userCredential.user, loading: false });
    } catch (error) {
      console.error('Error en signUp:', error);
      set({ error: (error as Error).message, loading: false });
    }
  },

  signInWithGoogle: async () => {
    try {
      set({ loading: true, error: null });
      console.log('Iniciando proceso de autenticación con Google...');
      
      const provider = new GoogleAuthProvider();
      provider.addScope('https://www.googleapis.com/auth/userinfo.email');
      provider.addScope('https://www.googleapis.com/auth/userinfo.profile');
      
      // Forzar selección de cuenta
      provider.setCustomParameters({
        prompt: 'select_account'
      });

      console.log('Abriendo ventana de autenticación de Google...');
      const userCredential = await signInWithPopup(auth, provider);
      
      console.log('Autenticación exitosa:', {
        nombre: userCredential.user.displayName,
        email: userCredential.user.email
      });
      
      set({ user: userCredential.user, loading: false });
    } catch (error) {
      console.error('Error en autenticación con Google:', error);
      
      if (error instanceof FirebaseError) {
        const errorCode = error.code;
        const errorMessage = error.message;
        
        // Log detallado del error
        console.error('Detalles del error:', {
          código: errorCode,
          mensaje: errorMessage,
          dominio: window.location.hostname
        });

        // Manejar errores específicos
        switch (errorCode) {
          case 'auth/unauthorized-domain':
            set({ 
              error: `El dominio ${window.location.hostname} no está autorizado. Por favor, contacta al administrador.`,
              loading: false 
            });
            break;
          case 'auth/internal-error':
            set({ 
              error: 'Error interno de Firebase. Por favor, intenta de nuevo.',
              loading: false 
            });
            break;
          case 'auth/popup-blocked':
            set({ 
              error: 'El navegador bloqueó la ventana emergente. Por favor, permite ventanas emergentes para este sitio.',
              loading: false 
            });
            break;
          case 'auth/cancelled-popup-request':
          case 'auth/popup-closed-by-user':
            set({ 
              error: 'Proceso de autenticación cancelado. Por favor, completa el proceso de inicio de sesión.',
              loading: false 
            });
            break;
          case 'auth/operation-not-allowed':
            set({ 
              error: 'La autenticación con Google no está habilitada. Por favor, contacta al administrador.',
              loading: false 
            });
            break;
          default:
            set({ 
              error: `Error de autenticación: ${errorMessage}`,
              loading: false 
            });
        }
      } else {
        console.error('Error no relacionado con Firebase:', error);
        set({ 
          error: 'Error inesperado durante la autenticación. Por favor, intenta de nuevo.',
          loading: false 
        });
      }
    }
  },

  logout: async () => {
    try {
      await signOut(auth);
      set({ user: null });
    } catch (error) {
      console.error('Error en logout:', error);
      set({ error: (error as Error).message });
    }
  },

  clearError: () => set({ error: null })
}));

// Listener para cambios en el estado de autenticación
onAuthStateChanged(auth, (user) => {
  if (user) {
    console.log('Usuario autenticado:', {
      nombre: user.displayName,
      email: user.email,
      proveedor: user.providerId
    });
  }
  useAuthStore.setState({ user, loading: false });
}); 