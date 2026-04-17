"use client";
import { useEffect, useState } from "react";

export default function Lots() {
  const [rows, setRows] = useState([]);
  const [show, setShow] = useState(false);
  const [form, setForm] = useState({ lotNo: "", roughWeight: "", polishWeight: "", shape: "", quality: "", color: "", status: "लंबित" });

  const load = () => fetch("/api/lots").then(r => {
    if (r.status === 401) { window.location.href = "/"; return; }
    return r.json();
  }).then(data => {
    if (!data || !Array.isArray(data)) return;
    setRows(data);
  });

  useEffect(() => { load(); }, []);

  const submit = async () => {
    await fetch("/api/lots", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) });
    setShow(false);
    setForm({ lotNo: "", roughWeight: "", polishWeight: "", shape: "", quality: "", color: "", status: "लंबित" });
    load();
  };

  const del = async (id) => {
    if (!confirm("हटाएं?")) return;
    await fetch("/api/lots", { method: "DELETE", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id }) });
    load();
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl md:text-3xl font-extrabold text-stone-900">लॉट</h1>
        <button onClick={() => setShow(true)} className="bg-amber-500 hover:bg-amber-600 text-white text-sm font-semibold px-4 py-2 rounded-lg">+ नया लॉट</button>
      </div>

      {show && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 px-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md space-y-4 shadow-xl">
            <h2 className="text-lg font-bold text-stone-900">नया लॉट जोड़ें</h2>
            {[["lotNo","लॉट नंबर"],["roughWeight","कच्चा वजन (कैरेट)"],["polishWeight","पॉलिश वजन (कैरेट)"],["shape","आकार"],["quality","गुणवत्ता (VVS1/VS1/SI1...)"],["color","रंग (D/E/F/G...)"]].map(([k,l]) => (
              <input key={k} placeholder={l} value={form[k]} onChange={e => setForm({...form,[k]:e.target.value})}
                className="w-full border border-gray-200 rounded-lg px-4 py-3 text-base outline-none focus:border-amber-400" />
            ))}
            <select value={form.status} onChange={e => setForm({...form, status: e.target.value})}
              className="w-full border border-gray-200 rounded-lg px-4 py-3 text-base outline-none focus:border-amber-400">
              {["लंबित","काम चल रहा है","पूर्ण","बिका"].map(s => <option key={s}>{s}</option>)}
            </select>
            <div className="flex gap-3 pt-2">
              <button onClick={submit} className="flex-1 bg-amber-500 hover:bg-amber-600 text-white font-semibold py-3 rounded-lg text-base">सेव करें</button>
              <button onClick={() => setShow(false)} className="flex-1 border border-gray-200 text-stone-600 font-semibold py-3 rounded-lg text-base">रद्द करें</button>
            </div>
          </div>
        </div>
      )}

      {/* Mobile card view */}
      <div className="md:hidden space-y-3">
        {rows.length === 0 ? (
          <p className="text-center text-stone-400 py-8">कोई लॉट नहीं</p>
        ) : rows.map(row => (
          <div key={row.id} className="bg-white border border-gray-200 rounded-xl p-4 space-y-2">
            <div className="flex items-center justify-between">
              <p className="font-extrabold text-stone-800 text-lg">{row.lotNo}</p>
              <button onClick={() => del(row.id)} className="text-red-400 text-sm font-semibold">हटाएं</button>
            </div>
            <p className="text-stone-500 text-sm">कच्चा वजन: {row.roughWeight} कैरेट</p>
            <p className="text-stone-500 text-sm">पॉलिश वजन: {row.polishWeight ? `${row.polishWeight} कैरेट` : "—"}</p>
            <p className="text-stone-500 text-sm">आकार: {row.shape || "—"} | गुणवत्ता: {row.quality || "—"} | रंग: {row.color || "—"}</p>
            <p className="text-stone-500 text-sm">स्थिति: {row.status}</p>
          </div>
        ))}
      </div>

      {/* Desktop table */}
      <div className="hidden md:block bg-white border border-gray-200 rounded-xl overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              {["लॉट नंबर","कच्चा वजन","पॉलिश वजन","आकार","गुणवत्ता","रंग","स्थिति",""].map(h => (
                <th key={h} className="px-5 py-3 text-left text-xs font-bold text-stone-500 uppercase tracking-widest">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.length === 0 ? (
              <tr><td colSpan={8} className="px-5 py-8 text-center text-stone-400">कोई लॉट नहीं</td></tr>
            ) : rows.map(row => (
              <tr key={row.id} className="border-b border-gray-100 hover:bg-gray-50">
                <td className="px-5 py-3 font-semibold text-stone-700">{row.lotNo}</td>
                <td className="px-5 py-3 text-stone-600">{row.roughWeight} कैरेट</td>
                <td className="px-5 py-3 text-stone-600">{row.polishWeight ? `${row.polishWeight} कैरेट` : "—"}</td>
                <td className="px-5 py-3 text-stone-600">{row.shape || "—"}</td>
                <td className="px-5 py-3 text-stone-600">{row.quality || "—"}</td>
                <td className="px-5 py-3 text-stone-600">{row.color || "—"}</td>
                <td className="px-5 py-3 text-stone-600">{row.status}</td>
                <td className="px-5 py-3"><button onClick={() => del(row.id)} className="text-red-400 hover:text-red-600 text-xs font-semibold">हटाएं</button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}