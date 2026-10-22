export interface Booking {
  id: string;
  start: number;
  end: number;
  title: string;
  bookedBy: string;
}

export interface Room {
  id: string;
  name: string;
  building: string;
  capacity: number;
  blocked: boolean;
  bookings: Booking[];
}

export type Decision = "available" | "unavailable";

export interface CheckResult {
  decision: Decision;
  reason: string;
}

export const MINUTE_MAX = 1440;
export const MAX_DURATION = 120;
