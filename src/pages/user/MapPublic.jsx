import { MapPin } from "lucide-react";
export default function MapPublic() {
  return (
    <div className="rounded-xl border border-ocean-100 bg-white h-[520px] grid place-items-center text-ocean-600">
      <div className="text-center">
        <MapPin className="w-8 h-8 mx-auto mb-2"/>
        <div>Bản đồ công cộng — tích hợp thư viện bản đồ sau.</div>
      </div>
    </div>
  );
}
