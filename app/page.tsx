"use client";

import { useSession, signIn } from "next-auth/react";
import Link from "next/link";
import LogoutButton from "./components/LogoutButton";

export default function Home() {
  const { data: session, status } = useSession();

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 text-gray-500 font-medium tracking-widest animate-pulse">
        載入中...
      </div>
    );
  }

  if (!session) {
    return (
      <main className="min-h-screen flex flex-col items-center justify-center p-6 bg-gradient-to-br from-emerald-50 via-white to-blue-50">
        <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/50 p-10 max-w-md w-full text-center transform transition-all hover:scale-[1.01]">
          <div className="mb-6"><span className="text-6xl drop-shadow-sm">🔐</span></div>
          <h1 className="text-3xl font-extrabold text-gray-800 mb-3 tracking-tight">交通碳排管理</h1>
          <p className="text-gray-500 mb-8 text-sm font-medium">請先登入或註冊以存取系統完整功能</p>
          
          <div className="flex flex-col gap-4">
            <button 
              onClick={() => signIn(undefined, { callbackUrl: "/" })}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3.5 px-6 rounded-xl shadow-md hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-200"
            >
              登入系統
            </button>
            <Link href="/register" className="w-full">
              <button className="w-full bg-white hover:bg-gray-50 text-gray-700 font-semibold py-3.5 px-6 rounded-xl border-2 border-gray-200 hover:border-gray-300 shadow-sm transform hover:-translate-y-0.5 transition-all duration-200">
                註冊新帳號
              </button>
            </Link>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-6 bg-gradient-to-br from-emerald-50 via-white to-teal-50">
      <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/50 p-10 max-w-md w-full text-center">
        <div className="mb-6"><span className="text-6xl drop-shadow-sm">🌿</span></div>
        <h1 className="text-3xl font-extrabold text-gray-800 mb-2 tracking-tight">交通碳排管理</h1>
        <p className="text-gray-500 mb-8 text-sm font-medium">
          歡迎回來，<span className="text-emerald-600 font-bold">{session.user?.name}</span>！
        </p>
        
        <div className="flex flex-col gap-3.5">
          <Link href="/input" className="w-full">
            <button className="w-full bg-emerald-500 hover:bg-emerald-600 text-white font-semibold py-3.5 px-6 rounded-xl shadow-md hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-200">
              ✍️ 填寫碳排紀錄
            </button>
          </Link>
          
          <Link href="/admin" className="w-full">
            <button className="w-full bg-slate-800 hover:bg-slate-900 text-white font-semibold py-3.5 px-6 rounded-xl shadow-md hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-200">
              📊 查看後台報表
            </button>
          </Link>

          <Link href="/profile" className="w-full">
            <button className="w-full bg-amber-500 hover:bg-amber-600 text-white font-semibold py-3.5 px-6 rounded-xl shadow-md hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-200">
              ⚙️ 修改帳號資料
            </button>
          </Link>

          <div className="w-full mt-4 pt-4 border-t border-gray-100">
            <LogoutButton />
          </div>
        </div>
      </div>
    </main>
  );
}
