import { forwardRef, useState } from "react";
import PricingCard from "@/components/ui/pricingCard";
import { Button } from "@/components/ui/button";
import { Spinner } from "../ui/spinner";

const PricingSection = forwardRef(
  ({ onPlanSelect, pricing, isLoading, handleContinueToPayment }, ref) => {
    if (isLoading) return <Spinner />;

    const [selectedPlanId, setSelectedPlanId] = useState(null);

    const handleSelect = (planKey) => {
      setSelectedPlanId(planKey);
      onPlanSelect(planKey);
    };

    const { currency, plans } = pricing;
    console.log(pricing);
 
    return (
      <div className="flex flex-col gap-5 px-8" ref={ref}>
        <h2 className="text-2xl font-semibold text-center mt-12 mb-4">
          Choose a plan
        </h2>

        <div className="flex gap-5 justify-center flex-col md:flex-row md:items-stretch items-center">
          {plans.map((plan) => (
            <PricingCard
              key={plan.planId}
              title={plan.name}
              price={plan.price}
              currency={currency}
              period={plan.period}
              features={plan.features}
              selected={selectedPlanId === plan.planId}
              onSelect={() => handleSelect(plan.planId)}
            />
          ))}
        </div>

        {selectedPlanId && (
          <Button
            className="mx-auto"
            variant="outline"
            onClick={() => handleContinueToPayment()}
          >
            {selectedPlanId === "free" ? "Create Room" : "Continue to Payment"}
          </Button>
        )}
      </div>
    );
  }
);

export default PricingSection;
