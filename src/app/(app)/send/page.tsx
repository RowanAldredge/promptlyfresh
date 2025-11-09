// src/app/(app)/send/page.tsx
"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

type Draft = {
  id: string;
  subject: string;
  body: string;
};

export default function SendPage() {
  const router = useRouter();
  const params = useSearchParams();
  const emailId = params.get("emailId") || "";

  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [sending, setSending] = useState(false);
  const [testing, setTesting] = useState(false);

  // Draft content
  const [draft, setDraft] = useState<Draft | null>(null);
  const [subject, setSubject] = useState("");
  const [body, setBody] = useState("");

  // Delivery settings
  const [fromName, setFromName] = useState("");
  const [fromEmail, setFromEmail] = useState("");
  const [replyTo, setReplyTo] = useState("");
  const [mode, setMode] = useState<"now" | "schedule">("now");
  const [scheduleAt, setScheduleAt] = useState<string>("");

  // Load draft + default sender settings
  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        // fetch draft
        if (emailId) {
          const r = await fetch(`/api/emails?id=${encodeURIComponent(emailId)}`, {
            cache: "no-store",
          });
          const data = await r.json();
          if (!r.ok) throw new Error(data.error || "Failed to load draft");
          setDraft({ id: data.id, subject: data.subject, body: data.body });
          setSubject(data.subject || "");
          setBody(data.body || "");
        }
        // fetch user sender defaults (optional endpoint you provide)
        try {
          const rs = await fetch("/api/user/sender", { cache: "no-store" });
          if (rs.ok) {
            const d = await rs.json();
            setFromName(d.fromName ?? "");
            setFromEmail(d.fromEmail ?? "");
            setReplyTo(d.replyTo ?? "");
          }
        } catch {}
      } catch (e: any) {
        alert(e.message || "Failed to load send page");
      } finally {
        setLoading(false);
      }
    })();
  }, [emailId]);

  // Simple guards
  const canSend = useMemo(() => {
    if (!subject.trim() || !body.trim() || !fromEmail.trim()) return false;
    if (mode === "schedule" && !scheduleAt) return false;
    return true;
  }, [subject, body, fromEmail, mode, scheduleAt]);

  async function saveEdits() {
    try {
      if (!draft?.id) return;
      setSaving(true);
      const res = await fetch("/api/emails", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ emailId: draft.id, subject, body }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Save failed");
      // keep id just in case it changed server-side
      setDraft({ id: data.emailId || draft.id, subject, body });
    } catch (e: any) {
      alert(e.message || "Failed to save draft");
    } finally {
      setSaving(false);
    }
  }

  async function handleSendTest() {
    try {
      if (!draft?.id) {
        alert("No draft loaded.");
        return;
      }
      if (!fromEmail.trim()) {
        alert("Please add a From email.");
        return;
      }
      setTesting(true);
      // ensure edits saved first
      await saveEdits();

      const res = await fetch("/api/send-test", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          emailId: draft.id,
          subject,
          body,
          fromName,
          fromEmail,
          replyTo,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to send test");
      alert("Test email sent!");
    } catch (e: any) {
      alert(e.message || "Failed to send test");
    } finally {
      setTesting(false);
    }
  }

  async function handleSend() {
    try {
      if (!draft?.id) {
        alert("No draft loaded.");
        return;
      }
      if (!canSend) {
        alert("Please complete the required fields.");
        return;
      }
      setSending(true);
      // ensure edits saved first
      await saveEdits();

      const res = await fetch("/api/send-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          emailId: draft.id,
          subject,
          body,
          fromName,
          fromEmail,
          replyTo,
          mode,
          scheduleAt: mode === "schedule" ? scheduleAt : undefined,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to send");

      // Redirect to analytics for that campaign if provided
      if (data.campaignId) {
        router.push(`/analytics?campaignId=${encodeURIComponent(data.campaignId)}`);
      } else {
        router.push(`/analytics`);
      }
    } catch (e: any) {
      alert(e.message || "Failed to send");
    } finally {
      setSending(false);
    }
  }

  return (
    <main className="min-h-screen bg-background text-text-primary">
      {/* Page header */}
      <div className="mx-auto max-w-6xl px-4 pt-8 pb-4 flex items-center justify-between">
        <h1 className="text-2xl md:text-3xl font-semibold tracking-tight">Review & Send</h1>
        <div className="text-sm text-text-muted">
          {loading ? "Loading…" : draft ? `Draft #${draft.id}` : "No draft loaded"}
        </div>
      </div>

      <div className="mx-auto max-w-6xl px-4 pb-16 grid gap-6 md:grid-cols-[1.15fr,0.85fr]">
        {/* Preview / Editor */}
        <section className="rounded-3xl border border-borderc bg-white p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold">Email preview</h2>
            <button
              onClick={saveEdits}
              disabled={!draft || saving}
              className={`inline-flex items-center gap-2 rounded-full border border-borderc bg-background px-4 py-2 text-sm hover:bg-surface ${
                saving ? "opacity-60 cursor-not-allowed" : ""
              }`}
            >
              {saving ? "Saving…" : "Save edits"}
            </button>
          </div>

          <label className="block text-sm">
            Subject
            <input
              className="mt-1 w-full rounded-xl border border-borderc bg-white px-3 py-2"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder="Subject line"
            />
          </label>

          <label className="block text-sm">
            Body
            <textarea
              className="mt-1 w-full rounded-xl border border-borderc bg-white px-3 py-2 min-h-[280px]"
              value={body}
              onChange={(e) => setBody(e.target.value)}
              placeholder="Email body"
            />
          </label>

          {/* Tiny helper hint */}
          <p className="text-xs text-text-muted">
            Tip: Keep subject lines ~7 words and front-load the benefit.
          </p>
        </section>

        {/* Settings / Actions */}
        <aside className="space-y-6">
          <section className="rounded-3xl border border-borderc bg-surface p-6">
            <div className="text-sm uppercase tracking-widest text-text-muted">
              Sender settings
            </div>

            <label className="block text-sm mt-3">
              From name
              <input
                className="mt-1 w-full rounded-xl border border-borderc bg-white px-3 py-2"
                value={fromName}
                onChange={(e) => setFromName(e.target.value)}
                placeholder="Acme Co."
              />
            </label>

            <label className="block text-sm mt-3">
              From email
              <input
                className="mt-1 w-full rounded-xl border border-borderc bg-white px-3 py-2"
                value={fromEmail}
                onChange={(e) => setFromEmail(e.target.value)}
                placeholder="newsletter@acme.com"
              />
            </label>

            <label className="block text-sm mt-3">
              Reply-To (optional)
              <input
                className="mt-1 w-full rounded-xl border border-borderc bg-white px-3 py-2"
                value={replyTo}
                onChange={(e) => setReplyTo(e.target.value)}
                placeholder="support@acme.com"
              />
            </label>
          </section>

          <section className="rounded-3xl border border-borderc bg-surface p-6">
            <div className="text-sm uppercase tracking-widest text-text-muted">
              Delivery
            </div>

            <div className="mt-3 flex items-center gap-4">
              <label className="inline-flex items-center gap-2 text-sm">
                <input
                  type="radio"
                  className="accent-brand-600"
                  checked={mode === "now"}
                  onChange={() => setMode("now")}
                />
                Send now
              </label>
              <label className="inline-flex items-center gap-2 text-sm">
                <input
                  type="radio"
                  className="accent-brand-600"
                  checked={mode === "schedule"}
                  onChange={() => setMode("schedule")}
                />
                Schedule
              </label>
            </div>

            {mode === "schedule" && (
              <div className="mt-3">
                <input
                  type="datetime-local"
                  className="w-full rounded-xl border border-borderc bg-white px-3 py-2"
                  value={scheduleAt}
                  onChange={(e) => setScheduleAt(e.target.value)}
                />
                <p className="mt-1 text-xs text-text-muted">
                  We’ll queue the campaign and send it at your selected time.
                </p>
              </div>
            )}
          </section>

          {/* Actions */}
          <section className="rounded-3xl border border-borderc bg-white p-6 shadow-sm">
            <div className="flex flex-col gap-3">
              <button
                onClick={handleSend}
                disabled={!canSend || sending}
                className={`inline-flex items-center justify-center gap-2 rounded-full px-4 py-2 text-sm shadow-sm transition ${
                  !canSend || sending
                    ? "bg-neutral-200 text-neutral-500 cursor-not-allowed"
                    : "bg-gradient-to-r from-brand-600 to-accent text-white hover:opacity-90"
                }`}
              >
                {sending ? "Sending…" : mode === "now" ? "Send email" : "Schedule send"}
              </button>

              <button
                onClick={handleSendTest}
                disabled={testing}
                className="inline-flex items-center justify-center gap-2 rounded-full border border-borderc bg-background px-4 py-2 text-sm hover:bg-surface"
              >
                {testing ? "Sending test…" : "Send test to myself"}
              </button>

              <button
                onClick={() => router.push("/compose")}
                className="inline-flex items-center justify-center gap-2 rounded-full border border-borderc bg-background px-4 py-2 text-sm hover:bg-surface"
              >
                ← Back to compose
              </button>
            </div>

            {/* Safety note */}
            <p className="mt-3 text-xs text-text-muted">
              Make sure your email includes an unsubscribe or preferences link.
            </p>
          </section>
        </aside>
      </div>
    </main>
  );
}
