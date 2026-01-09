"use client"
import Link from "next/link";
import { usePathname } from "next/navigation";
import { House, LayoutDashboard, Settings, PlusCircle } from "lucide-react";

const MobileNav = () => {
  const pathname = usePathname();

  const navItems = [
    { label: "Home", icon: House, href: "/" },
    { label: "Dashboard", icon: LayoutDashboard, href: "/dashboard" },
    { label: "Settings", icon: Settings, href: "/settings" },
  ];

  return (
    <div className="sm:hidden fixed bottom-0 left-0 right-0 z-50 bg-slate-950/80 backdrop-blur-lg border-t border-white/10 px-6 py-3">
      <div className="flex items-center justify-between">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;

          return (
            <Link 
              key={item.label} 
              href={item.href}
              className={`flex flex-col items-center gap-1 transition-colors ${
                isActive ? "text-indigo-400" : "text-slate-500"
              }`}
            >
              <Icon size={22} strokeWidth={isActive ? 2.5 : 2} />
              <span className="text-[10px] font-medium">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </div>
  );
};

export default MobileNav;