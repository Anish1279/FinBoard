import { useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import clsx from 'clsx';

interface Milestone {
  id: string;
  year: string;
  title: string;
  description: string;
  metric: string;
}

const MILESTONES: Milestone[] = [
  {
    id: 'm1',
    year: 'Seed Stage',
    title: 'FinBoard Inception',
    description: 'Initial architectural design for high-frequency transaction parsing.',
    metric: '$1.2M Funding',
  },
  {
    id: 'm2',
    year: 'Series A',
    title: 'AI Spend DNA App',
    description: 'Launch of our proprietary neural categorizer, reaching 99% accuracy.',
    metric: '10K Users',
  },
  {
    id: 'm3',
    year: 'Expansion',
    title: 'Global Ledger Sync',
    description: 'Multi-currency integration spanning 140+ countries with sub-second finality.',
    metric: '$10B Volume',
  },
  {
    id: 'm4',
    year: 'Current',
    title: 'Quantum Dashboard',
    description: 'The definitive high-end dashboard interface for uncompromising professionals.',
    metric: '99.99% Uptime',
  },
];

export function CurvedJourney() {
  const containerRef = useRef<HTMLDivElement>(null);
  const pathRef = useRef<SVGPathElement>(null);

  useGSAP(() => {
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced) return;

    if (!pathRef.current || !containerRef.current) return;

    const path = pathRef.current;
    const totalLength = path.getTotalLength();

    // Reset path dash array
    gsap.set(path, {
      strokeDasharray: totalLength,
      strokeDashoffset: totalLength,
    });

    const timeline = gsap.timeline({
      scrollTrigger: {
        trigger: containerRef.current,
        start: 'top 50%',
        end: 'bottom 80%',
        scrub: 1,
      }
    });

    // Draw path
    timeline.to(path, {
      strokeDashoffset: 0,
      ease: 'none'
    }, 0);

    // Stagger card reveals based on their position down the timeline
    const cards = gsap.utils.toArray('.milestone-card') as HTMLElement[];
    const beads = gsap.utils.toArray('.milestone-bead') as HTMLElement[];
    
    cards.forEach((card, i) => {
      const progressPoint = (i + 1) / cards.length;
      
      // when path drawing reaches this card, animate it in
      timeline.fromTo(card,
        { opacity: 0, x: i % 2 === 0 ? -40 : 40, filter: 'blur(8px)' },
        { opacity: 1, x: 0, filter: 'blur(0px)', duration: 0.1, ease: 'power2.out' },
        progressPoint * 0.8
      );

      timeline.fromTo(beads[i],
        { scale: 0, opacity: 0 },
        { scale: 1, opacity: 1, duration: 0.05, ease: 'back.out(2)' },
        progressPoint * 0.8
      );
    });

  }, { scope: containerRef, dependencies: [] });

  return (
    <section ref={containerRef} className="relative py-32 bg-surface-950 overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 lg:px-12 relative flex items-center justify-center">
        
        {/* SVG Thread */}
        <div className="absolute inset-y-0 left-1/2 -translate-x-1/2 w-[400px] pointer-events-none z-0">
          <svg className="w-full h-full" viewBox="0 -50 400 1200" preserveAspectRatio="none" style={{ overflow: 'visible' }}>
            <defs>
              <linearGradient id="journeyGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#1d4ed8" />
                <stop offset="50%" stopColor="#0ea5e9" />
                <stop offset="100%" stopColor="#10b981" />
              </linearGradient>
            </defs>
            <path
              ref={pathRef}
              d="M 200 0 C 350 150, 50 250, 200 400 C 350 550, 50 650, 200 800 C 350 950, 50 1050, 200 1200"
              fill="none"
              stroke="url(#journeyGrad)"
              strokeWidth="2"
              strokeLinecap="round"
            />
          </svg>
        </div>

        {/* Milestones mapped along the path */}
        <div className="relative z-10 w-full max-w-4xl flex flex-col gap-40 py-20">
          {MILESTONES.map((milestone, i) => {
            const isLeft = i % 2 === 0;
            return (
              <div key={milestone.id} className={clsx("relative flex items-center w-full", isLeft ? "justify-start" : "justify-end")}>
                
                {/* Bead on the path */}
                <div className="milestone-bead absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-sky-500 shadow-[0_0_20px_rgba(14,165,233,0.8)] border-2 border-white scale-0 opacity-0 z-20" />
                
                <div className={clsx("milestone-card w-[40%] flex flex-col opacity-0 blur-sm will-change-transform", isLeft ? "items-end text-right pr-12" : "items-start text-left pl-12")}>
                  <div className="mb-2">
                    <span className="text-sky-400 font-mono text-sm tracking-wider uppercase bg-sky-400/10 px-3 py-1 rounded-full border border-sky-400/20">
                      {milestone.year}
                    </span>
                  </div>
                  <h4 
                    className="text-3xl font-bold text-white mb-3"
                    style={{ fontFamily: 'Syne, sans-serif' }}
                  >
                    {milestone.title}
                  </h4>
                  <p 
                    className="text-gray-400 leading-relaxed mb-4"
                    style={{ fontFamily: 'DM Sans, sans-serif' }}
                  >
                    {milestone.description}
                  </p>
                  <span className="text-emerald-400 font-medium text-lg">
                    {milestone.metric}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
