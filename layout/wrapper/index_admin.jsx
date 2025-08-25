import TopAdmin from "../components/TopAdmin.jsx";
import BotAdmin from "../components/BotAdmin.jsx";
import { Outlet } from "react-router-dom";

export default function IndexAdminLayout() {
  return (
    <div className="min-h-screen bg-ocean-50 text-ocean-900">
      <div className="flex">
        <BotAdmin />
        <main className="flex-1 min-h-screen ml-0 md:ml">
          <TopAdmin />
          <div className="mx-auto max-w-7xl px-4 md:px-6 py-6">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}
