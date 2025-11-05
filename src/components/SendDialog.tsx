"use client";
import { useEffect, useState } from "react";

type Props = {
  open: boolean;
  onClose: () => void;
  emailId?: string | null;
};

export default function SendDialog({ open, onClose, emailId = null }: Props) {
  const [step, setStep] = useState<number>(emailId ? 2 : 1);
  const [selectedEmailId, setSelectedEmailId] = useState<string | null>(emailId ?? null);

  useEffect(() => {
    setSelectedEmailId(emailId ?? null);
    setStep(emailId ? 2 : 1);
  }, [emailId]);

  const [testRecipient, setTestRecipient] = useState("");
  const [recipients, setRecipients] = useState("");
  const [subjectOverride, setSubjectOverride] = useState("");
  const [scheduleAt, setScheduleAt] = useState<string>("");
  const [utm, setUtm] = useState(true);

  if (!open) return null;

  const close = () => {
    setStep(emailId ? 2 : 1);
    onClose();
  };

  const liveList = recipients.split(/[\n,]/).map(s => s.trim()).filter(Boolean);
  const canSendLive = liveList.length > 0;
  const canSendTest = /\S+@\S+\.\S+/.test(testRecipient);

  return (
    <div className="fixed inset-0 z-40">
      <div className="absolute inset-0 bg-black/40" onClick={close} />
      <div className="absolute left-1/2 top-1/2 w-[min(640px,92vw)] -translate-x-1/2 -translate-y-1/2 rounded-xl bg-white p-6 shadow-lg">

        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-lg font-medium">Send Email</h3>
          <button onClick={close} className="rounded px-3 py-1 text-sm hover:bg-neutral-100">Close</button>
        </div>

        {/* Step crumbs */}
        <ol className="mb-6 flex gap-3 text-xs text-neutral-500">
          <li className={step>=1 ? "text-black" : ""}>1. Choose Email</li>
          <li className={step>=2 ? "text-black" : ""}>2. Recipients</li>
          <li className={step>=3 ? "text-black" : ""}>3. Options</li>
          <li className={step>=4 ? "text-black" : ""}>4. Review</li>
        </ol>

        {/* STEP 1 */}
        {step === 1 && !emailId && (
          <div className="space-y-4">
            <p className="text-sm text-neutral-600">Pick an email from your history (placeholder input for MVP).</p>
            <input
              className="w-full rounded border p-2"
              placeholder="Enter Email ID"
              value={selectedEmailId ?? ""}
              onChange={(e) => setSelectedEmailId(e.target.value)}
            />
            <div className="flex justify-end gap-2">
              <button onClick={close} className="rounded px-4 py-2 text-sm hover:bg-neutral-100">Cancel</button>
              <button
                onClick={() => setStep(2)}
                disabled={!selectedEmailId}
                className={`rounded px-4 py-2 text-sm ${selectedEmailId ? "bg-black text-white" : "bg-neutral-200 text-neutral-500 cursor-not-allowed"}`}
              >
                Continue
              </button>
            </div>
          </div>
        )}

        {/* STEP 2 */}
        {step === 2 && (
          <div className="space-y-4">
            <div className="text-xs text-neutral-500">
              Sending: <span className="font-medium">{selectedEmailId || emailId || "(current draft)"}</span>
            </div>
            <div>
              <label className="block text-sm">Test recipient (optional)</label>
              <input className="mt-1 w-full rounded border p-2" value={testRecipient} onChange={e=>setTestRecipient(e.target.value)} placeholder="you@domain.com" />
            </div>
            <div>
              <label className="block text-sm">Primary recipients (comma or newline)</label>
              <textarea className="mt-1 w-full rounded border p-2" rows={4} value={recipients} onChange={e=>setRecipients(e.target.value)} />
            </div>
            <div className="flex justify-between">
              <button onClick={() => setStep(emailId ? 2 : 1)} className="rounded px-4 py-2 text-sm hover:bg-neutral-100">
                Back
              </button>
              <button onClick={() => setStep(3)} className="rounded bg-black px-4 py-2 text-sm text-white">Continue</button>
            </div>
          </div>
        )}

        {/* STEP 3 */}
        {step === 3 && (
          <div className="space-y-4">
            <label className="block text-sm">
              Subject override (optional)
              <input className="mt-1 w-full rounded border p-2" value={subjectOverride} onChange={e=>setSubjectOverride(e.target.value)} />
            </label>
            <div className="grid gap-4 md:grid-cols-2">
              <label className="block text-sm">
                Schedule (optional)
                <input type="datetime-local" className="mt-1 w-full rounded border p-2" value={scheduleAt} onChange={e=>setScheduleAt(e.target.value)} />
              </label>
              <label className="mt-6 flex items-center gap-2 text-sm md:mt-0">
                <input type="checkbox" checked={utm} onChange={e=>setUtm(e.target.checked)} />
                Add UTM tagging
              </label>
            </div>
            <div className="flex justify-between">
              <button onClick={() => setStep(2)} className="rounded px-4 py-2 text-sm hover:bg-neutral-100">Back</button>
              <button onClick={() => setStep(4)} className="rounded bg-black px-4 py-2 text-sm text-white">Continue</button>
            </div>
          </div>
        )}

        {/* STEP 4 */}
        {step === 4 && (
          <div className="space-y-4">
            <div className="rounded border p-3 text-sm">
              <div><span className="font-medium">Email:</span> {selectedEmailId || emailId || "(current draft)"}</div>
              <div><span className="font-medium">Test:</span> {testRecipient || "—"}</div>
              <div><span className="font-medium">Recipients:</span> {canSendLive ? liveList.join(", ") : "—"}</div>
              <div><span className="font-medium">Subject override:</span> {subjectOverride || "—"}</div>
              <div><span className="font-medium">Schedule:</span> {scheduleAt || "Send now"}</div>
              <div><span className="font-medium">UTM:</span> {utm ? "On" : "Off"}</div>
            </div>
            <div className="flex justify-between">
              <button onClick={() => setStep(3)} className="rounded px-4 py-2 text-sm hover:bg-neutral-100">Back</button>
              <div className="flex gap-2">
                {/* ✅ UPDATED Send Test */}
                <button
                  disabled={!canSendTest}
                  onClick={async () => {
                    if (!testRecipient) return;
                    const res = await fetch("/api/send", {
                      method: "POST",
                      headers: { "Content-Type": "application/json" },
                      body: JSON.stringify({
                        emailId: selectedEmailId || emailId,
                        mode: "test",
                        testRecipient,
                        subjectOverride,
                        scheduleAt: scheduleAt || null,
                        utm,
                      }),
                      credentials: "include",  // <-- important
                    });
                    const data = await res.json();
                    if (res.ok) {
                      alert(`Test ${data.status === "scheduled_test" ? "scheduled" : "sent"} to ${testRecipient}`);
                    } else {
                      alert(data.error || "Failed to send test");
                    }
                  }}
                  className={`rounded px-4 py-2 text-sm border ${canSendTest ? "" : "opacity-50 cursor-not-allowed"}`}
                >
                  Send Test
                </button>

                {/* ✅ UPDATED Send Live */}
                <button
                  disabled={!canSendLive}
                  onClick={async () => {
                    const res = await fetch("/api/send", {
                      method: "POST",
                      headers: { "Content-Type": "application/json" },
                      body: JSON.stringify({
                        emailId: selectedEmailId || emailId,
                        mode: "live",
                        recipients: liveList,
                        subjectOverride,
                        scheduleAt: scheduleAt || null,
                        utm,
                      }),
                      credentials: "include",  // <-- important
                    });
                    const data = await res.json();
                    if (res.status === 402 && data.error === "upgrade_required") {
                      window.location.href = "/pricing";
                      return;
                    }
                    if (res.ok) {
                      alert(data.status === "scheduled" ? "Scheduled!" : "Sent!");
                      close();
                    } else {
                      alert(data.error || "Failed to send");
                    }
                  }}
                  className={`rounded px-4 py-2 text-sm ${canSendLive ? "bg-black text-white" : "bg-neutral-200 text-neutral-500 cursor-not-allowed"}`}
                >
                  Send
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
