// src/app/(app)/compose/page.tsx
"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import SendDialog from "@/components/SendDialog";

type GenPayload = {
  business: string;
  audience: string;
  goal: string;
  product: string;
  tone: string;
  cta: string;
  length: string;
};

const SPAMMY = ["free!!!", "act now", "click here", "limited time", "guaranteed"];

export default function ComposePage() {
  const [form, setForm] = useState<GenPayload>({
    business: "",
    audience: "",
    goal: "",
    product: "",
    tone: "friendly",
    cta: "Learn more",
    length: "short",
  });

  const [subject, setSubject] = useState("");
  const [body, setBody] = useState("");
  const [emailId, setEmailId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [sendOpen, setSendOpen] = useState(false);
  const [genSource, setGenSource] = useState<"openai" | "mock" | "">("");

  // plan/limit banner
  const [plan, setPlan] = useState<"free" | "pro" | "unknown">("unknown");
  const [left, setLeft] = useState<number | null>(null);

  const router = useRouter();

  // load daily remaining + plan for banner and generate gating
  useEffect(() => {
    (async () => {
      try {
        const r = await fetch("/api/limits", { cache: "no-store" });
        if (!r.ok) throw new Error("Failed to load limits");
        const data = (await r.json()) as { plan: "free" | "pro"; left: number };
        setPlan(data.plan);
        setLeft(data.left);
      } catch {
        setPlan("free");
        setLeft(null);
      }
    })();
  }, []);

  const update =
    (k: keyof GenPayload) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
      setForm((prev) => ({ ...prev, [k]: e.target.value }));

  async function handleGenerate() {
    const hitCap = plan !== "pro" && typeof left === "number" && left <= 0;
    if (hitCap) {
      alert("You’ve hit today’s free limit. Upgrade for unlimited generations.");
      router.push("/pricing");
      return;
    }
    try {
      setLoading(true);
      setEmailId(null); // new draft after each generate
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Generate failed");
      setSubject(data.subject || "");
      setBody(data.body || "");
      setGenSource((data.source as any) || "");

      // refresh remaining for Free users
      if (plan !== "pro") {
        try {
          const r = await fetch("/api/limits", { cache: "no-store" });
          if (r.ok) {
            const d = (await r.json()) as { plan: "free" | "pro"; left: number };
            setPlan(d.plan);
            setLeft(d.left);
          }
        } catch {}
      }
    } catch (e: any) {
      alert(e.message || "Failed to generate");
    } finally {
      setLoading(false);
    }
  }

  async function handleSave() {
    try {
      if (!subject.trim() || !body.trim()) {
        alert("Generate content first.");
        return;
      }
      const res = await fetch("/api/emails", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ emailId, subject, body }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Save failed");
      setEmailId(data.emailId);
      alert("Draft saved.");
    } catch (e: any) {
      alert(e.message || "Failed to save");
    }
  }

  const hitCap = plan !== "pro" && typeof left === "number" && left <= 0;

  // --- Pre-Send Checker (client-only heuristics) ---
  const checks = useMemo(() => {
    const issues: { ok: boolean; label: string; help?: string }[] = [];

    // Subject length (words)
    const words = subject.trim() ? subject.trim().split(/\s+/).length : 0;
    const goodLen = words >= 6 && words <= 10;
    issues.push({
      ok: goodLen,
      label: goodLen ? "Subject length: good (6–10 words)" : `Subject length: ${words || 0} words`,
      help: goodLen ? undefined : "Aim for 6–10 words to improve opens.",
    });

    // Spammy phrases
    const foundSpam = SPAMMY.some((s) => subject.toLowerCase().includes(s));
    issues.push({
      ok: !foundSpam,
      label: "No spammy phrases in subject",
      help: foundSpam ? "Avoid phrases like “act now”, “click here”, “free!!!”" : undefined,
    });

    // Unsubscribe presence (very lightweight hint)
    const unsub = /unsubscribe|preferences|opt out/i.test(body);
    issues.push({
      ok: unsub,
      label: "Unsubscribe or preferences link mentioned",
      help: unsub ? undefined : "Add an unsubscribe/preference line at the bottom.",
    });

    return issues;
  }, [subject, body]);

  return (
    <main className="min-h-screen bg-background text-text-primary">
      {/* Page header */}
      <div className="mx-auto max-w-6xl px-4 pt-8 pb-4 flex items-center justify-between">
        <h1 className="text-2xl md:text-3xl font-semibold tracking-tight">Compose</h1>

        {/* Plan badge (matches dashboard look) */}
        <div className="flex items-center gap-2">
          {plan === "pro" ? (
            <span className="inline-flex items-center rounded-full border border-borderc bg-surface px-3 py-1 text-sm">
              <span className="mr-2 h-2 w-2 rounded-full bg-brand-600" />
              Pro · Unlimited generations
            </span>
          ) : (
            <span className="inline-flex items-center gap-2 text-sm">
              <span className="rounded-full border border-borderc bg-surface px-3 py-1">
                Free · {left ?? "—"} left today
              </span>
              <button
                onClick={() => router.push("/pricing")}
                className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-brand-600 to-accent text-white px-4 py-1.5 text-sm shadow-sm hover:opacity-90 transition"
              >
                Upgrade
              </button>
            </span>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="mx-auto max-w-6xl px-4 pb-16 grid gap-6 md:grid-cols-2">
        {/* Prompt panel */}
        <section className="rounded-3xl border border-borderc bg-surface p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm uppercase tracking-widest text-text-muted">Prompt</div>
              <div className="text-sm text-text-muted">We’ll apply what worked best in your past sends.</div>
            </div>
          </div>

          <label className="block text-sm">
            Business / Brand
            <input
              className="mt-1 w-full rounded-xl border border-borderc bg-white px-3 py-2"
              value={form.business}
              onChange={update("business")}
              placeholder="Acme Co."
            />
          </label>

          <label className="block text-sm">
            Audience / Segment
            <input
              className="mt-1 w-full rounded-xl border border-borderc bg-white px-3 py-2"
              value={form.audience}
              onChange={update("audience")}
              placeholder="Returning customers, new subscribers, etc."
            />
          </label>

          <label className="block text-sm">
            Goal
            <input
              className="mt-1 w-full rounded-xl border border-borderc bg-white px-3 py-2"
              value={form.goal}
              onChange={update("goal")}
              placeholder="Product launch, retention, sales push, announcement…"
            />
          </label>

          <label className="block text-sm">
            Product / Offer
            <input
              className="mt-1 w-full rounded-xl border border-borderc bg-white px-3 py-2"
              value={form.product}
              onChange={update("product")}
              placeholder="e.g., Winter Jacket, 20% off bundle"
            />
          </label>

          <div className="grid grid-cols-3 gap-3">
            <label className="block text-sm col-span-1">
              Tone
              <select
                className="mt-1 w-full rounded-xl border border-borderc bg-white px-3 py-2"
                value={form.tone}
                onChange={update("tone")}
              >
                <option value="friendly">Friendly</option>
                <option value="professional">Professional</option>
                <option value="bold">Bold</option>
                <option value="minimal">Minimal</option>
              </select>
            </label>

            <label className="block text-sm col-span-1">
              CTA
              <input
                className="mt-1 w-full rounded-xl border border-borderc bg-white px-3 py-2"
                value={form.cta}
                onChange={update("cta")}
                placeholder="Shop now, Learn more, Get offer…"
              />
            </label>

            <label className="block text-sm col-span-1">
              Length
              <select
                className="mt-1 w-full rounded-xl border border-borderc bg-white px-3 py-2"
                value={form.length}
                onChange={update("length")}
              >
                <option value="short">Short</option>
                <option value="medium">Medium</option>
                <option value="long">Long</option>
              </select>
            </label>
          </div>

          <div className="flex flex-wrap gap-2 pt-2">
            <button
              onClick={handleGenerate}
              disabled={loading || hitCap}
              title={hitCap ? "You’ve hit today’s free limit" : ""}
              className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm shadow-sm transition ${
                loading || hitCap
                  ? "bg-neutral-200 text-neutral-500 cursor-not-allowed"
                  : "bg-gradient-to-r from-brand-600 to-accent text-white hover:opacity-90"
              }`}
            >
              {loading ? "Generating…" : "✏️ Generate email"}
            </button>

            <button
              onClick={handleSave}
              className="inline-flex items-center gap-2 rounded-full border border-borderc bg-background px-4 py-2 text-sm hover:bg-surface"
            >
              Save draft
            </button>

            <button
              onClick={() => {
                if (!emailId) {
                  alert("Save draft first to open Send.");
                  return;
                }
                router.push(`/send?emailId=${emailId}`);
              }}
              className="inline-flex items-center gap-2 rounded-full border border-borderc bg-background px-4 py-2 text-sm hover:bg-surface"
            >
              Continue to send →
            </button>
          </div>

          {genSource && (
            <p className="text-xs text-text-muted pt-1">Generated via: {genSource}</p>
          )}
        </section>

        {/* Output + Pre-Send Checker */}
        <section className="rounded-3xl border border-borderc bg-white p-6 space-y-5 shadow-sm">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold">Draft</h2>
            <span className="text-xs text-text-muted">Edit inline as needed</span>
          </div>

          <label className="block text-sm">
            Subject
            <input
              className="mt-1 w-full rounded-xl border border-borderc bg-white px-3 py-2"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder="Generated subject"
            />
          </label>

          <label className="block text-sm">
            Body
            <textarea
              className="mt-1 w-full rounded-xl border border-borderc bg-white px-3 py-2 min-h-[260px]"
              value={body}
              onChange={(e) => setBody(e.target.value)}
              placeholder="Generated body"
            />
          </label>

          {/* Pre-Send Checker */}
          <div className="rounded-2xl border border-borderc bg-surface p-4">
            <div className="text-sm font-semibold mb-2">Pre-send checker</div>
            <ul className="space-y-1 text-sm">
              {checks.map((c, i) => (
                <li key={i} className="flex items-start gap-2">
                  <span className={`mt-0.5 inline-block h-3 w-3 rounded-full ${c.ok ? "bg-green-500" : "bg-amber-500"}`} />
                  <div>
                    <div className={c.ok ? "text-text-primary" : "text-text-primary"}>
                      {c.label}
                    </div>
                    {c.help && <div className="text-text-muted text-xs">{c.help}</div>}
                  </div>
                </li>
              ))}
            </ul>
          </div>

          {emailId && (
            <p className="text-xs text-text-muted">Draft ID: {emailId}</p>
          )}
        </section>
      </div>

      {/* (Kept) Reusable Send popup – currently unused since we route to /send */}
      <SendDialog open={sendOpen} onClose={() => setSendOpen(false)} emailId={emailId ?? undefined} />
    </main>
  );
}
