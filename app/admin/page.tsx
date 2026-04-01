"use client";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import Link from "next/link";

export default function AdminPage() {
  const { data: session, status } = useSession();
  const [records, setRecords] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  // 新增：年份與月份篩選狀態
  const [filterYear, setFilterYear] = useState("ALL");
  const [filterMonth, setFilterMonth] = useState("ALL");

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

  // 新增：匯出 Excel (CSV) 功能
  const exportToExcel = () => {
    const headers = ["建立時間", "員工姓名", "部門", "碳排量 (kgCO2e)"];
    const csvContent = [
      headers.join(","),
      ...filteredRecords.map(r => {
        const dateStr = new Date(r.createdAt || Date.now()).toLocaleString();
        return `"${dateStr}","${r.employeeName}","${r.department}","${r.totalEmission}"`;
      })
    ].join("\n");

    const blob = new Blob(["\uFEFF" + csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `碳排報表_${filterYear}_${filterMonth}.csv`;
    link.click();
  };

  if (status === "loading") return <div className="p-10 text-center font-bold text-gray-600">驗證身分中...</div>;
  if (!session) return <div className="p-10 text-center font-bold text-red-500">請先登入</div>;

  // 根據搜尋字串、年份、月份過濾資料
  const filteredRecords = records.filter(r => {
    const matchName = r.employeeName.toLowerCase().includes(searchTerm.toLowerCase());
    const d = new Date(r.createdAt || Date.now()); // 假設後端有傳 createdAt
    const matchYear = filterYear === "ALL" || d.getFullYear().toString() === filterYear;
    const matchMonth = filterMonth === "ALL" || (d.getMonth() + 1).toString().padStart(2, '0') === filterMonth;
    return matchName && matchYear && matchMonth;
  });

  const total = filteredRecords.reduce((acc, cur) => acc + cur.totalEmission, 0);
  const isAdmin = session?.user?.role === "ADMIN";

  // 產生動態年份選單 (例如今年及前幾年)
  const currentYear = new Date().getFullYear();
  const years = Array.from({length: 5}, (_, i) => (currentYear - i).toString());

  return (
    <div className="p-10 max-w-5xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">總排放量: {total.toFixed(2)} kgCO2e</h2>
        <div className="flex gap-3">
          {/* 新增匯出按鈕 */}
          <button onClick={exportToExcel} className="bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors">
            匯出 Excel
          </button>
          <Link href="/">
            <button className="bg-gray-600 hover:bg-gray-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors">
              返回首頁
            </button>
          </Link>
        </div>
      </div>

      <div className="mb-6 flex flex-col md:flex-row gap-4">
        <input 
          type="text" 
          placeholder="🔍 搜尋員工姓名..." 
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full md:w-1/3 px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-500 outline-none"
        />
        {/* 新增年份與月份篩選 */}
        <select value={filterYear} onChange={(e) => setFilterYear(e.target.value)} className="w-full md:w-1/4 px-4 py-2 rounded-lg border border-gray-300">
          <option value="ALL">所有年份</option>
          {years.map(y => <option key={y} value={y}>{y} 年</option>)}
        </select>
        <select value={filterMonth} onChange={(e) => setFilterMonth(e.target.value)} className="w-full md:w-1/4 px-4 py-2 rounded-lg border border-gray-300">
          <option value="ALL">所有月份</option>
          {Array.from({length: 12}, (_, i) => {
            const m = (i + 1).toString().padStart(2, '0');
            return <option key={m} value={m}>{m} 月</option>;
          })}
        </select>
      </div>
      
      <div className="overflow-x-auto shadow-md rounded-lg">
        <table className="min-w-full bg-white border border-gray-200">
          <thead className="bg-gray-800 text-white">
            <tr>
              <th className="px-6 py-3 text-left font-semibold">新增時間</th>
              <th className="px-6 py-3 text-left font-semibold">員工姓名</th>
              <th className="px-6 py-3 text-left font-semibold">部門</th>
              <th className="px-6 py-3 text-left font-semibold">碳排量 (kgCO2e)</th>
              {isAdmin && <th className="px-6 py-3 text-center font-semibold">操作</th>}
            </tr>
          </thead>
          <tbody>
            {filteredRecords.map(r => (
              <tr key={r.id} className="border-b hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4 text-gray-700">
                  {new Date(r.createdAt || Date.now()).toLocaleDateString('zh-TW')}
                </td>
                <td className="px-6 py-4 text-gray-700">{r.employeeName}</td>
                <td className="px-6 py-4 text-gray-700">{r.department}</td>
                <td className="px-6 py-4 text-gray-700 font-medium">{r.totalEmission}</td>
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
