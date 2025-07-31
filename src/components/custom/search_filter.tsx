// import { Search, Filter } from "lucide-react";
// import {
//   Sheet,
//   SheetClose,
//   SheetContent,
//   SheetDescription,
//   SheetFooter,
//   SheetHeader,
//   SheetTitle,
//   SheetTrigger,
// } from "../ui/sheet";
// import { Button } from "../ui/button";
// import { Label } from "../ui/label";
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "../ui/select";
// import { Checkbox } from "../ui/checkbox";
// import { Slider } from "../ui/slider";
// import { useEffect, useState } from "react";
// import { Calendar28 } from "./date_picker";
// import { getAllRoutes, Route } from "@/lib/data/route";
// import { getAllBusOperators, BusOperator } from "@/lib/data/bus_operator";
// import { getAllSeatLayouts, SeatLayout } from "@/lib/data/seat_layout";

// type SearchFilterProps = {
//   onApplyFilters: (filters: any) => void;
// };

// const SearchFilter = ({ onApplyFilters }: SearchFilterProps) => {
//   const [windowWidth, setWindowWidth] = useState(
//     typeof window !== "undefined" ? window.innerWidth : 768
//   );

//   const DEFAULT_PRICE_RANGE = [0, 2000000];
//   const [priceRange, setPriceRange] = useState(DEFAULT_PRICE_RANGE);
//   const [selectedDate, setSelectedDate] = useState<Date | undefined>();

//   const [selectedRouteId, setSelectedRouteId] = useState<string | undefined>();
//   const [selectedOperatorId, setSelectedOperatorId] = useState<
//     string | undefined
//   >();
//   const [selectedBusTypeIds, setSelectedBusTypeIds] = useState<string[]>([]);

//   const [amenities, setAmenities] = useState({
//     wifi: false,
//     // ac: false,
//     // entertainment: false,
//     // charging: false,
//   });

//   const [durationFilter, setDurationFilter] = useState<string>("any");
//   const [routes, setRoutes] = useState<Route[]>([]);
//   const [operators, setOperators] = useState<BusOperator[]>([]);
//   const [seatLayouts, setSeatLayouts] = useState<SeatLayout[]>([]);

//   useEffect(() => {
//     async function fetchSeatLayouts() {
//       const data = await getAllSeatLayouts();
//       setSeatLayouts(data);
//     }
//     fetchSeatLayouts();
//   }, []);

//   useEffect(() => {
//     async function fetchRoutes() {
//       const data = await getAllRoutes();
//       setRoutes(data);
//     }
//     fetchRoutes();
//   }, []);

//   useEffect(() => {
//     async function fetchOperators() {
//       const data = await getAllBusOperators();
//       setOperators(data);
//     }
//     fetchOperators();
//   }, []);

//   useEffect(() => {
//     const handleResize = () => {
//       setWindowWidth(window.innerWidth);
//     };

//     if (typeof window !== "undefined") {
//       window.addEventListener("resize", handleResize);
//       return () => window.removeEventListener("resize", handleResize);
//     }
//   }, []);

//   const toggleBusType = (id: string) => {
//     setSelectedBusTypeIds((prev) =>
//       prev.includes(id) ? prev.filter((type) => type !== id) : [...prev, id]
//     );
//   };

//   const clearAllFilters = () => {
//     setPriceRange(DEFAULT_PRICE_RANGE);
//     setSelectedRouteId(undefined);
//     setSelectedOperatorId(undefined);
//     setSelectedBusTypeIds([]);
//     setSelectedDate(undefined);
//     setAmenities({
//       wifi: false,
//       // ac: false,
//       // entertainment: false,
//       // charging: false,
//     });
//     setDurationFilter("any");
//   };

//   const applyFilters = () => {
//     let filters = {
//       routeId: selectedRouteId ? Number(selectedRouteId) : undefined,
//       operatorId: selectedOperatorId ? Number(selectedOperatorId) : undefined,
//       minPrice: priceRange[0],
//       maxPrice: priceRange[1],
//       seatLayoutIds:
//         selectedBusTypeIds.length > 0
//           ? selectedBusTypeIds.map((id) => Number(id))
//           : undefined,
//       departureTime: selectedDate
//         ? selectedDate.toLocaleDateString("en-CA")
//         : undefined,
//       durationFilter: durationFilter !== "any" ? durationFilter : undefined,
//       amenities: Object.fromEntries(
//         Object.entries(amenities).filter(([_, v]) => v === true)
//       ),
//     } as any;

//     // Xóa key có giá trị là: undefined, null, mảng rỗng, hoặc object rỗng (ví dụ amenities: {})
//     filters = Object.fromEntries(
//       Object.entries(filters).filter(([_, v]) => {
//         if (v === undefined || v === null) return false;
//         if (Array.isArray(v) && v.length === 0) return false;
//         if (
//           typeof v === "object" &&
//           !Array.isArray(v) &&
//           Object.keys(v).length === 0
//         )
//           return false;
//         return true;
//       })
//     );

