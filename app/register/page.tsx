"use client";
import { useState } from "react";

export default function RegisterPage() {
  const [form, setForm] = useState({ email: "", password: "", name: "" });

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await fetch("/api/register", {
      method: "POST",
      body: JSON.stringify(form),
    });
    
    if (res.ok) {
      alert("註冊成功！請前往登入頁面");
      window.location.href = "/api/auth/signin";
    } else {
      alert("註冊失敗或信箱已被使用");
    }
  };

  return (
    <main style={{ padding: "50px", textAlign: "center" }}>
      <h2>建立新帳號</h2>
      <form onSubmit={submit} style={{ display: "flex", flexDirection: "column", gap: "10px", maxWidth: "300px", margin: "0 auto" }}>
        <input placeholder="信箱" type="email" onChange={e => setForm({...form, email: e.target.value})} required />
        <input placeholder="密碼" type="password" onChange={e => setForm({...form, password: e.target.value})} required />
        <input placeholder="姓名" onChange={e => setForm({...form, name: e.target.value})} required />
        <button type="submit">註冊</button>
      </form>
    </main>
  );
}