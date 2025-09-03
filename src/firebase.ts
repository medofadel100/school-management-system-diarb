import { initializeApp, getApps } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getDatabase } from 'firebase/database';

const firebaseConfig = {
  apiKey: "AIzaSyDt5uDaZHEFhDhqWzJH7s16Jb3K2a384DR",
  authDomain: "school-management-system-diarb.firebaseapp.com",
  projectId: "school-management-system-diarb",
  storageBucket: "school-management-system-diarb.appspot.com",
  messagingSenderId: "675131217380",
  appId: "1:675131217380:web:5uDaZHEFhDhqWzJH7s16Jb3K2a384DRLTZui516R",
  databaseURL: "https://school-management-system-diarb-default-rtdb.firebaseio.com"
};ializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getDatabase } from 'firebase/database';

const firebaseConfig = {
  apiKey: "AIzaSyDt5uDaZHEFhDhqWzJH7s16Jb3K2a384DR",
  authDomain: "school-management-system-diarb.firebaseapp.com",
  databaseURL: "https://school-management-system-diarb-default-rtdb.firebaseio.com",
  projectId: "school-management-system-diarb",
  storageBucket: "school-management-system-diarb.appspot.com",
  messagingSenderId: "675131217380",
  appId: "1:675131217380:web:5uDaZHEFhDhqWzJH7s16Jb3K2a384DRLTZui516R"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const database = getDatabase(app);

export default app;
