import { NextResponse } from "next/server";
import { prisma } from "@/lib/db/prisma";

export async function GET() {
  try {
    const chats =
      await prisma.chatMessage.findMany({
        orderBy: {
          createdAt: "asc",
        },

        take: 50,
      });

    return NextResponse.json(
      chats
    );

  } catch (error) {

    console.error(
      error
    );

    return NextResponse.json(
      [],
      {
        status: 500,
      }
    );
  }
}