"use client";

import { useState } from "react";

export default function WaitlistForm() {
  const [email, setEmail] = useState("");
  const [hp, setHp] = useState(""); // honeypot
  const [status, setStatus] = useState<"idle" | "loading" | "ok" | "err">("idle");
  const [msg, setMsg] = useState("");

  async function joinWaitlist(e: React.FormEvent) {
    e.preventDefault();
    setStatus("loading");
    setMsg("");
    try {
      const res = await fetch("/api/waitlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, hp }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || "Something went wrong");
      setStatus("ok");
      setEmail("");
      setMsg("You're on the list! We’ll email you at launch.");
    } catch (err: any) {
      setStatus("err");
      setMsg(err.message || "Failed to join. Please try again.");
    }
  }

  return (
    <>
      <form onSubmit={joinWaitlist} className="mt-6 flex w-full max-w-md gap-2">
        <input
          type="email"
          required
          placeholder="your@email.com"
          className="flex-1 rounded border px-3 py-2"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        {/* honeypot (hidden via CSS) */}
        <input
          type="text"
          tabIndex={-1}
          autoComplete="off"
          className="hidden"
          value={hp}
          onChange={(e) => setHp(e.target.value)}
        />
        <button
          disabled={status === "loading"}
          className={`rounded px-4 py-2 text-sm text-white ${
            status === "loading" ? "bg-neutral-400" : "bg-black"
          }`}
        >
          {status === "loading" ? "Joining..." : "Join waitlist"}
        </button>
      </form>

      {msg && (
        <p className={`mt-2 text-sm ${status === "ok" ? "text-green-700" : "text-red-600"}`}>
          {msg}
        </p>
      )}
    </>
  );
}
