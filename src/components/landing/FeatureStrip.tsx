import { useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import {
  Wallet, Sparkles, PieChart, TrendingUp, Shield,
  ArrowUpCircle, Download, Search, Moon, Database,
} from 'lucide-react';

interface FeatureCardData {
  title: string;
  icon: typeof Wallet;
  metric: string;
  detail: string;
  label: string;
  position: 'top' | 'bottom';
}

const FEATURES: FeatureCardData[] = [
  { title: 'Total Balance',      icon: Wallet,        metric: '$24,400',   detail: 'Live portfolio balance',         label: 'Core',      position: 'top' },
  { title: 'Smart Insights',     icon: Sparkles,      metric: '5 active',  detail: 'Auto-generated observations',   label: 'AI',        position: 'bottom' },
  { title: 'Spending DNA',       icon: PieChart,      metric: '9 mapped',  detail: 'Categories visualized',          label: 'Analytics', position: 'top' },
  { title: 'Balance Trend',      icon: TrendingUp,    metric: '6 months',  detail: 'Area chart trajectory',          label: 'Charts',    position: 'bottom' },
  { title: 'Role-Based Access',  icon: Shield,        metric: '2 modes',   detail: 'Admin + Viewer separation',      label: 'Security',  position: 'top' },
  { title: 'Income Tracker',     icon: ArrowUpCircle, metric: '$39,400',   detail: 'All inflows this period',        label: 'Tracking',  position: 'bottom' },
  { title: 'Export Engine',      icon: Download,      metric: 'CSV + JSON',detail: 'One-click data export',          label: 'Tooling',   position: 'top' },
  { title: 'Transaction Search', icon: Search,        metric: '99 entries',detail: 'Instant filter + sort',          label: 'Search',    position: 'bottom' },
  { title: 'Dark Mode First',    icon: Moon,          metric: 'Toggle',    detail: 'Light mode also available',      label: 'Design',    position: 'top' },
  { title: 'Local Persistence',  icon: Database,      metric: 'Sync',      detail: 'localStorage persistence',       label: 'Storage',   position: 'bottom' },
];

const CARD_SPACING = 480;
const NODE_Y_TOP = 180;
const NODE_Y_BOTTOM = 380;
const BEAD_COUNT = 45;

interface SineNode { x: number; y: number }

function buildSinePath(nodes: SineNode[]): string {
  if (nodes.length < 2) return '';
  let d = `M ${nodes[0].x} ${nodes[0].y}`;
  for (let i = 1; i < nodes.length; i++) {
    const prev = nodes[i - 1];
    const curr = nodes[i];
    const cpX = (prev.x + curr.x) / 2;
    d += ` C ${cpX} ${prev.y}, ${cpX} ${curr.y}, ${curr.x} ${curr.y}`;
  }
  return d;
}

export function FeatureStrip() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const stripRef = useRef<HTMLDivElement>(null);
  const pathRef = useRef<SVGPathElement>(null);

  // build sine wave nodes
  const nodes: SineNode[] = FEATURES.map((_, i) => ({
    x: 240 + i * CARD_SPACING,
    y: i % 2 === 0 ? NODE_Y_TOP : NODE_Y_BOTTOM,
  }));
  const pathD = buildSinePath(nodes);
  const stripWidth = 240 + FEATURES.length * CARD_SPACING + 200;

  useGSAP(() => {
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced) {
      gsap.set('.feature-card', { opacity: 1, y: 0 });
      return;
    }

    const section = sectionRef.current!;
    const strip = stripRef.current!;
    const path = pathRef.current!;

    const totalLength = path.getTotalLength();

    // setup path drawing
    gsap.set(path, {
      strokeDasharray: totalLength,
      strokeDashoffset: totalLength,
    });

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: section,
        start: 'top top',
        end: () => `+=${strip.scrollWidth - window.innerWidth + window.innerWidth * 0.5}`,
        pin: true,
        scrub: 1.2,
        anticipatePin: 1,
        invalidateOnRefresh: true,
      },
    });

    // horizontal translate
    tl.to(strip, {
      x: () => -(strip.scrollWidth - window.innerWidth),
      ease: 'none',
    }, 0);

    // path drawing
    tl.to(path, { strokeDashoffset: 0, ease: 'none' }, 0);

    // card reveals
    const cards = strip.querySelectorAll('.feature-card');
    cards.forEach((card, i) => {
      tl.fromTo(card,
        { opacity: 0, y: 32 },
        { opacity: 1, y: 0, duration: 0.1, ease: 'power2.out' },
        (i / cards.length) * 0.9,
      );
    });

    // connector lines
    const connectors = strip.querySelectorAll('.card-connector');
    connectors.forEach((line, i) => {
      tl.fromTo(line,
        { opacity: 0 },
        { opacity: 1, duration: 0.08 },
        (i / connectors.length) * 0.9,
      );
    });

    // place chain beads along path
    const beads = strip.querySelectorAll('.chain-bead');
    beads.forEach((bead, i) => {
      const pt = path.getPointAtLength((i / beads.length) * totalLength);
      gsap.set(bead, {
        x: pt.x,
        y: pt.y,
        xPercent: -50,
        yPercent: -50,
        rotation: 45,
      });
    });

    // recalculate after fonts load
    document.fonts.ready.then(() => ScrollTrigger.refresh());
  }, { scope: sectionRef, dependencies: [] });

  return (
    <section ref={sectionRef} className="relative" style={{ willChange: 'transform' }}>
      {/* section heading */}
      <div className="absolute top-6 left-8 z-10">
        <span
          className="text-xs uppercase tracking-widest text-sky-400/60"
          style={{ fontFamily: 'DM Sans, sans-serif' }}
        >
          Features
        </span>
      </div>

      <div
        ref={stripRef}
        className="relative flex items-center"
        style={{ width: stripWidth, height: '100vh', willChange: 'transform' }}
      >
        {/* SVG layer — path + beads */}
        <svg
          className="absolute inset-0"
          width={stripWidth}
          height="100%"
          viewBox={`0 0 ${stripWidth} 560`}
          preserveAspectRatio="xMinYMid meet"
          style={{ overflow: 'visible' }}
        >
          <defs>
            <linearGradient id="pathGrad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#1d4ed8" />
              <stop offset="50%" stopColor="#0ea5e9" />
              <stop offset="100%" stopColor="#10b981" />
            </linearGradient>
          </defs>

          {/* main sine path */}
          <path
            ref={pathRef}
            d={pathD}
            fill="none"
            stroke="url(#pathGrad)"
            strokeWidth="2.5"
            strokeLinecap="round"
          />

          {/* chain beads */}
          {Array.from({ length: BEAD_COUNT }).map((_, i) => (
            <rect
              key={`bead-${i}`}
              className="chain-bead"
              width="8"
              height="14"
              rx="2"
              fill="none"
              stroke="rgba(148,163,184,0.25)"
              strokeWidth="1.2"
            />
          ))}

          {/* connector lines from nodes to cards */}
          {nodes.map((node, i) => {
            const isTop = FEATURES[i].position === 'top';
            const cardCenterY = isTop ? node.y - 120 : node.y + 120;
            return (
              <line
                key={`conn-${i}`}
                className="card-connector"
                x1={node.x}
                y1={node.y}
                x2={node.x}
                y2={cardCenterY}
                stroke="rgba(148,163,184,0.15)"
                strokeWidth="1"
                strokeDasharray="4 4"
                style={{ opacity: 0 }}
              />
            );
          })}

          {/* node dots */}
          {nodes.map((node, i) => (
            <circle
              key={`dot-${i}`}
              cx={node.x}
              cy={node.y}
              r="5"
              fill="#0ea5e9"
              opacity="0.6"
            />
          ))}
        </svg>

        {/* Feature cards */}
        {FEATURES.map((feat, i) => {
          const node = nodes[i];
          const isTop = feat.position === 'top';
          const cardTop = isTop ? node.y - 260 : node.y + 60;

          return (
            <div
              key={feat.title}
              className="feature-card absolute"
              style={{
                left: node.x - 130,
                top: cardTop,
                width: 260,
                willChange: 'transform, opacity',
                opacity: 0,
              }}
            >
              {/* label chip */}
              <span className="inline-block px-2.5 py-0.5 text-[10px] font-medium uppercase tracking-wider text-sky-300/80 bg-sky-400/10 rounded-full mb-3">
                {feat.label}
              </span>

              {/* icon */}
              <div className="w-10 h-10 rounded-xl bg-white/[0.06] flex items-center justify-center text-sky-400 mb-3">
                <feat.icon size={20} />
              </div>

              {/* title */}
              <h3
                className="text-[17px] font-bold text-white mb-1.5"
                style={{ fontFamily: 'Syne, sans-serif' }}
              >
                {feat.title}
              </h3>

              {/* description */}
              <p
                className="text-[13px] text-gray-400 mb-3 leading-relaxed"
                style={{ fontFamily: 'DM Sans, sans-serif' }}
              >
                {feat.detail}
              </p>

              {/* metric badge */}
              <span className="inline-block px-3 py-1 text-xs font-medium text-emerald-300 bg-emerald-400/10 rounded-lg">
                {feat.metric}
              </span>
            </div>
          );
        })}
      </div>
    </section>
  );
}
