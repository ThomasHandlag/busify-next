import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Button } from "../ui/button";

export interface BusOperatorItemProps {
  id: number;
  name: string;
  logo: string;
  description: string;
  averageRating: number;
  hotline: string;
  totalReviews: number;
}

const BusOperatorItem = ({
  busOperator,
}: {
  busOperator: BusOperatorItemProps;
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg font-semibold text-green-700">
          {busOperator.name}
        </CardTitle>
        <CardDescription className="text-sm text-gray-600">
          Contact: {busOperator.hotline}
        </CardDescription>
        <CardAction>
          <Button>View Details</Button>
        </CardAction>
      </CardHeader>
      <CardContent>
        <div className="flex w-full items-center justify-between">
          <Avatar>
            <AvatarImage
              src={busOperator.logo}
              alt={`${busOperator.name} Logo`}
            />
            <AvatarFallback>{busOperator.name}</AvatarFallback>
          </Avatar>
          <div className="text-sm text-gray-500">
            {busOperator.totalReviews} reviews
            <span className="text-yellow-500">
              {" "}
              {busOperator.averageRating.toFixed(1)}/5⭐
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default BusOperatorItem;
