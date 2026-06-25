import { prisma } from "@/lib/db/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const total =
      await prisma.refundRequest.count();

    const approved =
      await prisma.refundRequest.count({
        where: {
          status: "APPROVED",
        },
      });

    const rejected =
      await prisma.refundRequest.count({
        where: {
          status: "REJECTED",
        },
      });

    const review =
      await prisma.refundRequest.count({
        where: {
          status:
            "MANAGER_REVIEW",
        },
      });

    return NextResponse.json({
      total,
      approved,
      rejected,
      review,
    });

  } catch (error) {

    console.error(error);

    return NextResponse.json(
      {
        total: 0,
        approved: 0,
        rejected: 0,
        review: 0,
      },
      {
        status: 500,
      }
    );
  }
}