// "use client"

// import { useState } from "react"
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
// import { Button } from "@/components/ui/button"
// import { Input } from "@/components/ui/input"
// import { Label } from "@/components/ui/label"
// import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
// import { Separator } from "@/components/ui/separator"
// import { Badge } from "@/components/ui/badge"
// import { MapPin, Clock, User, CreditCard, AlertTriangle } from "lucide-react"

// interface BookingData {
//   trip: {
//     route: string
//     operator: string
//     departureTime: string
//     arrivalTime: string
//     date: string
//     duration: string
//   }
//   selectedSeats: string[]
//   passenger: {
//     name: string
//     phone: string
//     email: string
//   }
//   pricing: {
//     basePrice: number
//     totalPrice: number
//   }
// }

// interface PageProps {
//   params: {
//     id: string // trip_id from URL
//   }
// }

// export default function BookingConfirmation({ params }: PageProps) {
//   const [promoCode, setPromoCode] = useState("")
//   const [paymentMethod, setPaymentMethod] = useState("full")
//   const [discount, setDiscount] = useState(0)
//   const [isLoggedIn] = useState(true) // Mock login status
//   const tripId = params.id // Lấy trip_id từ URL
//   const [selectedPaymentMethod, setSelectedPaymentMethod] = useState("")
//   // Dữ liệu mock tĩnh để render tạm thời
//   const mockData: BookingData = tripId=== "1" ? {
//     trip: {
//       route: "TP.HCM → Đà Lạt",
//       operator: "Liên Hưng",
//       departureTime: "08:00",
//       arrivalTime: "14:00",
//       date: "01/08/2025",
//       duration: "6 giờ",
//     },
//     selectedSeats: ["A01", "A02"],
//     passenger: {
//       name: "Nguyễn Văn A",
//       phone: "0123456789",
//       email: "nguyenvana@email.com",
//     },
//     pricing: {
//       basePrice: 250000,
//       totalPrice: 500000,
//     },
//   }: {
//   trip: {
//     route: "Đà Nẵng → Huế",
//     operator: "Mai Linh",
//     departureTime: "14:00",
//     arrivalTime: "17:00",
//     date: "02/08/2025",
//     duration: "3 giờ",
//   },
//   selectedSeats: ["B01"],
//   passenger: {
//     name: "Trần Thị B",
//     phone: "0987654321",
//     email: "tranthib@email.com",
//   },
//   pricing: {
//     basePrice: 150000,
//     totalPrice: 150000,
//   },
// }

//   const depositRate = isLoggedIn ? 0.2 : 0.3
//   const depositAmount = mockData.pricing.totalPrice * depositRate
//   const finalAmount = mockData.pricing.totalPrice - discount

//   const applyPromoCode = () => {
//     if (promoCode === "SAVE10") {
//       setDiscount(50000)
//     } else {
//       setDiscount(0)
//     }
//   }

//   const handleConfirmPayment = () => {
//     console.log("Payment confirmed (mock)", {
//       paymentMethod,
//       amount: paymentMethod === "full" ? finalAmount : depositAmount,
//       promoCode,
//       tripId,
//     })
//   }

//   return (
//     <div className="min-h-screen bg-gray-50 w-full ">
//       <div className="bg-white shadow-sm border-b w-full">
//         <div className="px-4 py-4 w-full">
//           <div className="flex items-center gap-4">

//             <span className="text-gray-600">Xác nhận thông tin đặt vé</span>
//           </div>
//         </div>
//       </div>

