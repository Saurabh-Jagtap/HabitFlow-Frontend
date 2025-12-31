import React from "react";

export const StatCard = ({ label, value, gradient }) => {
  const [displayValue, setDisplayValue] = React.useState(0);

  React.useEffect(() => {
    let start = 0;
    const end = typeof value === "number" ? value : parseInt(value);
    if (isNaN(end)) return;

    const duration = 600;
    const stepTime = Math.max(Math.floor(duration / end), 20);

    const timer = setInterval(() => {
      start += 1;
      setDisplayValue(start);
      if (start >= end) clearInterval(timer);
    }, stepTime);

    return () => clearInterval(timer);
  }, [value]);

  return (
    <div className="relative rounded-xl bg-base-100 border border-base-300 p-5
                    overflow-hidden transition-all duration-300
                    hover:shadow-xl hover:-translate-y-1">

      {/* Glow */}
      <div className={`absolute inset-0 bg-gradient-to-br ${gradient} opacity-10`} />

      <div className="relative">
        <p className="text-sm text-base-content/60">{label}</p>
        <h3 className="text-4xl font-semibold tracking-tight">
          {displayValue}
        </h3>
      </div>
    </div>
  );
};
