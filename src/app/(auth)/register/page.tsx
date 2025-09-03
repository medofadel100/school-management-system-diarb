import Image from 'next/image'
import RegisterForm from '@/components/RegisterForm'

export default function Register() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-teal-50">
      <div className="flex flex-col items-center justify-center min-h-screen py-2">
        <header className="w-full bg-white/80 backdrop-blur-md shadow-lg p-6 mb-8 border-b border-emerald-100">
          <div className="container mx-auto flex flex-row-reverse justify-between items-center">
            <div className="text-right space-y-1 flex-grow">
              <h1 className="text-2xl font-bold text-emerald-800">محافظة الشرقيه</h1>
              <h2 className="text-lg text-emerald-700">مدرية التربيه والتعليم</h2>
              <h3 className="text-md text-emerald-600">ادارة ديرب نجم التعلمية</h3>
              <h4 className="text-sm text-emerald-500">ادارة التخطيط الاستراتيجي والسياسات</h4>
            </div>
            <div className="relative h-24 w-24 ml-6">
              <Image
                src="/logo.jpg"
                alt="Logo"
                fill
                className="object-contain rounded-lg shadow-md"
              />
            </div>
          </div>
        </header>

        <main className="flex flex-col items-center w-full flex-1 px-4 sm:px-20 text-center mb-8">
          <div className="bg-white/70 backdrop-blur-md rounded-3xl shadow-xl w-full max-w-5xl border border-emerald-100 overflow-hidden">
            <RegisterForm />
          </div>
        </main>
      </div>
    </div>
  )
}
