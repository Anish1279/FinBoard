import { useRef, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { Wallet, ChevronDown } from 'lucide-react';

const DATA_PARTICLES = [
  '+2.4%', '$128', '▲ 3.1', '99txn', '-$42', '▼ 0.8', '$5.2K', '+14%',
  '◆ 61%', '$390', '▲ 7.2', '-$18', '■ $2K', '+5.6%', '$740', '▼ 1.3',
  '◇ 89', '+$310', '▲ 4.8', '-2.1%', '$1.4K', '◆ 33', '+9.2%', '$67',
];

export function Hero() {
  const containerRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  const particles = useMemo(() => {
    return DATA_PARTICLES.map((text) => ({
      text,
      left: `${5 + Math.random() * 90}%`,
      top: `${Math.random() * 100}%`,
      duration: 14 + Math.random() * 16,
      delay: Math.random() * 12,
      fontSize: 10 + Math.random() * 4,
    }));
  }, []);

  useGSAP(() => {
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced) {
      gsap.set('.hero-word, .hero-subtitle, .hero-cta, .scroll-indicator', { 
        opacity: 1, 
        y: 0, 
        rotateX: 0, 
        scale: 1,
        clearProps: 'transform' // just in case
      });
      return;
    }

    const tl = gsap.timeline();

    // word-by-word stagger reveal
    tl.to('.hero-word',
      { opacity: 1, y: 0, rotateX: 0, duration: 0.7, stagger: 0.12, ease: 'power3.out', clearProps: 'transform' },
      0.3,
    );

    // subtitle
    tl.to('.hero-subtitle',
      { opacity: 1, y: 0, duration: 0.6, ease: 'power2.out', clearProps: 'transform' },
      1.1,
    );

    // CTA
    tl.to('.hero-cta',
      { opacity: 1, y: 0, scale: 1, duration: 0.5, ease: 'power2.out', clearProps: 'transform' },
      1.4,
    );

    // scroll indicator
    tl.to('.scroll-indicator',
      { opacity: 1, duration: 0.6 },
      2.0,
    );
  }, { scope: containerRef, dependencies: [] });

  const headingWords = ['Your', 'money,', '\n', 'finally', 'legible.'];

  return (
    <section
      ref={containerRef}
      className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden"
    >
      {/* Floating data fog */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {particles.map((p, i) => (
          <span
            key={i}
            className="data-particle"
            style={{
              left: p.left,
              top: p.top,
              animationDuration: `${p.duration}s`,
              animationDelay: `${p.delay}s`,
              fontSize: `${p.fontSize}px`,
            }}
          >
            {p.text}
          </span>
        ))}
      </div>

      {/* Top nav bar */}
      <nav className="absolute top-0 left-0 right-0 flex items-center justify-between px-6 sm:px-10 py-5 z-10">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-sky-400/10 flex items-center justify-center text-sky-400">
            <Wallet size={17} />
          </div>
          <span style={{ fontFamily: 'Syne, sans-serif' }} className="text-white font-bold text-lg tracking-tight">
            FinBoard
          </span>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate('/dashboard')}
            className="px-4 py-2 text-sm font-medium text-gray-400 hover:text-white border border-white/10 hover:border-white/20 rounded-lg transition-all"
          >
            Sign In
          </button>
          <button
            onClick={() => navigate('/dashboard')}
            className="px-4 py-2 text-sm font-medium text-white bg-sky-500 hover:bg-sky-400 rounded-lg transition-all"
          >
            Get Started
          </button>
        </div>
      </nav>

      {/* Center content */}
      <div className="relative z-10 text-center px-6 max-w-3xl mx-auto" style={{ perspective: '800px' }}>
        <h1
          className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-extrabold text-white leading-[1.05] tracking-tight mb-6"
          style={{ fontFamily: 'Syne, sans-serif' }}
        >
          {headingWords.map((word, i) =>
            word === '\n' ? (
              <br key={i} />
            ) : (
              <span 
                key={i} 
                className="hero-word inline-block mr-[0.25em] opacity-0"
                style={{ transform: 'translateY(40px) rotateX(15deg)' }}
              >
                {word}
              </span>
            )
          )}
        </h1>

        <p
          className="hero-subtitle text-base sm:text-lg text-gray-400 mb-10 opacity-0"
          style={{ fontFamily: 'DM Sans, sans-serif', transform: 'translateY(20px)' }}
        >
          Track, analyze, and understand every dollar — beautifully.
        </p>

        <button
          onClick={() => navigate('/dashboard')}
          className="hero-cta group relative inline-flex items-center gap-2.5 px-8 py-3.5 text-base font-semibold text-white bg-sky-500 hover:bg-sky-400 rounded-xl transition-all btn-shimmer opacity-0"
          style={{ fontFamily: 'DM Sans, sans-serif', transform: 'translateY(20px) scale(0.95)' }}
        >
          Enter Dashboard
          <span className="inline-block transition-transform group-hover:translate-x-1">→</span>
        </button>
      </div>

      {/* Scroll indicator */}
      <div className="scroll-indicator absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 opacity-0">
        <span className="text-[11px] text-gray-500 uppercase tracking-widest" style={{ fontFamily: 'DM Sans, sans-serif' }}>
          scroll to explore
        </span>
        <ChevronDown size={18} className="text-gray-500" style={{ animation: 'scrollBounce 2s ease-in-out infinite' }} />
      </div>
    </section>
  );
}
