export const ProgressBar = ({ label, value, colorClass, icon: Icon }) => (
  <div className="flex flex-col gap-2">
    <div className="flex items-center justify-between text-sm">
      <div className="flex items-center gap-2 text-base-content/70">
        <Icon size={16} />
        <span>{label}</span>
      </div>
      <span className="font-bold">{value}%</span>
    </div>
    <div className="h-3 w-full bg-base-300/50 rounded-full overflow-hidden">
      <div
        className={`h-full rounded-full transition-all duration-1000 ${colorClass}`}
        style={{ width: `${value}%` }}
      />
    </div>
  </div>
);