import { Button } from "@/components/ui/button";
import { TextGenerateEffect } from "./ui/text-generate-effect";
import { AnimatedGradientBg } from "./ui/animated-gradient-bg";
import { Link } from "react-router-dom";

export function HeroSection() {
  const words = ""; // Placeholder for animation

  return (
    <section className="relative min-h-screen flex justify-center overflow-hidden items-center sm:pb-16 pb-8">
      {/* Animated gradient background */}
      <AnimatedGradientBg />

      {/* Subtle gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/20 to-black/40" />

      <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
        <div className="mb-8 ">
          <TextGenerateEffect
            words={words}
            className="text-4xl md-6xl lg-7xl font-bold text-white leading-tight"
          />
        </div>

        <p className="text-lg text-gray-300 mb-12 max-w-2xl mx-auto leading-relaxed sm:px-0 px-5">
          Track chores, split bills, real-time polls, chat instantly — all in
          one private space.
        </p>

        <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
          <Link to="/register">
            <Button
              size="lg"
              className="bg-gradient-to-r from-pink-500 to-red-500 hover-pink-600 hover-red-600 text-white px-8 py-3 text-md sm:text-lg font-semibold rounded-lg transition-all duration-300 transform hover-105 shadow-lg shadow-pink-500/25"
            >
              Get Started for Free
            </Button>
          </Link>
          <Link to="/login">
            <Button
              variant="outline"
              size="lg"
              className="border-2 border-blue-500 text-blue-400 hover-blue-500 hover-white px-8 py-3 text-md sm:text-lg font-semibold rounded-lg transition-all duration-300 backdrop-blur-sm bg-transparent"
            >
              Video Demo
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
