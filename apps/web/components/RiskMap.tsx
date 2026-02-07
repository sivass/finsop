export default function RiskMap() {
  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6 shadow-sm overflow-hidden flex flex-col">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h3 className="text-slate-900 dark:text-white text-lg font-bold">Global Risk Heatmap</h3>
          <p className="text-slate-500 dark:text-slate-400 text-sm">Geographic anomaly distribution</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="size-2 rounded-full bg-red-500"></div>
            <span className="text-[11px] font-medium text-slate-500">High Risk</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="size-2 rounded-full bg-primary/40"></div>
            <span className="text-[11px] font-medium text-slate-500">Low Risk</span>
          </div>
        </div>
      </div>

      <div className="flex-1 min-h-[300px] relative rounded-lg overflow-hidden bg-slate-100 dark:bg-slate-800">
        {/* World Map */}
        <div
          className="absolute inset-0 bg-cover bg-center opacity-40 mix-blend-multiply grayscale"
          style={{ backgroundImage: "url('https://placeholder.pics/svg/300')" }}
        />
        {/* Risk Hotspots */}
        <div className="absolute top-[30%] left-[20%] size-12 bg-red-500/30 rounded-full animate-pulse flex items-center justify-center">
          <div className="size-4 bg-red-500 rounded-full"></div>
        </div>
        <div className="absolute top-[40%] left-[45%] size-8 bg-amber-500/30 rounded-full flex items-center justify-center">
          <div className="size-3 bg-amber-500 rounded-full"></div>
        </div>
        <div className="absolute top-[60%] left-[75%] size-10 bg-primary/30 rounded-full flex items-center justify-center">
          <div className="size-3 bg-primary rounded-full"></div>
        </div>
      </div>
    </div>
  );
}
