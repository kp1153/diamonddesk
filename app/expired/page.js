import { cookies } from "next/headers";
import { getSession } from "@/lib/session";

export default async function ExpiredPage() {
  const cookieStore = await cookies();
  const session = await getSession(cookieStore.get("session")?.value);
  const email = session?.email ?? "";

  const paymentURL = `https://nishantsoftwares.in/payment?software=heera&email=${encodeURIComponent(email)}`;

  return (
    <main className="min-h-screen bg-stone-950 flex items-center justify-center px-4">
      <div className="bg-stone-900 border border-stone-800 rounded-3xl p-10 w-full max-w-md text-center">
        <div className="text-5xl mb-3">⏰</div>
        <h1 className="text-2xl font-extrabold text-white mb-2">Trial खत्म हो गया</h1>
        <p className="text-stone-400 text-sm mb-6">
          आपका 7 दिन का मुफ्त trial समाप्त हो गया है। License लें और काम जारी रखें।
        </p>

        <div className="bg-stone-800 rounded-2xl p-5 mb-6">
          <p className="text-stone-400 text-xs mb-1">हीरा डेस्क License</p>
          <p className="text-4xl font-extrabold text-amber-400 mb-1">
            ₹4,999 <span className="text-sm font-normal text-stone-500">/साल</span>
          </p>
          <p className="text-stone-500 text-xs">Renewal: ₹1,999/साल</p>
        </div>

        <a href={paymentURL}
          className="block w-full py-3 bg-amber-500 hover:bg-amber-400 text-black font-bold rounded-xl text-base mb-3 transition-colors">
          License खरीदें — ₹4,999
        </a>

        <a href="https://wa.me/919996865069" target="_blank" rel="noopener noreferrer"
          className="block w-full py-3 bg-green-500 hover:bg-green-400 text-white font-bold rounded-xl text-base mb-5 transition-colors">
          💬 WhatsApp पर बात करें
        </a>

        <a href="/" className="text-stone-500 text-xs hover:text-stone-300">
          होम पेज पर जाएं
        </a>
      </div>
    </main>
  );
}