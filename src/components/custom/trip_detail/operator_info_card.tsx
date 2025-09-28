import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getBusOperatorById } from "@/lib/data/bus_operator";
import { Star, Phone, MapPin } from "lucide-react";
import { getTranslations } from "next-intl/server";

import Image from "next/image";
import ViewTripBtn from "./view_trip_btn";

export async function OperatorInfoCard({ id }: { id: number }) {
  const operatorDetail = await getBusOperatorById(id);
  const t = await getTranslations("TripDetail");

  if (!operatorDetail) {
    return (
      <Card>
        <CardContent>
          <p>{t("operatorNotFound")}</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <span>{t("busOperator")}</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="flex justify-between flex-col lg:flex-row gap-2">
        <div>
          <div className="flex items-center space-x-4 mb-4">
            <Image
              aria-label="Image21"
              src={operatorDetail.logoUrl ?? "/logo.png"}
              alt={operatorDetail.name ?? "Logo"}
              width={48}
              height={48}
              className="w-12 h-12 rounded-lg"
            />
            <div>
              <h3 className="text-lg font-semibold">{operatorDetail.name}</h3>
              <div className="flex items-center space-x-2">
                <Star className="w-4 h-4 text-accent fill-current" />
                <span className="text-sm text-muted-foreground">
                  {operatorDetail.rating}/5 ({operatorDetail.totalReviews}{" "}
                  {t("reviews")})
                </span>
              </div>
            </div>
          </div>
          <div className="space-y-2">
            <div className="flex items-center space-x-3">
              <Phone className="w-5 h-5 text-muted-foreground" />
              <span className="text-muted-foreground">
                {operatorDetail.hotline}
              </span>
            </div>
            <div className="flex items-center space-x-3">
              <MapPin className="w-5 h-5 text-muted-foreground" />
              <span className="text-muted-foreground">
                {t("headquarters")} {operatorDetail.address}
              </span>
            </div>
          </div>
        </div>
        <ViewTripBtn name={operatorDetail.name} />
      </CardContent>
    </Card>
  );
}
