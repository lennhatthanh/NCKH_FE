import { useEffect, useRef } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import { useDispatch, useSelector } from "react-redux";
import { dataTramSoTan } from "../../features/tramsotan/tramSoTanSlice";

mapboxgl.accessToken = "pk.eyJ1IjoiYml2aWVuZ2FjaCIsImEiOiJjbWN0NTFtNWowMXJnMmpxdXlzenp3ZDg3In0.GVJzm8i1OOnkkupDQxf_qw";

export default function MapPublic() {
    const mapContainer = useRef(null);
    const dispatch = useDispatch();
    const data = useSelector((state) => state.tramsotan.tramsotan) || [];

    useEffect(() => {
        dispatch(dataTramSoTan());
    }, [dispatch]);

    useEffect(() => {
        if (!mapContainer.current) return;

        const map = new mapboxgl.Map({
            container: mapContainer.current,
            style: "mapbox://styles/mapbox/streets-v12",
            projection: "globe",
            center: [108.247, 16.102],
            zoom: 4,
        });

        let userMarker = null;
        let userPosition = null;

        // Lấy vị trí hiện tại người dùng
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const { longitude, latitude } = position.coords;
                    userPosition = [longitude, latitude];

                    userMarker = new mapboxgl.Marker({ color: "blue" })
                        .setLngLat(userPosition)
                        .setPopup(new mapboxgl.Popup({ offset: 0 }).setText("Vị trí của bạn"))
                        .addTo(map);

                    map.flyTo({ center: userPosition, zoom: 14, essential: true });
                },
                (err) => console.error(err)
            );
        }

        // Marker trạm sơ tán
        data.forEach((tram) => {
            const lng = parseFloat(tram.kinh_do);
            const lat = parseFloat(tram.vi_do);

            const marker = new mapboxgl.Marker({ color: tram.tinh_trang ? "green" : "red" })
                .setLngLat([lng, lat])
                .addTo(map);

            // Tạo popup ban đầu (khi chưa tính khoảng cách)
            const popup = new mapboxgl.Popup({ offset: 0 }).setHTML(`
                    <div class="w-64 p-4 bg-gradient-to-br from-blue-50 to-white rounded-2xl shadow-xl border border-blue-100">
                        <h3 class="text-lg font-bold text-blue-700 mb-1 truncate">${tram.ten_khu_vuc}</h3>
                        <p class="text-gray-700 text-sm mb-2 line-clamp-3">${tram.mo_ta}</p>
                        <button id="btn-route-${tram.id}" class="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-3 rounded-lg shadow-md transition-all duration-200">
                            Chỉ đường
                        </button>
                    </div>
                `);

            marker.setPopup(popup);

            // Sự kiện click marker để tính khoảng cách
            function getDistanceFromLatLonInKm(lat1, lon1, lat2, lon2) {
                const R = 6371; // bán kính Trái Đất
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

            // Khi tạo marker
            marker.getElement().addEventListener("click", () => {
                if (!userPosition) return alert("Không lấy được vị trí của bạn");

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

                // Gắn sự kiện sau khi popup mở
                popup.on("open", () => {
                    const btnRoute = document.getElementById(`btn-route-${tram.id}`);
                    if (btnRoute) {
                        btnRoute.onclick = async () => {
                            const routeRequest = `https://api.mapbox.com/directions/v5/mapbox/driving/${userPosition[0]},${userPosition[1]};${tram.kinh_do},${tram.vi_do}?geometries=geojson&access_token=${mapboxgl.accessToken}`;
                            const res = await fetch(routeRequest);
                            const dataRoute = await res.json();
                            const routeGeojson = dataRoute.routes[0].geometry;

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

                            popup.remove(); // đóng popup sau khi chỉ đường
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

        return () => map.remove();
    }, [data]);

    return (
        <div className="h-[82vh] grid place-items-center rounded-xl border border-ocean-100 bg-white text-ocean-600">
            <div className="w-full h-full relative">
                <div ref={mapContainer} className="w-full h-full rounded-xl" />
            </div>
        </div>
    );
}
