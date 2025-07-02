import admin from 'firebase-admin';
import serviceAccount from './serviceAccountKey.js'

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
}

export const auth = admin.auth();