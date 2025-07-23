import TripItem, { TripItemProps } from "@/components/custom/trip_item";

const AppPage = () => {
  const FakeTripsData: TripItemProps[] = [
    {
      id: 1,
      date: "2023-10-01",
      time: "08:00",
      duration: "2:10",
      price: 15,
      startLocation: "City Center",
      endLocation: "Downtown",
      busOperator: "Busify Express",
      seatsAvailable: 20,
    },
    {
      id: 2,
      date: "2023-10-01",
      time: "18:00",
      duration: "1:30",
      price: 12,
      startLocation: "Uptown",
      endLocation: "Suburbs",
      busOperator: "Green Travels",
      seatsAvailable: 15,
    },
    {
      id: 3,
      date: "2023-10-01",
      time: "22:00",
      duration: "3:00",
      price: 20,
      startLocation: "Airport",
      endLocation: "City Center",
      busOperator: "City Connect",
      seatsAvailable: 10,
    },
    {
      id: 4,
      date: "2023-10-02",
      time: "09:00",
      duration: "4:00",
      price: 25,
      startLocation: "Downtown",
      endLocation: "Beach Resort",
      busOperator: "Travel Buddy",
      seatsAvailable: 30,
    },
  ];

  return (
    <div className="grid lg:grid-cols-3 sm:grid-cols-1 gap-4 p-4">
        {FakeTripsData.map((trip) => (
          <TripItem key={trip.id} trip={trip} />
        ))}
    </div>
  );
};

export default AppPage;
