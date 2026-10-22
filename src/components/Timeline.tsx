import type { Booking } from "@/lib/types";

interface TimelineProps {
  bookings: Booking[];
  candidateStart?: number | null;
  candidateEnd?: number | null;
  nowMinutes: number;
}

const DAY_END = 1440;

interface Block {
  start: number;
  end: number;
  kind: "booked" | "candidate";
  label?: string;
}

export function Timeline({ bookings, candidateStart, candidateEnd, nowMinutes }: TimelineProps) {
  const blocks: Block[] = [
    ...bookings.map((b) => ({ start: b.start, end: b.end, kind: "booked" as const, label: b.title })),
  ];
  if (
    candidateStart != null &&
    candidateEnd != null &&
    candidateStart >= 0 &&
    candidateEnd <= DAY_END &&
    candidateStart < candidateEnd
  ) {
    blocks.push({
      start: candidateStart,
      end: candidateEnd,
      kind: "candidate",
      label: "Your slot",
    });
  }

  return (
    <div className="space-y-2">
      <div className="relative h-14 w-full overflow-hidden rounded-lg bg-slate-100 ring-1 ring-slate-200">
        {blocks.map((blk, i) => {
          const leftPct = (blk.start / DAY_END) * 100;
          const widthPct = ((blk.end - blk.start) / DAY_END) * 100;
          return (
            <div
              key={i}
              className={[
                "absolute top-0 bottom-0 flex items-center justify-center overflow-hidden px-1 text-[10px] font-medium text-white whitespace-nowrap transition-all",
                blk.kind === "booked"
                  ? "bg-slate-400"
                  : "bg-emerald-500 ring-2 ring-emerald-300",
              ].join(" ")}
              style={{ left: `${leftPct}%`, width: `${widthPct}%` }}
              title={blk.label}
            >
              {widthPct > 6 ? blk.label : ""}
            </div>
          );
        })}

        <div
          className="absolute top-0 bottom-0 w-0.5 bg-amber-500"
          style={{ left: `${(nowMinutes / DAY_END) * 100}%` }}
        >
          <span className="absolute -top-0 left-1 rounded bg-amber-500 px-1 text-[9px] font-bold text-white">
            NOW
          </span>
        </div>
      </div>

      <div className="flex justify-between text-[10px] font-medium text-slate-400">
        {["00:00", "06:00", "12:00", "18:00", "24:00"].map((t) => (
          <span key={t}>{t}</span>
        ))}
      </div>

      <div className="flex flex-wrap gap-3 text-xs text-slate-500">
        <span className="inline-flex items-center gap-1.5">
          <span className="h-2.5 w-2.5 rounded-sm bg-slate-400" /> Existing booking
        </span>
        <span className="inline-flex items-center gap-1.5">
          <span className="h-2.5 w-2.5 rounded-sm bg-emerald-500" /> Your candidate slot
        </span>
        <span className="inline-flex items-center gap-1.5">
          <span className="h-2.5 w-2.5 rounded-sm bg-amber-500" /> Current time
        </span>
      </div>
    </div>
  );
}
