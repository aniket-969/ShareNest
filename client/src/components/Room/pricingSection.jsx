import { useState } from "react";
import PricingCard from "@/components/ui/pricingCard";
import { Button } from "@/components/ui/button";

const fakePricingResponse = {
  country: "IN",
  currency: "USD",
  plans: {
    free: {
      price: 0,
      period: null,
      popular: false,
      features: [
        "Up to 1 member",
        "One time and recurring tasks",
        "Expense tracking",
      ],
    },
    monthly: {
      price: 2.49,
      period: "month",
      popular: true,
      features: [
        "Up to 6 members",
        "Smart task management",
        "Split Expenses",
        "Admin controls",
        "Room chat & polls",
      ],
    },
    yearly: {
      price: 24.99,
      period: "year",
      popular: false,
      features: [
        "Up to 6 members",
        "Smart task management",
        "Split Expenses",
        "Admin controls",
        "Room chat & polls",
        "Save upto 5$ on yearly billing",
      ],
    },
  },
};

const fakePricingResponseI = {
  country: "IN",
  currency: "INR",
  plans: {
    free: {
      price: 0,
      period: null,
      features: [
        "Up to 1 member",
        "Smart task management",
        "Expense tracking",
      ],
    },
    monthly: {
      price: 99,
      period: "month",
      features: [
        "Up to 6 members",
        "Smart task management",
        "Split Expenses",
        "Admin controls",
        "Room chat & polls",
      ],
    },
    yearly: {
      price: 999,
      period: "year",
      features: [
        "Up to 6 members",
        "Smart task management",
        "Split Expenses",
        "Admin controls",
        "Room chat & polls",
        "Save upto 200₹ on yearly billing",
      ],
    },
  },
};

const PricingSection = ({ onPlanSelect }) => {
  const pricing = fakePricingResponseI;

  const [selectedPlan, setSelectedPlan] = useState(null);

  const handleSelect = (planKey) => {
    setSelectedPlan(planKey);
    onPlanSelect?.(planKey);
  };

  const { currency, plans } = pricing;

  return (
    <div className="flex flex-col gap-5">
      <h2 className="text-xl font-semibold text-center mt-12 mb-4">
        Choose a plan
      </h2>

      <div className="flex gap-5 justify-center">
        {Object.entries(plans).map(([planKey, plan]) => (
          <PricingCard
            key={planKey}
            title={planKey.charAt(0).toUpperCase() + planKey.slice(1)}
            price={plan.price}
            currency={currency}
            period={plan.period}
            features={plan.features}
            popular={plan.popular}
            selected={selectedPlan === planKey}
            onSelect={() => handleSelect(planKey)}
            actionLabel={
              selectedPlan === planKey ? "Selected" : "Select plan"
            }
          />
        ))}
      </div>

      {selectedPlan && (
        <Button className="mx-auto">
          Continue
        </Button>
      )}
    </div>
  );
};

export default PricingSection;
