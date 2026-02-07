"use client";
import { useState } from "react";
import { usePathname, useRouter } from "next/navigation";

type MenuItem = {
  title: string;
  icon: string;
  link: string;
  submenu?: MenuItem[];
};

const menus: MenuItem[] = [
  { title: "Dashboard", icon: "dashboard", link: "/" },
  { title: "Users", icon: "people", link: "/users" },
  { title: "Compliance", icon: "security", link: "/compliance" },
  { title: "Audit", icon: "fact_check", link: "/audit" },
];

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [openMenu, setOpenMenu] = useState<string | null>(null);

  const handleMenuClick = (menu: MenuItem) => {
    if (menu.submenu) {
      setOpenMenu(openMenu === menu.title ? null : menu.title);
    } else {
      router.push(menu.link);
    }
  };

  return (
    <aside className="w-64 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 flex flex-col min-h-screen">
      <div className="px-6 py-4 text-xl font-bold text-primary text-center flex items-center gap-2 border-b border-slate-200 dark:border-slate-800">
        <span className="material-symbols-outlined">security</span>
        FinSOP AI
      </div>
      <nav className="flex-1 overflow-y-auto custom-scrollbar px-2 py-4">
        {menus.map((menu) => (
          <div key={menu.title} className="mb-1">
            <button
              onClick={() => handleMenuClick(menu)}
              className={`w-full flex items-center gap-3 px-4 py-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 ${
                pathname === menu.link
                  ? "bg-slate-100 dark:bg-slate-800 font-bold"
                  : ""
              }`}
            >
              <span className="material-symbols-outlined">{menu.icon}</span>
              {menu.title}
              {menu.submenu && (
                <span className="material-symbols-outlined ml-auto">
                  {openMenu === menu.title ? "expand_less" : "expand_more"}
                </span>
              )}
            </button>
            {menu.submenu && openMenu === menu.title && (
              <div className="ml-8 mt-1 flex flex-col gap-1">
                {menu.submenu.map((sub) => (
                  <button
                    key={sub.title}
                    className="text-sm px-2 py-1 rounded hover:bg-slate-200 dark:hover:bg-slate-700"
                    onClick={() => router.push(sub.link)}
                  >
                    {sub.title}
                  </button>
                ))}
              </div>
            )}
          </div>
        ))}
      </nav>
    </aside>
  );
}
