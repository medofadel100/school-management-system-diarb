import { initializeApp, getApp, getApps } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getDatabase } from 'firebase/database';

const firebaseConfig = {
  apiKey: "AIzaSyDt5uDaZHEFhDhqWzJH7s16Jb3K2a384DR",
  authDomain: "school-management-system-diarb.firebaseapp.com",
  projectId: "school-management-system-diarb",
  storageBucket: "school-management-system-diarb.appspot.com",
  databaseURL: "https://school-management-system-diarb-default-rtdb.firebaseio.com",
  messagingSenderId: "109161320497625552683",
  appId: "1:109161320497625552683:web:5c89c516c89a3646516f31"
};

// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const auth = getAuth(app);
const database = getDatabase(app);

export { app, auth, database };
