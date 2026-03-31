"use client";
// 1. 記得引入 signIn
import { useSession, signIn } from "next-auth/react";
import Link from "next/link";
import LogoutButton from "./components/LogoutButton";

export default function Home() {
  const { data: session, status } = useSession();

  if (status === "loading") return <div className="min-h-screen flex items-center justify-center">載入中...</div>;

  if (!session) {
    return (
      <main className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-4">企業碳排放管理系統</h1>
        {/* 2. 把 Link 換成 button onClick，並加上 callbackUrl */}
        <button 
          onClick={() => signIn(undefined, { callbackUrl: "/" })}
          className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
        >
          前往登入
        </button>
      </main>
    );
  }

  // ... 下方保留你原本已登入的畫面程式碼
  return (
    <main className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-6">
      <div className="bg-white rounded-2xl shadow-lg p-10 max-w-md w-full text-center">
        <div className="mb-6"><span className="text-5xl">🌱</span></div>
        <h1 className="text-2xl font-bold text-gray-800 mb-2">企業碳排放管理系統</h1>
        <p className="text-gray-500 mb-8 text-sm">歡迎回來，{session.user?.name}！請選擇您要前往的服務。</p>
        <div className="flex flex-col gap-4">
          <Link href="/input" className="w-full">
            <button className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors">進入系統</button>
          </Link>
          <div className="w-full text-red-500"><LogoutButton /></div>
        </div>
      </div>
    </main>
  );
}