import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword,
  signOut,
  UserCredential 
} from 'firebase/auth';
import { ref, set, get } from 'firebase/database';
import { auth, database } from '../firebase';

export interface RegisterData {
  email: string;
  password: string;
  name: string;
  schoolName: string;
  whatsapp: string;
  role: 'admin' | 'teacher' | 'staff';
}

export interface AuthError {
  code: string;
  message: string;
}

export async function register(data: RegisterData): Promise<{ success: boolean; error?: string }> {
  try {
    // Input validation
    if (!data.email || !data.password || !data.name || !data.schoolName || !data.whatsapp) {
      return { success: false, error: 'جميع الحقول مطلوبة' };
    }

    // Password validation
    if (data.password.length < 6) {
      return { success: false, error: 'كلمة المرور يجب أن تكون 6 أحرف على الأقل' };
    }

    // WhatsApp number validation
    const whatsappNumber = data.whatsapp.replace(/\D/g, '');
    if (whatsappNumber.length < 10 || whatsappNumber.length > 15) {
      return { success: false, error: 'رقم الواتساب غير صحيح' };
    }

    // Check if school already exists
    const schoolRef = ref(database, `schools/${data.schoolName}`);
    const schoolSnapshot = await get(schoolRef);
    
    if (schoolSnapshot.exists() && data.role === 'admin') {
      return { success: false, error: 'اسم المدرسة مستخدم بالفعل' };
    }

    // Create user account
    let userCredential: UserCredential;
    try {
      userCredential = await createUserWithEmailAndPassword(auth, data.email, data.password);
    } catch (error: any) {
      if (error.code === 'auth/email-already-in-use') {
        return { success: false, error: 'البريد الإلكتروني مستخدم بالفعل' };
      }
      if (error.code === 'auth/invalid-email') {
        return { success: false, error: 'البريد الإلكتروني غير صحيح' };
      }
      if (error.code === 'auth/operation-not-allowed') {
        return { success: false, error: 'التسجيل غير متاح حالياً' };
      }
      if (error.code === 'auth/weak-password') {
        return { success: false, error: 'كلمة المرور ضعيفة' };
      }
      throw error;
    }

    const user = userCredential.user;

    // Save user data
    await set(ref(database, `users/${user.uid}`), {
      name: data.name,
      email: data.email,
      schoolName: data.schoolName,
      whatsapp: data.whatsapp,
      role: data.role,
      createdAt: new Date().toISOString()
    });

    // If user is admin, create school
    if (data.role === 'admin') {
      await set(schoolRef, {
        schoolInfo: {
          name: data.schoolName,
          principal: {
            name: data.name,
            whatsapp: data.whatsapp,
            email: data.email
          },
          createdAt: new Date().toISOString(),
          createdBy: user.uid
        }
      });
    }

    return { success: true };
  } catch (error) {
    console.error('Registration error:', error);
    return { success: false, error: 'حدث خطأ في التسجيل' };
  }
}