//       <div className="px-4 py-8 w-full">
//         <div className="w-full">
//           <div className="grid lg:grid-cols-3 gap-8 w-full">
//             <div className="lg:col-span-2 space-y-6 w-full">
//               <Card className="w-full">
//                 <CardHeader>
//                   <CardTitle className="flex items-center gap-2">
//                     <MapPin className="w-5 h-5 text-green-600" />
//                     Chi tiết chuyến đi
//                   </CardTitle>
//                 </CardHeader>
//                 <CardContent className="space-y-4 w-full">
//                   <div className="flex items-center justify-between">
//                     <div>
//                       <h3 className="font-semibold text-lg">{mockData.trip.route}</h3>
//                       <p className="text-gray-600">{mockData.trip.operator}</p>
//                     </div>
//                     <Badge variant="outline" className="text-green-600 border-green-600">
//                       {mockData.trip.duration}
//                     </Badge>
//                   </div>
//                   <div className="grid md:grid-cols-2 gap-4 w-full">
//                     <div className="flex items-center gap-3">
//                       <Clock className="w-4 h-4 text-gray-500" />
//                       <div>
//                         <p className="text-sm text-gray-500">Khởi hành</p>
//                         <p className="font-medium">
//                           {mockData.trip.departureTime} - {mockData.trip.date}
//                         </p>
//                       </div>
//                     </div>
//                     <div className="flex items-center gap-3">
//                       <Clock className="w-4 h-4 text-gray-500" />
//                       <div>
//                         <p className="text-sm text-gray-500">Dự kiến đến</p>
//                         <p className="font-medium">
//                           {mockData.trip.arrivalTime} - {mockData.trip.date}
//                         </p>
//                       </div>
//                     </div>
//                   </div>
//                 </CardContent>
//               </Card>

//               <Card className="w-full">
//                 <CardHeader>
//                   <CardTitle>Ghế đã chọn</CardTitle>
//                 </CardHeader>
//                 <CardContent>
//                   <div className="flex gap-2 w-full">
//                     {mockData.selectedSeats.map((seat) => (
//                       <Badge key={seat} variant="secondary" className="bg-green-100 text-green-700">
//                         Ghế {seat}
//                       </Badge>
//                     ))}
//                   </div>
//                 </CardContent>
//               </Card>

//               <Card className="w-full">
//                 <CardHeader>
//                   <CardTitle className="flex items-center gap-2">
//                     <User className="w-5 h-5 text-green-600" />
//                     Thông tin hành khách
//                   </CardTitle>
//                 </CardHeader>
//                 <CardContent className="space-y-3 w-full">
//                   <div>
//                     <Label className="text-sm text-gray-500">Họ và tên</Label>
//                     <p className="font-medium">{mockData.passenger.name}</p>
//                   </div>
//                   <div>
//                     <Label className="text-sm text-gray-500">Số điện thoại</Label>
//                     <p className="font-medium">{mockData.passenger.phone}</p>
//                   </div>
//                   <div>
//                     <Label className="text-sm text-gray-500">Email</Label>
//                     <p className="font-medium">{mockData.passenger.email}</p>
//                   </div>
//                 </CardContent>
//               </Card>

//               <Card className="w-full">
//                 <CardHeader>
//                   <CardTitle>Mã giảm giá</CardTitle>
//                 </CardHeader>
//                 <CardContent>
//                   <div className="flex gap-2 w-full">
//                     <Input
//                       placeholder="Nhập mã giảm giá"
//                       value={promoCode}
//                       onChange={(e) => setPromoCode(e.target.value)}
//                       className="w-full"
//                     />
//                     <Button variant="outline" onClick={applyPromoCode} className="w-auto">
//                       Áp dụng
//                     </Button>
//                   </div>
//                   {discount > 0 && (
//                     <p className="text-green-600 text-sm mt-2">
//                       Đã áp dụng mã giảm giá: -{discount.toLocaleString("vi-VN")}đ
//                     </p>
//                   )}
//                 </CardContent>
//               </Card>
//             </div>

//             <div className="space-y-6 w-full">
//               <Card className="w-full">
//                 <CardHeader>
//                   <CardTitle className="flex items-center gap-2">
//                     <CreditCard className="w-5 h-5 text-green-600" />
//                     Tóm tắt thanh toán
//                   </CardTitle>
//                 </CardHeader>
//                 <CardContent className="space-y-4 w-full">
//                   <div className="space-y-2 w-full">
//                     <div className="flex justify-between">
//                       <span>Giá vé ({mockData.selectedSeats.length} ghế)</span>
//                       <span>{mockData.pricing.totalPrice.toLocaleString("vi-VN")}đ</span>
//                     </div>
//                     {discount > 0 && (
//                       <div className="flex justify-between text-green-600">
//                         <span>Giảm giá</span>
//                         <span>-{discount.toLocaleString("vi-VN")}đ</span>
//                       </div>
//                     )}
//                     <Separator />
//                     <div className="flex justify-between font-semibold text-lg">
//                       <span>Tổng tiền</span>
//                       <span className="text-green-600">{finalAmount.toLocaleString("vi-VN")}đ</span>
//                     </div>
//                   </div>

