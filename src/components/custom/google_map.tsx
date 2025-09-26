"use client";

import { useEffect } from "react";
import dynamic from "next/dynamic";
import L from "leaflet"; // Import trực tiếp
import "leaflet/dist/leaflet.css";
import "leaflet-routing-machine"; // Import plugin
import "leaflet-routing-machine/dist/leaflet-routing-machine.css";
import { useMap } from "react-leaflet";
import { Location } from "@/lib/data/location";

// Ghi chú: Sửa lỗi icon mặc định, nên đặt ở một file khởi tạo hoặc đầu component
// Đoạn này vẫn hữu ích nếu bạn dùng marker mặc định ở đâu đó.
// @ts-expect-error may not exist in some versions
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "/leaflet/marker-icon-2x.png",
  iconUrl: "/leaflet/marker-icon.png",
  shadowUrl: "/leaflet/marker-shadow.png",
});

// Tải các thành phần của react-leaflet
const MapContainer = dynamic(
  () => import("react-leaflet").then((mod) => mod.MapContainer),
  { ssr: false }
);
const TileLayer = dynamic(
  () => import("react-leaflet").then((mod) => mod.TileLayer),
  { ssr: false }
);
const Marker = dynamic(
  () => import("react-leaflet").then((mod) => mod.Marker),
  { ssr: false }
);
const Popup = dynamic(() => import("react-leaflet").then((mod) => mod.Popup), {
  ssr: false,
});

// Định nghĩa interface rõ ràng

interface RouteMapProps {
  startLocation: Location;
  endLocation: Location;
  routeStops?: Location[];
  className?: string;
}

// Định nghĩa bounds của Việt Nam
const VIETNAM_BOUNDS = L.latLngBounds(
  L.latLng(8.0, 102.0), // Góc tây nam Việt Nam
  L.latLng(23.5, 110.0) // Góc đông bắc Việt Nam
);

// Hàm kiểm tra xem một điểm có nằm trong bounds Việt Nam không
const isInVietnamBounds = (lat: number, lng: number): boolean => {
  return VIETNAM_BOUNDS.contains(L.latLng(lat, lng));
};

// Ghi chú: Tách logic routing ra một component riêng
const RoutingMachine = ({
  startLocation,
  endLocation,
  routeStops = [],
}: Omit<RouteMapProps, "className">) => {
  const map = useMap(); // Ghi chú: Sử dụng hook useMap thay cho whenCreated

  useEffect(() => {
    if (!map) return;

    // Validation: Kiểm tra tất cả waypoints có nằm trong Việt Nam không
    const allLocations = [startLocation, ...routeStops, endLocation];
    const invalidLocations = allLocations.filter(
      (loc) => !isInVietnamBounds(loc.latitude, loc.longitude)
    );

    if (invalidLocations.length > 0) {
      console.warn(
        "Some locations are outside Vietnam bounds:",
        invalidLocations
      );
      // Có thể hiển thị warning cho user ở đây
    }

    const waypoints = [
      L.latLng(startLocation.latitude, startLocation.longitude),
      ...routeStops.map((stop) => L.latLng(stop.latitude, stop.longitude)),
      L.latLng(endLocation.latitude, endLocation.longitude),
    ];

    const routingControl = L.Routing.control({
      waypoints,
      routeWhileDragging: false,
      show: false,
      lineOptions: {
        styles: [{ color: "#3B82F6", weight: 4, opacity: 0.8 }],
        extendToWaypoints: true,
        missingRouteTolerance: 0,
      },
      router: L.Routing.osrmv1({
        serviceUrl: "https://router.project-osrm.org/route/v1",
        profile: "driving",
        // Note: OSRM không hỗ trợ giới hạn routing theo quốc gia trực tiếp
        // Để đảm bảo routing chỉ trong Việt Nam, có thể:
        // 1. Sử dụng OSRM server riêng cho Việt Nam
        // 2. Thêm validation để kiểm tra tất cả waypoints trong bounds VN
        // 3. Chuyển sang Google Maps API với region='VN'
      }),
    }).addTo(map);

    // Điều chỉnh khung nhìn - giới hạn trong bounds Việt Nam
    const bounds = L.latLngBounds(waypoints);
    // Đảm bảo bounds không vượt ra ngoài Việt Nam
    const constrainedBounds = bounds.intersects(VIETNAM_BOUNDS)
      ? bounds
      : VIETNAM_BOUNDS; // Nếu waypoints nằm ngoài VN, hiển thị toàn bộ VN
    map.fitBounds(constrainedBounds, { padding: [50, 50] });

    // Giới hạn zoom và pan trong khu vực Việt Nam
    map.setMaxBounds(VIETNAM_BOUNDS);
    map.setMinZoom(6); // Zoom tối thiểu để thấy toàn bộ Việt Nam

    // Cleanup function: Xóa control khi component unmount
    return () => {
      if (map && routingControl) {
        map.removeControl(routingControl);
      }
    };
  }, [map, startLocation, endLocation, routeStops]); // Thêm dependencies

  return null; // Component này chỉ để thực thi logic, không render gì
};

