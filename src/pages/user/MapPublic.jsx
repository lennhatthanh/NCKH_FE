import { useEffect, useRef, useState } from "react";
import { useLocation } from "react-router-dom";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import { useDispatch, useSelector } from "react-redux";
import { dataTramSoTanOpen } from "../../features/tramsotan/tramSoTanSlice";
import { MagnifyingGlassPlusIcon, MagnifyingGlassMinusIcon, MapPinIcon } from "@heroicons/react/24/solid";

mapboxgl.accessToken = "pk.eyJ1IjoiYml2aWVuZ2FjaCIsImEiOiJjbWN0NTFtNWowMXJnMmpxdXlzenp3ZDg3In0.GVJzm8i1OOnkkupDQxf_qw";

export default function MapPublic() {
    const mapContainer = useRef(null);
    const mapRef = useRef(null);
    const dispatch = useDispatch();
    const data = useSelector((state) => state.tramsotan.tramsotanopen) || [];
    const location = useLocation();
    const [userPosition, setUserPosition] = useState(null);
    const [selectedId, setSelectedId] = useState(null);

    // Lấy dữ liệu trạm
    useEffect(() => {
        dispatch(dataTramSoTanOpen());
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

            const marker = new mapboxgl.Marker({ color }).setLngLat([lng, lat]).addTo(map);
            map.tramMarkers.push(marker);

            if (location.state && location.state.id === tram.id) {
                map.flyTo({ center: [lng, lat], zoom: 16, essential: true });
                setSelectedId(tram.id);
            }

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
                    <div class="flex items-center justify-between mb-3">
                        <span class="text-sm font-semibold text-blue-600">Khoảng cách:</span>
                        <span class="text-sm font-bold text-blue-800">${distance}</span>
                    </div>
                    <a href="tel:${tram.so_dien_thoai}" class="flex items-center justify-center w-full mb-3 bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-3 rounded-lg shadow-md transition-all duration-200">
                        Gọi ngay: ${tram.so_dien_thoai}
                    </a>
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

            marker.getElement().addEventListener("click", () => {
                popup.togglePopup();
                setSelectedId(tram.id);
                map.flyTo({ center: [lng, lat], zoom: 16, essential: true });
            });

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

    // Zoom in/out
    const handleZoom = (type) => {
        const map = mapRef.current;
        if (!map) return;
        type === "in" ? map.zoomIn() : map.zoomOut();
    };

    // Fly tới user
    const flyToUser = () => {
        const map = mapRef.current;
        if (map && userPosition) map.flyTo({ center: userPosition, zoom: 14, essential: true });
    };

    return (
        <div className="h-[82vh] relative rounded-xl border border-ocean-100 bg-white text-ocean-600">
            <div ref={mapContainer} className="w-full h-full rounded-xl" />

            {/* Nút zoom & vị trí user với icon */}
            <div className="absolute top-4 right-4 flex flex-col gap-2 bg-white/90 p-2 rounded-lg shadow-md z-50">
                <button onClick={() => handleZoom("in")} className="bg-blue-600 hover:bg-blue-700 p-2 rounded">
                    <MagnifyingGlassPlusIcon className="w-6 h-6 text-white" />
                </button>
                <button onClick={() => handleZoom("out")} className="bg-blue-600 hover:bg-blue-700 p-2 rounded">
                    <MagnifyingGlassMinusIcon className="w-6 h-6 text-white" />
                </button>
                <button onClick={flyToUser} className="bg-green-600 hover:bg-green-700 p-2 rounded">
                    <MapPinIcon className="w-6 h-6 text-white" />
                </button>
            </div>
        </div>
    );
}
