import { prisma } from "@/lib/db/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const logs =
      await prisma.agentLog.findMany({
        orderBy: {
          createdAt: "desc",
        },

        take: 20,

        include: {
          refund: {
            include: {
              order: true,
            },
          },
        },
      });

    return NextResponse.json(
      logs
    );

  } catch (error) {

    console.error(error);

    return NextResponse.json(
      {
        error:
          "Failed to load logs",
      },
      {
        status: 500,
      }
    );
  }
}