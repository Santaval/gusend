import { initializeApp, getApps, cert } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';

const firebaseConfig = {
  projectId: process.env.FIREBASE_PROJECT_ID,
  clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
  privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
};

// Initialize Firebase Admin SDK
function initializeFirebaseAdmin() {
  if (getApps().length === 0) {
    initializeApp({
      credential: cert(firebaseConfig),
      projectId: process.env.FIREBASE_PROJECT_ID,
    });
  }
}

// Initialize and get Firestore instance
export function getFirestoreDb() {
  initializeFirebaseAdmin();
  return getFirestore();
}

export { initializeFirebaseAdmin };