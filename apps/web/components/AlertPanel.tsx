import AlertItem from "./AlertItem";

const alerts = [
  {
    type: "high",
    title: "Velocity Threshold Exceeded",
    description: "Account #9421-XX-02 from IP 192.168.1.45 triggered 45 transactions in 10s.",
    timeAgo: "2 mins ago",
    score: "94/100",
  },
  {
    type: "medium",
    title: "Unusual Device Login",
    description: "New MacOS device detected for user ID: 882193 from unknown location.",
    timeAgo: "14 mins ago",
    score: "67/100",
  },
  {
    type: "low",
    title: "Large Transfer Verification",
    description: "Outbound transfer of $45,000 initiated. Waiting for SOP confirmation.",
    timeAgo: "42 mins ago",
    score: "22/100",
  },
  {
    type: "resolved",
    title: "Password Reset Attempt",
    description: "Successive failed password resets for Account #3321.",
    timeAgo: "1h ago",
  },
];

export default function AlertPanel() {
  return (
    <div className="flex flex-col bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-sm overflow-hidden">
      <div className="p-6 border-b border-slate-100 dark:border-slate-800">
        <div className="flex items-center justify-between">
          <h3 className="text-slate-900 dark:text-white text-lg font-bold leading-tight">
            Alert Summary
          </h3>
          <span className="bg-primary text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
            24 NEW
          </span>
        </div>
        <div className="flex gap-2 mt-4">
          <button className="flex-1 py-1 text-[11px] font-bold rounded-lg border border-primary bg-primary/10 text-primary">
            ALL
          </button>
          <button className="flex-1 py-1 text-[11px] font-bold rounded-lg border border-slate-200 dark:border-slate-700 text-slate-500">
            HIGH
          </button>
          <button className="flex-1 py-1 text-[11px] font-bold rounded-lg border border-slate-200 dark:border-slate-700 text-slate-500">
            MEDIUM
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto custom-scrollbar p-4 space-y-3">
        {alerts.map((alert, idx) => (
          <AlertItem key={idx} {...alert} />
        ))}
      </div>

      <button className="m-4 py-3 bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-xs font-bold rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-100 transition-colors">
        VIEW ALL ALERTS
      </button>
    </div>
  );
}
