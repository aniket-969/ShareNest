import { useEffect, useState, useRef, useCallback } from "react";
import { Check } from "lucide-react";
import { PLAN_FEATURES, ROOM_PLANS } from "@/utils/room-plans";

function getCurrencySymbol(currency) {
  if (currency === "INR") return "₹";
  return "$";
}

function PricingCard({ card, symbol }) {
  const cardRef = useRef(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = useCallback((e) => {
    if (!cardRef.current) return;

    const rect = cardRef.current.getBoundingClientRect();

    setMousePos({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  }, []);

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="relative group rounded-xl overflow-hidden transition-transform duration-200 ease-out hover:scale-[1.02] hover:-translate-y-0.5"
    >
      {/* Glow */}
      <div
        className="absolute -inset-px rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"
        style={{
          background: isHovered
            ? `radial-gradient(400px circle at ${mousePos.x}px ${mousePos.y}px, rgba(236,72,153,0.3), transparent 40%)`
            : "transparent",
        }}
      />

      {/* Card */}
      <div className="relative rounded-xl border border-gray-700/50 bg-gray-800/50 p-6 h-full group-hover:border-gray-600/50 transition-colors duration-500">
        {/* Shine */}
        <div
          className="pointer-events-none absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"
          style={{
            background: isHovered
              ? `radial-gradient(300px circle at ${mousePos.x}px ${mousePos.y}px, rgba(236,72,153,0.06), transparent 40%)`
              : "transparent",
          }}
        />

        {card.badge && (
          <span className="absolute right-4 top-0 rounded-b-lg bg-gradient-to-r from-pink-500 to-red-500 px-3 py-1 text-xs font-semibold text-white z-10">
            {card.badge}
          </span>
        )}

        <div className="relative z-10">
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-white mb-4">
              {card.title}
            </h3>

            <div className="flex items-baseline gap-1">
              {card.price === 0 ? (
                <span className="text-4xl font-bold text-white">Free</span>
              ) : (
                <>
                  <span className="text-4xl font-bold text-white">
                    {symbol}
                    {card.price}
                  </span>
                  {card.period && (
                    <span className="text-sm text-gray-400">
                      /{card.period}
                    </span>
                  )}
                </>
              )}
            </div>
          </div>

          <ul className="space-y-3">
            {card.features.map((feature, idx) => (
              <li key={idx} className="flex items-start gap-2.5">
                <Check className="h-4 w-4 text-pink-400 mt-0.5 flex-shrink-0" />
                <span className="text-sm text-gray-300">{feature}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

export function PricingSection() {
  const [region, setRegion] = useState("USD");

  useEffect(() => {
    fetch("/api/geo")
      .then((res) => res.json())
      .then((data) => {
        if (data.country === "IN") {
          setRegion("INR");
        }
      })
      .catch(() => setRegion("USD"));
  }, []);

  const regionData = ROOM_PLANS[region];
  const { free, pro_monthly, pro_yearly } = regionData.plans;
  const symbol = getCurrencySymbol(regionData.currency);

  const cards = [
    {
      id: "free",
      title: free.label,
      price: free.price,
      period: free.period,
      features: PLAN_FEATURES.free,
      badge: null,
      action: "Get Started"
    },
    {
      id: "pro_monthly",
      title: pro_monthly.label,
      price: pro_monthly.price,
      period: pro_monthly.period,
      features: PLAN_FEATURES.pro,
      badge: null,
      action: "Subscribe"
    },
    {
      id: "pro_yearly",
      title: pro_yearly.label,
      price: pro_yearly.price,
      period: pro_yearly.period,
      features: PLAN_FEATURES.pro,
      badge: "Save More",
      action: "Subscribe"
    },
  ];

  return (
    <section className="py-16 px-4 bg-gradient-to-b from-gray-900/50 to-black">
      <div className="container mx-auto max-w-5xl">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Simple, Transparent Pricing
          </h2>

          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            No hidden fees. Pick a plan that works for your household.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-stretch">
          {cards.map((card) => (
            <PricingCard key={card.id} card={card} symbol={symbol} />
          ))}
        </div>
      </div>
    </section>
  );
}
