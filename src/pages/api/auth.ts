import { initializeApp, getApps } from 'firebase/app';
import { getAuth, createUserWithEmailAndPassword, User } from 'firebase/auth';
import { getDatabase, ref, set } from 'firebase/database';
import { UserData, AuthResponse } from '../../types/auth';

const firebaseConfig = {
  apiKey: "AIzaSyDt5uDaZHEFhDhqWzJH7s16Jb3K2a384DR",
  authDomain: "school-management-system-diarb.firebaseapp.com",
  databaseURL: "https://school-management-system-diarb-default-rtdb.firebaseio.com",
  projectId: "school-management-system-diarb",
  storageBucket: "school-management-system-diarb.appspot.com",
  messagingSenderId: "675131217380",
  appId: "1:675131217380:web:5uDaZHEFhDhqWzJH7s16Jb3K2a384DRLTZui516R"
};

// Initialize Firebase if it hasn't been initialized
if (!getApps().length) {
  initializeApp(firebaseConfig);
}

const auth = getAuth();
const database = getDatabase();

export async function registerUser(
  email: string,
  password: string,
  userData: Omit<UserData, 'email' | 'createdAt' | 'uid'>
): Promise<AuthResponse> {
  try {
    // Create auth user
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    if (!user) {
      throw new Error('فشل في إنشاء الحساب');
    }

    // Save user data to database
    const fullUserData: UserData = {
      ...userData,
      email: user.email || email,
      createdAt: new Date().toISOString(),
      uid: user.uid
    };

    await set(ref(database, `users/${user.uid}`), fullUserData);

    // If user is admin, create school structure
    if (userData.role === 'admin') {
      await set(ref(database, `schools/${userData.schoolName}`), {
        schoolInfo: {
          name: userData.schoolName,
          principal: {
            name: userData.name,
            whatsapp: userData.whatsapp,
            email: user.email
          },
          createdAt: new Date().toISOString(),
          createdBy: user.uid
        }
      });
    }

    return { success: true, user: fullUserData };
  } catch (error) {
    console.error('Registration error:', error);
    
    if (error instanceof Error) {
      if (error.message.includes('email-already-in-use')) {
        return { success: false, error: 'البريد الإلكتروني مستخدم بالفعل' };
      }
      if (error.message.includes('invalid-email')) {
        return { success: false, error: 'البريد الإلكتروني غير صحيح' };
      }
      if (error.message.includes('weak-password')) {
        return { success: false, error: 'كلمة المرور ضعيفة جداً' };
      }
      return { success: false, error: error.message };
    }
    
    return { success: false, error: 'حدث خطأ في التسجيل' };
  }
}
