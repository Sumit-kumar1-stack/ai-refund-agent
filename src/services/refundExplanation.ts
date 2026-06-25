import { gemini } from "@/lib/gemini/client";

export async function generateRefundExplanation(
  decision: string,
  reason: string,
  orderNumber: string
) {
  try {
    const response =
      await gemini.models.generateContent({
        model: "gemini-2.5-flash",

        contents: `
You are an AI refund assistant.

Order Number:
${orderNumber}

Decision:
${decision}

Reason:
${reason}

Respond like a live customer support chat assistant.

Rules:
- Professional and friendly
- No email formatting
- No "Dear Customer"
- No subject lines
- No signatures
- Maximum 80 words
- Explain clearly and naturally
`,
      });

    return (
      response.text?.trim() ||
      `Decision: ${decision}

Reason:
${reason}`
    );

  } catch (error) {

    console.error(
      "Gemini generation failed:",
      error
    );

    return `Decision: ${decision}

Reason:
${reason}`;
  }
}