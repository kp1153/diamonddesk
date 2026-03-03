"use client";
import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const navLinks = [
  { label: "Dashboard", href: "/dashboard" },
  { label: "Inventory", href: "/inventory" },
  { label: "Manufacturing", href: "/manufacturing" },
  { label: "Sales", href: "/sales" },
  { label: "Labour", href: "/labour" },
  { label: "GST", href: "/gst" },
  { label: "Reports", href: "/reports" },
  { label: "Settings", href: "/settings" },
];

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();

  return (
    <nav className="sticky top-0 z-50 bg-stone-900 border-b border-stone-700 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">

        {/* Logo */}
        <Link href="/dashboard" className="flex flex-col leading-none">
          <span className="font-serif text-xl font-bold text-white">
            Diamond<span className="text-amber-400">Desk</span>
          </span>
          <span className="text-[9px] tracking-[3px] text-amber-500 uppercase">Surat · Diamond ERP</span>
        </Link>

        {/* Desktop Nav */}
        <ul className="hidden md:flex items-center gap-1">
          {navLinks.map(({ label, href }) => (
            <li key={href}>
              <Link href={href}
                className={`px-3 py-2 text-xs font-semibold uppercase tracking-wide rounded transition-colors
                ${pathname === href ? "text-amber-400 bg-stone-700" : "text-stone-300 hover:text-amber-400 hover:bg-stone-700"}`}>
                {label}
              </Link>
            </li>
          ))}
        </ul>

        {/* Right */}
        <div className="flex items-center gap-3">
          <span className="hidden md:block text-xs text-stone-400">Ratan Lal & Sons</span>
          <button className="text-stone-300 hover:text-amber-400 transition text-lg">👤</button>
          <button className="md:hidden flex flex-col gap-1.5 p-2" onClick={() => setMobileOpen(!mobileOpen)}>
            <span className={`block w-5 h-0.5 bg-stone-300 transition-all duration-300 ${mobileOpen ? "rotate-45 translate-y-2" : ""}`} />
            <span className={`block w-5 h-0.5 bg-stone-300 transition-all duration-300 ${mobileOpen ? "opacity-0" : ""}`} />
            <span className={`block w-5 h-0.5 bg-stone-300 transition-all duration-300 ${mobileOpen ? "-rotate-45 -translate-y-2" : ""}`} />
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="md:hidden bg-stone-800 border-t border-stone-700 px-4 pb-4 pt-2">
          {navLinks.map(({ label, href }) => (
            <Link key={href} href={href}
              className={`block py-2.5 text-sm border-b border-stone-700 transition-colors
              ${pathname === href ? "text-amber-400" : "text-stone-300 hover:text-amber-400"}`}>
              {label}
            </Link>
          ))}
        </div>
      )}
    </nav>
  );
}