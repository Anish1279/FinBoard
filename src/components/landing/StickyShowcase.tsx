import { useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
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
  const visualRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced) return;

    const cards = gsap.utils.toArray('.showcase-card') as HTMLElement[];
    const totalDuration = cards.length * 100;

    // Pin the visual container
    ScrollTrigger.create({
      trigger: containerRef.current,
      start: 'top top',
      end: `+=${totalDuration}%`,
      pin: visualRef.current,
      pinSpacing: false,
      scrub: 1,
    });

    // Create a timeline for the core visual rotation/morph
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: containerRef.current,
        start: 'top top',
        end: `+=${totalDuration}%`,
        scrub: 1,
      }
    });

    tl.to('.core-ring-1', { rotation: 360, ease: 'none', duration: 1 }, 0);
    tl.to('.core-ring-2', { rotation: -360, ease: 'none', duration: 1 }, 0);
    tl.to('.core-cube', { rotationX: 360, rotationY: 360, ease: 'none', duration: 1 }, 0);

    // Fade cards in and out
    cards.forEach((card, i) => {
      // Create scroll triggers for each specific card relative to the container
      const startPx = i * window.innerHeight;
      
      gsap.fromTo(card, 
        { opacity: 0.1, scale: 0.9, filter: 'blur(4px)' },
        { 
          opacity: 1, scale: 1, filter: 'blur(0px)', duration: 1, ease: 'power2.out',
          scrollTrigger: {
            trigger: containerRef.current,
            start: `top+=${startPx} center`,
            end: `top+=${startPx + window.innerHeight * 0.4} center`,
            scrub: true,
          }
        }
      );

      gsap.to(card, {
        opacity: 0.1, scale: 0.9, filter: 'blur(4px)', duration: 1, ease: 'power2.in',
        scrollTrigger: {
          trigger: containerRef.current,
          start: `top+=${startPx + window.innerHeight * 0.8} center`,
          end: `top+=${startPx + window.innerHeight} center`,
          scrub: true,
        }
      });
    });

  }, { scope: containerRef, dependencies: [] });

  return (
    <section ref={containerRef} className="relative bg-surface-950 w-full" style={{ paddingBottom: `${SHOWCASE_STEPS.length * 100}vh` }}>
      {/* Sticky Background & Visual */}
      <div 
        ref={visualRef} 
        className="absolute top-0 left-0 w-full h-screen overflow-hidden flex items-center justify-end pointer-events-none"
      >
        {/* Subtle radial gradient to frame the visual */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_right_center,rgba(2,132,199,0.1),transparent_50%)] z-0" />
        <div className="absolute inset-0 bg-gradient-to-b from-surface-950 via-transparent to-surface-950 z-0" />
        
        {/* Core Product Visualization (The "Robotic Arm" equivalent) */}
        <div className="relative w-full lg:w-[50vw] h-full flex flex-col items-center justify-center transform lg:-translate-x-12 z-0" style={{ perspective: '1200px' }}>
          <div className="absolute inset-0 bg-sky-500/10 blur-[120px] rounded-full w-[300px] h-[300px] md:w-[400px] md:h-[400px] m-auto" />
          
          <div className="relative w-64 h-64 md:w-96 md:h-96 flex items-center justify-center" style={{ transformStyle: 'preserve-3d' }}>
            <div className="core-ring-1 absolute inset-0 border border-sky-500/20 rounded-full" />
            <div className="core-ring-2 absolute inset-5 border-2 border-dashed border-sky-400/30 rounded-full" />
            <div className="core-cube w-32 h-32 md:w-48 md:h-48 bg-gradient-to-tr from-sky-600/40 to-emerald-400/10 backdrop-blur-3xl border border-white/10 rounded-3xl flex items-center justify-center shadow-[0_0_80px_rgba(14,165,233,0.3)]">
              <span className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-white/50" style={{ fontFamily: 'Syne, sans-serif'}}>
                A.I.
              </span>
            </div>
            
            {/* connecting lines to nodes */}
            <div className="absolute w-[200%] h-[1px] bg-gradient-to-r from-sky-500/0 via-sky-500/50 to-sky-500/0 rotate-45" />
            <div className="absolute w-[200%] h-[1px] bg-gradient-to-r from-sky-500/0 via-emerald-500/40 to-sky-500/0 -rotate-45" />
          </div>
        </div>
      </div>

      {/* Scrolling Text Content */}
      <div className="relative z-10 w-full h-full max-w-7xl mx-auto px-6 sm:px-12 flex flex-col justify-start items-start pt-[50vh]">
        {SHOWCASE_STEPS.map((step, i) => (
          <div key={i} className="showcase-card w-full max-w-md h-[100vh] flex flex-col justify-center transition-all will-change-transform opacity-10 blur-sm scale-90">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-14 h-14 rounded-2xl bg-white/[0.03] border border-white/[0.08] flex items-center justify-center text-sky-400 backdrop-blur-lg">
                <step.icon size={26} strokeWidth={1.5} />
              </div>
              <span className="inline-flex px-3 py-1 text-xs font-mono font-medium text-sky-300 bg-sky-400/10 rounded-full border border-sky-400/20 backdrop-blur-md">
                {step.metric}
              </span>
            </div>
            <h3 
              className="text-4xl md:text-5xl font-bold text-white mb-6 leading-tight tracking-tight"
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
    </section>
  );
}
