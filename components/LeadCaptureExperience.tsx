"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { CheckCircle2, Mail, X } from "lucide-react";
import { LEAD_CAPTURE, TOKENS } from "@/lib/tokens";

type LeadSource = "inline" | "exit_modal" | "sticky";

interface LeadFormProps {
  email: string;
  whatsapp: string;
  submitting: boolean;
  error: string | null;
  cta: string;
  onEmailChange: (value: string) => void;
  onWhatsappChange: (value: string) => void;
  onSubmit: () => void;
}

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function normalizeWhatsapp(value: string): string {
  return value.replace(/[^\d+]/g, "").slice(0, 20);
}

function LeadForm({
  email,
  whatsapp,
  submitting,
  error,
  cta,
  onEmailChange,
  onWhatsappChange,
  onSubmit,
}: LeadFormProps) {
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <label className="lead-label">{LEAD_CAPTURE.fields.emailLabel}</label>
        <input
          type="email"
          value={email}
          onChange={(event) => onEmailChange(event.target.value)}
          placeholder={LEAD_CAPTURE.fields.emailPlaceholder}
          className="lead-input"
          autoComplete="email"
        />
      </div>

      <div className="space-y-2">
        <label className="lead-label">{LEAD_CAPTURE.fields.whatsappLabel}</label>
        <input
          type="tel"
          value={whatsapp}
          onChange={(event) => onWhatsappChange(event.target.value)}
          placeholder={LEAD_CAPTURE.fields.whatsappPlaceholder}
          className="lead-input"
          autoComplete="tel"
        />
      </div>

      {error ? <p className="text-red-300 text-xs font-mono">{error}</p> : null}

      <button
        type="button"
        onClick={onSubmit}
        disabled={submitting}
        className="btn-glow w-full font-mono font-bold text-xs md:text-sm text-white px-6 py-3 rounded-full tracking-widest transition-all hover:scale-[1.01] active:scale-95 disabled:opacity-65 disabled:cursor-not-allowed"
      >
        {submitting ? "ENVIANDO..." : cta}
      </button>
    </div>
  );
}