//     console.log("Cleaned filters:", filters);
//     onApplyFilters(filters);
//   };

//   return (
//     <Sheet>
//       <SheetTrigger asChild>
//         <Button variant="ghost">
//           <Filter className="w-5 h-5 mr-2" />
//           Filter
//         </Button>
//       </SheetTrigger>
//       <SheetContent
//         side={windowWidth < 640 ? "bottom" : "right"}
//         className="overflow-y-auto p-4 h-full rounded"
//       >
//         <SheetHeader>
//           <SheetTitle className="flex items-center">
//             <Search className="w-5 h-5 mr-2" />
//             Search & Filter
//           </SheetTitle>
//           <SheetDescription>
//             Find the perfect bus trip by filtering routes, operators, and
//             preferences.
//           </SheetDescription>
//         </SheetHeader>

//         <div className="grid flex-1 gap-6 py-6">
//           {/* Route Select */}
//           <div className="grid gap-3">
//             <Label>Route</Label>
//             <Select value={selectedRouteId} onValueChange={setSelectedRouteId}>
//               <SelectTrigger>
//                 <SelectValue placeholder="Select a route" />
//               </SelectTrigger>
//               <SelectContent>
//                 <SelectItem value="any">Any</SelectItem>
//                 {routes.map((route) => (
//                   <SelectItem key={route.id} value={route.id.toString()}>
//                     {route.name}
//                   </SelectItem>
//                 ))}
//               </SelectContent>
//             </Select>
//           </div>

//           {/* Operator Select */}
//           <div className="grid gap-3">
//             <Label>Bus Operator</Label>
//             <Select
//               value={selectedOperatorId}
//               onValueChange={setSelectedOperatorId}
//             >
//               <SelectTrigger>
//                 <SelectValue placeholder="Select operator" />
//               </SelectTrigger>
//               <SelectContent>
//                 <SelectItem value="any">Any</SelectItem>
//                 {operators.map((op) => (
//                   <SelectItem key={op.id} value={op.id.toString()}>
//                     {op.name}
//                   </SelectItem>
//                 ))}
//               </SelectContent>
//             </Select>
//           </div>

//           {/* Price Range */}
//           <div className="grid gap-3">
//             <Label>
//               Khoảng giá ({priceRange[0].toLocaleString("vi-VN")}₫ -{" "}
//               {priceRange[1].toLocaleString("vi-VN")}₫)
//             </Label>
//             <Slider
//               value={priceRange}
//               onValueChange={setPriceRange}
//               min={0}
//               max={2000000}
//               step={50000}
//             />
//             <div className="flex justify-between text-sm text-gray-500">
//               <span>0₫</span>
//               <span>2.000.000₫</span>
//             </div>
//           </div>

//           {/* Bus Types */}
//           <div className="grid gap-3">
//             <Label>Bus Types</Label>
//             <div className="space-y-2">
//               {seatLayouts.map((layout) => (
//                 <div key={layout.id} className="flex items-center space-x-2">
//                   <Checkbox
//                     id={layout.id.toString()}
//                     checked={selectedBusTypeIds.includes(layout.id.toString())}
//                     onCheckedChange={() => toggleBusType(layout.id.toString())}
//                   />
//                   <Label htmlFor={layout.id.toString()}>{layout.name}</Label>
//                 </div>
//               ))}
//             </div>
//           </div>

//           {/* Departure Date */}
//           <div className="grid gap-3">
//             <Label>Departure Date</Label>
//             <Calendar28
//               key={selectedDate?.toISOString() ?? "no-date"}
//               initialDate={selectedDate}
//               onDateChange={setSelectedDate}
//             />
//           </div>

//           {/* Duration */}
//           <div className="grid gap-3">
//             <Label>Trip Duration</Label>
//             <Select value={durationFilter} onValueChange={setDurationFilter}>
//               <SelectTrigger>
//                 <SelectValue placeholder="Select duration" />
//               </SelectTrigger>
//               <SelectContent>
//                 <SelectItem value="any">Any</SelectItem>
//                 <SelectItem value="LESS_THAN_3">Under 3 hours</SelectItem>
//                 <SelectItem value="BETWEEN_3_AND_6">3-6 hours</SelectItem>
//                 <SelectItem value="BETWEEN_6_AND_12">6-12 hours</SelectItem>
//                 <SelectItem value="GREATER_THAN_12">Over 12 hours</SelectItem>
//               </SelectContent>
//             </Select>
//           </div>