//                   <div className="space-y-4 w-full">
//                     <Label className="text-base font-medium">Lựa chọn thanh toán</Label>
//                     <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod} className="w-full">
//                       <div className="flex items-center space-x-2 w-full">
//                         <RadioGroupItem value="full" id="full" />
//                         <Label htmlFor="full" className="flex-1">
//                           <div>
//                             <p className="font-medium">Thanh toán toàn bộ</p>
//                             <p className="text-sm text-gray-500">Trả {finalAmount.toLocaleString("vi-VN")}đ ngay</p>
//                           </div>
//                         </Label>
//                       </div>
//                       <div className="flex items-center space-x-2 w-full">
//                         <RadioGroupItem value="deposit" id="deposit" />
//                         <Label htmlFor="deposit" className="flex-1">
//                           <div>
//                             <p className="font-medium">Đặt cọc trước</p>
//                             <p className="text-sm text-gray-500">
//                               Trả {depositAmount.toLocaleString("vi-VN")}đ ({Math.round(depositRate * 100)}%)
//                             </p>
//                           </div>
//                         </Label>
//                       </div>
//                     </RadioGroup>
//                   </div>

//                   {paymentMethod === "deposit" && (
//                     <Card className="bg-yellow-50 border-yellow-200 w-full">
//                       <CardContent className="p-4 space-y-3 w-full">
//                         <div className="flex items-start gap-2 w-full">
//                           <AlertTriangle className="w-4 h-4 text-yellow-600 mt-0.5" />
//                           <div className="space-y-2 text-sm w-full">
//                             <p className="font-medium text-yellow-800">Thông tin đặt cọc:</p>
//                             <ul className="space-y-1 text-yellow-700 w-full">
//                               <li>• Số tiền cọc: {depositAmount.toLocaleString("vi-VN")}đ</li>
//                               <li>• Hạn thanh toán: Trước 2 giờ khởi hành</li>
//                               <li>• Số tiền còn lại: {(finalAmount - depositAmount).toLocaleString("vi-VN")}đ</li>
//                             </ul>
//                             <p className="text-yellow-800 font-medium w-full">
//                               ⚠️ Vé sẽ bị hủy tự động nếu không thanh toán đủ đúng hạn
//                             </p>
//                           </div>
//                         </div>
//                       </CardContent>
//                     </Card>
//                   )}

//                   {/* Payment Methods */}
//                   <div className="space-y-4">
//                     <Label className="text-base font-medium">Phương thức thanh toán</Label>
//                     <RadioGroup value={selectedPaymentMethod} onValueChange={setSelectedPaymentMethod}>
//                       <div className="grid grid-rows-2 gap-3">
//                         <div className="flex items-center space-x-2 p-3 border rounded-lg hover:bg-gray-50">
//                           <RadioGroupItem value="momo" id="momo" />
//                           <Label htmlFor="momo" className="flex items-center gap-2 cursor-pointer">
//                             <div className="w-6 h-6 rounded flex items-center justify-center">
//                             <img src="https://cdn.haitrieu.com/wp-content/uploads/2022/10/Logo-MoMo-Circle.png" alt="MoMo Logo" className="w-4 h-4" />
//                             </div>
//                             <span className="text-sm font-medium">MoMo</span>
//                           </Label>
//                         </div>

//                         <div className="flex items-center space-x-2 p-3 border rounded-lg hover:bg-gray-50">
//                           <RadioGroupItem value="zalopay" id="zalopay" />
//                           <Label htmlFor="zalopay" className="flex items-center gap-2 cursor-pointer">
//                             <div className="w-6 h-6 rounded flex items-center justify-center">
//                               <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRwPynD27LbXlPsbofv1AX-5ZXDn_XMGo-1TA&s" width="500" height="500" alt="ZaloPay" className="w-4 h-4" />
//                             </div>
//                             <span className="text-sm font-medium">ZaloPay</span>
//                           </Label>
//                         </div>

//                         <div className="flex items-center space-x-2 p-3 border rounded-lg hover:bg-gray-50">
//                           <RadioGroupItem value="viettelmoney" id="viettelmoney" />
//                           <Label htmlFor="viettelmoney" className="flex items-center gap-2 cursor-pointer">
//                             <div className="w-6 h-6 rounded flex items-center justify-center">
//                               <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSg4HNMFnJLLavO19NsgZZucD9GEVqPG-uG4Q&s" alt="ViettelMoney" className="w-4 h-4" />
//                             </div>
//                             <span className="text-sm font-medium">ViettelMoney</span>
//                           </Label>
//                         </div>

