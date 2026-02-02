import {
  Card,
  CardHeader,
  CardTitle,
  CardContent} from '@/components/ui/card';
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from '@/components/ui/button';

const PricingCard = ({
  title,
  price,
  currency,
  period,
  features,
  selected,
  onSelect,
  actionLabel = "Select plan",
}) => {
  return (
    <Card
      onClick={onSelect}
      className={cn(
        "w-full max-w-xs cursor-pointer transition border-none px-2 shadow-lg",
        selected
          ? "scale-105"
          : "hover:bg-card/70"
      )}
    >
      <CardHeader className="relative space-y-1 ">
        {period === "year" && (
          <span className="absolute right-4 top-4 rounded-full bg-primary px-2 py-1 text-xs text-white">
            Save More
          </span>
        )}

        <CardTitle className={`text-lg ${price === 0 ? "invisible" : ""}`}>
          {title}
        </CardTitle>

        <div className="text-3xl font-bold ">
          {price === 0 ? (
            "Free"
          ) : (
            <>
              {currency} {price}
              <span className="text-sm font-normal text-muted-foreground">
                /{period}
              </span>
            </>
          )}

          <Button variant="outline"
            className={cn(
              "w-full mt-4 transition  cursor-pointer hover:bg-secondary-foreground/70 hover:text-primary-foreground",
              selected
                ? "bg-primary hover:bg-primary hover:text-primary-foreground"
                : ""
            )}
          >
            {selected ? "Selected" : actionLabel}
          </Button>
        </div>
      </CardHeader>

      <CardContent className="b">
        <ul className="space-y-2 text-sm font-semibold ">
          {features.map((feature, idx) => (
            <li key={idx} className="flex items-start gap-2">
              <Check className="h-4 w-4 text-primary mt-0.5" />
              <span>{feature}</span>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
};

export default PricingCard;
