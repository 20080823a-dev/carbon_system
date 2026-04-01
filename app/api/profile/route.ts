import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcrypt";

export async function PUT(req: Request) {
  try {
    const { email, name, password } = await req.json();
    if (!email) return NextResponse.json({ error: "缺少信箱" }, { status: 400 });

    const updateData: any = { name };
    // 若使用者有輸入新密碼，則加密後一併更新
    if (password) updateData.password = await bcrypt.hash(password, 10);

    await prisma.user.update({
      where: { email },
      data: updateData,
    });

    return NextResponse.json({ message: "更新成功" });
  } catch (error) {
    return NextResponse.json({ error: "伺服器錯誤" }, { status: 500 });
  }
}