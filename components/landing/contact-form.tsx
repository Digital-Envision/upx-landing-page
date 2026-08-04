"use client";

import { useState } from "react";
import type { LandingPageContent } from "@/lib/landing/content";
import { MessageIcon, PaperIcon, ProfileIcon, WorkIcon } from "./figma-icons";
import { CtaButton } from "./ui";

type Status = "idle" | "sending" | "sent" | "error";

/**
 * Each Iconly glyph has its own aspect, and the design sizes them individually
 * inside a 25.714px box rather than stretching them to a square.
 */
type IconSpec = { Icon: React.ComponentType<React.SVGProps<SVGSVGElement>>; w: number; h: number };

const FIELD_ICONS = {
  profile: { Icon: ProfileIcon, w: 17.14, h: 21.43 },
  message: { Icon: MessageIcon, w: 21.43, h: 19.29 },
  work: { Icon: WorkIcon, w: 21.43, h: 21.43 },
  paper: { Icon: PaperIcon, w: 18.42, h: 21.67 },
} as const satisfies Record<string, IconSpec>;

/** Optional-field icons, resolved here because components can't cross the
 *  server/client boundary as props. */
const EXTRA_FIELD_ICONS = { userGroup: FIELD_ICONS.profile } as const;

/**
 * The icon is positioned over the control rather than sitting beside it, so the
 * padding belongs to the input itself — that keeps the whole field a single
 * touch target of adequate height. The 58px inset is the design's 16px padding
 * + 26px icon box + 16px gap.
 */
function Field({ icon, children }: { icon: IconSpec; children: React.ReactNode }) {
  const { Icon, w, h } = icon;
  return (
    <label className="relative block rounded-[13px] bg-white focus-within:ring-2 focus-within:ring-lp-blue/40">
      <span className="pointer-events-none absolute left-4 top-4 flex size-[26px] items-center justify-center text-lp-navy">
        <Icon width={w} height={h} />
      </span>
      {children}
    </label>
  );
}

const inputClass =
  "block w-full border-0 bg-transparent py-4 pl-[58px] pr-4 text-[16px] text-lp-navy outline-none placeholder:text-lp-navy/70";

export function ContactForm({
  content,
  slug,
  ctaLabel,
}: {
  content: LandingPageContent["form"];
  slug: string;
  ctaLabel: string;
}) {
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState<string | null>(null);
  const ExtraIcon = content.extraField ? EXTRA_FIELD_ICONS[content.extraField.icon] : null;

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("sending");
    setError(null);

    const form = event.currentTarget;
    const payload = Object.fromEntries(new FormData(form).entries());

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...payload, source: slug }),
      });
      if (!res.ok) {
        const body = (await res.json().catch(() => null)) as { error?: string } | null;
        throw new Error(body?.error ?? "Something went wrong. Please try again.");
      }
      form.reset();
      setStatus("sent");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong. Please try again.");
      setStatus("error");
    }
  }

  if (status === "sent") {
    return (
      <div className="rounded-3xl bg-[#f4f6ff] p-8 text-center shadow-xl">
        <h3 className="text-[22px] font-semibold text-lp-navy">Thanks — we&rsquo;ve got it.</h3>
        <p className="mt-3 text-[16px] font-medium leading-[26px] text-lp-slate">
          One of our team will reply within one business day.
        </p>
        <button
          type="button"
          onClick={() => setStatus("idle")}
          className="mt-6 text-[14px] font-semibold text-lp-blue underline underline-offset-4"
        >
          Send another enquiry
        </button>
      </div>
    );
  }

  return (
    <div className="rounded-3xl bg-[#f4f6ff] px-6 py-6 shadow-xl sm:px-8">
      <h3 className="text-[22px] font-semibold text-lp-navy sm:text-[24px]">Contact Our Team</h3>

      <form onSubmit={onSubmit} className="mt-6 flex flex-col gap-4" noValidate={false}>
        {/* Honeypot — real people never fill this in. */}
        <input
          type="text"
          name="website"
          tabIndex={-1}
          autoComplete="off"
          aria-hidden="true"
          className="hidden"
        />

        <Field icon={FIELD_ICONS.profile}>
          <input
            className={inputClass}
            name="fullName"
            type="text"
            required
            autoComplete="name"
            maxLength={120}
            placeholder="Full Name*"
            aria-label="Full name (required)"
          />
        </Field>

        <Field icon={FIELD_ICONS.message}>
          <input
            className={inputClass}
            name="email"
            type="email"
            required
            autoComplete="email"
            maxLength={200}
            placeholder="Business Email*"
            aria-label="Business email (required)"
          />
        </Field>

        <Field icon={FIELD_ICONS.work}>
          <input
            className={inputClass}
            name="company"
            type="text"
            autoComplete="organization"
            maxLength={160}
            placeholder="Company Name"
            aria-label="Company name"
          />
        </Field>

        {content.extraField && ExtraIcon ? (
          <Field icon={ExtraIcon}>
            <input
              className={inputClass}
              name={content.extraField.name}
              type="text"
              maxLength={200}
              placeholder={content.extraField.label}
              aria-label={content.extraField.label}
            />
          </Field>
        ) : null}

        <Field icon={FIELD_ICONS.paper}>
          <textarea
            className={`${inputClass} min-h-[148px] resize-y`}
            name="details"
            rows={5}
            maxLength={4000}
            placeholder={content.detailsLabel}
            aria-label={content.detailsLabel}
          />
        </Field>

        {error ? (
          <p role="alert" className="text-[14px] font-medium text-[#c2373f]">
            {error}
          </p>
        ) : null}

        <CtaButton type="submit" disabled={status === "sending"} className="mt-2 self-start">
          {status === "sending" ? "Sending…" : ctaLabel}
        </CtaButton>
      </form>
    </div>
  );
}
