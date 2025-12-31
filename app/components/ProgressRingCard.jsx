export const ProgressStat = ({ label, value }) => {
  const radius = 36;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (value / 100) * circumference;

  return (
    <div className="relative rounded-xl bg-base-100 border border-base-300 p-5
                    transition-all duration-300 hover:shadow-xl hover:-translate-y-1">

      <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/10 to-purple-500/10" />

      <div className="relative flex flex-col items-center gap-3">
        <p className="text-sm text-base-content/60">{label}</p>

        <svg width="100" height="100" className="rotate-[-90deg]">
          <circle
            cx="50"
            cy="50"
            r={radius}
            stroke="rgba(255,255,255,0.1)"
            strokeWidth="8"
            fill="transparent"
          />
          <circle
            cx="50"
            cy="50"
            r={radius}
            stroke="url(#grad)"
            strokeWidth="8"
            fill="transparent"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            strokeLinecap="round"
            className="transition-all duration-700 ease-out"
          />
          <defs>
            <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#6366f1" />
              <stop offset="100%" stopColor="#8b5cf6" />
            </linearGradient>
          </defs>
        </svg>

        <span className="absolute text-xl font-semibold">
          {value}%
        </span>
      </div>
    </div>
  );
};
