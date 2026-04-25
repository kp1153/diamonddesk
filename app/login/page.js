export default function LoginPage({ searchParams }) {
  const error = searchParams?.error;

  return (
    <div className="min-h-screen bg-stone-950 flex flex-col items-center justify-center">
      <div className="text-center space-y-6">
        <p className="text-amber-400 text-xs tracking-[0.3em] uppercase font-semibold">निशांत सॉफ्टवेयर्स</p>
        <h1 className="text-5xl font-extrabold text-white tracking-tight">
          हीरा<span className="text-amber-400">डेस्क</span>
        </h1>
        <p className="text-stone-400 text-base max-w-xs mx-auto">
          कारीगर, लॉट, मजदूरी — सब एक जगह।
        </p>

        {error === "failed" && (
          <p className="text-red-400 text-sm font-medium">
            लॉगिन में समस्या आई। कृपया दोबारा कोशिश करें।
          </p>
        )}
        {error === "invalid" && (
          <p className="text-red-400 text-sm font-medium">
            अमान्य अनुरोध। कृपया दोबारा कोशिश करें।
          </p>
        )}

        <a
          href="/api/auth/login"
          className="inline-block bg-amber-500 hover:bg-amber-400 text-black font-bold px-8 py-3 rounded-xl text-sm transition-colors mt-4"
        >
          गूगल से लॉगिन करें
        </a>
      </div>
    </div>
  );
}