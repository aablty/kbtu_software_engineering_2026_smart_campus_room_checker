import type { Room } from "@/lib/types";
import { formatTime } from "@/lib/availability";
import { Lock, Users, MapPin } from "lucide-react";

interface RoomCardProps {
  room: Room;
  isSelected: boolean;
  onSelect: () => void;
}

export function RoomCard({ room, isSelected, onSelect }: RoomCardProps) {
  return (
    <button
      type="button"
      onClick={onSelect}
      aria-pressed={isSelected}
      className={[
        "w-full text-left rounded-xl border p-4 transition-all duration-200",
        "focus:outline-none focus:ring-2 focus:ring-sky-400/60",
        isSelected
          ? "border-sky-500 bg-sky-50 ring-1 ring-sky-500 shadow-sm"
          : "border-slate-200 bg-white hover:border-sky-300 hover:shadow-sm",
        room.blocked && !isSelected ? "opacity-70" : "",
      ].join(" ")}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0">
          <p className="font-semibold text-slate-800 truncate">{room.name}</p>
          <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-slate-500">
            <span className="inline-flex items-center gap-1">
              <MapPin className="h-3.5 w-3.5" />
              {room.building}
            </span>
            <span className="inline-flex items-center gap-1">
              <Users className="h-3.5 w-3.5" />
              {room.capacity} seats
            </span>
          </div>
        </div>
        {room.blocked && (
          <span className="inline-flex items-center gap-1 rounded-full bg-red-100 px-2 py-0.5 text-xs font-medium text-red-700">
            <Lock className="h-3 w-3" />
            Blocked
          </span>
        )}
      </div>
      <div className="mt-3 flex flex-wrap gap-1.5">
        {room.bookings.length === 0 ? (
          <span className="text-xs text-slate-400">No bookings today</span>
        ) : (
          room.bookings.map((b) => (
            <span
              key={b.id}
              className="rounded-md bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-600"
            >
              {formatTime(b.start)}–{formatTime(b.end)}
            </span>
          ))
        )}
      </div>
    </button>
  );
}
