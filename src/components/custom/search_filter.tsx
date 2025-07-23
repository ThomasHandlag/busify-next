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
import { Input } from "../ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Checkbox } from "../ui/checkbox";
import { Slider } from "../ui/slider";
import { Separator } from "../ui/separator";
import { Badge } from "../ui/badge";
import { useEffect, useState } from "react";
import { FormItem } from "../ui/form";
import { Calendar28 } from "./date_picker";

const SearchFilter = () => {
  const [windowWidth, setWindowWidth] = useState(
    typeof window !== "undefined" ? window.innerWidth : 768
  );
  const [priceRange, setPriceRange] = useState([10, 50]);
  const [selectedOperators, setSelectedOperators] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedBusTypes, setSelectedBusTypes] = useState<string[]>([]);

  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };

    if (typeof window !== "undefined") {
      window.addEventListener("resize", handleResize);
      return () => window.removeEventListener("resize", handleResize);
    }
  }, []);

  const busTypes = [
    "Standard",
    "VIP Sleeper",
    "Luxury Coach",
    "Mini Bus",
    "Double Decker",
  ];

  const popularRoutes = [
    "Ho Chi Minh → Da Lat",
    "Hanoi → Ha Long Bay",
    "Da Nang → Hoi An",
    "Can Tho → Ho Chi Minh",
    "Nha Trang → Mui Ne",
    "Hanoi → Sapa",
  ];

  const toggleBusType = (busType: string) => {
    setSelectedBusTypes((prev) =>
      prev.includes(busType)
        ? prev.filter((type) => type !== busType)
        : [...prev, busType]
    );
  };

  const clearAllFilters = () => {
    setSearchQuery("");
    setSelectedOperators([]);
    setSelectedBusTypes([]);
    setPriceRange([10, 50]);
  };

  const applyFilters = () => {
    // Here you would typically call a function to apply filters
    console.log("Applying filters:", {
      searchQuery,
      selectedOperators,
      selectedBusTypes,
      priceRange,
    });
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

        <div className="grid flex-1 gap-6 py-6">
          {/* Search Input */}
          <div className="grid gap-3">
            <Label htmlFor="search-input">Search Routes</Label>
            <Input
              id="search-input"
              placeholder="Search by route, city, or destination..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full"
            />
          </div>

          {/* Bus Operators */}
          <div className="grid gap-3">
            <FormItem>
              <Label>Bus Operators</Label>
              <Input placeholder="Search by operator name..." />
            </FormItem>
          </div>

          <Separator />

          {/* Popular Routes */}
          <div className="grid gap-3">
            <Label>Popular Routes</Label>
            <div className="flex flex-wrap gap-2">
              {popularRoutes.map((route, index) => (
                <Badge
                  key={index}
                  variant="outline"
                  className="cursor-pointer hover:bg-green-50 hover:border-green-300"
                  onClick={() => setSearchQuery(route)}
                >
                  {route}
                </Badge>
              ))}
            </div>
          </div>

          <Separator />

          {/* Price Range */}
          <div className="grid gap-3">
            <Label>
              Price Range (${priceRange[0]} - ${priceRange[1]})
            </Label>
            <Slider
              value={priceRange}
              onValueChange={setPriceRange}
              max={100}
              min={5}
              step={5}
              className="w-full"
            />
            <div className="flex justify-between text-sm text-gray-500">
              <span>$5</span>
              <span>$100</span>
            </div>
          </div>

          <Separator />

          {/* Bus Types */}
          <div className="grid gap-3">
            <Label>Bus Types</Label>
            <div className="space-y-2">
              {busTypes.map((busType) => (
                <div key={busType} className="flex items-center space-x-2">
                  <Checkbox
                    id={busType}
                    checked={selectedBusTypes.includes(busType)}
                    onCheckedChange={() => toggleBusType(busType)}
                  />
                  <Label htmlFor={busType} className="text-sm cursor-pointer">
                    {busType}
                  </Label>
                </div>
              ))}
            </div>
          </div>

          <Separator />

          {/* Departure Time */}
          <div className="grid gap-3">
            <FormItem>
              <Label>Departure Time</Label>
              <Calendar28 onDateChange={(date) => console.log(date)} />
            </FormItem>
          </div>

          {/* Trip Duration */}
          <div className="grid gap-3">
            <Label>Maximum Trip Duration</Label>
            <Select>
              <SelectTrigger>
                <SelectValue placeholder="Any duration" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="any">Any duration</SelectItem>
                <SelectItem value="short">Under 3 hours</SelectItem>
                <SelectItem value="medium">3-6 hours</SelectItem>
                <SelectItem value="long">6-12 hours</SelectItem>
                <SelectItem value="overnight">Over 12 hours</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Amenities */}
          <div className="grid gap-3">
            <Label>Amenities</Label>
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Checkbox id="wifi" />
                <Label htmlFor="wifi" className="text-sm cursor-pointer">
                  Wi-Fi
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox id="ac" />
                <Label htmlFor="ac" className="text-sm cursor-pointer">
                  Air Conditioning
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox id="entertainment" />
                <Label
                  htmlFor="entertainment"
                  className="text-sm cursor-pointer"
                >
                  Entertainment System
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox id="charging" />
                <Label htmlFor="charging" className="text-sm cursor-pointer">
                  Charging Ports
                </Label>
              </div>
            </div>
          </div>
        </div>

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
