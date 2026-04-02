import { useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { Layers, Lightbulb, TrendingUp, CheckCircle, Award } from 'lucide-react';
import clsx from 'clsx';

const MILESTONES = [
  {
    date: 'NOV 2023',
    title: 'FinBoard Architected',
    desc: 'The foundational neural models are designed, moving beyond traditional ledgers.',
    icon: Lightbulb
  },
  {
    date: 'JAN 2024',
    title: 'Series A Funding',
    desc: 'Secured $14M from top-tier VCs to accelerate horizontal scaling.',
    icon: TrendingUp
  },
  {
    date: 'JUN 2024',
    title: 'Global Ledger Sync',
    desc: 'Successfully bypassed legacy SWIFT systems with sub-second multi-currency sync.',
    icon: Layers
  },
  {
    date: 'OCT 2024',
    title: 'Quantum Validated',
    desc: 'Hit exactly zero downtime across 15M highly concurrent global transactions.',
    icon: CheckCircle
  },
  {
    date: 'MAR 2025',
    title: 'Industry Award',
    desc: 'Awarded #1 Dashboard Interface by elite financial designer consortiums.',
    icon: Award
  }
];

export function HorizontalJourney() {
  const containerRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const pathRef = useRef<SVGPathElement>(null);

  useGSAP(() => {
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced) return;

    if (!containerRef.current || !trackRef.current || !pathRef.current) return;

    const trackWidth = trackRef.current.scrollWidth;
    const viewWidth = window.innerWidth;
    
    // We scroll the track to the left by the difference between its actual width and the viewport width
    const scrollDist = trackWidth - viewWidth;

    const path = pathRef.current;
    const totalLength = path.getTotalLength();
    gsap.set(path, {
      strokeDasharray: totalLength,
      strokeDashoffset: totalLength,
    });

    // Pin timeline
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: containerRef.current,
        start: 'top top',
        end: `+=${scrollDist}`, // Pin duration correlates to horizontal scroll width
        pin: true,
        scrub: 1,
      }
    });

    // Translate the track horizontally
    tl.to(trackRef.current, {
      x: -scrollDist,
      ease: 'none',
      duration: 1
    }, 0);

    // Draw the amber sine path while scrolling horizontally
    tl.to(path, {
      strokeDashoffset: 0,
      ease: 'none',
      duration: 1
    }, 0);

    // Animate the playhead "glowing orb" horizontally
    tl.to('.playhead-glow', {
      left: '100%',
      ease: 'none',
      duration: 1
    }, 0);

  }, { scope: containerRef, dependencies: [] });

  // Generate an exact sine wave visually covering the horizontal width.
  // Each segment is 400px wide (100px quarter waves). 
  // Let's cover 5 milestones at ~400px spacing = 2000px wide.
  const pathData = `M 0 100 Q 100 0, 200 100 T 400 100 T 600 100 T 800 100 T 1000 100 T 1200 100 T 1400 100 T 1600 100 T 1800 100 T 2000 100 T 2200 100 T 2400 100`;

  return (
    <section ref={containerRef} className="bg-black w-full h-screen overflow-hidden flex flex-col justify-center relative">
      {/* Label */}
      <div className="absolute top-12 left-12 flex items-center gap-4 text-white uppercase tracking-[0.2em] font-mono text-sm z-50">
        <span className="w-10 h-[1px] bg-sky-500"></span> OUR JOURNEY
      </div>

      <div ref={trackRef} className="flex items-center w-[2400px] h-full relative pl-32">
        
        {/* Background SVG wave */}
        <div className="absolute left-0 w-[2400px] h-[200px] top-1/2 -translate-y-1/2 flex items-center z-0">
          <svg width="2400" height="200" viewBox="0 0 2400 200" className="opacity-30">
            <path d={pathData} fill="none" stroke="#262626" strokeWidth="4" strokeLinecap="round" />
            {/* Outline beads as filler along the path */}
            {[200, 600, 1000, 1400, 1800, 2200].map(x => (
              <rect key={`bg-${x}`} x={x - 15} y={85} width="30" height="30" rx="8" fill="none" stroke="#262626" strokeWidth="2" className="transform rotate-12 origin-center" />
            ))}
          </svg>
        </div>

        {/* Foreground Colored SVG wave */}
        <div className="absolute left-0 w-[2400px] h-[200px] top-1/2 -translate-y-1/2 flex items-center z-10 pointer-events-none">
          <svg width="2400" height="200" viewBox="0 0 2400 200">
             <defs>
              <linearGradient id="amberGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#d97706" />
                <stop offset="50%" stopColor="#fbbf24" />
                <stop offset="100%" stopColor="#f59e0b" />
              </linearGradient>
            </defs>
            <path ref={pathRef} d={pathData} fill="none" stroke="url(#amberGrad)" strokeWidth="4" strokeLinecap="round" />
            
            {/* Playhead Glow directly linked to SVG */}
            <circle className="playhead-glow absolute opacity-0" r="10" fill="white" cy="100" />
          </svg>
        </div>

        {/* Playhead glow element tracking the scroll natively outside SVG */}
        <div className="absolute w-[2400px] h-0 top-1/2 -translate-y-1/2 z-30">
          <div className="playhead-glow absolute top-1/2 -translate-y-1/2 -ml-3 w-6 h-6 rounded-full bg-white shadow-[0_0_30px_10px_rgba(251,191,36,0.6)]" />
        </div>

        {/* Milestone Cards */}
        {MILESTONES.map((milestone, i) => {
          const isTop = i % 2 === 0;
          const xPos = i * 400; // Place directly over the nodes (0, 400, 800...)
          
          return (
            <div 
              key={i} 
              className="absolute flex flex-col items-center" 
              style={{ left: `${xPos + 100}px`, /* Offset to match the wave peak/trough where x is 0, 400, 800 but wait path nodes are at 0, 400, 800 */
                       ...(isTop ? { bottom: '50%' } : { top: '50%' })
              }}
            >
              {/* Connecting Dashed Line */}
              <div 
                className={clsx("absolute w-[2px] border-l-2 border-dashed border-amber-500/40", isTop ? "bottom-0 origin-bottom" : "top-0 origin-top")}
                style={{ height: '80px', transform: 'translateY(-15px)' }}
              />
              
              {/* Amber Bead exactly on the path intersection */}
              <div 
                className={clsx(
                  "absolute left-1/2 -translate-x-1/2 w-10 h-8 bg-amber-500/20 border-2 border-amber-500 rounded-lg shadow-[0_0_20px_rgba(245,158,11,0.5)] z-20 flex items-center justify-center transform",
                  isTop ? "translate-y-[15px]" : "translate-y-[-15px]"
                )}
                style={{ transform: `${isTop ? 'translateY(15px)' : 'translateY(-15px)'} rotate(12deg)` }}
              />

              {/* Glassmorphic Card */}
              <div 
                className={clsx(
                  "relative w-72 p-6 rounded-2xl border border-amber-500/20 bg-black/40 backdrop-blur-md shadow-xl",
                  isTop ? "mb-[100px]" : "mt-[100px]"
                )}
              >
                {/* Subtle Amber Glow behind card */}
                <div className="absolute inset-0 bg-amber-500/5 blur-3xl -z-10 rounded-2xl" />
                
                <div className="flex justify-between items-start mb-4">
                  <span className="text-amber-400 font-mono text-sm uppercase tracking-widest">{milestone.date}</span>
                  <div className="w-8 h-8 rounded-full bg-amber-500/10 flex items-center justify-center text-amber-500 border border-amber-500/20">
                    <milestone.icon size={16} />
                  </div>
                </div>
                
                <h4 className="text-xl font-bold text-white mb-2 font-syne">{milestone.title}</h4>
                <p className="text-sm text-gray-400 font-sans leading-relaxed">{milestone.desc}</p>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
