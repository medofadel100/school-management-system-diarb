'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { ref, set } from 'firebase/database';
import { auth, database } from '@/lib/firebase';
import Link from 'next/link';

export default function RegisterForm() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: '',
    jobTitle: '',
    nationalId: '',
    codeNumber: '',
    whatsapp: '',
    schoolName: '',
    educationalStage: '',
    principalName: '',
    principalWhatsapp: '',
    email: '',
    password: '',
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        formData.email,
        formData.password
      );

      // Save user data to Firebase Realtime Database with proper structure
      await set(ref(database, `schools/${formData.schoolName}`), {
        schoolInfo: {
          name: formData.schoolName,
          stage: formData.educationalStage,
          principal: {
            name: formData.principalName,
            whatsapp: formData.principalWhatsapp,
          }
        },
        staff: {
          [userCredential.user.uid]: {
            name: formData.name,
            jobTitle: formData.jobTitle,
            nationalId: formData.nationalId,
            codeNumber: formData.codeNumber,
            whatsapp: formData.whatsapp,
            email: formData.email,
            role: 'supervisor',
            createdAt: new Date().toISOString(),
          }
        }
      });

      // Also save user reference for quick lookup
      await set(ref(database, `users/${userCredential.user.uid}`), {
        schoolName: formData.schoolName,
        role: 'supervisor',
        email: formData.email,
        name: formData.name,
      });

      router.push('/dashboard');
    } catch (error) {
      console.error('Registration error:', error);
      const firebaseError = error as { code?: string };
      switch (firebaseError.code) {
        case 'auth/email-already-in-use':
          setError('هذا البريد الإلكتروني مستخدم بالفعل');
          break;
        case 'auth/invalid-email':
          setError('البريد الإلكتروني غير صالح');
          break;
        case 'auth/operation-not-allowed':
          setError('التسجيل بالبريد الإلكتروني غير مفعل');
          break;
        case 'auth/weak-password':
          setError('كلمة المرور ضعيفة - يجب أن تكون 6 أحرف على الأقل');
          break;
        default:
          setError('حدث خطأ أثناء إنشاء الحساب');
          break;
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <div className="p-8 md:p-12">
      <h2 className="text-3xl font-bold mb-8 text-emerald-800">إنشاء حساب جديد</h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="text-right">
            <label htmlFor="name" className="block mb-2 text-lg font-medium text-emerald-700">الاسم</label>
            <input
              id="name"
              name="name"
              type="text"
              value={formData.name}
              onChange={handleChange}
              className="w-full p-3 border border-emerald-200 rounded-lg bg-white/50 backdrop-blur-sm focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all duration-200"
              required
              placeholder="أدخل الاسم الكامل"
            />
          </div>
          <div className="text-right">
            <label htmlFor="jobTitle" className="block mb-2 text-lg font-medium text-emerald-700">الوظيفة</label>
            <input
              id="jobTitle"
              name="jobTitle"
              type="text"
              value={formData.jobTitle}
              onChange={handleChange}
              className="w-full p-3 border border-emerald-200 rounded-lg bg-white/50 backdrop-blur-sm focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all duration-200"
              required
              placeholder="أدخل المسمى الوظيفي"
            />
          </div>
          <div className="text-right">
            <label htmlFor="nationalId" className="block mb-2 text-lg font-medium text-emerald-700">الرقم القومي</label>
            <input
              id="nationalId"
              name="nationalId"
              type="text"
              value={formData.nationalId}
              onChange={handleChange}
              className="w-full p-3 border border-emerald-200 rounded-lg bg-white/50 backdrop-blur-sm focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all duration-200"
              required
              placeholder="أدخل الرقم القومي"
            />
          </div>
          <div className="text-right">
            <label htmlFor="codeNumber" className="block mb-2 text-lg font-medium text-emerald-700">رقم الكود</label>
            <input
              id="codeNumber"
              name="codeNumber"
              type="text"
              value={formData.codeNumber}
              onChange={handleChange}
              className="w-full p-3 border border-emerald-200 rounded-lg bg-white/50 backdrop-blur-sm focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all duration-200"
              required
              placeholder="أدخل رقم الكود"
            />
          </div>
          <div className="text-right">
            <label htmlFor="whatsapp" className="block mb-2 text-lg font-medium text-emerald-700">رقم الواتس</label>
            <input
              id="whatsapp"
              name="whatsapp"
              type="tel"
              value={formData.whatsapp}
              onChange={handleChange}
              className="w-full p-3 border border-emerald-200 rounded-lg bg-white/50 backdrop-blur-sm focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all duration-200"
              required
              placeholder="أدخل رقم الواتس"
            />
          </div>
          <div className="text-right">
            <label htmlFor="schoolName" className="block mb-2 text-lg font-medium text-emerald-700">اسم المدرسة</label>
            <input
              id="schoolName"
              name="schoolName"
              type="text"
              value={formData.schoolName}
              onChange={handleChange}
              className="w-full p-3 border border-emerald-200 rounded-lg bg-white/50 backdrop-blur-sm focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all duration-200"
              required
              placeholder="أدخل اسم المدرسة"
            />
          </div>
          <div className="text-right">
            <label htmlFor="educationalStage" className="block mb-2 text-lg font-medium text-emerald-700">المرحلة</label>
            <input
              id="educationalStage"
              name="educationalStage"
              type="text"
              value={formData.educationalStage}
              onChange={handleChange}
              className="w-full p-3 border border-emerald-200 rounded-lg bg-white/50 backdrop-blur-sm focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all duration-200"
              required
              placeholder="أدخل المرحلة التعليمية"
            />
          </div>
          <div className="text-right">
            <label htmlFor="principalName" className="block mb-2 text-lg font-medium text-emerald-700">اسم مدير المدرسة</label>
            <input
              id="principalName"
              name="principalName"
              type="text"
              value={formData.principalName}
              onChange={handleChange}
              className="w-full p-3 border border-emerald-200 rounded-lg bg-white/50 backdrop-blur-sm focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all duration-200"
              required
              placeholder="أدخل اسم المدير"
            />
          </div>
          <div className="text-right">
            <label htmlFor="principalWhatsapp" className="block mb-2 text-lg font-medium text-emerald-700">رقم الواتس للمدير</label>
            <input
              id="principalWhatsapp"
              name="principalWhatsapp"
              type="tel"
              value={formData.principalWhatsapp}
              onChange={handleChange}
              className="w-full p-3 border border-emerald-200 rounded-lg bg-white/50 backdrop-blur-sm focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all duration-200"
              required
              placeholder="أدخل رقم واتس المدير"
            />
          </div>
          <div className="text-right">
            <label htmlFor="email" className="block mb-2 text-lg font-medium text-emerald-700">البريد الإلكتروني</label>
            <input
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full p-3 border border-emerald-200 rounded-lg bg-white/50 backdrop-blur-sm focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all duration-200"
              required
              placeholder="أدخل البريد الإلكتروني"
            />
          </div>
          <div className="text-right">
            <label htmlFor="password" className="block mb-2 text-lg font-medium text-emerald-700">كلمة المرور</label>
            <input
              id="password"
              name="password"
              type="password"
              value={formData.password}
              onChange={handleChange}
              className="w-full p-3 border border-emerald-200 rounded-lg bg-white/50 backdrop-blur-sm focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all duration-200"
              required
              placeholder="أدخل كلمة المرور"
            />
          </div>
        </div>
        {error && (
          <div className="bg-red-50 border-l-4 border-red-500 p-4 text-right">
            <p className="text-red-700">{error}</p>
          </div>
        )}
        <div className="flex flex-col space-y-4">
          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-emerald-600 text-white py-3 px-6 rounded-lg font-medium text-lg hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? 'جاري إنشاء الحساب...' : 'إنشاء الحساب'}
          </button>
          <Link
            href="/login"
            className="text-center text-emerald-600 hover:text-emerald-800 font-medium transition-colors duration-200"
          >
            لديك حساب بالفعل؟ سجل دخولك
          </Link>
        </div>
      </form>
    </div>
  );
}
