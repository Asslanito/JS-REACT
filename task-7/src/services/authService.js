import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
  onAuthStateChanged,
  sendPasswordResetEmail,
  setPersistence,
  browserLocalPersistence,
} from 'firebase/auth';
import { auth, googleProvider } from '../firebase';

const MESSAGES = {
  'auth/invalid-credential': 'Wrong email or password.',
  'auth/user-not-found': 'No account with this email.',
  'auth/wrong-password': 'Wrong email or password.',
  'auth/email-already-in-use': 'This email is already registered. Try logging in.',
  'auth/weak-password': 'Password must be at least 6 characters.',
  'auth/invalid-email': 'Enter a valid email address.',
  'auth/popup-closed-by-user': 'Google sign-in was closed before finishing.',
  'auth/too-many-requests': 'Too many attempts. Try again in a few minutes.',
  'auth/network-request-failed': 'Network error. Check your connection.',
  'auth/operation-not-allowed': 'This sign-in method is not enabled in Firebase.',
  'auth/configuration-not-found': 'Authentication is not set up in Firebase yet.',
  'auth/invalid-api-key': 'Invalid Firebase API key. Check .env.local.',
};

export function toAuthError(err) {
  console.error('Firebase auth error:', err?.code, err?.message);
  return new Error(
    MESSAGES[err?.code] || `Something went wrong (${err?.code || 'unknown'}).`
  );
}

async function run(fn) {
  try {
    return await fn();
  } catch (err) {
    throw toAuthError(err);
  }
}

export const initPersistence = () => setPersistence(auth, browserLocalPersistence);
export const subscribeToAuth = (cb, onError) => onAuthStateChanged(auth, cb, onError);
export const signUp = (email, password) => run(() => createUserWithEmailAndPassword(auth, email, password));
export const logIn = (email, password) => run(() => signInWithEmailAndPassword(auth, email, password));
export const logInWithGoogle = () => run(() => signInWithPopup(auth, googleProvider));
export const logOut = () => run(() => signOut(auth));
export const resetPassword = (email) => run(() => sendPasswordResetEmail(auth, email));