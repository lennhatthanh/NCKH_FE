import { useEffect, useRef, useState } from "react";
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
    const [userPosition, setUserPosition] = useState(null);

    // Lấy dữ liệu trạm sơ tán
    useEffect(() => {
        dispatch(dataTramSoTan());
    }, [dispatch]);

    // Lấy vị trí người dùng
    useEffect(() => {
        if (!navigator.geolocation) return alert("Trình duyệt không hỗ trợ định vị");

        const watcher = navigator.geolocation.watchPosition(
            (pos) => {
                const coords = [pos.coords.longitude, pos.coords.latitude];
                setUserPosition(coords);

                // Nếu map đã tạo, cập nhật marker và flyTo
                if (mapRef.current) {
                    if (!mapRef.current.userMarker) {
                        mapRef.current.userMarker = new mapboxgl.Marker({ color: "blue" })
                            .setLngLat(coords)
                            .setPopup(new mapboxgl.Popup({ offset: 0 }).setText("Vị trí của bạn"))
                            .addTo(mapRef.current);
                    } else {
                        mapRef.current.userMarker.setLngLat(coords);
                    }
                    mapRef.current.flyTo({ center: coords, zoom: 14, essential: true });
                }
            },
            (err) => console.error("Lỗi định vị:", err),
            { enableHighAccuracy: true, maximumAge: 0, timeout: 5000 }
        );

        return () => navigator.geolocation.clearWatch(watcher);
    }, []);

    // Tạo map và marker trạm sơ tán
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

    // Thêm marker trạm sơ tán khi có dữ liệu và vị trí người dùng
    useEffect(() => {
        if (!mapRef.current || !userPosition || data.length === 0) return;

        const map = mapRef.current;

        // Xoá marker cũ nếu có
        if (map.tramMarkers) {
            map.tramMarkers.forEach((m) => m.remove());
        }
        map.tramMarkers = [];

        data.forEach((tram) => {
            const lng = parseFloat(tram.kinh_do);
            const lat = parseFloat(tram.vi_do);

            const marker = new mapboxgl.Marker({ color: tram.tinh_trang ? "green" : "red" })
                .setLngLat([lng, lat])
                .addTo(map);
            map.tramMarkers.push(marker);

            // Tính khoảng cách
            function getDistanceFromLatLonInKm(lat1, lon1, lat2, lon2) {
                const R = 6371;
                const dLat = ((lat2 - lat1) * Math.PI) / 180;
                const dLon = ((lon2 - lon1) * Math.PI) / 180;
                const a =
                    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
                    Math.cos((lat1 * Math.PI) / 180) *
                        Math.cos((lat2 * Math.PI) / 180) *
                        Math.sin(dLon / 2) *
                        Math.sin(dLon / 2);
                const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
                return (R * c).toFixed(1);
            }

            // Popup khi click marker
            marker.getElement().addEventListener("click", () => {
                const distanceKm = getDistanceFromLatLonInKm(userPosition[1], userPosition[0], lat, lng);

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
              <span class="text-sm font-bold text-blue-800">${distanceKm} km</span>
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
                marker.setPopup(popup).togglePopup();

                popup.on("open", () => {
                    const btnRoute = document.getElementById(`btn-route-${tram.id}`);
                    if (btnRoute) {
                        btnRoute.onclick = async () => {
                            const routeRequest = `https://api.mapbox.com/directions/v5/mapbox/driving/${userPosition[0]},${userPosition[1]};${tram.kinh_do},${tram.vi_do}?geometries=geojson&access_token=${mapboxgl.accessToken}`;
                            const res = await fetch(routeRequest);
                            const dataRoute = await res.json();
                            const routeGeojson = {
                                type: "Feature",
                                geometry: dataRoute.routes[0].geometry,
                            };

                            if (map.getSource("route")) {
                                map.getSource("route").setData(routeGeojson);
                            } else {
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

                    const btnGoogle = document.getElementById(`btn-google-${tram.id}`);
                    if (btnGoogle) {
                        btnGoogle.onclick = () => {
                            const url = `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`;
                            window.open(url, "_blank");
                        };
                    }
                });
            });
        });
    }, [data, userPosition]);

    return (
        <div className="h-[82vh] grid place-items-center rounded-xl border border-ocean-100 bg-white text-ocean-600">
            <div className="w-full h-full relative">
                <div ref={mapContainer} className="w-full h-full rounded-xl" />
            </div>
        </div>
    );
}
