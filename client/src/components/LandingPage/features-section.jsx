import { useRef, useState, useCallback } from "react";
import {
  ListChecks,
  DollarSign,
  Users,
  MessageCircle,
  Calendar,
  Lock,
  Zap,
} from "lucide-react";

const features = [
  {
    icon: DollarSign,
    title: "Smart Bill Splitting",
    description:
      "Automatically calculate and split bills fairly among roommates along with settle all at once feature.",
  },
  {
    icon: ListChecks,
    title: "Chore Management",
    description:
      "Assign, track, and rotate household chores to keep everyone accountable.",
  },
  {
    icon: MessageCircle,
    title: "Instant Chat",
    description:
      "Stay connected with your roommates through built-in messaging and notifications.",
  },
  {
    icon: Calendar,
    title: "Shared Calendar",
    description: "One click on date to know the tasks and respective turns.",
  },
  {
    icon: Zap,
    title: "Real-time Updates",
    description:
      "Get instant notifications for bills, chores, and important household updates.",
  },
  {
    icon: Users,
    title: "Polls",
    description: "Resolve conflicts with instant polls.",
  },
];

function FeatureCard({ feature }) {
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

  const Icon = feature.icon;

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="relative group rounded-xl overflow-hidden transition-transform duration-200 ease-out hover:scale-[1.01] hover:-translate-y-0.5"
    >
      {/* Animated border glow */}
      <div
        className="absolute -inset-px rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"
        style={{
          background: isHovered
            ? `radial-gradient(400px circle at ${mousePos.x}px ${mousePos.y}px, rgba(236,72,153,0.3), transparent 40%)`
            : "transparent",
        }}
      />

      {/* Card content */}
      <div className="relative rounded-xl border border-gray-700/50 bg-gray-800/50 p-6 h-full group-hover:border-gray-600/50 transition-colors duration-500">
        {/* Spotlight effect */}
        <div
          className="pointer-events-none absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"
          style={{
            background: isHovered
              ? `radial-gradient(300px circle at ${mousePos.x}px ${mousePos.y}px, rgba(236,72,153,0.06), transparent 40%)`
              : "transparent",
          }}
        />

        {/* Shine effect */}
        <div
          className="pointer-events-none absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"
          style={{
            background: isHovered
              ? `radial-gradient(150px circle at ${mousePos.x}px ${mousePos.y}px, rgba(255,255,255,0.03), transparent 40%)`
              : "transparent",
          }}
        />

        <div className="relative z-10">
          <div className="w-12 h-12 bg-gradient-to-r from-pink-500 to-red-500 rounded-lg flex items-center justify-center mb-4 group-hover:shadow-lg group-hover:shadow-pink-500/20 transition-shadow duration-500">
            <Icon className="w-6 h-6 text-white" />
          </div>

          <h3 className="text-lg font-semibold text-white mb-2">
            {feature.title}
          </h3>

          <p className="text-gray-400 text-sm leading-relaxed">
            {feature.description}
          </p>
        </div>
      </div>
    </div>
  );
}

 function FeaturesSection() {
  return (
    <section className="py-20 px-4 bg-gray-900/50">
      <div className="container mx-auto max-w-6xl">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Everything you need for shared living
          </h2>

          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Streamline your household management with powerful tools designed
            for modern roommates.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <FeatureCard key={index} feature={feature} />
          ))}
        </div>
      </div>
    </section>
  );
}

export default FeaturesSection