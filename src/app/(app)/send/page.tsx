"use client";
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import SendDialog from "@/components/SendDialog";

export default function SendPage() {
  const [open, setOpen] = useState(false);
  const params = useSearchParams();
  const emailId = params.get("emailId") || undefined;

  useEffect(() => setOpen(true), []); // auto-open

  return (
    <div>
      <h1 className="text-2xl font-medium mb-2">Send</h1>
      <button className="rounded border px-4 py-2 text-sm" onClick={() => setOpen(true)}>
        Open Send popup
      </button>

      {/* 👇 forward the id to the dialog */}
      <SendDialog open={open} onClose={() => setOpen(false)} emailId={emailId} />
    </div>
  );
}
