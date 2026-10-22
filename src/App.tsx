import { useMemo, useState } from "react";
import { CalendarClock, Clock, DoorOpen, Search } from "lucide-react";

import { RoomCard } from "@/components/RoomCard";
import { ResultBanner } from "@/components/ResultBanner";
import { Timeline } from "@/components/Timeline";
import { RoomBookings } from "@/components/RoomBookings";

import { rooms as sampleRooms } from "@/lib/sampleData";
import { checkAvailability, formatTime } from "@/lib/availability";
import type { CheckResult, Room } from "@/lib/types";
import { MAX_DURATION } from "@/lib/types";

function nowDefault(): number {
  const d = new Date();
  return d.getHours() * 60 + d.getMinutes();
}

function defaultInterval(now: number): { start: string; end: string } {
  let start = now + 30;
  let end = start + 60;
  if (end > 1440) {
    end = 1440;
    start = end - 60;
  }
  if (start <= now) {
    start = now + 1;
    end = Math.min(start + 60, 1440);
  }
  return { start: formatTime(start), end: formatTime(end) };
}

function App() {
  const [rooms] = useState<Room[]>(sampleRooms);
  const [selectedId, setSelectedId] = useState<string>(rooms[0].id);
  const [nowMinutes, setNowMinutes] = useState<number>(nowDefault);
  const [startInput, setStartInput] = useState<string>(() => defaultInterval(nowMinutes).start);
  const [endInput, setEndInput] = useState<string>(() => defaultInterval(nowMinutes).end);
  const [result, setResult] = useState<CheckResult | null>(null);

  const selectedRoom = useMemo(
    () => rooms.find((r) => r.id === selectedId) ?? rooms[0],
    [rooms, selectedId],
  );

  const startMinutes = timeToMinutes(startInput);
  const endMinutes = timeToMinutes(endInput);
  const duration =
    startMinutes != null && endMinutes != null ? endMinutes - startMinutes : null;

  const handleCheck = () => {
    if (startMinutes == null) {
      setResult({
        decision: "unavailable",
        reason: "Please enter valid start and end times.",
      });
      return;
    }
    if (endMinutes == null) {
      setResult({
        decision: "unavailable",
        reason: "Enter the end time in HH:MM format. Use 24:00 for end of day.",
      });
      return;
    }
    const res = checkAvailability(selectedRoom, startMinutes, endMinutes, nowMinutes);
    setResult(res);
  };

  const handleReset = () => {
    setResult(null);
  };

  return (
    <div className="min-h-screen bg-slate-100 text-slate-800">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto max-w-5xl px-4 py-5 sm:px-6">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-sky-600 text-white shadow-sm">
              <DoorOpen className="h-5 w-5" />
            </div>
            <div>
              <h1 className="text-lg font-bold tracking-tight sm:text-xl">
                Smart Campus — Room Availability Checker
              </h1>
              <p className="text-xs text-slate-500 sm:text-sm">
                Check whether a study room is free before you book it.
              </p>
            </div>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-4 py-6 sm:px-6 sm:py-8">
        <div className="grid gap-6 lg:grid-cols-[320px_1fr]">
          <section aria-label="Room list" className="space-y-3">
            <h2 className="flex items-center gap-2 text-sm font-semibold text-slate-600">
              <DoorOpen className="h-4 w-4" />
              Rooms
            </h2>
            <div className="space-y-2.5">
              {rooms.map((room) => (
                <RoomCard
                  key={room.id}
                  room={room}
                  isSelected={room.id === selectedId}
                  onSelect={() => {
                    setSelectedId(room.id);
                    setResult(null);
                  }}
                />
              ))}
            </div>
          </section>

          <section aria-label="Availability checker" className="space-y-5">
            <div className="rounded-xl border border-slate-200 bg-white p-4">
              <label className="flex flex-wrap items-center justify-between gap-3">
                <span className="flex items-center gap-2 text-sm font-medium text-slate-600">
                  <Clock className="h-4 w-4" />
                  Current time
                </span>
                <span className="flex items-center gap-2">
                  <input
                    type="time"
                    value={formatTime(nowMinutes)}
                    onChange={(e) => {
                      const m = timeToMinutes(e.target.value);
                      if (m != null) setNowMinutes(m);
                      setResult(null);
                    }}
                    className="rounded-lg border border-slate-300 px-2.5 py-1.5 text-sm text-slate-700 focus:border-sky-500 focus:outline-none focus:ring-1 focus:ring-sky-500"
                  />
                  <span className="text-xs text-slate-400">({nowMinutes} min)</span>
                </span>
              </label>
            </div>

            <div className="rounded-xl border border-slate-200 bg-white p-4 sm:p-5">
              <h2 className="flex items-center gap-2 text-sm font-semibold text-slate-600">
                <CalendarClock className="h-4 w-4" />
                Candidate booking interval
              </h2>

              <div className="mt-4 grid gap-4 sm:grid-cols-2">
                <div>
                  <label
                    htmlFor="start-time"
                    className="mb-1 block text-xs font-medium text-slate-500"
                  >
                    Start time
                  </label>
                  <input
                    id="start-time"
                    type="time"
                    value={startInput}
                    onChange={(e) => {
                      setStartInput(e.target.value);
                      setResult(null);
                    }}
                    className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-700 focus:border-sky-500 focus:outline-none focus:ring-1 focus:ring-sky-500"
                  />
                  <p className="mt-1 text-xs text-slate-400">
                    Must be after current time ({formatTime(nowMinutes)}).
                  </p>
                </div>

                <div>
                  <label
                    htmlFor="end-time"
                    className="mb-1 block text-xs font-medium text-slate-500"
                  >
                    End time
                  </label>
                  <input
                    id="end-time"
                    type="text"
                    inputMode="numeric"
                    placeholder="HH:MM (24:00 ok)"
                    value={endInput}
                    onChange={(e) => {
                      setEndInput(e.target.value);
                      setResult(null);
                    }}
                    className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-700 focus:border-sky-500 focus:outline-none focus:ring-1 focus:ring-sky-500"
                  />
                  <p className="mt-1 text-xs text-slate-400">
                    Max booking length: {MAX_DURATION} minutes. Use 24:00 for end of day.
                  </p>
                </div>
              </div>

              <div className="mt-3 flex items-center gap-2 text-xs">
                {duration != null ? (
                  duration > 0 ? (
                    <span
                      className={[
                        "rounded-full px-2.5 py-0.5 font-medium",
                        duration > MAX_DURATION
                          ? "bg-red-100 text-red-700"
                          : "bg-sky-100 text-sky-700",
                      ].join(" ")}
                    >
                      Duration: {duration} min
                      {duration > MAX_DURATION ? ` (exceeds ${MAX_DURATION})` : ""}
                    </span>
                  ) : (
                    <span className="rounded-full bg-red-100 px-2.5 py-0.5 font-medium text-red-700">
                      End must be after start
                    </span>
                  )
                ) : (
                  <span className="rounded-full bg-slate-100 px-2.5 py-0.5 font-medium text-slate-500">
                    Enter valid times
                  </span>
                )}
              </div>

              <div className="mt-4 flex gap-3">
                <button
                  type="button"
                  onClick={handleCheck}
                  className="inline-flex items-center gap-2 rounded-lg bg-sky-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-sky-700 focus:outline-none focus:ring-2 focus:ring-sky-400/60"
                >
                  <Search className="h-4 w-4" />
                  Check availability
                </button>
                <button
                  type="button"
                  onClick={handleReset}
                  className="inline-flex items-center gap-2 rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm font-semibold text-slate-600 transition-colors hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-slate-300"
                >
                  Clear
                </button>
              </div>
            </div>

            <div className="rounded-xl border border-slate-200 bg-white p-4 sm:p-5">
              <h2 className="text-sm font-semibold text-slate-600">
                Day timeline — {selectedRoom.name}
              </h2>
              <div className="mt-4">
                <Timeline
                  bookings={selectedRoom.bookings}
                  candidateStart={startMinutes}
                  candidateEnd={endMinutes}
                  nowMinutes={nowMinutes}
                />
              </div>
            </div>

            <ResultBanner result={result} />

            <RoomBookings room={selectedRoom} />
          </section>
        </div>

        <footer className="mt-8 text-center text-xs text-slate-400">
          Fictional sample data · No real bookings are created or modified.
        </footer>
      </main>
    </div>
  );
}

function timeToMinutes(value: string): number | null {
  const match = /^(\d{1,2}):(\d{2})$/.exec(value.trim());
  if (!match) return null;
  const h = parseInt(match[1], 10);
  const m = parseInt(match[2], 10);
  if (h === 24 && m === 0) return 1440;
  if (h < 0 || h > 23 || m < 0 || m > 59) return null;
  return h * 60 + m;
}

export default App;
