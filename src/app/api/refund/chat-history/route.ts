import { prisma } from "@/lib/db/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  const messages =
    await prisma.chatMessage.findMany({
      orderBy: {
        createdAt: "asc",
      },
      take: 50,
    });

  return NextResponse.json(messages);
}