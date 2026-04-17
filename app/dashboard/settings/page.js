import { cookies } from "next/headers";
import { getSession } from "@/lib/session";
import { redirect } from "next/navigation";
import Link from "next/link";

export default async function Settings() {
  const cookieStore = await cookies();
  const session = await getSession(cookieStore.get("session")?.value);
  if (!session) redirect("/");

  return (
    <div className="space-y-6 max-w-lg">
      <h1 className="text-3xl font-extrabold text-stone-900">सेटिंग</h1>
      <div className="bg-white border border-gray-200 rounded-xl p-6 space-y-4">
        <div>
          <p className="text-xs font-bold text-stone-500 uppercase tracking-widest mb-1">नाम</p>
          <p className="text-lg font-semibold text-stone-800">{session.name}</p>
        </div>
        <div>
          <p className="text-xs font-bold text-stone-500 uppercase tracking-widest mb-1">ईमेल</p>
          <p className="text-lg font-semibold text-stone-800">{session.email}</p>
        </div>
      </div>
      <Link href="/api/auth/logout"
        className="inline-block bg-red-50 border border-red-200 text-red-600 font-semibold px-5 py-2 rounded-lg hover:bg-red-100 transition text-sm">
        लॉगआउट करें
      </Link>
    </div>
  );
}