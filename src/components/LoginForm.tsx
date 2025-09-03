'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '@/lib/firebase';

export default function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    // Basic validation
    if (!email || !password) {
      setError('يرجى إدخال البريد الإلكتروني وكلمة المرور');
      setIsLoading(false);
      return;
    }

    // Email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError('يرجى إدخال بريد إلكتروني صحيح');
      setIsLoading(false);
      return;
    }

    // Password length validation
    if (password.length < 6) {
      setError('يجب أن تتكون كلمة المرور من 6 أحرف على الأقل');
      setIsLoading(false);
      return;
    }

    try {
      await signInWithEmailAndPassword(auth, email.trim(), password);
      router.push('/dashboard');
    } catch (error) {
      console.error('Login error:', error);
      const firebaseError = error as { code?: string };
      
      // Handle specific Firebase Auth errors
      if (firebaseError.code === 'auth/user-not-found' || firebaseError.code === 'auth/wrong-password') {
        setError('خطأ في البريد الإلكتروني أو كلمة المرور');
      } else if (firebaseError.code === 'auth/invalid-email') {
        setError('البريد الإلكتروني غير صحيح');
      } else if (firebaseError.code === 'auth/user-disabled') {
        setError('تم تعطيل هذا الحساب');
      } else if (firebaseError.code === 'auth/too-many-requests') {
        setError('تم تجاوز عدد محاولات تسجيل الدخول. يرجى المحاولة لاحقاً');
      } else {
        setError('حدث خطأ أثناء تسجيل الدخول. يرجى المحاولة مرة أخرى');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-8 md:p-12">
      <h2 className="text-3xl font-bold mb-8 text-emerald-800">تسجيل الدخول</h2>
      <form onSubmit={handleSubmit} className="space-y-6 max-w-md mx-auto">
        <div className="text-right">
          <label htmlFor="email" className="block mb-2 text-lg font-medium text-emerald-700">
            البريد الإلكتروني
          </label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-3 border border-emerald-200 rounded-lg bg-white/50 backdrop-blur-sm focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all duration-200"
            required
            placeholder="أدخل بريدك الإلكتروني"
          />
        </div>
        <div className="text-right">
          <label htmlFor="password" className="block mb-2 text-lg font-medium text-emerald-700">
            كلمة المرور
          </label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-3 border border-emerald-200 rounded-lg bg-white/50 backdrop-blur-sm focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all duration-200"
            required
            placeholder="أدخل كلمة المرور"
          />
        </div>
        {error && (
          <div className="bg-red-50 border-l-4 border-red-500 p-4 text-right">
            <p className="text-red-700">{error}</p>
          </div>
        )}
        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-emerald-600 text-white py-3 px-6 rounded-lg font-medium text-lg hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? 'جاري التحميل...' : 'تسجيل الدخول'}
        </button>
      </form>
      <p className="mt-8 text-center text-emerald-700 text-lg">
        ليس لديك حساب؟{' '}
        <Link href="/register" className="text-emerald-600 hover:text-emerald-800 font-medium hover:underline transition-colors duration-200">
          إنشاء حساب جديد
        </Link>
      </p>
    </div>
  );
}
