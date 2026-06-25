import { NextResponse } from "next/server";
import { prisma } from "@/lib/db/prisma";

export async function GET() {
  const users = await prisma.user.findMany();

  return NextResponse.json({
    success: true,
    count: users.length,
    users,
  });
}