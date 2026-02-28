import { NextResponse } from "next/server";

interface LeadPayload {
  email: string;
  whatsapp?: string;
  source?: string;
  page?: string;
}

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const WEBHOOK_TIMEOUT_MS = 8_000;

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
    if (!webhookUrl) {
      return NextResponse.json(
        {
          ok: false,
          message: "Integración de leads no disponible. Configura LEAD_WEBHOOK_URL.",
        },
        { status: 503 }
      );
    }

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), WEBHOOK_TIMEOUT_MS);

    let webhookResponse: Response;
    try {
      webhookResponse = await fetch(webhookUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(leadEvent),
        cache: "no-store",
        signal: controller.signal,
      });
    } catch (error) {
      const timedOut = error instanceof Error && error.name === "AbortError";
      return NextResponse.json(
        {
          ok: false,
          message: timedOut
            ? "Tiempo agotado al enviar tu lead. Intenta nuevamente."
            : "No pudimos enrutar tu lead. Intenta nuevamente.",
        },
        { status: timedOut ? 504 : 502 }
      );
    } finally {
      clearTimeout(timeoutId);
    }

    if (!webhookResponse.ok) {
      return NextResponse.json(
        { ok: false, message: "No pudimos enrutar tu lead. Intenta nuevamente." },
        { status: 502 }
      );
    }

    console.info(
      `[lead-capture] email=${maskEmail(email)} source=${source} page=${page} webhook=on`
    );

    return NextResponse.json({
      ok: true,
      routed: true,
    });
  } catch (error) {
    return NextResponse.json(
      { ok: false, message: "Error inesperado al guardar lead." },
      { status: 500 }
    );
  }
}
