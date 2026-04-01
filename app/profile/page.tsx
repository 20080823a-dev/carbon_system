"use client";
import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function ProfilePage() {
  const { data: session, status, update } = useSession();
  const router = useRouter();
  const [form, setForm] = useState({ name: "", password: "" });

  // 預設帶入原姓名
  useEffect(() => {
    if (session?.user?.name) setForm(prev => ({ ...prev, name: session.user.name as string }));
  }, [session]);

  if (status === "loading") return <div className="p-10 text-center">載入中...</div>;
  if (!session) return <div className="p-10 text-center text-red-500">請先登入</div>;

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await fetch("/api/profile", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: session.user?.email,
        name: form.name,
        password: form.password || undefined, // 沒填就不傳密碼
      }),
    });

    if (res.ok) {
      alert("資料更新成功！");
      await update({ name: form.name }); // 更新前端 Session 狀態
      router.push("/");
    } else {
      alert("更新失敗");
    }
  };

  return (
    <main className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-6">
      <div className="bg-white rounded-2xl shadow-lg p-10 max-w-md w-full">
        <h2 className="text-2xl font-bold text-center mb-6">修改帳號資料</h2>
        <form onSubmit={submit} className="flex flex-col gap-4">
          <div>
            <label className="text-sm font-medium text-gray-700">信箱 (無法修改)</label>
            <input type="email" value={session.user?.email || ""} disabled className="w-full border p-3 rounded-lg bg-gray-100 text-gray-500" />
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700">姓名</label>
            <input value={form.name} onChange={e => setForm({...form, name: e.target.value})} required className="w-full border p-3 rounded-lg" />
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700">新密碼 (不修改請留空)</label>
            <input type="password" placeholder="輸入新密碼" value={form.password} onChange={e => setForm({...form, password: e.target.value})} className="w-full border p-3 rounded-lg" />
          </div>
          <button type="submit" className="w-full bg-yellow-500 hover:bg-yellow-600 text-white font-semibold py-3 rounded-lg mt-4">儲存修改</button>
          <button type="button" onClick={() => router.push("/")} className="w-full bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold py-3 rounded-lg">返回首頁</button>
        </form>
      </div>
    </main>
  );
}