"use client";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import Link from "next/link";

export default function AdminPage() {
  const { data: session, status } = useSession();
  const [records, setRecords] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState(""); // 1. 新增搜尋狀態

  // 2. 解除僅限 ADMIN 的讀取限制，讓所有登入者都能載入資料
  useEffect(() => {
    if (session) {
      fetch("/api/emissions").then(r => r.json()).then(setRecords);
    }
  }, [session]);

  const handleDelete = async (id: number) => {
    if (!confirm("確定要刪除這筆紀錄嗎？")) return;
    const res = await fetch(`/api/emissions?id=${id}`, { method: "DELETE" });
    if (res.ok) setRecords(records.filter(r => r.id !== id));
    else alert("刪除失敗");
  };

  if (status === "loading") return <div className="p-10 text-center font-bold text-gray-600">驗證身分中...</div>;
  if (!session) return <div className="p-10 text-center font-bold text-red-500">請先登入</div>;

  // 3. 根據搜尋字串過濾資料
  const filteredRecords = records.filter(r => 
    r.employeeName.toLowerCase().includes(searchTerm.toLowerCase())
  );
  const total = filteredRecords.reduce((acc, cur) => acc + cur.totalEmission, 0);
  
  // 判斷是否為管理員
  const isAdmin = session?.user?.role === "ADMIN";

  return (
    <div className="p-10 max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">總排放量: {total.toFixed(2)} kgCO2e</h2>
        <Link href="/">
          <button className="bg-gray-600 hover:bg-gray-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors">
            返回首頁
          </button>
        </Link>
      </div>

      {/* 4. 新增搜尋列 */}
      <div className="mb-6">
        <input 
          type="text" 
          placeholder="🔍 搜尋員工姓名..." 
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full md:w-1/2 px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-500 outline-none"
        />
      </div>
      
      <div className="overflow-x-auto shadow-md rounded-lg">
        <table className="min-w-full bg-white border border-gray-200">
          <thead className="bg-gray-800 text-white">
            <tr>
              <th className="px-6 py-3 text-left font-semibold">員工姓名</th>
              <th className="px-6 py-3 text-left font-semibold">部門</th>
              <th className="px-6 py-3 text-left font-semibold">碳排量 (kgCO2e)</th>
              {/* 5. 只有管理員才看得到操作欄位 */}
              {isAdmin && <th className="px-6 py-3 text-center font-semibold">操作</th>}
            </tr>
          </thead>
          <tbody>
            {filteredRecords.map(r => (
              <tr key={r.id} className="border-b hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4 text-gray-700">{r.employeeName}</td>
                <td className="px-6 py-4 text-gray-700">{r.department}</td>
                <td className="px-6 py-4 text-gray-700 font-medium">{r.totalEmission}</td>
                {/* 5. 只有管理員才看得到刪除按鈕 */}
                {isAdmin && (
                  <td className="px-6 py-4 text-center">
                    <button 
                      onClick={() => handleDelete(r.id)}
                      className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md text-sm transition-colors"
                    >
                      刪除
                    </button>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}