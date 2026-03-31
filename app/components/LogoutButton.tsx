"use client";
import { signOut } from "next-auth/react";

export default function LogoutButton() {
  return (
    <button onClick={async () => {
  await signOut({ callbackUrl: '/api/auth/signin', redirect: true });
}}>
  登出
</button>
  );
}