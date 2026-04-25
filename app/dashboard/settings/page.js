"use client";
import { useEffect, useState } from "react";
import Link from "next/link";

export default function Settings() {
  const [user, setUser] = useState(null);
  const [form, setForm] = useState({ name: "", shopName: "", whatsapp: "" });
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetch("/api/settings").then(r => {
      if (r.status === 401) { window.location.href = "/"; return null; }
      return r.json();
    }).then(data => {
      if (!data) return;
      setUser(data);
      setForm({ name: data.name || "", shopName: data.shopName || "", whatsapp: data.whatsapp || "" });
    });
  }, []);

  const save = async () => {
    setLoading(true);
    await fetch("/api/settings", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    setLoading(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  if (!user) return <div className="text-center py-12 text-stone-400">लोड हो रहा है...</div>;

  return (
    <div className="space-y-6 max-w-lg">
      <h1 className="text-3xl font-extrabold text-stone-900">सेटिंग</h1>

      {/* Read-only info */}
      <div className="bg-white border border-gray-200 rounded-xl p-6 space-y-4">
        <div>
          <p className="text-xs font-bold text-stone-400 uppercase tracking-widest mb-1">ईमेल (बदला नहीं जा सकता)</p>
          <p className="text-base font-semibold text-stone-700">{user.email}</p>
        </div>
      </div>

      {/* Editable fields */}
      <div className="bg-white border border-gray-200 rounded-xl p-6 space-y-4">
        <h2 className="text-sm font-bold text-stone-500 uppercase tracking-widest">प्रोफाइल</h2>
        <div>
          <label className="text-xs font-bold text-stone-400 uppercase tracking-widest mb-1 block">आपका नाम</label>
          <input
            value={form.name}
            onChange={e => setForm({ ...form, name: e.target.value })}
            placeholder="आपका नाम"
            className="w-full border border-gray-200 rounded-lg px-4 py-3 text-base outline-none focus:border-amber-400"
          />
        </div>
        <div>
          <label className="text-xs font-bold text-stone-400 uppercase tracking-widest mb-1 block">दुकान का नाम</label>
          <input
            value={form.shopName}
            onChange={e => setForm({ ...form, shopName: e.target.value })}
            placeholder="जैसे: राम ज्वेलर्स"
            className="w-full border border-gray-200 rounded-lg px-4 py-3 text-base outline-none focus:border-amber-400"
          />
        </div>
        <div>
          <label className="text-xs font-bold text-stone-400 uppercase tracking-widest mb-1 block">WhatsApp नंबर</label>
          <input
            value={form.whatsapp}
            onChange={e => setForm({ ...form, whatsapp: e.target.value })}
            placeholder="91XXXXXXXXXX"
            type="tel"
            className="w-full border border-gray-200 rounded-lg px-4 py-3 text-base outline-none focus:border-amber-400"
          />
          <p className="text-xs text-stone-400 mt-1">कारीगरों को WhatsApp भेजने में उपयोग होगा</p>
        </div>

        <button
          onClick={save}
          disabled={loading}
          className="w-full bg-amber-500 hover:bg-amber-600 disabled:opacity-50 text-white font-semibold py-3 rounded-lg text-base transition"
        >
          {loading ? "सेव हो रहा है..." : "सेव करें"}
        </button>

        {saved && (
          <div className="bg-green-50 border border-green-200 rounded-lg px-4 py-3 text-sm text-green-700 font-semibold text-center">
            ✅ सेटिंग सेव हो गई!
          </div>
        )}
      </div>

      <Link
        href="/api/auth/logout"
        className="inline-block bg-red-50 border border-red-200 text-red-600 font-semibold px-5 py-2 rounded-lg hover:bg-red-100 transition text-sm"
      >
        लॉगआउट करें
      </Link>
    </div>
  );
}