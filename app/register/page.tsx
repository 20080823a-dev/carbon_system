"use client";
import { useState } from "react";
import Link from "next/link";

// 嚴謹定義表單的型別，避免 VS Code 出現紅線
interface RegisterFormState {
  email?: string;
  password?: string;
  name?: string;
}

export default function RegisterPage() {
  const [form, setForm] = useState<RegisterFormState>({ email: "", password: "", name: "" });

  const submit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const res = await fetch("/api/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(form),
    });
    
    if (res.ok) {
      alert("註冊成功！請前往登入頁面");
      window.location.href = "/api/auth/signin"; // 成功後導向登入頁
    } else {
      alert("註冊失敗或信箱/名稱已被使用");
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-200 p-6">
      <div className="bg-white p-10 rounded-3xl shadow-2xl w-full max-w-md border border-slate-100">
        
        <div className="text-center mb-8">
          <div className="text-5xl mb-4 drop-shadow-sm">✨</div>
          <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight mb-2">建立新帳號</h2>
          <p className="text-slate-500 text-sm">請輸入您的詳細資料以完成註冊</p>
        </div>
        
        <form onSubmit={submit} className="flex flex-col gap-5">
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-1.5">信箱</label>
            <input 
              className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all shadow-sm bg-slate-50 focus:bg-white"
              placeholder="name@example.com" 
              type="email" 
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setForm({...form, email: e.target.value})} 
              required 
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-slate-700 mb-1.5">姓名 (登入用)</label>
            <input 
              className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all shadow-sm bg-slate-50 focus:bg-white"
              placeholder="例如：王小明" 
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setForm({...form, name: e.target.value})} 
              required 
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-slate-700 mb-1.5">密碼</label>
            <input 
              className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all shadow-sm bg-slate-50 focus:bg-white"
              placeholder="設定一組安全的密碼" 
              type="password" 
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setForm({...form, password: e.target.value})} 
              required 
            />
          </div>

          <button 
            type="submit"
            className="w-full mt-4 bg-blue-600 hover:bg-blue-700 text-white font-bold py-3.5 rounded-xl shadow-lg transform transition-all active:scale-95 hover:-translate-y-0.5"
          >
            立即註冊
          </button>
        </form>

        <div className="mt-8 text-center">
          <Link href="/" className="text-sm text-slate-500 hover:text-blue-600 font-semibold transition-colors">
            已經有帳號了？ <span className="underline">返回登入</span>
          </Link>
        </div>

      </div>
    </main>
  );
}
