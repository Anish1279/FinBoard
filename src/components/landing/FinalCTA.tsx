import { useNavigate } from 'react-router-dom';

export function FinalCTA() {
  const navigate = useNavigate();

  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center px-6">
      <h2
        className="text-3xl sm:text-4xl md:text-5xl font-bold text-white text-center mb-10 max-w-xl leading-tight text-balance"
        style={{ fontFamily: 'Syne, sans-serif' }}
      >
        Ready to see your finances clearly?
      </h2>

      <button
        onClick={() => navigate('/dashboard')}
        className="group relative inline-flex items-center gap-2.5 px-10 py-4 text-lg font-semibold text-white bg-sky-500 hover:bg-sky-400 rounded-2xl transition-all"
        style={{
          animation: 'pulseGlow 2.5s ease-out infinite',
          fontFamily: 'DM Sans, sans-serif',
        }}
      >
        Enter FinBoard
        <span className="inline-block transition-transform group-hover:translate-x-1">→</span>
      </button>

      {/* bottom credit */}
      <p
        className="absolute bottom-8 text-xs text-gray-600"
        style={{ fontFamily: 'DM Sans, sans-serif' }}
      >
        Built with precision and care
      </p>
    </section>
  );
}
