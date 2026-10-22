import { describe, it, expect } from "vitest";
import { checkAvailability } from "@/lib/availability";
import type { Booking, Room } from "@/lib/types";

function makeRoom(overrides: Partial<Room> = {}): Room {
  return {
    id: "TEST",
    name: "Test Room",
    building: "Test Building",
    capacity: 10,
    blocked: false,
    bookings: [],
    ...overrides,
  };
}

function makeBooking(start: number, end: number): Booking {
  return { id: `b-${start}-${end}`, start, end, title: "Test Booking", bookedBy: "Tester" };
}

function cloneBookings(bookings: Booking[]): Booking[] {
  return bookings.map((b) => ({ ...b }));
}

describe("checkAvailability — T01-T17", () => {
  it("T01: touching start at existing booking end is available", () => {
    const bookings = [makeBooking(600, 660)];
    const room = makeRoom({ bookings });
    const snapshot = cloneBookings(bookings);
    const result = checkAvailability(room, 660, 720, 540);
    expect(result.decision).toBe("available");
    expect(result.reason).toBe("This slot is open and ready to book.");
    expect(bookings).toEqual(snapshot);
    expect(bookings.length).toBe(1);
  });

  it("T02: start equal to now is unavailable", () => {
    const bookings = [makeBooking(600, 660)];
    const room = makeRoom({ bookings });
    const snapshot = cloneBookings(bookings);
    const result = checkAvailability(room, 540, 570, 540);
    expect(result.decision).toBe("unavailable");
    expect(result.reason).toBe("Start time must be after the current time (09:00).");
    expect(bookings).toEqual(snapshot);
  });

  it("T03: start equals end is unavailable", () => {
    const bookings = [makeBooking(600, 660)];
    const room = makeRoom({ bookings });
    const snapshot = cloneBookings(bookings);
    const result = checkAvailability(room, 720, 720, 540);
    expect(result.decision).toBe("unavailable");
    expect(result.reason).toBe("Start time must be before end time.");
    expect(bookings).toEqual(snapshot);
  });

  it("T04: start after end is unavailable", () => {
    const bookings = [makeBooking(600, 660)];
    const room = makeRoom({ bookings });
    const snapshot = cloneBookings(bookings);
    const result = checkAvailability(room, 750, 720, 540);
    expect(result.decision).toBe("unavailable");
    expect(result.reason).toBe("Start time must be before end time.");
    expect(bookings).toEqual(snapshot);
  });

  it("T05: end past 1440 is unavailable", () => {
    const bookings = [makeBooking(600, 660)];
    const room = makeRoom({ bookings });
    const snapshot = cloneBookings(bookings);
    const result = checkAvailability(room, 1380, 1441, 540);
    expect(result.decision).toBe("unavailable");
    expect(result.reason).toBe("End time cannot go past 24:00 (1440).");
    expect(bookings).toEqual(snapshot);
  });

  it("T06: exactly 120-minute valid slot is available", () => {
    const bookings = [makeBooking(600, 660)];
    const room = makeRoom({ bookings });
    const snapshot = cloneBookings(bookings);
    const result = checkAvailability(room, 720, 840, 540);
    expect(result.decision).toBe("available");
    expect(result.reason).toBe("This slot is open and ready to book.");
    expect(bookings).toEqual(snapshot);
  });

  it("T07: 121-minute slot exceeds 120-minute limit", () => {
    const bookings = [makeBooking(600, 660)];
    const room = makeRoom({ bookings });
    const snapshot = cloneBookings(bookings);
    const result = checkAvailability(room, 720, 841, 540);
    expect(result.decision).toBe("unavailable");
    expect(result.reason).toBe("Booking is 121 minutes, which exceeds the 120-minute limit.");
    expect(bookings).toEqual(snapshot);
  });

  it("T08: touching end at existing booking start is available", () => {
    const bookings = [makeBooking(600, 660)];
    const room = makeRoom({ bookings });
    const snapshot = cloneBookings(bookings);
    const result = checkAvailability(room, 570, 600, 540);
    expect(result.decision).toBe("available");
    expect(result.reason).toBe("This slot is open and ready to book.");
    expect(bookings).toEqual(snapshot);
  });

  it("T09: partial overlap with existing booking is unavailable", () => {
    const bookings = [makeBooking(600, 660)];
    const room = makeRoom({ bookings });
    const snapshot = cloneBookings(bookings);
    const result = checkAvailability(room, 630, 690, 540);
    expect(result.decision).toBe("unavailable");
    expect(result.reason).toBe('Overlaps "Test Booking" (10:00\u201311:00).');
    expect(bookings).toEqual(snapshot);
  });

  it("T10: candidate containing existing booking is unavailable", () => {
    const bookings = [makeBooking(600, 660)];
    const room = makeRoom({ bookings });
    const snapshot = cloneBookings(bookings);
    const result = checkAvailability(room, 570, 690, 540);
    expect(result.decision).toBe("unavailable");
    expect(result.reason).toBe('Overlaps "Test Booking" (10:00\u201311:00).');
    expect(bookings).toEqual(snapshot);
  });

  it("T11: candidate inside existing booking is unavailable", () => {
    const bookings = [makeBooking(600, 660)];
    const room = makeRoom({ bookings });
    const snapshot = cloneBookings(bookings);
    const result = checkAvailability(room, 615, 645, 540);
    expect(result.decision).toBe("unavailable");
    expect(result.reason).toBe('Overlaps "Test Booking" (10:00\u201311:00).');
    expect(bookings).toEqual(snapshot);
  });

  it("T12: exact duplicate of existing booking is unavailable", () => {
    const bookings = [makeBooking(600, 660)];
    const room = makeRoom({ bookings });
    const snapshot = cloneBookings(bookings);
    const result = checkAvailability(room, 600, 660, 540);
    expect(result.decision).toBe("unavailable");
    expect(result.reason).toBe('Overlaps "Test Booking" (10:00\u201311:00).');
    expect(bookings).toEqual(snapshot);
  });

  it("T13: blocked room is unavailable even with valid slot", () => {
    const bookings = [makeBooking(600, 660)];
    const room = makeRoom({ bookings, blocked: true });
    const snapshot = cloneBookings(bookings);
    const result = checkAvailability(room, 660, 720, 540);
    expect(result.decision).toBe("unavailable");
    expect(result.reason).toBe("This room is currently blocked and cannot be booked.");
    expect(bookings).toEqual(snapshot);
  });

  it("T14: empty bookings with valid slot is available", () => {
    const bookings: Booking[] = [];
    const room = makeRoom({ bookings });
    const snapshot = cloneBookings(bookings);
    const result = checkAvailability(room, 630, 690, 540);
    expect(result.decision).toBe("available");
    expect(result.reason).toBe("This slot is open and ready to book.");
    expect(bookings).toEqual(snapshot);
    expect(bookings.length).toBe(0);
  });

  it("T15: available result does not mutate bookings array", () => {
    const bookings = [makeBooking(600, 660), makeBooking(800, 840)];
    const room = makeRoom({ bookings });
    const snapshot = cloneBookings(bookings);
    const result = checkAvailability(room, 660, 720, 540);
    expect(result.decision).toBe("available");
    expect(result.reason).toBe("This slot is open and ready to book.");
    expect(bookings).toStrictEqual(snapshot);
    expect(bookings.length).toBe(2);
  });

  it("T16: valid slot ending exactly at 1440 is available", () => {
    const bookings = [makeBooking(600, 660)];
    const room = makeRoom({ bookings });
    const snapshot = cloneBookings(bookings);
    const result = checkAvailability(room, 1380, 1440, 1200);
    expect(result.decision).toBe("available");
    expect(result.reason).toBe("This slot is open and ready to book.");
    expect(bookings).toEqual(snapshot);
  });

  it("T17: valid interval after now with no conflict is available", () => {
    const bookings = [makeBooking(600, 660)];
    const room = makeRoom({ bookings });
    const snapshot = cloneBookings(bookings);
    const result = checkAvailability(room, 680, 740, 540);
    expect(result.decision).toBe("available");
    expect(result.reason).toBe("This slot is open and ready to book.");
    expect(bookings).toEqual(snapshot);
  });
});