//           {/* Amenities */}
//           <div className="grid gap-3">
//             <Label>Amenities</Label>
//             {["wifi"].map((key) => (
//               <div key={key} className="flex items-center space-x-2">
//                 <Checkbox
//                   id={key}
//                   checked={amenities[key as keyof typeof amenities]}
//                   onCheckedChange={(val) =>
//                     setAmenities((prev) => ({ ...prev, [key]: val as boolean }))
//                   }
//                 />
//                 <Label htmlFor={key}>{key.toUpperCase()}</Label>
//               </div>
//             ))}
//           </div>
//         </div>

//         <SheetFooter className="gap-2">
//           <Button
//             variant="outline"
//             onClick={clearAllFilters}
//             className="flex-1"
//           >
//             Clear All
//           </Button>
//           <Button
//             onClick={applyFilters}
//             className="flex-1 bg-green-600 hover:bg-green-700"
//           >
//             Apply Filters
//           </Button>
//           <SheetClose asChild>
//             <Button variant="outline" className="flex-1">
//               Close
//             </Button>
//           </SheetClose>
//         </SheetFooter>
//       </SheetContent>
//     </Sheet>
//   );
// };

// export default SearchFilter;


"use client";

import { useState, useEffect } from "react";
import { Search, Filter } from "lucide-react";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "../ui/sheet";
import { Button } from "../ui/button";
import { Label } from "../ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Checkbox } from "../ui/checkbox";
import { Slider } from "../ui/slider";
import { Calendar28 } from "./date_picker";
import { getAllRoutes, Route } from "@/lib/data/route";
import { getAllBusOperators, BusOperator } from "@/lib/data/bus_operator";
import { getAllSeatLayouts, SeatLayout } from "@/lib/data/seat_layout";

type SearchFilterProps = {
  onApplyFilters: (filters: any) => void;
};

