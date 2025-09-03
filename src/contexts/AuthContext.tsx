import { createContext, useContext, useEffect, useState } from 'react';
import { auth, database } from '../firebase';
import { ref, get, set, DatabaseReference } from 'firebase/database';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  User,
  AuthError
} from 'firebase/auth';

interface UserData {
  name: string;
  schoolName: string;
  role: string;
  whatsapp: string;
  email: string;
  createdAt: string;
}

interface AuthContextType {
  currentUser: User | null;
  signup: (email: string, password: string, userData: UserData) => Promise<User>;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  async function signup(email: string, password: string, userData: UserData) {
    try {
      // Validate input data
      if (!email || !password || !userData.name || !userData.schoolName || !userData.whatsapp) {
        throw new Error('جميع الحقول مطلوبة');
      }

      if (password.length < 6) {
        throw new Error('كلمة المرور يجب أن تكون 6 أحرف على الأقل');
      }

      // Create user account
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      
      if (!user) {
        throw new Error('فشل في إنشاء الحساب');
      }

      // Prepare user data
      const userDataToSave = {
        ...userData,
        email: user.email,
        createdAt: new Date().toISOString(),
        uid: user.uid
      };

      // Save user data to database
      try {
        await set(ref(database, `users/${user.uid}`), userDataToSave);
      } catch (dbError) {
        // If database save fails, delete the created auth user
        await user.delete();
        throw new Error('فشل في حفظ بيانات المستخدم');
      }

      // Create school structure for admin users
      if (userData.role === 'admin') {
        try {
          const schoolRef = ref(database, `schools/${userData.schoolName}`);
          const schoolData = {
            schoolInfo: {
              name: userData.schoolName,
              stage: 'غير محدد',
              principal: {
                name: userData.name,
                whatsapp: userData.whatsapp,
                email: user.email
              },
              createdAt: new Date().toISOString(),
              createdBy: user.uid
            }
          };
          await set(schoolRef, schoolData);
        } catch (schoolError) {
          // If school creation fails, clean up user data and auth
          await set(ref(database, `users/${user.uid}`), null);
          await user.delete();
          throw new Error('فشل في إنشاء بيانات المدرسة');
        }
      }

      return user;
    } catch (error: any) {
      console.error('Error in signup:', error);
      
      // Handle Firebase Auth specific errors
      if (error.code === 'auth/email-already-in-use') {
        throw new Error('البريد الإلكتروني مستخدم بالفعل');
      } else if (error.code === 'auth/invalid-email') {
        throw new Error('البريد الإلكتروني غير صحيح');
      } else if (error.code === 'auth/operation-not-allowed') {
        throw new Error('التسجيل غير متاح حالياً');
      } else if (error.code === 'auth/weak-password') {
        throw new Error('كلمة المرور ضعيفة');
      }
      
      // If it's our custom error, throw it directly
      if (error.message) {
        throw new Error(error.message);
      }

      // For any other errors
      throw new Error('حدث خطأ أثناء إنشاء الحساب');
    }
  }

  async function login(email: string, password: string) {
    await signInWithEmailAndPassword(auth, email, password);
  }

  function logout() {
    return signOut(auth);
  }

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const value = {
    currentUser,
    signup,
    login,
    logout,
    loading
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}
