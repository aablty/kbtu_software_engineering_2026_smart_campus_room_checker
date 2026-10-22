import type { Room } from "./types";

export const rooms: Room[] = [
  {
    id: "A101",
    name: "A-101 · Study Lab",
    building: "Science Block",
    capacity: 24,
    blocked: false,
    bookings: [
      { id: "b1", start: 540, end: 600, title: "Physics Recitation", bookedBy: "Prof. Lin" },
      { id: "b2", start: 720, end: 810, title: "Lab Safety Training", bookedBy: "Facilities" },
    ],
  },
  {
    id: "B204",
    name: "B-204 · Seminar Room",
    building: "Humanities Wing",
    capacity: 12,
    blocked: true,
    bookings: [
      { id: "b3", start: 480, end: 570, title: "Maintenance", bookedBy: "Facilities" },
    ],
  },
  {
    id: "C310",
    name: "C-310 · Lecture Hall",
    building: "Main Building",
    capacity: 80,
    blocked: false,
    bookings: [
      { id: "b4", start: 600, end: 690, title: "CS Colloquium", bookedBy: "Dept. of Computing" },
      { id: "b5", start: 900, end: 960, title: "Guest Lecture", bookedBy: "Prof. Okafor" },
    ],
  },
  {
    id: "D105",
    name: "D-105 · Project Room",
    building: "Engineering Quad",
    capacity: 6,
    blocked: false,
    bookings: [
      { id: "b6", start: 870, end: 930, title: "Capstone Sync", bookedBy: "Team Photon" },
    ],
  },
];
