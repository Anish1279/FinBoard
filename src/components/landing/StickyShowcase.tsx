import { useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { Shield, Zap, Globe, Cpu } from 'lucide-react';

const SHOWCASE_STEPS = [
  {
    title: 'Quantum Execution',
    description: 'Our proprietary engine processes transactions with sub-millisecond precision, ensuring your capital is never idle.',
    icon: Zap,
    metric: '< 1ms',
  },
  {
    title: 'Adaptive Intelligence',
    description: 'Neural networks constantly analyze spending DNA to automatically categorize and forecast your fiscal trajectory.',
    icon: Cpu,
    metric: '99.9%',
  },
  {
    title: 'Military-Grade Vault',
    description: 'Encrypted end-to-end. Your financial data is securely fragmented and stored across decentralized nodes.',
    icon: Shield,
    metric: 'AES-256',
  },
  {
    title: 'Global Synchronization',
    description: 'Instantly sync and settle across 140+ currencies. Market fluctuations are managed in real-time.',
    icon: Globe,
    metric: '140+',
  },
];

export function StickyShowcase() {
  const containerRef = useRef<HTMLDivElement>(null);
  const cardsWrapperRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced) return;

    const cards = gsap.utils.toArray('.showcase-card') as HTMLElement[];
    const totalScrollSpace = cards.length * 150; // Pin for 600% of viewport height (slower scroll)

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: containerRef.current,
        start: 'top top',
        end: `+=${totalScrollSpace}%`,
        pin: true,
        scrub: 1,
      }
    });

    // 1. Visual core continuous animation
    tl.to('.core-ring-1', { rotation: 360, ease: 'none', duration: 1 }, 0);
    tl.to('.core-ring-2', { rotation: -360, ease: 'none', duration: 1 }, 0);
    tl.to('.core-cube', { rotationX: 360, rotationY: 360, ease: 'none', duration: 1 }, 0);

    // 2. Animate the cards container upwards continuously
    const distanceToScroll = (cards.length - 1) * window.innerHeight;
    tl.to(cardsWrapperRef.current, { y: -distanceToScroll, ease: 'none', duration: 1 }, 0);

    // 3. Stagger opacity/blur effects synced to the scrub timeline percent
    cards.forEach((card, i) => {
      const centerTime = i / (cards.length - 1); 
      
      const fadeInStart = Math.max(0, centerTime - 0.2); 
      const fadeInEnd = Math.max(0, centerTime);
      const holdEnd = Math.min(1, centerTime + 0.2);
      const fadeOutEnd = Math.min(1, centerTime + 0.35);

      // fade IN from 0 opacity up to centerTime
      if (i === 0) {
        // the first one starts solid
        gsap.set(card, { opacity: 1, scale: 1, filter: 'blur(0px)' });
      } else {
        tl.fromTo(card, 
          { opacity: 0.1, scale: 0.9, filter: 'blur(8px)' },
          { opacity: 1, scale: 1, filter: 'blur(0px)', ease: 'power2.out' },
          fadeInStart
        );
        // clamp tween ending precisely at its center index
        tl.to(card, { duration: fadeInEnd - fadeInStart }, fadeInStart);
      }

      // fade OUT
      if (i < cards.length - 1) {
        tl.to(card, 
          { opacity: 0.1, scale: 0.9, filter: 'blur(8px)', ease: 'power2.in' },
          holdEnd
        );
        tl.to(card, { duration: fadeOutEnd - holdEnd }, holdEnd);
      }
    });

  }, { scope: containerRef, dependencies: [] });

  return (
    <section ref={containerRef} className="bg-surface-950 w-full h-screen overflow-hidden flex relative">
      {/* Background & Visual on Left */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_right_center,rgba(2,132,199,0.1),transparent_50%)] z-0 pointer-events-none" />
      <div className="absolute inset-0 bg-gradient-to-b from-surface-950 via-transparent to-surface-950 z-0 pointer-events-none" />
      
      <div className="absolute left-0 top-0 w-full h-full lg:w-[50vw] flex items-center justify-center z-0 pointer-events-none opacity-20 lg:opacity-100" style={{ perspective: '1200px' }}>
        <div className="relative w-[300px] h-[300px] md:w-[400px] md:h-[400px] flex items-center justify-center" style={{ transformStyle: 'preserve-3d' }}>
          <div className="absolute inset-0 bg-sky-500/10 blur-[120px] rounded-full m-auto" />
          <div className="core-ring-1 absolute inset-0 border border-sky-500/20 rounded-full" />
          <div className="core-ring-2 absolute inset-5 border-2 border-dashed border-sky-400/30 rounded-full" />
          <div className="core-cube w-32 h-32 md:w-48 md:h-48 bg-gradient-to-tr from-sky-600/40 to-emerald-400/10 backdrop-blur-3xl border border-white/10 rounded-3xl flex items-center justify-center shadow-[0_0_80px_rgba(14,165,233,0.3)]">
            <span className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-white/50" style={{ fontFamily: 'Syne, sans-serif'}}>
              A.I.
            </span>
          </div>
          <div className="absolute w-[200%] h-[1px] bg-gradient-to-r from-sky-500/0 via-sky-500/50 to-sky-500/0 rotate-45" />
          <div className="absolute w-[200%] h-[1px] bg-gradient-to-r from-sky-500/0 via-emerald-500/40 to-sky-500/0 -rotate-45" />
        </div>
      </div>

      {/* Cards container - right side */}
      <div className="w-full lg:w-[50vw] ml-auto h-full relative z-10 overflow-visible">
        <div ref={cardsWrapperRef} className="absolute top-0 left-0 w-full flex flex-col justify-start px-6 sm:px-12">
          {SHOWCASE_STEPS.map((step, i) => (
            <div key={i} className="showcase-card w-full max-w-md h-screen flex flex-col justify-center will-change-transform opacity-10 blur-[4px] scale-90 lg:pl-16">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-14 h-14 rounded-2xl bg-white/[0.03] border border-white/[0.08] flex items-center justify-center text-sky-400 backdrop-blur-lg">
                  <step.icon size={26} strokeWidth={1.5} />
                </div>
                <span className="inline-flex px-3 py-1 text-xs font-mono font-medium text-sky-300 bg-sky-400/10 rounded-full border border-sky-400/20 backdrop-blur-md">
                  {step.metric}
                </span>
              </div>
              <h3 
                className="text-3xl md:text-5xl font-bold text-white mb-6 leading-tight tracking-tight"
                style={{ fontFamily: 'Syne, sans-serif' }}
              >
                {step.title}
              </h3>
              <p 
                className="text-lg text-gray-400 leading-relaxed font-light"
                style={{ fontFamily: 'DM Sans, sans-serif' }}
              >
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
