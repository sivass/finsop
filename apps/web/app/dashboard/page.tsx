
import KpiCard from "@/components/KpiCard";
import LineChart from "@/components/LineChart";
import RiskMap from "@/components/RiskMap";
import AlertPanel from "@/components/AlertPanel";

const kpis = [
  {
    title: "Total Transactions",
    value: "1,240,500",
    trend: "+12.4%",
    trendIcon: "trending_up",
    icon: "payments",
    color: "text-primary",
    sparklinePath: "M0 35 Q 20 10, 40 25 T 100 5",
  },
  {
    title: "Anomalies Detected",
    value: "429",
    trend: "Critical",
    trendIcon: "report_problem",
    icon: "warning",
    color: "text-amber-500",
    badge: "SCANNING",
    badgeColor: "bg-amber-50 dark:bg-amber-900/20",
  },
  {
    title: "SOP Actions Triggered",
    value: "12,850",
    trend: "Automated Response",
    trendIcon: "",
    icon: "bolt",
    color: "text-indigo-500",
    largeIcon: "manufacturing",
  },
  {
    title: "Accounts Protected",
    value: "98.2%",
    trend: "Optimized",
    trendIcon: "check_circle",
    icon: "verified_user",
    color: "text-emerald-500",
    circularIndicator: true,
  },
];

export default function DashboardPage() {
  return (
    <div className="flex flex-col min-h-screen bg-background-light dark:bg-background-dark text-slate-900 dark:text-slate-100">
      <main className="flex-1 overflow-hidden flex flex-col p-6 space-y-6">
        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {kpis.map((kpi, idx) => (
            <KpiCard key={idx} {...kpi} />
          ))}
        </div>

        {/* Main Grid */}
        <div className="flex-1 grid grid-cols-12 gap-6 min-h-0">
          {/* Left Column */}
          <div className="col-span-12 lg:col-span-8 flex flex-col gap-6 overflow-y-auto pr-2">
            <LineChart />
            <RiskMap />
          </div>

          {/* Right Column */}
          <div className="col-span-12 lg:col-span-4">
            <AlertPanel />
          </div>
        </div>
      </main>
    </div>
  );
}
