"use client";
import { signOut } from "next-auth/react";

export default function LogoutButton() {
  return (
    <button 
      onClick={async () => {
        // 將 callbackUrl 改為 "/"，避免直接進入登入頁面導致快取衝突
        await signOut({ callbackUrl: "/" });
      }}
      className="w-full bg-red-50 hover:bg-red-100 text-red-600 font-semibold py-3 px-6 rounded-lg transition-colors"
    >
      登出
    </button>
  );
}