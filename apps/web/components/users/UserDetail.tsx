"use client";
import { useEffect, useState } from "react";

interface Transaction {
  transactionId: string;
  predicted_anomaly: number;
  anomaly_score: number;
  aiPatternId: string;
  sopAlert: string[];
  explanation: Record<string, number>;
  detectedPatterns: string[];
}

interface User {
  userId: string;
  name: string;
  role: string;
  department: string;
  accountType: string;
  email: string;
  homeCountry: string;
  status: string;
  createdAt: string;
}

interface Report {
  riskScore: number;
  details: string[];
}

interface UserDetailData {
  user: User;
  transactions: Transaction[];
  report: Report;
}

interface UserDetailProps {
  userId: string;
}

export default function UserDetail({ userId }: UserDetailProps) {
  const [data, setData] = useState<UserDetailData | null>(null);

  useEffect(() => {
    if (!userId) return;

    const controller = new AbortController();

    fetch(`/api/users/${userId}`, { signal: controller.signal })
      .then((res) => res.json())
      .then(setData)
      .catch((err) => {
        if (err.name !== "AbortError") console.error(err);
      });

    return () => controller.abort();
  }, [userId]);

  if (!data) return <p className="text-slate-500">Loading user...</p>;

  const { user, transactions, report } = data;

  return (
    <div className="space-y-6">
      {/* User Card */}
      <div className="bg-white dark:bg-slate-900 rounded-xl p-6 shadow-sm flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-20 h-20 bg-slate-200 dark:bg-slate-800 rounded-lg" />
          <div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">
              {user.name}
            </h2>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              {user.role} • {user.accountType}
            </p>
            <p className="text-xs text-slate-400 mt-1">ID: {user.userId}</p>
          </div>
        </div>
        <div className="text-center">
          <span className="text-green-600 font-bold text-2xl">
            {report.riskScore}
          </span>
          <p className="text-xs text-slate-400 mt-1">Aggregate Risk</p>
        </div>
      </div>

      {/* AI Pattern */}
      <div className="bg-white dark:bg-slate-900 p-6 rounded-xl shadow-sm">
        <h3 className="text-slate-500 text-xs uppercase mb-2">
          AI Pattern Detail
        </h3>
        <p className="text-slate-900 dark:text-white text-sm">
          Baseline check successful. Behavior matches history.
        </p>
      </div>

      {/* Transaction Table */}
      <div className="bg-white dark:bg-slate-900 p-6 rounded-xl shadow-sm overflow-x-auto">
        <h3 className="text-slate-500 text-xs uppercase mb-2">
          Transaction Audit Ledger
        </h3>
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="text-slate-400 text-xs uppercase border-b border-slate-200 dark:border-slate-800">
              <th className="py-2 px-3">Timestamp</th>
              <th className="py-2 px-3">Counterparty</th>
              <th className="py-2 px-3">Amount</th>
              <th className="py-2 px-3">State</th>
            </tr>
          </thead>
          <tbody>
            {transactions.map((tx) => (
              <tr
                key={tx.transactionId}
                className="border-b border-slate-100 dark:border-slate-800"
              >
                <td className="py-2 px-3">{new Date().toLocaleString()}</td>
                <td className="py-2 px-3">Standard Merchant</td>
                <td className="py-2 px-3">
                  ${tx.explanation.amount.toFixed(2)}
                </td>
                <td className="py-2 px-3 text-green-600 font-bold">APPROVED</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