//                         <div className="flex items-center space-x-2 p-3 border rounded-lg hover:bg-gray-50">
//                           <RadioGroupItem value="vnpay" id="vnpay" />
//                           <Label htmlFor="vnpay" className="flex items-center gap-2 cursor-pointer">
//                             <div className="w-6 h-6 rounded flex items-center justify-center">
//                               <img src="https://cdn-new.topcv.vn/unsafe/150x/https://static.topcv.vn/company_logos/cong-ty-cp-giai-phap-thanh-toan-viet-nam-vnpay-6194ba1fa3d66.jpg" alt="VNPAY" className="w-4 h-4" />
//                             </div>
//                             <span className="text-sm font-medium">VNPay</span>
//                           </Label>
//                         </div>

//                         <div className="flex items-center space-x-2 p-3 border rounded-lg hover:bg-gray-50">
//                           <RadioGroupItem value="shopeepay" id="shopeepay" />
//                           <Label htmlFor="shopeepay" className="flex items-center gap-2 cursor-pointer">
//                             <div className="w-6 h-6 rounded flex items-center justify-center">
//                              <img src="https://cdn.haitrieu.com/wp-content/uploads/2022/10/Logo-ShopeePay-V.png" alt="SPAY" className="w-4 h-4" />
//                             </div>
//                             <span className="text-sm font-medium">ShopeePay</span>
//                           </Label>
//                         </div>

//                         <div className="flex items-center space-x-2 p-3 border rounded-lg hover:bg-gray-50">
//                           <RadioGroupItem value="vietcombank" id="vietcombank" />
//                           <Label htmlFor="vietcombank" className="flex items-center gap-2 cursor-pointer">
//                             <div className="w-6 h-6 rounded flex items-center justify-center">
//                              <img src="https://hienlaptop.com/wp-content/uploads/2024/12/logo-vietcombank-vector-13.png" alt="VCB" className="w-4 h-4" />
//                             </div>
//                             <span className="text-sm font-medium">Vietcombank</span>
//                           </Label>
//                         </div>
//                       </div>
//                     </RadioGroup>
//                   </div>

//                   {/* QR Code Display */}
//                   {selectedPaymentMethod && (
//                     <Card className="bg-blue-50 border-blue-200">
//                       <CardContent className="p-4">
//                         <div className="text-center space-y-4">
//                           <div className="flex items-center justify-center gap-2">
//                             <div
//                               className={`w-6 h-6 rounded flex items-center justify-center ${
//                                 selectedPaymentMethod === "momo"
//                                   ? "bg-pink-500"
//                                   : selectedPaymentMethod === "zalopay"
//                                     ? "bg-blue-500"
//                                     : selectedPaymentMethod === "viettelmoney"
//                                       ? "bg-red-500"
//                                       : selectedPaymentMethod === "vnpay"
//                                         ? "bg-blue-600"
//                                         : selectedPaymentMethod === "shopeepay"
//                                           ? "bg-orange-500"
//                                           : "bg-green-600"
//                               }`}
//                             >
//                               <span className="text-white text-xs font-bold">
//                                 {selectedPaymentMethod.charAt(0).toUpperCase()}
//                               </span>
//                             </div>
//                             <h3 className="font-semibold text-blue-800">
//                               Thanh toán qua{" "}
//                               {selectedPaymentMethod === "momo"
//                                 ? "MoMo"
//                                 : selectedPaymentMethod === "zalopay"
//                                   ? "ZaloPay"
//                                   : selectedPaymentMethod === "viettelmoney"
//                                     ? "ViettelMoney"
//                                     : selectedPaymentMethod === "vnpay"
//                                       ? "VNPay"
//                                       : selectedPaymentMethod === "shopeepay"
//                                         ? "ShopeePay"
//                                         : "Vietcombank"}
//                             </h3>
//                           </div>

//                           {/* QR Code Placeholder */}
//                           <div className="flex justify-center">
//                             <div className="w-48 h-48 bg-white border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center">
//                               <img
//                                 src={`/placeholder.svg?height=180&width=180&text=QR+${selectedPaymentMethod.toUpperCase()}`}
//                                 alt={`QR Code ${selectedPaymentMethod}`}
//                                 className="w-44 h-44"
//                               />
//                             </div>
//                           </div>

