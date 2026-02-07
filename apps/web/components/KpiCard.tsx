interface KpiCardProps {
  title: string;
  value: string;
  trend?: string;
  trendIcon?: string;
  icon: string;
  color: string;
  badge?: string;
  badgeColor?: string;
  largeIcon?: string;
  circularIndicator?: boolean;
  sparklinePath?: string;
}

export default function KpiCard(props: KpiCardProps) {
  return (
    <div
      className={`flex flex-col gap-2 rounded-xl p-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm ${
        props.badgeColor ? `border-l-4 border-l-amber-500` : ""
      }`}
    >
      <div className="flex justify-between items-start">
        <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">{props.title}</p>
        <span className={`material-symbols-outlined text-[20px] ${props.color}`}>
          {props.icon}
        </span>
      </div>
      <div className="flex items-end justify-between">
        <div>
          <p className="text-slate-900 dark:text-white text-2xl font-bold leading-tight">
            {props.value}
          </p>
          {props.trend && (
            <p className={`text-xs font-semibold flex items-center gap-1 mt-1 ${props.color}`}>
              {props.trendIcon && (
                <span className="material-symbols-outlined text-[14px]">{props.trendIcon}</span>
              )}
              {props.trend}
            </p>
          )}
        </div>

        {props.largeIcon && (
          <div className={`text-indigo-500/20`}>
            <span className="material-symbols-outlined text-[40px]">{props.largeIcon}</span>
          </div>
        )}

        {props.circularIndicator && (
          <div className="size-10 rounded-full border-4 border-slate-100 dark:border-slate-800 border-t-emerald-500"></div>
        )}

        {props.badge && (
          <div className={`${props.badgeColor} rounded flex items-center justify-center w-24 h-10 text-[10px] font-bold`}>
            {props.badge}
          </div>
        )}
      </div>
    </div>
  );
}
