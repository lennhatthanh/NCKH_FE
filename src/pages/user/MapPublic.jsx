import { useEffect, useRef, useState } from "react";
import { useLocation } from "react-router-dom";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import { useDispatch, useSelector } from "react-redux";
import { dataTramSoTan } from "../../features/tramsotan/tramSoTanSlice";

mapboxgl.accessToken = "pk.eyJ1IjoiYml2aWVuZ2FjaCIsImEiOiJjbWN0NTFtNWowMXJnMmpxdXlzenp3ZDg3In0.GVJzm8i1OOnkkupDQxf_qw";

export default function MapPublic() {
  const mapContainer = useRef(null);
  const mapRef = useRef(null);
  const dispatch = useDispatch();
  const data = useSelector((state) => state.tramsotan.tramsotan) || [];
  const location = useLocation();
  const [userPosition, setUserPosition] = useState(null);
  const [selectedId, setSelectedId] = useState(null);

  // Lấy dữ liệu trạm
  useEffect(() => {
    dispatch(dataTramSoTan());
  }, [dispatch]);

  // Khởi tạo map
  useEffect(() => {
    if (!mapContainer.current) return;

    const map = new mapboxgl.Map({
      container: mapContainer.current,
      style: "mapbox://styles/mapbox/streets-v12",
      projection: "globe",
      center: [108.247, 16.102],
      zoom: 4,
    });

    mapRef.current = map;
    return () => map.remove();
  }, []);

  // Lấy vị trí người dùng
  useEffect(() => {
    if (!navigator.geolocation) return;

    const watcher = navigator.geolocation.watchPosition(
      (pos) => {
        const coords = [pos.coords.longitude, pos.coords.latitude];
        setUserPosition(coords);

        const map = mapRef.current;
        if (!map) return;

        if (!map.userMarker) {
          map.userMarker = new mapboxgl.Marker({ color: "blue" })
            .setLngLat(coords)
            .setPopup(new mapboxgl.Popup({ offset: 0 }).setText("Vị trí của bạn"))
            .addTo(map);
        } else {
          map.userMarker.setLngLat(coords);
        }

        // Fly tới người dùng nếu không xem trạm
        if (!location.state) map.flyTo({ center: coords, zoom: 14, essential: true });
      },
      (err) => console.error(err),
      { enableHighAccuracy: true, maximumAge: 0, timeout: 5000 }
    );

    return () => navigator.geolocation.clearWatch(watcher);
  }, [location.state]);

  // Thêm marker trạm
  useEffect(() => {
    if (!mapRef.current || data.length === 0) return;

    const map = mapRef.current;
    if (map.tramMarkers) map.tramMarkers.forEach((m) => m.remove());
    map.tramMarkers = [];

    data.forEach((tram) => {
      const lng = parseFloat(tram.kinh_do);
      const lat = parseFloat(tram.vi_do);

      const color = tram.tinh_trang ? "green" : "red";
      const marker = new mapboxgl.Marker({ color })
        .setLngLat([lng, lat])
        .addTo(map);

      map.tramMarkers.push(marker);

      // Fly tới trạm nếu xem từ danh sách
      if (location.state && location.state.id === tram.id) {
        map.flyTo({ center: [lng, lat], zoom: 16, essential: true });
        setSelectedId(tram.id); // đánh dấu trạm đang chọn
      }

      // Popup
      const distance = userPosition
        ? `${getDistance(userPosition[1], userPosition[0], lat, lng)} km`
        : "Chưa xác định";

      const popupContent = `
        <div class="w-64 p-4 bg-gradient-to-br from-blue-50 to-white rounded-2xl shadow-xl border border-blue-100">
          <h3 class="text-lg font-bold text-blue-700 mb-1 truncate">${tram.ten_khu_vuc}</h3>
          <p class="text-gray-700 text-sm mb-2 line-clamp-3">${tram.mo_ta}</p>
          <div class="flex justify-between text-sm mb-2">
            <span class="font-medium">Sức chứa: <span class="text-gray-800">${tram.suc_chua}</span></span>
            <span class="font-medium">Đang chứa: <span class="text-gray-800">${tram.dang_chua}</span></span>
          </div>
          <div class="text-sm mb-3"><span class="font-medium">SDT:</span> ${tram.so_dien_thoai}</div>
          <div class="flex items-center justify-between mb-3">
            <span class="text-sm font-semibold text-blue-600">Khoảng cách:</span>
            <span class="text-sm font-bold text-blue-800">${distance}</span>
          </div>
          <button id="btn-route-${tram.id}" class="w-full mb-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-3 rounded-lg shadow-md transition-all duration-200">
            Bắt đầu chỉ đường
          </button>
          <button id="btn-google-${tram.id}" class="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-3 rounded-lg shadow-md transition-all duration-200">
            Mở Google Maps
          </button>
        </div>
      `;

      const popup = new mapboxgl.Popup({ offset: 10 }).setHTML(popupContent);
      marker.setPopup(popup);

      // Click marker mở popup và highlight
      marker.getElement().addEventListener("click", () => {
        popup.togglePopup();
        setSelectedId(tram.id);
      });

      // Nút chỉ đường & Google Maps
      popup.on("open", () => {
        const btnRoute = document.getElementById(`btn-route-${tram.id}`);
        const btnGoogle = document.getElementById(`btn-google-${tram.id}`);

        if (btnRoute && userPosition) {
          btnRoute.onclick = async () => {
            const res = await fetch(
              `https://api.mapbox.com/directions/v5/mapbox/driving/${userPosition[0]},${userPosition[1]};${lng},${lat}?geometries=geojson&access_token=${mapboxgl.accessToken}`
            );
            const dataRoute = await res.json();
            const routeGeojson = { type: "Feature", geometry: dataRoute.routes[0].geometry };

            if (map.getSource("route")) map.getSource("route").setData(routeGeojson);
            else {
              map.addSource("route", { type: "geojson", data: routeGeojson });
              map.addLayer({
                id: "route",
                type: "line",
                source: "route",
                layout: { "line-join": "round", "line-cap": "round" },
                paint: { "line-color": "#1E40AF", "line-width": 5 },
              });
            }
            popup.remove();
          };
        }

        if (btnGoogle) {
          btnGoogle.onclick = () => {
            window.open(`https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`, "_blank");
          };
        }
      });
    });

    // Hàm tính khoảng cách
    function getDistance(lat1, lon1, lat2, lon2) {
      const R = 6371;
      const dLat = ((lat2 - lat1) * Math.PI) / 180;
      const dLon = ((lon2 - lon1) * Math.PI) / 180;
      const a =
        Math.sin(dLat / 2) ** 2 +
        Math.cos((lat1 * Math.PI) / 180) * Math.cos((lat2 * Math.PI) / 180) * Math.sin(dLon / 2) ** 2;
      const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
      return (R * c).toFixed(1);
    }
  }, [data, userPosition, location.state]);

  return (
    <div className="h-[82vh] grid place-items-center rounded-xl border border-ocean-100 bg-white text-ocean-600">
      <div className="w-full h-full relative">
        <div ref={mapContainer} className="w-full h-full rounded-xl" />
      </div>
    </div>
  );
}