export default function RouteMap({
  startLocation,
  endLocation,
  routeStops = [],
  className = "h-64 w-full",
}: RouteMapProps) {
  // Ghi chú: Không cần state isLoading và error ở đây nữa vì dynamic import đã xử lý phần tải.
  // Bạn có thể thêm lại nếu cần xử lý lỗi fetch dữ liệu tọa độ.

  const startIcon = L.divIcon({
    className: "custom-icon",
    html: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="12" cy="12" r="10" fill="#3B82F6" stroke="white" stroke-width="2"/><circle cx="12" cy="12" r="4" fill="white"/></svg>`,
    iconSize: [24, 24],
    iconAnchor: [12, 12],
  });

  const endIcon = L.divIcon({
    className: "custom-icon",
    html: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="12" cy="12" r="10" fill="#EF4444" stroke="white" stroke-width="2"/><circle cx="12" cy="12" r="4" fill="white"/></svg>`,
    iconSize: [24, 24],
    iconAnchor: [12, 12],
  });

  const stopIcon = L.divIcon({
    className: "custom-icon",
    html: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="12" cy="12" r="8" fill="#F59E0B" stroke="white" stroke-width="2"/><circle cx="12" cy="12" r="3" fill="white"/></svg>`,
    iconSize: [20, 20],
    iconAnchor: [10, 10],
  });

  return (
    <div className={`relative ${className}`}>
      <MapContainer
        center={[
          (startLocation.latitude + endLocation.latitude) / 2,
          (startLocation.longitude + endLocation.longitude) / 2,
        ]}
        zoom={8}
        zoomControl={false}
        scrollWheelZoom={true}
        style={{ height: "100%", width: "100%" }}
        className="rounded-lg shadow-lg z-10"
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />

        {/* Start Marker */}
        <Marker
          position={[startLocation.latitude, startLocation.longitude]}
          icon={startIcon}
        >
          <Popup>
            <div className="p-2 max-w-[200px]">
              <div className="font-bold text-primary mb-1">Điểm đón</div>
              <div className="text-sm">{startLocation.address}</div>
              <div className="text-xs text-muted-foreground">{startLocation.city}</div>
            </div>
          </Popup>
        </Marker>

        {/* Route Stops Markers */}
        {routeStops.map((stop, index) => (
          <Marker
            key={index}
            position={[stop.latitude, stop.longitude]}
            icon={stopIcon}
          >
            <Popup>
              <div className="p-2 max-w-[200px]">
                <div className="font-bold text-accent mb-1">
                  Điểm dừng {index + 1}
                </div>
                <div className="text-sm">{stop.address}</div>
                <div className="text-xs text-muted-foreground">{stop.city}</div>
              </div>
            </Popup>
          </Marker>
        ))}

        {/* End Marker */}
        <Marker
          position={[endLocation.latitude, endLocation.longitude]}
          icon={endIcon}
        >
          <Popup>
            <div className="p-2 max-w-[200px]">
              <div className="font-bold text-destructive mb-1">Điểm trả</div>
              <div className="text-sm">{endLocation.address}</div>
              <div className="text-xs text-muted-foreground">{endLocation.city}</div>
            </div>
          </Popup>
        </Marker>

        {/* Ghi chú: Component Routing được gọi bên trong MapContainer */}
        <RoutingMachine
          startLocation={startLocation}
          endLocation={endLocation}
          routeStops={routeStops}
        />
      </MapContainer>

      {/* Map Legend */}
      <div className="absolute top-4 left-4 bg-white rounded-lg shadow-lg p-3 text-sm z-[15]">
        <div className="space-y-2">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-primary rounded-full"></div>
            <span>Điểm đón</span>
          </div>
          {routeStops.length > 0 && (
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-accent rounded-full"></div>
              <span>Điểm dừng</span>
            </div>
          )}
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-destructive rounded-full"></div>
            <span>Điểm trả</span>
          </div>
        </div>
      </div>
    </div>
  );
}
