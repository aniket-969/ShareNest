
import { Button } from "@/components/ui/button"
import { TextGenerateEffect } from "./ui/text-generate-effect"
import { AnimatedGradientBg } from "./ui/animated-gradient-bg"

export function HeroSection() {
  const words = "" // Placeholder for animation

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-black">
      {/* Animated gradient background */}
      <AnimatedGradientBg />

      {/* Subtle gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/20 to-black/40" />

      <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
        <div className="mb-8">
          <TextGenerateEffect
            words={words}
            className="text-4xl md-6xl lg-7xl font-bold text-white leading-tight"
          />
        </div>

        <p className="text-lg md-xl text-gray-300 mb-12 max-w-2xl mx-auto leading-relaxed">
           Track chores, split bills, polls, chat instantly—all in one private space.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Button
            size="lg"
            className="bg-gradient-to-r from-pink-500 to-red-500 hover-pink-600 hover-red-600 text-white px-8 py-3 text-lg font-semibold rounded-lg transition-all duration-300 transform hover-105 shadow-lg shadow-pink-500/25"
          >
            Get Started for Free
          </Button>
          <Button
            variant="outline"
            size="lg"
            className="border-2 border-blue-500 text-blue-400 hover-blue-500 hover-white px-8 py-3 text-lg font-semibold rounded-lg transition-all duration-300 backdrop-blur-sm bg-transparent"
          >
            Live Demo
          </Button>
        </div>
      </div>
    </section>
  )
}