export default function LeadCaptureExperience() {
  const [email, setEmail] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [leadCaptured, setLeadCaptured] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [activeModalSource, setActiveModalSource] = useState<LeadSource>("sticky");

  useEffect(() => {
    if (typeof window === "undefined") return;
    const wasCaptured = window.localStorage.getItem("ngx_lead_captured") === "1";
    if (wasCaptured) setLeadCaptured(true);
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (leadCaptured) return;
    if (window.innerWidth < 1024) return;
    if (window.localStorage.getItem("ngx_exit_modal_dismissed") === "1") return;

    let armed = false;
    const timerId = window.setTimeout(() => {
      armed = true;
    }, 12000);

    const onMouseOut = (event: MouseEvent) => {
      if (!armed || modalOpen) return;
      if (event.clientY <= 8) {
        setActiveModalSource("exit_modal");
        setModalOpen(true);
        window.removeEventListener("mouseout", onMouseOut);
      }
    };

    window.addEventListener("mouseout", onMouseOut);

    return () => {
      window.clearTimeout(timerId);
      window.removeEventListener("mouseout", onMouseOut);
    };
  }, [leadCaptured, modalOpen]);

  const submitLead = useCallback(async (source: LeadSource) => {
    const trimmedEmail = email.trim().toLowerCase();
    const normalizedWhatsapp = normalizeWhatsapp(whatsapp.trim());

    if (!EMAIL_REGEX.test(trimmedEmail)) {
      setError("Ingresa un correo válido para recibir tu plan.");
      return;
    }

    setSubmitting(true);
    setError(null);

    try {
      const response = await fetch("/api/lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: trimmedEmail,
          whatsapp: normalizedWhatsapp || undefined,
          source,
          page: typeof window !== "undefined" ? window.location.pathname : "/",
        }),
      });

      if (!response.ok) {
        const payload = await response.json().catch(() => null);
        setError(payload?.message ?? "No pudimos guardar tu lead. Intenta nuevamente.");
        return;
      }

      setLeadCaptured(true);
      setModalOpen(false);
      if (typeof window !== "undefined") {
        window.localStorage.setItem("ngx_lead_captured", "1");
      }
    } catch {
      setError("Hubo un problema de conexión. Intenta nuevamente.");
    } finally {
      setSubmitting(false);
    }
  }, [email, whatsapp]);

  const closeModal = useCallback(() => {
    setModalOpen(false);
    if (typeof window !== "undefined") {
      window.localStorage.setItem("ngx_exit_modal_dismissed", "1");
    }
  }, []);

  const stickyVisible = useMemo(() => !leadCaptured && !modalOpen, [leadCaptured, modalOpen]);

  return (
    <>
      <div
        className="vite-section vite-frame relative overflow-hidden"
        style={{ background: TOKENS.bg }}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-vite/10 via-transparent to-vite/5 pointer-events-none" />
        <div className="max-w-content mx-auto px-6 md:px-10 py-20 md:py-24 relative z-10">
          <div className="liquid-card rounded-2xl p-6 md:p-10 max-w-4xl mx-auto">
            <p className="vite-label text-white/45 mb-4">{LEAD_CAPTURE.inlineTag}</p>
            <h3 className="vite-h2 text-white mb-4" style={{ fontSize: "clamp(22px, 3vw, 34px)" }}>
              {LEAD_CAPTURE.inlineTitle}
            </h3>
            <p className="text-white/65 text-sm md:text-base mb-6 max-w-2xl">
              {LEAD_CAPTURE.inlineBody}
            </p>

            {leadCaptured ? (
              <div className="lead-success-card">
                <CheckCircle2 className="text-vite" size={20} />
                <div>
                  <p className="font-mono text-white text-sm md:text-base">{LEAD_CAPTURE.successTitle}</p>
                  <p className="text-white/65 text-xs md:text-sm mt-1">{LEAD_CAPTURE.successBody}</p>
                </div>
              </div>
            ) : (
              <>
                <LeadForm
                  email={email}
                  whatsapp={whatsapp}
                  submitting={submitting}
                  error={error}
                  cta={LEAD_CAPTURE.inlineCta}
                  onEmailChange={setEmail}
                  onWhatsappChange={setWhatsapp}
                  onSubmit={() => void submitLead("inline")}
                />
                <p className="text-[11px] text-white/35 mt-4">{LEAD_CAPTURE.legal}</p>
              </>
            )}

            <p className="font-mono text-[11px] text-vite/75 mt-4 tracking-widest uppercase">{LEAD_CAPTURE.inlineSub}</p>
          </div>
        </div>
      </div>

      {stickyVisible ? (
        <button
          type="button"
          onClick={() => {
            setActiveModalSource("sticky");
            setModalOpen(true);
          }}
          className="lead-sticky-btn md:hidden"
        >
          <Mail size={14} />
          <span>{LEAD_CAPTURE.stickyCta}</span>
        </button>
      ) : null}

      <AnimatePresence>
        {modalOpen && !leadCaptured ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[120] flex items-center justify-center p-4"
          >
            <button
              type="button"
              className="absolute inset-0 bg-black/75 backdrop-blur-sm"
              onClick={closeModal}
              aria-label="Cerrar"
            />
            <motion.div
              initial={{ y: 20, opacity: 0, scale: 0.98 }}
              animate={{ y: 0, opacity: 1, scale: 1 }}
              exit={{ y: 20, opacity: 0, scale: 0.98 }}
              className="relative w-full max-w-lg lead-modal-card"
            >
              <button
                type="button"
                onClick={closeModal}
                className="absolute top-4 right-4 text-white/70 hover:text-white transition-colors"
                aria-label="Cerrar modal"
              >
                <X size={18} />
              </button>
              <p className="vite-label text-white/40 mb-3">{LEAD_CAPTURE.inlineTag}</p>
              <h4 className="vite-h2 text-white mb-3" style={{ fontSize: "clamp(20px, 4vw, 30px)" }}>
                {LEAD_CAPTURE.modalTitle}
              </h4>
              <p className="text-white/65 text-sm mb-6">{LEAD_CAPTURE.modalBody}</p>

              <LeadForm
                email={email}
                whatsapp={whatsapp}
                submitting={submitting}
                error={error}
                cta={LEAD_CAPTURE.modalCta}
                onEmailChange={setEmail}
                onWhatsappChange={setWhatsapp}
                onSubmit={() => void submitLead(activeModalSource)}
              />
              <p className="text-[11px] text-white/35 mt-4">{LEAD_CAPTURE.legal}</p>
            </motion.div>
          </motion.div>
        ) : null}
      </AnimatePresence>

    </>
  );
}
