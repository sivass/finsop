interface AlertItemProps {
  type: string;
  title: string;
  description: string;
  timeAgo: string;
  score?: string;
}
interface RiskColors {
  [key: string]: string;
}
const riskColors: RiskColors = {
  high: "text-red-500",
  medium: "text-amber-500",
  low: "text-primary",
  resolved: "text-slate-400",
};

export default function AlertItem({
  type,
  title,
  description,
  timeAgo,
  score,
}: AlertItemProps) {
  return (
    <div
      className={`p-4 rounded-xl border border-slate-100 dark:border-slate-800 hover:border-${
        type === "high" ? "red" : type === "medium" ? "amber" : "primary"
      }-200 dark:hover:border-${type}-900 hover:bg-${type}-50/30 dark:hover:bg-${type}-950/10 transition-colors group ${
        type === "resolved" ? "opacity-70" : ""
      }`}
    >
      <div className="flex justify-between items-start mb-2">
        <span className="flex items-center gap-2">
          <span className={`size-2 rounded-full ${riskColors[type]}`}></span>
          <span
            className={`text-xs font-bold uppercase tracking-wider ${riskColors[type]}`}
          >
            {type === "resolved"
              ? "Resolved"
              : type.charAt(0).toUpperCase() + type.slice(1) + " Risk"}
          </span>
        </span>
        <span className="text-[10px] font-medium text-slate-400">
          {timeAgo}
        </span>
      </div>

      <h4 className="text-sm font-bold text-slate-900 dark:text-white mb-1">
        {title}
      </h4>
      <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2">
        {description}
      </p>

      {score && (
        <div className="mt-3 pt-3 border-t border-slate-100 dark:border-slate-800 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <span className="text-[10px] text-slate-400 font-bold uppercase">
              Score
            </span>
            <span
              className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                type === "high"
                  ? "bg-red-100 dark:bg-red-900/40 text-red-600 dark:text-red-400"
                  : type === "medium"
                    ? "bg-amber-100 dark:bg-amber-900/40 text-amber-600 dark:text-amber-400"
                    : "bg-primary/10 text-primary"
              }`}
            >
              {score}
            </span>
          </div>
          <button className="text-xs font-bold text-primary opacity-0 group-hover:opacity-100 transition-opacity">
            {type === "low" ? "View Detail" : "Investigate"}
          </button>
        </div>
      )}
    </div>
  );
}
