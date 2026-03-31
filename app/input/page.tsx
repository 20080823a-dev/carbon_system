"use client";
import { useState } from "react";

export default function InputPage() {
  const [form, setForm] = useState({ employeeName: "", department: "", commuteMethod: "汽車", distanceKm: 0, attendanceDays: 0 });

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    await fetch("/api/emissions", { method: "POST", body: JSON.stringify(form) });
    alert("新增成功");
  };

  return (
    <form onSubmit={submit}>
      <input placeholder="姓名" onChange={e => setForm({...form, employeeName: e.target.value})} />
      <input placeholder="部門" onChange={e => setForm({...form, department: e.target.value})} />
      <select onChange={e => setForm({...form, commuteMethod: e.target.value})}>
        <option>汽車</option><option>機車</option><option>捷運</option><option>公車</option>
      </select>
      <input type="number" placeholder="公里數" onChange={e => setForm({...form, distanceKm: Number(e.target.value)})} />
      <input type="number" placeholder="天數" onChange={e => setForm({...form, attendanceDays: Number(e.target.value)})} />
      <button type="submit">送出</button>
    </form>
  );
}