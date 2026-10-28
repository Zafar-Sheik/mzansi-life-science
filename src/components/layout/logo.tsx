export function Logo({ compact = false }: { compact?: boolean }) {
  return (
    <span className="flex items-center gap-2">
      <svg width="32" height="32" viewBox="0 0 32 32" aria-hidden>
        <defs>
          <linearGradient id="logo-g" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#4338ca" />
            <stop offset="0.55" stopColor="#047857" />
            <stop offset="1" stopColor="#0e7490" />
          </linearGradient>
        </defs>
        <rect width="32" height="32" rx="9" fill="url(#logo-g)" />
        {/* a DNA double helix growing into a leaf: the code of life */}
        <path d="M10 25c0-5 12-6 12-11S10 8 10 4" fill="none" stroke="white" strokeWidth="1.8" strokeLinecap="round" />
        <path d="M22 25c0-5-12-6-12-11" fill="none" stroke="white" strokeOpacity="0.65" strokeWidth="1.8" strokeLinecap="round" />
        <path d="M12 20.5h8M13 9h6M11.5 16.5h3.5" stroke="white" strokeOpacity="0.7" strokeWidth="1.4" strokeLinecap="round" />
        <path d="M22 14c0-4 2-7 6-8 0 4-2 7-6 8z" fill="#a3e635" />
      </svg>
      {!compact && (
        <span className="font-display text-lg font-bold tracking-tight">
          Life<span className="bg-gradient-to-r from-brand to-eco bg-clip-text text-transparent">Mzansi</span>
        </span>
      )}
    </span>
  );
}