//                           <div className="space-y-2 text-sm text-blue-700">
//                             <p className="font-medium">Quét mã QR để thanh toán</p>
//                             <p>
//                               Số tiền:{" "}
//                               <span className="font-bold text-lg">
//                                 {paymentMethod === "full"
//                                   ? finalAmount.toLocaleString("vi-VN")
//                                   : depositAmount.toLocaleString("vi-VN")}
//                                 đ
//                               </span>
//                             </p>
//                             <p>
//                               Nội dung: BUSIFY - {mockData.trip.route} - {mockData.selectedSeats.join(", ")}
//                             </p>
//                           </div>

//                           <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
//                             <p className="text-xs text-yellow-800">
//                               <strong>Lưu ý:</strong> Sau khi thanh toán thành công, vui lòng chờ 1-2 phút để hệ thống
//                               xử lý giao dịch.
//                             </p>
//                           </div>
//                         </div>
//                       </CardContent>
//                     </Card>
//                   )}

//                   <Button
//                     className="w-full bg-green-600 hover:bg-green-700 text-white py-3"
//                     onClick={handleConfirmPayment}
//                   >
//                     Xác nhận và Thanh toán
//                     <span className="ml-2">
//                       {paymentMethod === "full"
//                         ? finalAmount.toLocaleString("vi-VN")
//                         : depositAmount.toLocaleString("vi-VN")}
//                       đ
//                     </span>
//                   </Button>

//                   <div className="text-xs text-gray-500 space-y-1 w-full">
//                     <p>• Chính sách hủy vé linh hoạt</p>
//                     <p>• Hỗ trợ 24/7 qua hotline</p>
//                     <p>• Đảm bảo ghế đã đặt</p>
//                     <p>• Thanh toán an toàn</p>
//                   </div>
//                 </CardContent>
//               </Card>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   )
// }
"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import BookingInteractiveSection from "@/components/custom/booking/BookingInteractiveSection";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MapPin, Clock, User } from "lucide-react";
import { Label } from "@radix-ui/react-label";
import React from "react";

interface TripApiResponse {
  code: number;
  message: string;
  result: {
    departureTime: string;
    bus: {
      licensePlate: string;
      name: string;
      seats: number;
    };
    price_per_seat: number;
    route: {
      startLocation: {
        address: string;
        city: string;
        latitude: number;
        name: string;
        longtitude: number;
      };
      estimatedDuration: number;
      endLocation: {
        address: string;
        city: string;
        latitude: number;
        name: string;
        longtitude: number;
      };
    };
    id: number;
    operator: {
      name: string;
      id: number;
    };
    route_stop: Array<{
      address: string;
      city: string;
      latitude: number;
      longtitude: number;
      time_offset_from_start: number;
    }>;
  };
}

interface BookingData {
  trip: {
    route: string;
    operator: string;
    departureTime: string;
    arrivalTime: string;
    date: string;
    duration: string;
  };
  selectedSeats: string[];
  passenger: {
    name: string;
    phone: string;
    email: string;
  };
  pricing: {
    basePrice: number;
    totalPrice: number;
  };
}

interface PageProps {
  params: Promise<{ id: string }>; // params là Promise
}

