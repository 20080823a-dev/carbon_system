"use client";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";

export default function AdminPage() {
  // 加上 status 來追蹤載入狀態
  const { data: session, status } = useSession();
  const [records, setRecords] = useState<any[]>([]);

  useEffect(() => {
    if (session?.user?.role === "ADMIN") {
      fetch("/api/emissions").then(r => r.json()).then(setRecords);
    }
  }, [session]);

  // 1. 等待驗證中，顯示載入畫面避免閃爍
  if (status === "loading") return <div className="p-10 text-center font-bold text-gray-600">驗證身分中...</div>;

  // 2. 驗證失敗或權限不足
  if (session?.user?.role !== "ADMIN") return <div className="p-10 text-center font-bold text-red-500">權限不足，請登入管理員帳號</div>;

  const total = records.reduce((acc, cur) => acc + cur.totalEmission, 0);

  return (
    <div className="p-10 max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">總排放量: {total.toFixed(2)} kgCO2e</h2>
      <div className="overflow-x-auto shadow-md rounded-lg">
        <table className="min-w-full bg-white border border-gray-200">
          <thead className="bg-gray-800 text-white">
            <tr>
              <th className="px-6 py-3 text-left font-semibold">員工姓名</th>
              <th className="px-6 py-3 text-left font-semibold">部門</th>
              <th className="px-6 py-3 text-left font-semibold">碳排量 (kgCO2e)</th>
            </tr>
          </thead>
          <tbody>
            {records.map(r => (
              <tr key={r.id} className="border-b hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4 text-gray-700">{r.employeeName}</td>
                <td className="px-6 py-4 text-gray-700">{r.department}</td>
                <td className="px-6 py-4 text-gray-700 font-medium">{r.totalEmission}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}