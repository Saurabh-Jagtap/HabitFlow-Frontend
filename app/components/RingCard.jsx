export const RingCard = ({
  label,
  value,
  color,
  suffix = "",
  subText,
  displayValue,
}) => {
  const radius = 34;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (value / 100) * circumference;

  const colorMap = {
    indigo: "#6366f1",
    emerald: "#10b981",
    slate: "#64748b",
  };

  return (
    <div className="relative rounded-xl bg-base-100 border border-base-300 p-5
                    flex flex-col items-center justify-center
                    transition-all duration-300 hover:shadow-xl hover:-translate-y-1">

      {/* Ring container */}
      <div className="relative w-24 h-24">
        <svg
          width="96"
          height="96"
          className="-rotate-90"
        >
          <circle
            cx="48"
            cy="48"
            r={radius}
            stroke="rgba(255,255,255,0.1)"
            strokeWidth="8"
            fill="transparent"
          />
          <circle
            cx="48"
            cy="48"
            r={radius}
            stroke={colorMap[color]}
            strokeWidth="8"
            fill="transparent"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            strokeLinecap="round"
            className="transition-all duration-700 ease-out"
          />
        </svg>

        {/* CENTERED TEXT */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-xl font-semibold leading-none">
            {displayValue ?? value}
            {suffix}
          </span>
          {subText && (
            <span className="text-xs text-base-content/60 mt-1">
              {subText}
            </span>
          )}
        </div>
      </div>

      <p className="mt-4 text-sm text-base-content/60 text-center">
        {label}
      </p>
    </div>
  );
};
