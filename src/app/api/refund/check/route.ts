import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db/prisma";
import { RefundStatus } from "@prisma/client";

import { evaluateRefund } from "@/services/refundDecision";
import { generateRefundExplanation } from "@/services/refundExplanation";

export async function POST(
  request: NextRequest
) {
  try {
    console.log(
      "POST /api/refund/check called"
    );

    const body =
      await request.json();

    const orderNumber =
      body.orderNumber;

    console.log(
      "Order:",
      orderNumber
    );

    if (!orderNumber) {
      return NextResponse.json(
        {
          error:
            "Order number required",
        },
        {
          status: 400,
        }
      );
    }

    const order =
      await prisma.order.findUnique({
        where: {
          orderNumber,
        },
      });

    if (!order) {
      return NextResponse.json(
        {
          error:
            "Order not found",
        },
        {
          status: 404,
        }
      );
    }

    const result =
      evaluateRefund({
        productType:
          order.productType,

        amount:
          order.amount,

        purchaseDate:
          order.purchaseDate,

        delivered:
          order.delivered,
      });

    const explanation =
      await generateRefundExplanation(
        result.decision,
        result.reason,
        orderNumber
      );

    const refund =
      await prisma.refundRequest.create({
        data: {
          reason:
            "Customer Chat Request",

          status:
            result.decision as RefundStatus,

          orderId:
            order.id,

          aiDecision:
            result.decision,

          aiReasoning:
            result.reason,

          aiResponse:
            explanation,
        },
      });

    await prisma.agentLog.createMany({
      data: [
        {
          eventType:
            "CUSTOMER_REQUEST",

          message:
            "Customer requested refund",

          refundId:
            refund.id,
        },

        {
          eventType:
            "ORDER_LOCATED",

          message:
            `Order ${orderNumber} located`,

          refundId:
            refund.id,
        },

        {
          eventType:
            "POLICY_EVALUATED",

          message:
            "Refund policy evaluated",

          refundId:
            refund.id,
        },

        {
          eventType:
            "REFUND_DECISION",

          message:
            explanation,

          refundId:
            refund.id,
        },
      ],
    });

    return NextResponse.json({
      orderNumber,

      decision:
        result.decision,

      reason:
        result.reason,

      explanation,
    });

  } catch (error) {

    console.error(
      "Refund API Error:",
      error
    );

    return NextResponse.json(
      {
        error:
          "Failed to process refund",
      },
      {
        status: 500,
      }
    );
  }
}