export default function BookingConfirmation({ params }: PageProps) {
  // Unwrap params bằng React.use()
  const { id: tripId } = React.use(params);
  const searchParams = useSearchParams();

  // Lấy dữ liệu từ query params
  const selectedSeatsFromParams = searchParams.get("seats")?.split(",") || [];
  const fullName = searchParams.get("fullName") || "";
  const phone = searchParams.get("phone") || "";
  const email = searchParams.get("email") || "";

  // State để lưu dữ liệu
  const [tripData, setTripData] = useState<TripApiResponse | null>(null);
  const [bookingData, setBookingData] = useState<BookingData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Kiểm tra query params
    if (!selectedSeatsFromParams.length || !fullName || !phone || !email) {
      setError("Thông tin đặt vé không đầy đủ. Vui lòng kiểm tra lại.");
      setLoading(false);
      return;
    }

    const fetchTripData = async () => {
      setLoading(true);
      try {
        const response = await fetch(`http://localhost:8080/api/trips/${tripId}`);
        if (!response.ok) throw new Error(`Lỗi khi gọi API: ${response.status}`);
        const data: TripApiResponse = await response.json();
        setTripData(data);

        // Chuyển đổi dữ liệu
        const departureTime = new Date(data.result.departureTime).toLocaleTimeString("vi-VN", {
          hour: "2-digit",
          minute: "2-digit",
        });
        const durationHours = Math.floor(data.result.route.estimatedDuration / 60);
        const durationMinutes = data.result.route.estimatedDuration % 60;
        const durationString = `${durationHours} giờ ${durationMinutes > 0 ? `${durationMinutes} phút` : ""}`;
        const totalPrice = data.result.price_per_seat * selectedSeatsFromParams.length;

        const departureDateTime = new Date(data.result.departureTime);
        const arrivalDateTime = new Date(
          departureDateTime.getTime() + data.result.route.estimatedDuration * 60000
        );
        const arrivalTime = arrivalDateTime.toLocaleTimeString("vi-VN", {
          hour: "2-digit",
          minute: "2-digit",
        });

        setBookingData({
          trip: {
            route: `${data.result.route.startLocation.city} → ${data.result.route.endLocation.city}`,
            operator: data.result.operator.name,
            departureTime: departureTime,
            arrivalTime: arrivalTime,
            date: new Date(data.result.departureTime).toLocaleDateString("vi-VN"),
            duration: durationString,
          },
          selectedSeats: selectedSeatsFromParams,
          passenger: {
            name: fullName,
            phone: phone,
            email: email,
          },
          pricing: {
            basePrice: data.result.price_per_seat,
            totalPrice: totalPrice,
          },
        });
      } catch (error) {
        console.error("Lỗi fetch API:", error);
        setError("Không thể tải thông tin chuyến đi. Vui lòng thử lại sau.");
      } finally {
        setLoading(false);
      }
    };

    fetchTripData();
  }, [tripId, selectedSeatsFromParams, fullName, phone, email]);

  if (loading) return <div>Đang tải...</div>;
  if (error) return <div className="text-red-500">{error}</div>;
  if (!bookingData) return <div>Không có dữ liệu để hiển thị</div>;

  return (
    <div className="min-h-screen bg-gray-50 w-full">
      <div className="bg-white shadow-sm border-b w-full">
        <div className="px-4 py-4">
          <div className="flex items-center gap-4">
            <span className="text-gray-600">Xác nhận thông tin đặt vé</span>
          </div>
        </div>
      </div>

      <div className="px-4 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-green-600" />
                  Chi tiết chuyến đi
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-semibold text-lg">
                      {bookingData.trip.route}
                    </h3>
                    <p className="text-gray-600">{bookingData.trip.operator}</p>
                  </div>
                  <Badge
                    variant="outline"
                    className="text-green-600 border-green-600"
                  >
                    {bookingData.trip.duration}
                  </Badge>
                </div>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="flex items-center gap-3">
                    <Clock className="w-4 h-4 text-gray-500" />
                    <div>
                      <p className="text-sm text-gray-500">Khởi hành</p>
                      <p className="font-medium">
                        {bookingData.trip.departureTime} -{" "}
                        {bookingData.trip.date}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Clock className="w-4 h-4 text-gray-500" />
                    <div>
                      <p className="text-sm text-gray-500">Dự kiến đến</p>
                      <p className="font-medium">
                        {bookingData.trip.arrivalTime} - {bookingData.trip.date}
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Ghế đã chọn</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex gap-2">
                  {bookingData.selectedSeats.map((seat) => (
                    <Badge
                      key={seat}
                      variant="secondary"
                      className="bg-green-100 text-green-700"
                    >
                      Ghế {seat}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="w-5 h-5 text-green-600" />
                  Thông tin hành khách
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <Label className="text-sm text-gray-500">Họ và tên</Label>
                  <p className="font-medium">{bookingData.passenger.name}</p>
                </div>
                <div>
                  <Label className="text-sm text-gray-500">Số điện thoại</Label>
                  <p className="font-medium">{bookingData.passenger.phone}</p>
                </div>
                <div>
                  <Label className="text-sm text-gray-500">Email</Label>
                  <p className="font-medium">{bookingData.passenger.email}</p>
                </div>
              </CardContent>
            </Card>
          </div>
          <div className="space-y-6">
            <BookingInteractiveSection
              initialTotalPrice={bookingData.pricing.totalPrice}
              mockData={bookingData}
            />
          </div>
        </div>
      </div>
    </div>
  );
}