// Aura orb logo as a pure SVG — no background, full transparency
const AuraOrb = ({ size = 36 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 100 100"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <defs>
      {/* Glow filter */}
      <filter id="orb-glow" x="-30%" y="-30%" width="160%" height="160%">
        <feGaussianBlur stdDeviation="4" result="blur" />
        <feMerge>
          <feMergeNode in="blur" />
          <feMergeNode in="SourceGraphic" />
        </feMerge>
      </filter>
      {/* Center radial glow */}
      <radialGradient id="center-glow" cx="50%" cy="50%" r="50%">
        <stop offset="0%"  stopColor="#ffffff" stopOpacity="0.95" />
        <stop offset="35%" stopColor="#c4b5fd" stopOpacity="0.6" />
        <stop offset="100%" stopColor="#7c3aed" stopOpacity="0" />
      </radialGradient>
      {/* Ring 1 gradient — violet/purple */}
      <linearGradient id="ring1-grad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%"  stopColor="#a855f7" stopOpacity="0.9" />
        <stop offset="100%" stopColor="#7c3aed" stopOpacity="0.7" />
      </linearGradient>
      {/* Ring 2 gradient — cyan/blue */}
      <linearGradient id="ring2-grad" x1="100%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%"  stopColor="#38bdf8" stopOpacity="0.9" />
        <stop offset="100%" stopColor="#0ea5e9" stopOpacity="0.7" />
      </linearGradient>
      {/* Ring 3 gradient — blue-violet */}
      <linearGradient id="ring3-grad" x1="50%" y1="0%" x2="50%" y2="100%">
        <stop offset="0%"  stopColor="#818cf8" stopOpacity="0.85" />
        <stop offset="100%" stopColor="#6366f1" stopOpacity="0.65" />
      </linearGradient>
    </defs>

    {/* Outer ambient glow */}
    <ellipse cx="50" cy="50" rx="38" ry="38" fill="rgba(124,58,237,0.12)" />

    {/* Ring 1: tilted ~20deg — purple */}
    <ellipse
      cx="50" cy="50"
      rx="38" ry="14"
      stroke="url(#ring1-grad)"
      strokeWidth="4"
      fill="rgba(168,85,247,0.08)"
      transform="rotate(-25 50 50)"
      filter="url(#orb-glow)"
    />

    {/* Ring 2: tilted ~-20deg — cyan */}
    <ellipse
      cx="50" cy="50"
      rx="38" ry="14"
      stroke="url(#ring2-grad)"
      strokeWidth="4"
      fill="rgba(56,189,248,0.08)"
      transform="rotate(25 50 50)"
      filter="url(#orb-glow)"
    />

    {/* Ring 3: near-horizontal — indigo */}
    <ellipse
      cx="50" cy="50"
      rx="38" ry="11"
      stroke="url(#ring3-grad)"
      strokeWidth="3.5"
      fill="rgba(99,102,241,0.07)"
      transform="rotate(70 50 50)"
      filter="url(#orb-glow)"
    />

    {/* Ring 4: vertical complement */}
    <ellipse
      cx="50" cy="50"
      rx="14" ry="38"
      stroke="url(#ring2-grad)"
      strokeWidth="3"
      fill="rgba(56,189,248,0.05)"
      filter="url(#orb-glow)"
    />

    {/* Center glow orb */}
    <circle cx="50" cy="50" r="16" fill="url(#center-glow)" />
  </svg>
);

export default AuraOrb;
