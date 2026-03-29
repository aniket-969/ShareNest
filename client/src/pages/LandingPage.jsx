import { Header } from "@/components/LandingPage/header";
import FeaturesSection from "@/components/LandingPage/features-section";
import {PricingSection} from "@/components/LandingPage/pricing-section";
import {Footer} from "@/components/LandingPage/footer";
import { HeroSection } from '@/components/LandingPage/hero-section';

const LandingPage = () => {
  return (
    <div className="landing min-h-screen bg-background text-foreground">
      <Header />
      <HeroSection />
      <FeaturesSection />
      <PricingSection />
      <Footer />
    </div>
  );
};

export default LandingPage;