const SearchFilter = ({ onApplyFilters }: SearchFilterProps) => {
  const [windowWidth, setWindowWidth] = useState(
    typeof window !== "undefined" ? window.innerWidth : 768
  );

  const DEFAULT_PRICE_RANGE = [0, 2000000];
  const [priceRange, setPriceRange] = useState(DEFAULT_PRICE_RANGE);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>();

  const [selectedRouteId, setSelectedRouteId] = useState<string | undefined>();
  const [selectedOperatorId, setSelectedOperatorId] = useState<
    string | undefined
  >();
  const [selectedBusTypeIds, setSelectedBusTypeIds] = useState<string[]>([]);

  const [amenities, setAmenities] = useState({
    wifi: false,
  });

  const [durationFilter, setDurationFilter] = useState<string>("any");
  const [routes, setRoutes] = useState<Route[]>([]);
  const [operators, setOperators] = useState<BusOperator[]>([]);
  const [seatLayouts, setSeatLayouts] = useState<SeatLayout[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      setError(null);
      try {
        const [routeData, operatorData, seatLayoutData] = await Promise.all([
          getAllRoutes(),
          getAllBusOperators(),
          getAllSeatLayouts(),
        ]);
        setRoutes(routeData);
        setOperators(operatorData);
        setSeatLayouts(seatLayoutData);
      } catch (err) {
        setError("Failed to load filter data");
        console.error("Error fetching filter data:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };

    if (typeof window !== "undefined") {
      window.addEventListener("resize", handleResize);
      return () => window.removeEventListener("resize", handleResize);
    }
  }, []);

  const toggleBusType = (id: string) => {
    setSelectedBusTypeIds((prev) =>
      prev.includes(id) ? prev.filter((type) => type !== id) : [...prev, id]
    );
  };

  const clearAllFilters = () => {
    setPriceRange(DEFAULT_PRICE_RANGE);
    setSelectedRouteId(undefined);
    setSelectedOperatorId(undefined);
    setSelectedBusTypeIds([]);
    setSelectedDate(undefined);
    setAmenities({
      wifi: false,
    });
    setDurationFilter("any");
  };

  const applyFilters = () => {
    let filters = {
      routeId: selectedRouteId ? Number(selectedRouteId) : undefined,
      operatorId: selectedOperatorId ? Number(selectedOperatorId) : undefined,
      minPrice: priceRange[0],
      maxPrice: priceRange[1],
      seatLayoutIds:
        selectedBusTypeIds.length > 0
          ? selectedBusTypeIds.map((id) => Number(id))
          : undefined,
      departureTime: selectedDate
        ? selectedDate.toLocaleDateString("en-CA")
        : undefined,
      durationFilter: durationFilter !== "any" ? durationFilter : undefined,
      amenities: Object.fromEntries(
        Object.entries(amenities).filter(([_, v]) => v === true)
      ),
    } as any;

    // Remove keys with undefined, null, empty array, or empty object
    filters = Object.fromEntries(
      Object.entries(filters).filter(([_, v]) => {
        if (v === undefined || v === null) return false;
        if (Array.isArray(v) && v.length === 0) return false;
        if (
          typeof v === "object" &&
          !Array.isArray(v) &&
          Object.keys(v).length === 0
        )
          return false;
        return true;
      })
    );

    console.log("Cleaned filters:", filters);
    onApplyFilters(filters);
  };

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="ghost">
          <Filter className="w-5 h-5 mr-2" />
          Filter
        </Button>
      </SheetTrigger>
      <SheetContent
        side={windowWidth < 640 ? "bottom" : "right"}
        className="overflow-y-auto p-4 h-full rounded"
      >
        <SheetHeader>
          <SheetTitle className="flex items-center">
            <Search className="w-5 h-5 mr-2" />
            Search & Filter
          </SheetTitle>
          <SheetDescription>
            Find the perfect bus trip by filtering routes, operators, and
            preferences.
          </SheetDescription>
        </SheetHeader>

        {loading && <div className="py-4 text-center text-gray-500">Đang tải...</div>}
        {error && <div className="py-4 text-center text-red-500">Lỗi: {error}</div>}

        {!loading && !error && (
          <div className="grid flex-1 gap-6 py-6">
            {/* Route Select */}
            <div className="grid gap-3">
              <Label>Route</Label>
              <Select value={selectedRouteId} onValueChange={setSelectedRouteId}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a route" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="any">Any</SelectItem>
                  {routes.map((route) => (
                    <SelectItem key={route.id} value={route.id.toString()}>
                      {route.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Operator Select */}
            <div className="grid gap-3">
              <Label>Bus Operator</Label>
              <Select
                value={selectedOperatorId}
                onValueChange={setSelectedOperatorId}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select operator" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="any">Any</SelectItem>
                  {operators.map((op) => (
                    <SelectItem key={op.id} value={op.id.toString()}>
                      {op.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Price Range */}
            <div className="grid gap-3">
              <Label>
                Khoảng giá ({priceRange[0].toLocaleString("vi-VN")}₫ -{" "}
                {priceRange[1].toLocaleString("vi-VN")}₫)
              </Label>
              <Slider
                value={priceRange}
                onValueChange={setPriceRange}
                min={0}
                max={2000000}
                step={50000}
              />
              <div className="flex justify-between text-sm text-gray-500">
                <span>0₫</span>
                <span>2.000.000₫</span>
              </div>
            </div>

            {/* Bus Types */}
            <div className="grid gap-3">
              <Label>Bus Types</Label>
              <div className="space-y-2">
                {seatLayouts.map((layout) => (
                  <div key={layout.id} className="flex items-center space-x-2">
                    <Checkbox
                      id={layout.id.toString()}
                      checked={selectedBusTypeIds.includes(layout.id.toString())}
                      onCheckedChange={() => toggleBusType(layout.id.toString())}
                    />
                    <Label htmlFor={layout.id.toString()}>{layout.name}</Label>
                  </div>
                ))}
              </div>
            </div>

            {/* Departure Date */}
            <div className="grid gap-3">
              <Label>Departure Date</Label>
              <Calendar28
                key={selectedDate?.toISOString() ?? "no-date"}
                initialDate={selectedDate}
                onDateChange={setSelectedDate}
              />
            </div>

            {/* Duration */}
            <div className="grid gap-3">
              <Label>Trip Duration</Label>
              <Select value={durationFilter} onValueChange={setDurationFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Select duration" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="any">Any</SelectItem>
                  <SelectItem value="LESS_THAN_3">Under 3 hours</SelectItem>
                  <SelectItem value="BETWEEN_3_AND_6">3-6 hours</SelectItem>
                  <SelectItem value="BETWEEN_6_AND_12">6-12 hours</SelectItem>
                  <SelectItem value="GREATER_THAN_12">Over 12 hours</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Amenities */}
            <div className="grid gap-3">
              <Label>Amenities</Label>
              {["wifi"].map((key) => (
                <div key={key} className="flex items-center space-x-2">
                  <Checkbox
                    id={key}
                    checked={amenities[key as keyof typeof amenities]}
                    onCheckedChange={(val) =>
                      setAmenities((prev) => ({ ...prev, [key]: val as boolean }))
                    }
                  />
                  <Label htmlFor={key}>{key.toUpperCase()}</Label>
                </div>
              ))}
            </div>
          </div>
        )}

        <SheetFooter className="gap-2">
          <Button
            variant="outline"
            onClick={clearAllFilters}
            className="flex-1"
          >
            Clear All
          </Button>
          <Button
            onClick={applyFilters}
            className="flex-1 bg-green-600 hover:bg-green-700"
          >
            Apply Filters
          </Button>
          <SheetClose asChild>
            <Button variant="outline" className="flex-1">
              Close
            </Button>
          </SheetClose>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
};

export default SearchFilter;