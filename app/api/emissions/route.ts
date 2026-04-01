import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// 簡單排放係數定義 (單位: kgCO2e/km)
const EMISSION_FACTORS: Record<string, number> = {
  "汽車": 0.115,
  "機車": 0.0951,
  "捷運": 0.033,
  "公車": 0.053,
  "台鐵": 0.053,
  "高鐵": 0.033,
  "步行/自行車": 0,
};

export async function POST(req: Request) {
  try {
    const data = await req.json();
    const { employeeName, department, commuteMethod, distanceKm, attendanceDays } = data;

    // 計算總碳排放量：距離 * 出勤天數 * 排放係數
    const factor = EMISSION_FACTORS[commuteMethod] || 0;
    const totalEmission = distanceKm * attendanceDays * factor;

    const newRecord = await prisma.carbonRecord.create({
      data: {
        employeeName,
        department,
        commuteMethod,
        distanceKm: Number(distanceKm),
        attendanceDays: Number(attendanceDays),
        totalEmission,
      },
    });

    return NextResponse.json({ success: true, data: newRecord });
  } catch (error) {
    return NextResponse.json({ success: false, error: "儲存失敗" }, { status: 500 });
  }
}

export async function GET() {
  // 供後台報表讀取所有資料使用
  const records = await prisma.carbonRecord.findMany({
    orderBy: { createdAt: 'desc' }
  });
  return NextResponse.json(records);
}
export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    if (!id) return NextResponse.json({ error: "缺少 ID" }, { status: 400 });

    await prisma.carbonRecord.delete({
      where: { id: Number(id) }
    });
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: "刪除失敗" }, { status: 500 });
  }
}
