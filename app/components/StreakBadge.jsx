import { Flame } from "lucide-react";

export const StreakBadge = ({ value }) => {
  return (
    <div className="relative rounded-xl bg-gradient-to-br from-rose-500/20 to-orange-500/20
                    border border-rose-500/30 p-5
                    flex flex-col items-center justify-center
                    transition-all duration-300 hover:shadow-xl hover:-translate-y-1">

      <Flame size={40} className="text-orange-500 mb-2" />

      <h3 className="text-3xl font-bold leading-none">
        {value}
      </h3>

      <p className="text-sm text-base-content/70 mt-1">
        Best Streak
      </p>
    </div>
  );
};
