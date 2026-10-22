import type { Room } from "@/lib/types";
import { formatTime } from "@/lib/availability";

interface RoomBookingsProps {
  room: Room;
}

export function RoomBookings({ room }: RoomBookingsProps) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4">
      <h3 className="text-sm font-semibold text-slate-700">
        Existing bookings — {room.name}
      </h3>
      {room.bookings.length === 0 ? (
        <p className="mt-2 text-sm text-slate-400">No bookings for this room today.</p>
      ) : (
        <ul className="mt-2 space-y-2">
          {room.bookings.map((b) => (
            <li
              key={b.id}
              className="flex flex-wrap items-center justify-between gap-2 rounded-lg bg-slate-50 px-3 py-2"
            >
              <span className="text-sm font-medium text-slate-700">{b.title}</span>
              <span className="text-xs font-medium text-slate-500">
                {formatTime(b.start)}–{formatTime(b.end)} · {b.end - b.start} min
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
