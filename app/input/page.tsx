"use client";
import { useState } from "react";
import Link from "next/link"; // 引入 Link 用於返回首頁

export default function InputPage() {
  const [form, setForm] = useState({ employeeName: "", department: "", commuteMethod: "汽車", distanceKm: 0, attendanceDays: 0 });

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    await fetch("/api/emissions", { method: "POST", body: JSON.stringify(form) });
    alert("新增成功");
    // 可選擇在成功後清空表單，或導回首頁
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-blue-50 p-6">
      <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8 w-full max-w-md">
        
        <div className="text-center mb-8">
          <div className="text-5xl mb-3">✍️</div>
          <h2 className="text-2xl font-bold text-gray-800">填寫碳排紀錄</h2>
          <p className="text-sm text-gray-500 mt-1">請確實填寫您的通勤資訊</p>
        </div>

        <form onSubmit={submit} className="flex flex-col gap-5">
          {/* 姓名輸入框 */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">員工姓名</label>
            <input 
              required
              placeholder="例如：王小明" 
              onChange={e => setForm({...form, employeeName: e.target.value})} 
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition-all"
            />
          </div>

          {/* 部門輸入框 */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">所屬部門</label>
            <input 
              required
              placeholder="例如：行銷部" 
              onChange={e => setForm({...form, department: e.target.value})} 
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition-all"
            />
          </div>

          {/* 通勤方式下拉選單 */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">主要通勤方式</label>
            <select 
              onChange={e => setForm({...form, commuteMethod: e.target.value})}
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none bg-white transition-all cursor-pointer"
            >
              <option value="汽車">🚗 汽車</option>
              <option value="機車">🏍️ 機車</option>
              <option value="捷運">🚇 捷運</option>
              <option value="公車">🚌 公車</option>
              <option value="步行">🚶 步行</option>
              <option value="腳踏車">🚲 腳踏車</option>
            </select>
          </div>

          {/* 數字輸入群組 (兩欄並排) */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">單趟距離 (公里)</label>
              <input 
                required
                type="number" 
                min="0"
                step="0.1"
                placeholder="例如：15" 
                onChange={e => setForm({...form, distanceKm: Number(e.target.value)})} 
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition-all"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">本月出勤天數</label>
              <input 
                required
                type="number" 
                min="0"
                max="31"
                placeholder="例如：22" 
                onChange={e => setForm({...form, attendanceDays: Number(e.target.value)})} 
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition-all"
              />
            </div>
          </div>

          {/* 按鈕群組 */}
          <div className="mt-4 flex flex-col gap-3">
            <button 
              type="submit" 
              className="w-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-bold py-3.5 rounded-xl shadow-md transform transition-all hover:-translate-y-0.5"
            >
              送出紀錄
            </button>
            
            <Link href="/" className="w-full">
              <button 
                type="button" 
                className="w-full bg-white hover:bg-gray-50 text-gray-700 font-semibold py-3.5 rounded-xl border border-gray-300 shadow-sm transition-all"
              >
                返回首頁
              </button>
            </Link>
          </div>

        </form>
      </div>
    </main>
  );
}