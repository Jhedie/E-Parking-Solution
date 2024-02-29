import * as admin from "firebase-admin";

admin.initializeApp({
  credential: admin.credential.cert({
    privateKey: process.env.PRIVATE_KEY?.replace(/\\n/g, "\n"),
    projectId: process.env.PROJECT_ID,
    clientEmail: process.env.CLIENT_EMAIL,
  }),
  databaseURL: process.env.DATABASE_URL,
});
const db = admin.firestore();

export { admin, db };
