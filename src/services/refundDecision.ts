import { ProductType } from "@prisma/client";

type RefundInput = {
  productType: ProductType;
  amount: number;
  purchaseDate: Date;
  delivered: boolean;
};

export function evaluateRefund(
  input: RefundInput
) {
  const days =
    Math.floor(
      (Date.now() -
        input.purchaseDate.getTime()) /
        (1000 * 60 * 60 * 24)
    );

  if (
    input.productType === ProductType.DIGITAL
  ) {
    return {
      decision: "REJECTED",
      reason:
        "Digital products are non-refundable.",
    };
  }

  if (input.amount > 1000) {
    return {
      decision: "MANAGER_REVIEW",
      reason:
        "High value order requires manager approval.",
    };
  }

  if (!input.delivered) {
    return {
      decision: "REJECTED",
      reason:
        "Product has not been delivered.",
    };
  }

  if (days > 30) {
    return {
      decision: "REJECTED",
      reason:
        "Refund request exceeds 30-day policy.",
    };
  }

  return {
    decision: "APPROVED",
    reason:
      "Order meets refund policy requirements.",
    };
}