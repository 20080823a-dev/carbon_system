import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcrypt";

export async function POST(req: Request) {
  try {
    const { email, password, name } = await req.json();
    
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) return NextResponse.json({ error: "信箱已存在" }, { status: 400 });

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({
      data: { email, password: hashedPassword, name, role: "USER" }
    });

    return NextResponse.json({ message: "註冊成功", user: { email: user.email } });
  } catch (error) {
  console.log("註冊崩潰的真正原因：", error); // 加上這行把報錯印在終端機
  return NextResponse.json({ error: "伺服器錯誤" }, { status: 500 });
}
}