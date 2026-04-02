import { Hero } from '../components/landing/Hero';
import { StickyShowcase } from '../components/landing/StickyShowcase';
import { CurvedJourney } from '../components/landing/CurvedJourney';
import { StatsRow } from '../components/landing/StatsRow';
import { FinalCTA } from '../components/landing/FinalCTA';

export function LandingPage() {
  return (
    <div className="landing-bg relative min-h-screen text-white overflow-x-hidden">
      {/* ambient floating orbs */}
      <div className="ambient-bg">
        <div className="orb orb-1" />
        <div className="orb orb-2" />
        <div className="orb orb-3" />
        <div className="orb orb-4" />
      </div>

      {/* grain texture overlay */}
      <div className="grain-overlay" />

      {/* page content */}
      <div className="relative z-[2]">
        <Hero />
        <StickyShowcase />
        <CurvedJourney />
        <StatsRow />
        <FinalCTA />
      </div>
    </div>
  );
}
