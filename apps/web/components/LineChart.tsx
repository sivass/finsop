export default function LineChart() {
  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6 shadow-sm">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h3 className="text-slate-900 dark:text-white text-lg font-bold">Transaction Behavior Over Time</h3>
          <p className="text-slate-500 dark:text-slate-400 text-sm">Active Monitoring · Last 30 Days</p>
        </div>
        <div className="flex gap-2">
          <select className="bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-xs px-3 py-1.5 focus:ring-primary">
            <option>Volume</option>
            <option>Value (USD)</option>
          </select>
        </div>
      </div>

      <div className="h-64 w-full">
        <svg className="w-full h-full" preserveAspectRatio="none" viewBox="0 0 800 240">
          <defs>
            <linearGradient id="chartGradient" x1="0" x2="0" y1="0" y2="1">
              <stop offset="0%" stopColor="#136dec" stopOpacity="0.2" />
              <stop offset="100%" stopColor="#136dec" stopOpacity="0" />
            </linearGradient>
          </defs>
          <path
            d="M0 180 C 100 160, 150 200, 200 150 C 250 100, 300 120, 350 80 C 400 40, 450 100, 500 90 C 550 80, 600 20, 700 40 L 800 10 L 800 240 L 0 240 Z"
            fill="url(#chartGradient)"
          />
          <path
            d="M0 180 C 100 160, 150 200, 200 150 C 250 100, 300 120, 350 80 C 400 40, 450 100, 500 90 C 550 80, 600 20, 700 40 L 800 10"
            fill="none"
            stroke="#136dec"
            strokeLinecap="round"
            strokeWidth={3}
          />
          {/* Grid Lines */}
          {[80, 130, 180, 230].map((y, idx) => (
            <line
              key={idx}
              x1={0}
              x2={800}
              y1={y}
              y2={y}
              stroke="#e2e8f0"
              strokeDasharray="4"
              strokeWidth={1}
              className="dark:stroke-slate-800"
            />
          ))}
        </svg>
      </div>

      <div className="flex justify-between mt-4 px-2 text-[11px] font-bold text-slate-400">
        <span>MAY 01</span>
        <span>MAY 08</span>
        <span>MAY 15</span>
        <span>MAY 22</span>
        <span>MAY 29</span>
      </div>
    </div>
  );
}
