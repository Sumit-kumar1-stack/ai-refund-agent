import { prisma } from "@/lib/db/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  await prisma.$connect();

  return NextResponse.json({
    success: true,
    message: "Database connected",
  });
}