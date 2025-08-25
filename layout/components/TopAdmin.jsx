import { Bell, Search, UserCircle } from "lucide-react";

export default function TopAdmin() {
  return (
    <header className="sticky top-0 z-30 bg-ocean-50/70 backdrop-blur-md border-b border-ocean-100">
      <div className="h-14 flex items-center justify-between px-4 md:px-6">
        <div className="hidden md:block w-full max-w-xl">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-ocean-300" />
            <input
              placeholder="Tìm kiếm…"
              className="w-full pl-9 pr-3 py-2 rounded-full border border-ocean-100 bg-ocean-50
                         text-ocean-900 placeholder-ocean-300 outline-none focus:ring-2 focus:ring-ocean-300"
            />
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button className="p-2 rounded-full hover:bg-ocean-100 text-ocean-900 transition">
            <Bell className="w-5 h-5" />
          </button>
          <div className="w-9 h-9 rounded-full bg-ocean-300/30 grid place-items-center text-ocean-900">
            <UserCircle className="w-6 h-6" />
          </div>
        </div>
      </div>
    </header>
  );
}
