"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

const links = [
  { label: "Dashboard", href: "/dashboard", icon: "▦" },
  { label: "Inventory", href: "/inventory", icon: "◈" },
  { label: "Manufacturing", href: "/manufacturing", icon: "⚙" },
  { label: "Sales", href: "/sales", icon: "◎" },
  { label: "Labour", href: "/labour", icon: "◉" },
  { label: "GST", href: "/gst", icon: "₹" },
  { label: "Reports", href: "/reports", icon: "≡" },
  { label: "Settings", href: "/settings", icon: "⊙" },
];

export default function Sidebar() {
  const pathname = usePathname();
  return (
    <aside className="w-56 h-screen bg-white border-r border-gray-200 flex flex-col">
      <div className="px-6 py-5 border-b border-gray-100">
        <p className="text-lg font-bold text-stone-900">Diamond<span className="text-amber-500">Desk</span></p>
        <p className="text-[10px] tracking-widest text-amber-500 uppercase">Surat · ERP</p>
      </div>
      <nav className="flex-1 px-3 py-4 space-y-1">
        {links.map(({ label, href, icon }) => (
          <Link key={href} href={href}
            className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors
            ${pathname === href ? "bg-amber-50 text-amber-600 font-semibold" : "text-stone-600 hover:bg-gray-100"}`}>
            <span className="text-base">{icon}</span>
            {label}
          </Link>
        ))}
      </nav>
      <div className="px-6 py-4 border-t border-gray-100 text-xs text-stone-400">
        DiamondDesk
      </div>
    </aside>
  );
}