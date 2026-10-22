import type { Booking, CheckResult, Room } from "./types";
import { MAX_DURATION, MINUTE_MAX } from "./types";

export function overlaps(aStart: number, aEnd: number, bStart: number, bEnd: number): boolean {
  return aStart < bEnd && bStart < aEnd;
}

export function findConflict(start: number, end: number, bookings: Booking[]): Booking | null {
  return bookings.find((b) => overlaps(start, end, b.start, b.end)) ?? null;
}

export function checkAvailability(
  room: Room,
  start: number,
  end: number,
  nowMinutes: number,
): CheckResult {
  if (!Number.isFinite(start) || !Number.isFinite(end)) {
    return { decision: "unavailable", reason: "Please enter valid start and end times." };
  }
  if (start < 0) {
    return { decision: "unavailable", reason: "Start time cannot be before 00:00." };
  }
  if (end > MINUTE_MAX) {
    return { decision: "unavailable", reason: "End time cannot go past 24:00 (1440)." };
  }
  if (start >= end) {
    return { decision: "unavailable", reason: "Start time must be before end time." };
  }
  if (start <= nowMinutes) {
    return {
      decision: "unavailable",
      reason: `Start time must be after the current time (${formatTime(nowMinutes)}).`,
    };
  }

  if (end - start > MAX_DURATION) {
    return {
      decision: "unavailable",
      reason: `Booking is ${end - start} minutes, which exceeds the 120-minute limit.`,
    };
  }

  if (room.blocked) {
    return {
      decision: "unavailable",
      reason: "This room is currently blocked and cannot be booked.",
    };
  }

  const conflict = findConflict(start, end, room.bookings);
  if (conflict) {
    return {
      decision: "unavailable",
      reason: `Overlaps "${conflict.title}" (${formatTime(conflict.start)}–${formatTime(conflict.end)}).`,
    };
  }

  return { decision: "available", reason: "This slot is open and ready to book." };
}

export function formatTime(minutes: number): string {
  if (minutes >= MINUTE_MAX) return "24:00";
  const m = ((minutes % MINUTE_MAX) + MINUTE_MAX) % MINUTE_MAX;
  const h = Math.floor(m / 60);
  const mm = m % 60;
  return `${h.toString().padStart(2, "0")}:${mm.toString().padStart(2, "0")}`;
}
