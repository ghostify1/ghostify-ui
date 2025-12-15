export default function GhostLogo({ size = 120, halo = false }) {
  const stroke = "#80E6FF";

  return (
    <div style={{ display: "grid", placeItems: "center" }}>
      <svg
        width={size}
        height={size}
        viewBox="0 0 120 120"
        style={{
          filter: "drop-shadow(0 0 18px rgba(128,230,255,0.35))",
        }}
      >
        {halo && (
          <ellipse
            cx="60"
            cy="18"
            rx="28"
            ry="8"
            fill="none"
            stroke={stroke}
            strokeWidth="3"
            opacity="0.9"
          />
        )}

        <path
          d="M30 56c0-20 14-34 30-34s30 14 30 34v34c0 3-3 5-6 3l-6-4-6 4-6-4-6 4-6-4-6 4c-3 2-6 0-6-3V56z"
          fill="none"
          stroke={stroke}
          strokeWidth="4"
          strokeLinejoin="round"
        />

        <rect x="46" y="52" width="10" height="22" rx="5" fill={stroke} opacity="0.9" />
        <rect x="64" y="52" width="10" height="22" rx="5" fill={stroke} opacity="0.9" />
      </svg>

      <style jsx>{`
        div {
          animation: pulse 2.8s ease-in-out infinite;
        }
        @keyframes pulse {
          0% { transform: translateY(0); opacity: 0.95; }
          50% { transform: translateY(-1px); opacity: 1; }
          100% { transform: translateY(0); opacity: 0.95; }
        }
      `}</style>
    </div>
  );
}
