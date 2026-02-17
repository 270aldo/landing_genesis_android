import { NextResponse } from "next/server";

interface LeadPayload {
  email: string;
  whatsapp?: string;
  source?: string;
  page?: string;
}

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function sanitizeText(value: unknown, max = 200): string {
  if (typeof value !== "string") return "";
  return value.trim().slice(0, max);
}

function maskEmail(email: string): string {
  const [local = "", domain = ""] = email.split("@");
  if (!domain) return "***";
  const safeLocal = local.length <= 2 ? `${local[0] ?? "*"}*` : `${local.slice(0, 2)}***`;
  return `${safeLocal}@${domain}`;
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as LeadPayload;

    const email = sanitizeText(body.email, 120).toLowerCase();
    const whatsapp = sanitizeText(body.whatsapp, 30).replace(/[^\d+]/g, "");
    const source = sanitizeText(body.source, 40) || "unknown";
    const page = sanitizeText(body.page, 120) || "/";

    if (!EMAIL_REGEX.test(email)) {
      return NextResponse.json(
        { ok: false, message: "Correo inválido." },
        { status: 400 }
      );
    }

    const leadEvent = {
      email,
      whatsapp: whatsapp || undefined,
      source,
      page,
      createdAt: new Date().toISOString(),
      userAgent: request.headers.get("user-agent") ?? "unknown",
      ip:
        request.headers.get("x-forwarded-for") ??
        request.headers.get("x-real-ip") ??
        "unknown",
    };

    const webhookUrl = process.env.LEAD_WEBHOOK_URL;
    if (webhookUrl) {
      const webhookResponse = await fetch(webhookUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(leadEvent),
        cache: "no-store",
      });

      if (!webhookResponse.ok) {
        return NextResponse.json(
          { ok: false, message: "No pudimos enrutar tu lead. Intenta nuevamente." },
          { status: 502 }
        );
      }
    }

    // Fallback logging for environments without webhook integration.
    console.info(
      `[lead-capture] email=${maskEmail(email)} source=${source} page=${page} webhook=${webhookUrl ? "on" : "off"}`
    );

    return NextResponse.json({
      ok: true,
      routed: Boolean(webhookUrl),
    });
  } catch (error) {
    return NextResponse.json(
      { ok: false, message: "Error inesperado al guardar lead." },
      { status: 500 }
    );
  }
}
