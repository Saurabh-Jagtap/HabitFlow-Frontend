export const SemiCircleGauge = ({ value, total }) => {
  const percentage = total === 0 ? 0 : Math.min(100, Math.max(0, (value / total) * 100));
  const radius = 85;
  const circumference = radius * Math.PI;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  return (
    <div className="relative flex flex-col items-center justify-center">
      <svg className="w-full max-w-[240px] h-[140px] overflow-visible" viewBox="0 0 200 110">
        <defs>
          <linearGradient id="gaugeGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#6366f1" /> {/* Indigo */}
            <stop offset="100%" stopColor="#a855f7" /> {/* Purple */}
          </linearGradient>
        </defs>
        
        {/* Background Arc */}
        <path
          d="M 15 100 A 85 85 0 0 1 185 100"
          fill="none"
          stroke="currentColor"
          strokeWidth="15"
          strokeLinecap="round"
          className="text-base-300/50"
        />
        
        {/* Progress Arc */}
        <path
          d="M 15 100 A 85 85 0 0 1 185 100"
          fill="none"
          stroke="url(#gaugeGradient)"
          strokeWidth="15"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          className="transition-all duration-1000 ease-out"
        />
      </svg>
      
      {/* Centered Text */}
      <div className="absolute bottom-4 flex flex-col items-center">
        <span className="text-4xl font-bold tracking-tighter text-base-content">
          {Math.round(percentage)}%
        </span>
        <span className="text-xs font-medium text-base-content/50 uppercase tracking-wider">
          Completed
        </span>
      </div>
    </div>
  );
};