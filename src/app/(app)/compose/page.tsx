// src/app/(app)/compose/page.tsx
"use client";

import { useEffect, useState } from "react";
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
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
      setForm((prev) => ({ ...prev, [k]: e.target.value }));

  async function handleGenerate() {
    if (plan !== "pro" && typeof left === "number" && left <= 0) {
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

      // optimistic: if you want, refresh remaining after a generate
      // (only matters for Free)
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

  return (
    <div>
      <h1 className="text-2xl font-medium mb-2">Compose</h1>

      {/* small plan/remaining banner */}
      <div className="mb-4 rounded border bg-white p-3 text-sm">
        {plan === "pro" ? (
          <span className="inline-block rounded bg-green-50 px-2 py-1 text-green-700">
            Plan: Pro — unlimited generations
          </span>
        ) : (
          <span className="inline-block rounded bg-amber-50 px-2 py-1 text-amber-700">
            Plan: Free — {left ?? "—"} left today{" "}
            <button
              onClick={() => router.push("/pricing")}
              className="underline ml-1"
            >
              Upgrade
            </button>
          </span>
        )}
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {/* Prompt inputs */}
        <div className="rounded border bg-white p-4 space-y-3">
          <label className="block text-sm">
            Business
            <input
              className="mt-1 w-full rounded border p-2"
              value={form.business}
              onChange={update("business")}
            />
          </label>
          <label className="block text-sm">
            Audience
            <input
              className="mt-1 w-full rounded border p-2"
              value={form.audience}
              onChange={update("audience")}
            />
          </label>
          <label className="block text-sm">
            Goal
            <input
              className="mt-1 w-full rounded border p-2"
              value={form.goal}
              onChange={update("goal")}
            />
          </label>
          <label className="block text-sm">
            Product
            <input
              className="mt-1 w-full rounded border p-2"
              value={form.product}
              onChange={update("product")}
            />
          </label>
          <label className="block text-sm">
            Tone
            <input
              className="mt-1 w-full rounded border p-2"
              value={form.tone}
              onChange={update("tone")}
            />
          </label>
          <label className="block text-sm">
            CTA
            <input
              className="mt-1 w-full rounded border p-2"
              value={form.cta}
              onChange={update("cta")}
            />
          </label>
          <label className="block text-sm">
            Length
            <input
              className="mt-1 w-full rounded border p-2"
              value={form.length}
              onChange={update("length")}
            />
          </label>

          <div className="flex gap-2 pt-2">
            <button
              onClick={handleGenerate}
              disabled={loading || hitCap}
              className={`rounded px-4 py-2 text-sm ${
                loading || hitCap
                  ? "bg-neutral-200 text-neutral-500 cursor-not-allowed"
                  : "bg-black text-white"
              }`}
              title={hitCap ? "You’ve hit today’s free limit" : ""}
            >
              {loading ? "Generating..." : "Generate"}
            </button>

            <button
              onClick={handleSave}
              className="rounded border px-4 py-2 text-sm"
            >
              Save Draft
            </button>

            {/* Send routes to /send with the saved draft id */}
            <button
              onClick={() => {
                if (!emailId) {
                  alert("Save draft first to open Send.");
                  return;
                }
                router.push(`/send?emailId=${emailId}`);
              }}
              className="rounded border px-4 py-2 text-sm"
            >
              Send
            </button>
          </div>

          {genSource && (
            <p className="text-xs text-neutral-500 pt-1">
              Generated via: {genSource}
            </p>
          )}
        </div>

        {/* Output editor */}
        <div className="rounded border bg-white p-4 space-y-3">
          <label className="block text-sm">
            Subject
            <input
              className="mt-1 w-full rounded border p-2"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder="Generated subject"
            />
          </label>
          <label className="block text-sm">
            Body
            <textarea
              className="mt-1 w-full rounded border p-2 min-h-[220px]"
              value={body}
              onChange={(e) => setBody(e.target.value)}
              placeholder="Generated body"
            />
          </label>
          {emailId && (
            <p className="text-xs text-neutral-500">Draft ID: {emailId}</p>
          )}
        </div>
      </div>

      {/* (Kept) Reusable Send popup – currently unused since we route to /send */}
      <SendDialog
        open={sendOpen}
        onClose={() => setSendOpen(false)}
        emailId={emailId ?? undefined}
      />
    </div>
  );
}
