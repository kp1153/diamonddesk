"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

const links = [
  { label: "डैशबोर्ड", href: "/dashboard", icon: "▦" },
  { label: "कारीगर", href: "/karigars", icon: "◉" },
  { label: "लॉट", href: "/lots", icon: "◈" },
  { label: "काम", href: "/assignments", icon: "⚙" },
  { label: "बिक्री", href: "/sales", icon: "◎" },
  { label: "रिपोर्ट", href: "/reports", icon: "≡" },
  { label: "सेटिंग", href: "/settings", icon: "⊙" },
];

export default function Sidebar() {
  const pathname = usePathname();
  return (
    <>
      {/* Desktop sidebar */}
      <aside className="hidden md:flex w-56 min-h-screen bg-white border-r border-gray-200 flex-col">
        <div className="px-6 py-5 border-b border-gray-100">
          <p className="text-lg font-bold text-stone-900">हीरा<span className="text-amber-500">डेस्क</span></p>
          <p className="text-[10px] tracking-widest text-amber-500 uppercase">निशांत सॉफ्टवेयर्स</p>
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
        <div className="px-4 py-4 border-t border-gray-100">
          <Link href="/api/auth/logout" className="text-xs text-stone-400 hover:text-red-500 transition-colors">
            लॉगआउट
          </Link>
        </div>
      </aside>

      {/* Mobile top bar */}
      <div className="md:hidden fixed top-0 left-0 right-0 z-50 bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between">
        <p className="text-base font-bold text-stone-900">हीरा<span className="text-amber-500">डेस्क</span></p>
        <Link href="/api/auth/logout" className="text-xs text-stone-400 hover:text-red-500">लॉगआउट</Link>
      </div>

      {/* Mobile bottom nav */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-200 flex justify-around items-center py-2">
        {links.map(({ label, href, icon }) => (
          <Link key={href} href={href}
            className={`flex flex-col items-center gap-0.5 px-2 py-1 rounded-lg text-xs transition-colors
            ${pathname === href ? "text-amber-600 font-bold" : "text-stone-400"}`}>
            <span className="text-lg">{icon}</span>
            <span className="text-[10px]">{label}</span>
          </Link>
        ))}
      </nav>
    </>
  );
}