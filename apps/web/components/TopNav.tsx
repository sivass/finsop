"use client";
import Image from "next/image";
import ThemeToggle from "./ThemeToggle";

export default function TopNav() {
  return (
    <header className="flex items-center justify-between whitespace-nowrap border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-8 py-3 shrink-0">
      {/* <div className="flex items-center gap-4">
        <div className="size-8 bg-primary text-white rounded flex items-center justify-center">
          <span className="material-symbols-outlined">security</span>
        </div>
        <div>
          <h2 className="text-slate-900 dark:text-white text-lg font-bold leading-tight tracking-tight">
            Fraud & Behaviour Monitoring Dashboard
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            FinSOP AI Compliance Manager
          </p>
        </div>
      </div> */}

      <div className="flex flex-1 justify-end gap-6 items-center">
        <label className="flex flex-col min-w-64 h-10 max-w-md">
          <div className="flex w-full flex-1 items-stretch rounded-lg h-full border border-slate-200 dark:border-slate-700">
            <div className="text-slate-400 flex bg-slate-50 dark:bg-slate-800 items-center justify-center pl-4 rounded-l-lg border-r-0">
              <span className="material-symbols-outlined text-[20px]">
                search
              </span>
            </div>
            <input
              className="form-input flex w-full min-w-0 flex-1 rounded-lg text-slate-900 dark:text-white focus:outline-0 focus:ring-2 focus:ring-primary/20 border-none bg-slate-50 dark:bg-slate-800 placeholder:text-slate-400 px-4 rounded-l-none pl-2 text-sm font-normal"
              placeholder="Search accounts, transaction IDs or alerts..."
            />
          </div>
        </label>

        <div className="flex gap-3">
          <button className="flex items-center justify-center rounded-lg h-10 w-10 bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700">
            <span className="material-symbols-outlined">notifications</span>
          </button>
          <button className="flex items-center justify-center rounded-lg h-10 w-10 bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700">
            <span className="material-symbols-outlined">settings</span>
          </button>
        </div>

        <div className="h-8 w-[1px] bg-slate-200 dark:bg-slate-700 mx-2"></div>

        <div className="flex items-center gap-3">
          <div className="text-right">
            <p className="text-sm font-semibold text-slate-900 dark:text-white leading-none">
              Alex Rivera
            </p>
            <p className="text-[11px] text-slate-500 dark:text-slate-400">
              Compliance Officer
            </p>
          </div>
          <div className="bg-primary/10 rounded-full p-0.5 border border-primary/20">
            <Image
              className="size-8 rounded-full object-cover"
              alt="Profile photo of the user Alex Rivera"
              src="/assets/images/user.png"
              width={30}
              height={30}
            />
          </div>
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
