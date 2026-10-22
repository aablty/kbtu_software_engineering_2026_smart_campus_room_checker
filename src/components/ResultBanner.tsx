import type { CheckResult } from "@/lib/types";
import { CheckCircle2, XCircle } from "lucide-react";

interface ResultBannerProps {
  result: CheckResult | null;
}

export function ResultBanner({ result }: ResultBannerProps) {
  if (!result) {
    return (
      <div className="rounded-xl border border-dashed border-slate-300 bg-slate-50 p-4 text-center text-sm text-slate-400">
        Select a room and enter a time interval to check availability.
      </div>
    );
  }

  const isAvailable = result.decision === "available";

  return (
    <div
      role="status"
      aria-live="polite"
      className={[
        "flex items-start gap-3 rounded-xl border p-4 transition-all duration-200",
        isAvailable
          ? "border-emerald-300 bg-emerald-50"
          : "border-red-300 bg-red-50",
      ].join(" ")}
    >
      {isAvailable ? (
        <CheckCircle2 className="h-5 w-5 shrink-0 text-emerald-600" />
      ) : (
        <XCircle className="h-5 w-5 shrink-0 text-red-600" />
      )}
      <div className="min-w-0">
        <p
          className={[
            "font-bold text-base",
            isAvailable ? "text-emerald-700" : "text-red-700",
          ].join(" ")}
        >
          {isAvailable ? "Available" : "Unavailable"}
        </p>
        <p
          className={[
            "text-sm",
            isAvailable ? "text-emerald-600" : "text-red-600",
          ].join(" ")}
        >
          {result.reason}
        </p>
      </div>
    </div>
  );
}
