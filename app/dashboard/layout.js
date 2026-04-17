import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { getSession } from "@/lib/session";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function DashboardLayout({ children }) {
  const cookieStore = await cookies();
  const session = await getSession(cookieStore.get("session")?.value);
  if (!session) redirect("/");

  // Whitelist — हमेशा allow
  if (session.email !== "prasad.kamta@gmail.com") {
    if (session.status !== "active") {
      const expiry = session.expiryDate ? new Date(session.expiryDate) : null;
      if (!expiry || new Date() > expiry) {
        redirect("/expired");
      }
    }
  }

  const links = [
    { label: "डैशबोर्ड", href: "/dashboard", icon: "▦" },
    { label: "कारीगर", href: "/dashboard/karigars", icon: "◉" },
    { label: "लॉट", href: "/dashboard/lots", icon: "◈" },
    { label: "काम", href: "/dashboard/assignments", icon: "⚙" },
    { label: "बिक्री", href: "/dashboard/sales", icon: "◎" },
    { label: "रिपोर्ट", href: "/dashboard/reports", icon: "≡" },
    { label: "सेटिंग", href: "/dashboard/settings", icon: "⊙" },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Desktop sidebar */}
      <div className="hidden md:flex min-h-screen">
        <aside className="w-56 bg-white border-r border-gray-200 flex flex-col">
          <div className="px-6 py-5 border-b border-gray-100">
            <p className="text-lg font-bold text-stone-900">
              हीरा<span className="text-amber-500">डेस्क</span>
            </p>
            <p className="text-[10px] tracking-widest text-amber-500 uppercase">
              निशांत सॉफ्टवेयर्स
            </p>
          </div>
          <nav className="flex-1 px-3 py-4 space-y-1">
            {links.map(({ label, href, icon }) => (
              <Link
                key={href}
                href={href}
                className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-stone-600 hover:bg-amber-50 hover:text-amber-600 transition-colors"
              >
                <span className="text-base">{icon}</span>
                {label}
              </Link>
            ))}
          </nav>
          <div className="px-4 py-4 border-t border-gray-100">
            <p className="text-xs text-stone-500 mb-2">{session.name}</p>
            <Link
              href="/api/auth/logout"
              className="text-xs text-stone-400 hover:text-red-500 transition-colors"
            >
              लॉगआउट
            </Link>
          </div>
        </aside>
        <main className="flex-1 p-8 overflow-auto">{children}</main>
      </div>

      {/* Mobile layout */}
      <div className="md:hidden flex flex-col min-h-screen">
        <header className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between">
          <p className="text-base font-bold text-stone-900">
            हीरा<span className="text-amber-500">डेस्क</span>
          </p>
          <Link
            href="/api/auth/logout"
            className="text-xs text-stone-400 hover:text-red-500"
          >
            लॉगआउट
          </Link>
        </header>
        <main className="flex-1 p-4 pt-16 pb-24 overflow-auto">{children}</main>
        <nav className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-200 flex justify-around items-center py-2">
          {links.map(({ label, href, icon }) => (
            <Link
              key={href}
              href={href}
              className="flex flex-col items-center gap-0.5 px-2 py-1 text-xs text-stone-400 hover:text-amber-600 transition-colors"
            >
              <span className="text-lg">{icon}</span>
              <span className="text-[10px]">{label}</span>
            </Link>
          ))}
        </nav>
      </div>
    </div>
  );
}
